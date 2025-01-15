const sequelize = require('../db')
const {DataTypes, Sequelize} = require('sequelize')
const {User, Group} = require('./models')


// Модель для теста
const Test = sequelize.define('Test', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false }
});

// Модель для вопроса
const Question = sequelize.define('Question', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    questionText: { type: DataTypes.TEXT, allowNull: false },
    testId: { 
        type: DataTypes.INTEGER, 
        references: {
            model: Test,
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
});

// Модель для ответа
const Answer = sequelize.define('Answer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    answerText: { type: DataTypes.STRING, allowNull: false },
    isCorrect: { type: DataTypes.BOOLEAN, defaultValue: false },
    questionId: { 
        type: DataTypes.INTEGER, 
        references: {
            model: Question,
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
});

const TestShedule = sequelize.define('TestShedule',{
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.DATE, allowNull: false },
    startTime: { type: DataTypes.TIME, allowNull: false },
    endTime: { type: DataTypes.TIME, allowNull: false },
    testId: {
        type: DataTypes.INTEGER,
        references: {
            model: Test,
            key: 'id'
        }
    },
    groupId: {
        type: DataTypes.INTEGER,
        references: {
            model: Group,
            key: 'id'
        }
    },
})

// Модель для сохранения ответов пользователя
const UserAnswer = sequelize.define('UserAnswer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    selectedAnswerId: {
        type: DataTypes.INTEGER,
        references: {
            model: Answer,
            key: 'id'
        }
    },
    userId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    questionId: {
        type: DataTypes.INTEGER,
        references: {
            model: Question,
            key: 'id'
        }
    },
    testSheduleId: {
        type: DataTypes.INTEGER,
        references: {
            model: TestShedule,
            key: 'id'
        }
    },
    isCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

// Модель для результатов теста
const TestResult = sequelize.define('TestResult', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { 
        type: DataTypes.INTEGER,
        allowNull: false
    },
    testSheduleId: {
        type: DataTypes.INTEGER,
        references: {
            model: TestShedule,
            key: 'id'
        }
    },
    correctAnswers: { type: DataTypes.INTEGER, allowNull: false },
    totalQuestions: { type: DataTypes.INTEGER, allowNull: false },
    resultPercentage: { type: DataTypes.DECIMAL(5, 2), allowNull: false }
});



// Устанавливаем связи
Test.hasMany(Question, { foreignKey: 'testId' });
Question.belongsTo(Test, { foreignKey: 'testId' });

Question.hasMany(Answer, { foreignKey: 'questionId' });
Answer.belongsTo(Question, { foreignKey: 'questionId' });

UserAnswer.belongsTo(Answer, { foreignKey: 'selectedAnswerId' });
Answer.hasMany(UserAnswer, { foreignKey: 'selectedAnswerId' });

UserAnswer.belongsTo(Question, { foreignKey: 'questionId' });
Question.hasMany(UserAnswer, { foreignKey: 'questionId' });

UserAnswer.belongsTo(TestShedule, { foreignKey: 'testSheduleId' });
TestShedule.hasMany(UserAnswer, { foreignKey: 'testSheduleId' });

UserAnswer.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(UserAnswer, { foreignKey: 'userId' });

TestResult.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(TestResult, { foreignKey: 'userId' });

TestResult.belongsTo(Test, { foreignKey: 'testId' });
Test.hasMany(TestResult, { foreignKey: 'testId' });

TestShedule.belongsTo(Test, { foreignKey: 'testId' });
Test.hasMany(TestShedule, { foreignKey: 'testId' });

TestShedule.belongsTo(Group, { foreignKey: 'groupId' });
Group.hasMany(TestShedule, { foreignKey: 'groupId' });

module.exports = {
    Test,
    Question,
    Answer,
    UserAnswer,
    TestResult,
    TestShedule
};
