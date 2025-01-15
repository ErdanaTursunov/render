const Router = require('express')
const userController = require('../controllers/userController')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')
const testController = require('../controllers/testController')
const { validateRegistration } = require('../validators/registrationValidator')
const checkAdmin = require('../middleware/checkAdmin')
const adminController = require('../controllers/adminController')
const testRouter = new Router()
const adminRouter = new Router()

testRouter.get('/', testController.getAllTests)
testRouter.get('/user/:userId', testController.getUserTests)
testRouter.get('/TestShedule', testController.getTestShedule)
testRouter.get('/:testId', authMiddleware, testController.getQuestions)
testRouter.post('/:testSheduleId/question/:questionId/answer', authMiddleware, testController.userAnswer)
testRouter.post('/:testSheduleId/result', authMiddleware, testController.getResult) 

// --------------------------------------
adminRouter.get('/users', adminController.getAllUsers)

adminRouter.get('/user/:id', adminController.getUser)

adminRouter.delete('/delete/user/:id', adminController.deleteUser)


// Результаты тестов
adminRouter.get('/results/:id', adminController.getResults)

// Групыы
adminRouter.get('/groups', adminController.getGroups)

// Создание нового теста
adminRouter.post('/create/tests', adminController.createTest);

// Создать группы
adminRouter.post('/create/group', adminController.createGroup);

// Добавление вопроса к тесту
adminRouter.post('/create/questions', adminController.addQuestion);

// Добавление ответа к вопросу
adminRouter.post('/create/answers', adminController.addAnswer);

// Создание расписания для теста
adminRouter.post('/create/schedules', adminController.createTestShedule);

// Удаление теста
adminRouter.delete('/delete/test/:id', adminController.deleteTest);

// Удаления группа
adminRouter.delete('/delete/group/:id', adminController.deleteGroup);

// Удаление теста
adminRouter.delete('/delete/question/:id', adminController.deletequestion);
// Удаление теста

adminRouter.delete('/delete/answer/:id', adminController.deleteanswer);

// Обновление теста
adminRouter.put('/put/tests/:id', adminController.updateTest);





// router.get('/', userController.home)
router.post('/auth/signin', userController.login)
router.post('/auth/signup', validateRegistration, userController.registration)
router.post('/signout', userController.signout)
// router.get('/auth/check', authMiddleware, userController.check)


router.use('/tests', testRouter)
router.use('/admin', checkAdmin, adminRouter)

module.exports = router