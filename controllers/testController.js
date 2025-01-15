const { where } = require('sequelize');
const ApiError = require('../error/apiError');
const logger = require('../logger');
const {Test, Question, Answer, UserAnswer, TestResult, TestShedule} = require('../models/testModels');
const { User } = require('../models/models');

class TestController {
// ********************************************************************************************************

  // Получить тесты с вопросами и ответами
  async getAllTests(req, res, next) {
    try {
      const tests = await Test.findAll();

      res.status(200).json(tests);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  }


// ********************************************************************************************************


  // Получить тесты с вопросами и ответами
  async getUserTests(req, res, next) {
    try {
      const { userId } = req.params;
  
      // Получаем пользователя и его groupId
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const groupId = user.groupId;
  
      // Получаем все записи из TestShedule для указанной группы
      const schedules = await TestShedule.findAll({ where: { groupId } });
  
      // Получаем результаты тестов для этого пользователя
      const testResults = await TestResult.findAll({ where: { userId } });
  
      // Извлекаем testId из всех записей расписания
      const testIds = schedules.map((schedule) => schedule.testId);
  
      if (testIds.length === 0) {
        return res.status(404).json({ message: 'No tests found for this group' });
      }
  
      // Получаем тесты по массиву testId
      const tests = await Test.findAll({ where: { id: testIds } });
  
      // Добавляем информацию о том, пройден ли тест
      const testsWithStatus = tests.map((test) => {
        // Проверяем, есть ли результат для этого теста у пользователя
        const testResult = testResults.find((result) => result.testId === test.id);
  
        return {
          ...test.toJSON(),
          status: testResult ? 'Passed' : 'Not Passed',
        };
      });
  
      res.status(200).json(testsWithStatus);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  }
  
  

// ********************************************************************************************************
    async getTestShedule(req, res, next) {
        try {
            const tests = await TestShedule.findAll({
                include: [
                    {
                        model: Test, // Указываем модель для связи
                    },
                ],
            });

            if (!tests || tests.length === 0) {
                logger.warn('Тесты не найдены'); // Логирование предупреждения
                return res.status(404).json({ message: 'Тесты не найдены' });
            }

            logger.info('Тесты успешно получены'); // Логирование успешного события
            return res.json({ tests });
        } catch (error) {
            logger.error(`Ошибка при получении тестов: ${error.message || error}`); // Логирование ошибки

            return next(ApiError.internal('Ошибка при получении тестов'));
        }
    }

// ********************************************************************************************************
    async getQuestions(req, res, next) {
        try {
            const testId = req.params.testId
            const questions = await Question.findAll(
                {where: {testId: testId},
                include: [
                    {
                        model: Answer,
                        attributes: ['id', 'answerText', 'isCorrect'], // Указываем, какие поля вернуть из модели Answer
                    },
                ],
            })
            if (!questions) {
                logger.warn('Вопросы не найдены'); // Логирование предупреждения
                return res.status(404).json({ message: 'Вопросы не найдены' })
            }
            logger.info('Вопросы успешно получены'); // Логирование успешного события
            return res.json({ "questions": questions })
        } catch (error) {
            logger.error(`Ошибка при получении вопросов теста: ${error.message || error}`); // Логирование ошибки
            return next(ApiError.internal('Ошибка при получении вопросов'))
        }
    }
// ********************************************************************************************************
    async userAnswer(req, res, next) {
        try {
            const { testSheduleId, questionId } = req.params; // ID теста и вопроса из параметров
            const { answerId } = req.body;
            
            const testShedule = await TestShedule.findOne({
                where: { id: testSheduleId },
                include: [{ model: Test }] 
            });
            if (!testShedule) {
                logger.warn('Тест не найден'); // Логирование предупреждения
                return res.status(404).json({ message: 'Тест не найден' });
            }

            const question = await Question.findOne({
                where: { id: questionId, testId: testShedule.Test.id },
            });

            if (!question) {
                logger.warn('Вопрос не найден'); // Логирование предупреждения
                return res.status(404).json({ message: 'Вопрос не найден' });
            }

            const answer = await Answer.findOne({
                where: { id: answerId, questionId: questionId },
            });
            if (!answer) {
                logger.warn('Ответ не найден'); // Логирование предупреждения
                return res.status(404).json({ message: 'Ответ не найден' });
            }

            const isCorrect = answer.isCorrect;

            // Проверка, есть ли уже ответ пользователя на этот вопрос
            let userAnswer = await UserAnswer.findOne({
                where: { userId: req.user.id, testSheduleId: testSheduleId, questionId: questionId },
            });

            if (userAnswer) {
                // Если ответ уже существует, обновляем его
                userAnswer.answerId = answerId;
                userAnswer.isCorrect = isCorrect;
                await userAnswer.save();
            } else {
                // Если ответа нет, добавляем новый
                await UserAnswer.create({
                    userId: req.user.id, // ID текущего пользователя из токена
                    testSheduleId: testSheduleId,
                    questionId: questionId,
                    selectedAnswerId: answerId,
                    isCorrect: isCorrect,
                });
            }

            logger.info('Ответ успешно засчитан'); // Логирование успешного события
            return res.json({
                message: isCorrect ? 'Ответ правильный!' : 'Ответ неправильный!',
                isCorrect,
            });

        } catch (error) {
            logger.error(`Ошибка при отправке ответа: ${error.message || error}`); // Логирование ошибки
            return ApiError.internal('Ошибка при отправке ответов');
        }
    }
// ********************************************************************************************************
    async getResult(req, res, next) {
        try {
            const { testSheduleId } = req.params; // ID теста из параметров
            const userId = req.user.id; // ID пользователя из токена (авторизации)

            // Получаем все ответы пользователя на конкретный тест
            const userAnswers = await UserAnswer.findAll({
                where: { userId, testSheduleId },
                include: [{ model: Answer, attributes: ['isCorrect'] }],
            });
            // console.log({userAnswers});

            // Проверка на пустые данные
            if (!userAnswers || userAnswers.length === 0) {
                logger.warn('Ответы пользователя не найдены'); // Логирование предупреждения
                return res.status(404).json({ message: 'Ответы пользователя не найдены' });
            }

            // Подсчёт количества правильных ответов
            const correctAnswersCount = userAnswers.reduce((count, userAnswer) => {
                return userAnswer.isCorrect ? count + 1 : count;
            }, 0);
            // console.log('correct ', correctAnswersCount);
            const testShedule = await TestShedule.findOne({
                where: { id: testSheduleId },
                attributes: ['testId'], // Получаем testId из TestShedule
            });
            // console.log('fdss',testShedule.testId);

            if (!testShedule) {
                logger.warn('Тест не найден'); // Логирование предупреждения
                throw new Error('TestShedule не найден');
            }
            
            // Используем testId для поиска теста в таблице Test
            const test = await Test.findOne({
                where: { id: testShedule.testId },
            });
            // console.log(test);
            
            // Общее количество вопросов для данного теста
            const totalQuestions = await Question.count({
                where: { testId: test.id },
            });
            // console.log(totalQuestions);

            const result = {
                correctAnswers: correctAnswersCount,
                totalQuestions,
                resultPercentage: ((correctAnswersCount / totalQuestions) * 100).toFixed(2), 
                userId: userId,
                testSheduleId: testSheduleId,
                testId:test.id,
            }

             await TestResult.create(result)

            // Отправка результата
            logger.info('Результаты теста успешно вычислены, сохранены в БД и отправлены'); // Логирование предупреждения
            return res.status(201).json(result);

        } catch (error) {
            logger.error(`Ошибка при вычислении результатов: ${error.message || error}`); // Логирование ошибки
            return res.status(500).json({ message: 'Ошибка при вычислении результатов' });
        }
    }
}

module.exports = new TestController()
