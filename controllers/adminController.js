const ApiError = require("../error/apiError");
const logger = require("../logger");
const { User, Group } = require("../models/models");
const {
  Test,
  Question,
  Answer,
  TestResult,
  TestShedule,
  UserAnswer,
} = require("../models/testModels");

class AdminController {
  async getResults(req, res, next) {
    try {
      const { id } = req.params; // Получаем id из параметров запроса
  
      if (!id) {
        return res.status(400).json({ message: "Test ID is required" });
      }
  
      const results = await TestResult.findAll({
        where: { testId: id }, // Фильтруем результаты по testId
      });
  
      if (!results || results.length === 0) {
        return res.status(404).json({ message: "No results found for the given test ID" });
      }
  
      res.status(200).json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
  

   

  // Добавить вопрос к тесту (с проверкой на существование теста)
  async addQuestion(req, res, next) {
    try {
      const { testId, questionText } = req.body;

      const test = await Test.findByPk(testId);
      if (!test) {
        return res.status(404).json({ message: 'Test not found' });
      }

      const question = await Question.create({ testId, questionText });
      res.status(201).json(question);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  }

  // Добавить ответ к вопросу (с проверкой на существование вопроса)
  async addAnswer(req, res, next) {
    try {
      const { questionId, answerText, isCorrect } = req.body;

      const question = await Question.findByPk(questionId);
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }

      const answer = await Answer.create({ questionId, answerText, isCorrect });
      res.status(201).json(answer);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async getGroups(req, res, next) {
    try {
      const groups = await Group.findAll();

      res.status(200).json(groups);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  }
  // Создать новый тест
  async createTest(req, res, next) {
    try {
      const { title, description } = req.body;

      const test = await Test.create({ title, description });

      res.status(201).json(test);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  async createGroup(req, res, next) {
    try {
      const { name } = req.body;

      const group = await Group.create({ name });

      res.status(201).json(group);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Добавить вопрос к тесту
  async addQuestion(req, res, next) {
    try {
      const { testId, questionText } = req.body;

      const question = await Question.create({ testId, questionText });

      res.status(201).json(question);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Добавить ответ к вопросу
  async addAnswer(req, res, next) {
    try {
      const { questionId, answerText, isCorrect } = req.body;

      const answer = await Answer.create({ questionId, answerText, isCorrect });

      res.status(201).json(answer);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Создать расписание теста
  async createTestShedule(req, res, next) {
    try {
      const { date, startTime, endTime, testId, groupId } = req.body;

      const testShedule = await TestShedule.create({
        date,
        startTime,
        endTime,
        testId,
        groupId,
      });

      res.status(201).json(testShedule);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Удалить тест
  async deleteTest(req, res, next) {
    try {
      const { id } = req.params;
  
      // Находим тест по ID
      const test = await Test.findByPk(id);
  
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
  
      // Находим все вопросы, связанные с тестом
      const questions = await Question.findAll({
        where: { testId: id },
      });
  
      // Извлекаем IDs вопросов
      const questionIds = questions.map((q) => q.id);
  
      await UserAnswer.destroy({
        where: { questionId: questionIds },
      });

      // Удаляем все ответы, связанные с этими вопросами
      await Answer.destroy({
        where: { questionId: questionIds },
      });
  
      // Удаляем все вопросы, связанные с тестом
      await Question.destroy({
        where: { testId: id },
      });
        
      const shedule = await TestShedule.findAll({
        where: { testId: id },
      });
  
      // Извлекаем IDs вопросов
      const sheduleIds = shedule.map((q) => q.id);

      await TestResult.destroy({
        where: { testSheduleId: sheduleIds },
      });

      await TestShedule.destroy({
        where: { testId: id },
      });
        
  
      // Удаляем сам тест
      await test.destroy();
  
      res.status(200).json({ message: "Test deleted successfully" });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
  

  async deletequestion(req, res, next) {
    try {
      const { id } = req.params;
  
      // Найти вопрос по ID
      const question = await Question.findByPk(id);
  
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
  
      // Удалить все связанные ответы
      await Answer.destroy({
        where: { questionId: id },
      });
  
      // Удалить сам вопрос
      await question.destroy();
  
      res.status(200).json({ message: "Question and its answers deleted successfully" });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
  
  async deleteGroup(req, res, next) {
    try {
      const { id } = req.params;
  
      // Найти вопрос по ID
      const group = await Group.findByPk(id);
  
      // Удалить сам вопрос
      await group.destroy();
  
      res.status(200).json({ message: "Question and its answers deleted successfully" });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  async deleteanswer(req, res, next) {
    try {
      const { id } = req.params;

      const answer = await Answer.findByPk(id);

      if (!answer) {
        return res.status(404).json({ message: "Test not found" });
      }

      await UserAnswer.destroy({
        where: { selectedAnswerId: id },
      });

      await answer.destroy();

      res.status(200).json({ message: "Test deleted successfully" });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Обновить тест
  async updateTest(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      const test = await Test.findByPk(id);

      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }

      test.title = title || test.title;
      test.description = description || test.description;

      await test.save();

      res.status(200).json(test);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Получить все тесты
  async getAllTests(req, res, next) {
    try {
      const tests = await Test.findAll();

      res.status(200).json(tests);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await User.findAll();

      res.status(200).json(users);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  async getUser(req, res, next) {
    try {

      const { id } = req.params;

      const users = await User.findOne({where:{id}});

      res.status(200).json(users);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
  
      // Найти вопрос по ID
      const user = await User.findByPk(id);
  
      if (!user) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      await UserAnswer.destroy({
        where: { userId: id },
      });

      await TestResult.destroy({
        where: { userId: id },
      });

      // Удалить сам вопрос
      await user.destroy();
  
      res.status(200).json({ message: "Question and its answers deleted successfully" });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
  // ********************************************************************************************************
}

module.exports = new AdminController();
