const sequelize = require('../db')
const {DataTypes, Sequelize} = require('sequelize')

// Модели таблиц БД
const Group = sequelize.define('Group', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true},
})

const User = sequelize.define('User', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {
        type: Sequelize.ENUM('student', 'admin', 'teacher'),
        allowNull: false,
        defaultValue: 'student',  // Устанавливаем дефолтное значение
    },
    groupId: { // Добавляем поле для внешнего ключа в таблицу User
        type: DataTypes.INTEGER,
        references: {
            model: Group, // Ссылается на модель Group
            key: 'id' // Внешний ключ ссылается на поле id в модели Group
        }
    }

})

User.belongsTo(Group, { foreignKey: 'groupId' }); // В таблице Users будет поле groupId
Group.hasMany(User, { foreignKey: 'groupId' });

module.exports = {
    User,
    Group
}