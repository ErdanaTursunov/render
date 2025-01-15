'use strict'

const { User, Group } = require('./models/models')
const { Test, Question, Answer, TestShedule } = require('./models/testModels');
const sequelize = require('./db')
const bcrypt = require('bcrypt');

const initDB = async () => {
    try {
        // Подключение к базе данных
        await sequelize.authenticate();
        console.log('Соединение с базой данных установлено успешно.');

        // Синхронизация моделей (создаёт таблицы, если их нет)
        await sequelize.sync({ force: true }); // Используйте { force: true } для пересоздания таблиц

        // Данные для добавления
        const groups = [
            { name: '000' },
            { name: '333' },
            { name: '444' },
            { name: '223' },
        ];

        await Group.bulkCreate(groups);
        console.log('Группы добавлены успешно.');
   
        const group = await Group.findOne({where: {name: '000'}})

        const users = [
            { name: 'Alice', email: 'alice@example.com', password: await bcrypt.hash('password123', 5), role: 'student', groupId: group.id },
            { name: 'Bob', email: 'bob@example.com', password: await bcrypt.hash('securepass ', 5), role: 'teacher', groupId: group.id },
            { name: 'Charlie', email: 'charlie@example.com', password: await bcrypt.hash('mypassword', 5), role: 'admin', groupId: group.id },
        ];

        // Добавление данных в таблицы
        await User.bulkCreate(users);
        console.log('Пользователи добавлены успешно.');

        const test1 = await Test.create({ title: 'Экзамен 344/1, 344/2', description: 'Экзаменационные тестовые вопросы по модулю ПМ04 - "Создание Web ресурсов"' });
        
        // Массив вопросов для тестов
    const questionsForTest1 = [
        {
            questionText: "Какой тег используется для создания гиперссылки?",
            answers: [
                { answerText: "<link>", isCorrect: false },
                { answerText: "<a>", isCorrect: true },
                { answerText: "<href>", isCorrect: false },
                { answerText: "<hyperlink>", isCorrect: false }
            ]
        },
        {
            questionText: "Какой атрибут HTML используется для задания идентификатора элемента?",
            answers: [
                { answerText: "class", isCorrect: false },
                { answerText: "id", isCorrect: true },
                { answerText: "name", isCorrect: false },
                { answerText: "tag", isCorrect: false }
            ]
        },
        {
            questionText: "Что делает атрибут target=\"_blank\"?",
            answers: [
                { answerText: "Открывает ссылку в том же окне", isCorrect: false },
                { answerText: "Открывает ссылку в новом окне/вкладке", isCorrect: true },
                { answerText: "Открывает ссылку в модальном окне", isCorrect: false },
                { answerText: "Не используется", isCorrect: false }
            ]
        },
        // {
        //     questionText: "Какой тег используется для создания нумерованного списка?",
        //     answers: [
        //         { answerText: "<ul>", isCorrect: false },
        //         { answerText: "<ol>", isCorrect: true },
        //         { answerText: "<li>", isCorrect: false },
        //         { answerText: "<list>", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой атрибут используется для указания пути к изображению?",
        //     answers: [
        //         { answerText: "alt", isCorrect: false },
        //         { answerText: "src", isCorrect: true },
        //         { answerText: "href", isCorrect: false },
        //         { answerText: "path", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой тег определяет заголовок самого высокого уровня?",
        //     answers: [
        //         { answerText: "<h1>", isCorrect: true },
        //         { answerText: "<header>", isCorrect: false },
        //         { answerText: "<h6>", isCorrect: false },
        //         { answerText: "<title>", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой атрибут используется для объединения ячеек таблицы по горизонтали?",
        //     answers: [
        //         { answerText: "rowspan", isCorrect: false },
        //         { answerText: "colspan", isCorrect: true },
        //         { answerText: "merge", isCorrect: false },
        //         { answerText: "span", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой тег используется для вставки строки в таблицу?",
        //     answers: [
        //         { answerText: "<td>", isCorrect: false },
        //         { answerText: "<tr>", isCorrect: true },
        //         { answerText: "<th>", isCorrect: false },
        //         { answerText: "<table>", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой тег HTML используется для добавления текста в подстрочном формате?",
        //     answers: [
        //         { answerText: "<sub>", isCorrect: true },
        //         { answerText: "<sup>", isCorrect: false },
        //         { answerText: "<small>", isCorrect: false },
        //         { answerText: "<below>", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой атрибут HTML используется для задания всплывающей подсказки?",
        //     answers: [
        //         { answerText: "tooltip", isCorrect: false },
        //         { answerText: "hint", isCorrect: false },
        //         { answerText: "alt", isCorrect: false },
        //         { answerText: "title", isCorrect: true }
        //     ]
        // },
        // {
        //     questionText: "Какое свойство используется для задания фона элемента?",
        //     answers: [
        //         { answerText: "background-color", isCorrect: true },
        //         { answerText: "bg-color", isCorrect: false },
        //         { answerText: "background", isCorrect: false },
        //         { answerText: "color", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой селектор используется для выбора всех элементов с определённым классом?",
        //     answers: [
        //         { answerText: ".class", isCorrect: true },
        //         { answerText: "#class", isCorrect: false },
        //         { answerText: "class", isCorrect: false },
        //         { answerText: "*class", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какое значение свойства position делает элемент фиксированным при прокрутке страницы?",
        //     answers: [
        //         { answerText: "relative", isCorrect: false },
        //         { answerText: "absolute", isCorrect: false },
        //         { answerText: "fixed", isCorrect: true },
        //         { answerText: "static", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Как задать полупрозрачный цвет в CSS?",
        //     answers: [
        //         { answerText: "Использовать HEX", isCorrect: false },
        //         { answerText: "Использовать RGBA", isCorrect: true },
        //         { answerText: "Использовать HSL", isCorrect: false },
        //         { answerText: "Использовать CMYK", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какое свойство изменяет размер шрифта текста?",
        //     answers: [
        //         { answerText: "font-weight", isCorrect: false },
        //         { answerText: "font-size", isCorrect: true },
        //         { answerText: "text-size", isCorrect: false },
        //         { answerText: "size", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой селектор CSS выбирает только первый элемент списка?",
        //     answers: [
        //         { answerText: ":first", isCorrect: false },
        //         { answerText: ":first-child", isCorrect: true },
        //         { answerText: ":first-of-type", isCorrect: false },
        //         { answerText: ":nth-child(1)", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какое свойство CSS используется для добавления тени текста?",
        //     answers: [
        //         { answerText: "text-shadow", isCorrect: true },
        //         { answerText: "box-shadow", isCorrect: false },
        //         { answerText: "font-shadow", isCorrect: false },
        //         { answerText: "shadow", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какое свойство изменяет внутренние отступы элемента?",
        //     answers: [
        //         { answerText: "margin", isCorrect: false },
        //         { answerText: "padding", isCorrect: true },
        //         { answerText: "border", isCorrect: false },
        //         { answerText: "gap", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какое значение свойства display делает элемент блочным?",
        //     answers: [
        //         { answerText: "inline", isCorrect: false },
        //         { answerText: "block", isCorrect: true },
        //         { answerText: "inline-block", isCorrect: false },
        //         { answerText: "flex", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой из следующих селекторов выбирает все <p> внутри <div>?",
        //     answers: [
        //         { answerText: "div + p", isCorrect: false },
        //         { answerText: "div > p", isCorrect: false },
        //         { answerText: "div p", isCorrect: true },
        //         { answerText: "p div", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Что возвращает typeof null?",
        //     answers: [
        //         { answerText: "object", isCorrect: true },
        //         { answerText: "null", isCorrect: false },
        //         { answerText: "undefined", isCorrect: false },
        //         { answerText: "boolean", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какое ключевое слово объявляет константу?",
        //     answers: [
        //         { answerText: "var", isCorrect: false },
        //         { answerText: "let", isCorrect: false },
        //         { answerText: "const", isCorrect: true },
        //         { answerText: "constant", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой метод массива добавляет элемент в конец массива?",
        //     answers: [
        //         { answerText: "pop()", isCorrect: false },
        //         { answerText: "shift()", isCorrect: false },
        //         { answerText: "unshift()", isCorrect: false },
        //         { answerText: "push()", isCorrect: true }
        //     ]
        // },
        // {
        //     questionText: "Как записать стрелочную функцию?",
        //     answers: [
        //         { answerText: "function() => {}", isCorrect: false },
        //         { answerText: "() -> {}", isCorrect: false },
        //         { answerText: "() => {}", isCorrect: true },
        //         { answerText: "{ => () }", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Что вернёт console.log(2 + '2')?",
        //     answers: [
        //         { answerText: "4", isCorrect: false },
        //         { answerText: "22", isCorrect: true },
        //         { answerText: "NaN", isCorrect: false },
        //         { answerText: "Ошибка", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой метод преобразует JSON-строку в объект?",
        //     answers: [
        //         { answerText: "JSON.stringify()", isCorrect: false },
        //         { answerText: "JSON.parse()", isCorrect: true },
        //         { answerText: "JSON.toObject()", isCorrect: false },
        //         { answerText: "parseJSON()", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Как проверить, является ли переменная массивом?",
        //     answers: [
        //         { answerText: "typeof", isCorrect: false },
        //         { answerText: "isArray()", isCorrect: false },
        //         { answerText: "Array.isArray()", isCorrect: true },
        //         { answerText: "instanceof Array", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какое ключевое слово используется для исключения из функции?",
        //     answers: [
        //         { answerText: "break", isCorrect: false },
        //         { answerText: "continue", isCorrect: false },
        //         { answerText: "return", isCorrect: true },
        //         { answerText: "stop", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой метод используется для округления числа вниз?",
        //     answers: [
        //         { answerText: "Math.floor()", isCorrect: true },
        //         { answerText: "Math.round()", isCorrect: false },
        //         { answerText: "Math.ceil()", isCorrect: false },
        //         { answerText: "Math.trunc()", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Как остановить выполнение цикла?",
        //     answers: [
        //         { answerText: "stop", isCorrect: false },
        //         { answerText: "return", isCorrect: false },
        //         { answerText: "exit", isCorrect: false },
        //         { answerText: "break", isCorrect: true }
        //     ]
        // },
        // {
        //     questionText: "Что такое 'props'?",
        //     answers: [
        //         { answerText: "Локальное состояние", isCorrect: false },
        //         { answerText: "Свойства компонента", isCorrect: true },
        //         { answerText: "Метод компонента", isCorrect: false },
        //         { answerText: "Шаблоны стилей", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Как передать данные от родителя к дочернему компоненту?",
        //     answers: [
        //         { answerText: "Через состояние", isCorrect: false },
        //         { answerText: "Через props", isCorrect: true },
        //         { answerText: "Через useEffect", isCorrect: false },
        //         { answerText: "Невозможно", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Что делает метод setState()?",
        //     answers: [
        //         { answerText: "Меняет свойства компонента", isCorrect: false },
        //         { answerText: "Обновляет состояние компонента", isCorrect: true },
        //         { answerText: "Обновляет DOM", isCorrect: false },
        //         { answerText: "Удаляет состояние", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой хук используется для управления состоянием в функциональных компонентах?",
        //     answers: [
        //         { answerText: "useEffect", isCorrect: false },
        //         { answerText: "useState", isCorrect: true },
        //         { answerText: "useReducer", isCorrect: false },
        //         { answerText: "useContext", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Что такое 'Virtual DOM'?",
        //     answers: [
        //         { answerText: "Слой для тестирования", isCorrect: false },
        //         { answerText: "Копия реального DOM", isCorrect: true },
        //         { answerText: "Хранилище данных", isCorrect: false },
        //         { answerText: "Среда разработки", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой метод жизненного цикла вызывается перед удалением компонента?",
        //     answers: [
        //         { answerText: "componentDidMount", isCorrect: false },
        //         { answerText: "componentWillUnmount", isCorrect: true },
        //         { answerText: "render", isCorrect: false },
        //         { answerText: "shouldComponentUpdate", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой хук запускает эффект после рендера компонента?",
        //     answers: [
        //         { answerText: "useState", isCorrect: false },
        //         { answerText: "useEffect", isCorrect: true },
        //         { answerText: "useContext", isCorrect: false },
        //         { answerText: "useReducer", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой атрибут React используется для привязки стилей к элементу?",
        //     answers: [
        //         { answerText: "style", isCorrect: true },
        //         { answerText: "class", isCorrect: false },
        //         { answerText: "styles", isCorrect: false },
        //         { answerText: "css", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Как называются функции, которые возвращают React-элементы?",
        //     answers: [
        //         { answerText: "Компоненты", isCorrect: true },
        //         { answerText: "Состояния", isCorrect: false },
        //         { answerText: "Блоки", isCorrect: false },
        //         { answerText: "use эффекты", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Как передать несколько значений состояния в одном вызове?",
        //     answers: [
        //         { answerText: "Использовать несколько useState", isCorrect: false },
        //         { answerText: "Использовать useReducer", isCorrect: true },
        //         { answerText: "Использовать useContext", isCorrect: false },
        //         { answerText: "Невозможно", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой метод используется для создания контекста в React?",
        //     answers: [
        //         { answerText: "createState", isCorrect: false },
        //         { answerText: "createContext", isCorrect: true },
        //         { answerText: "createStore", isCorrect: false },
        //         { answerText: "useContext", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой хук используется для создания ссылки на DOM-элемент?",
        //     answers: [
        //         { answerText: "useEffect", isCorrect: false },
        //         { answerText: "useState", isCorrect: false },
        //         { answerText: "useRef", isCorrect: true },
        //         { answerText: "useReducer", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой метод используется для асинхронной загрузки данных в React?",
        //     answers: [
        //         { answerText: "fetchData", isCorrect: false },
        //         { answerText: "useFetch", isCorrect: false },
        //         { answerText: "useEffect", isCorrect: true },
        //         { answerText: "useAsync", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Что делает атрибут key в списках React?",
        //     answers: [
        //         { answerText: "Открывает элемент списка", isCorrect: false },
        //         { answerText: "Устанавливает уникальный идентификатор для каждого элемента", isCorrect: true },
        //         { answerText: "Создаёт массив элементов", isCorrect: false },
        //         { answerText: "Связывает элементы", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой тип данных должен использоваться для атрибута key?",
        //     answers: [
        //         { answerText: "Объект", isCorrect: false },
        //         { answerText: "Число или строка", isCorrect: true },
        //         { answerText: "Булевое значение", isCorrect: false },
        //         { answerText: "Любой", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой хук можно использовать для оптимизации производительности в React?",
        //     answers: [
        //         { answerText: "useEffect", isCorrect: false },
        //         { answerText: "useMemo", isCorrect: true },
        //         { answerText: "useState", isCorrect: false },
        //         { answerText: "useReducer", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Что возвращает метод React.createElement()?",
        //     answers: [
        //         { answerText: "Компонент", isCorrect: false },
        //         { answerText: "DOM-узел", isCorrect: false },
        //         { answerText: "React-элемент", isCorrect: true },
        //         { answerText: "Объект JavaScript", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Что такое JSX?",
        //     answers: [
        //         { answerText: "Язык программирования", isCorrect: false },
        //         { answerText: "Функция React", isCorrect: false },
        //         { answerText: "Синтаксическое расширение JavaScript", isCorrect: true },
        //         { answerText: "Структура данных", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Какой метод используется для рендера компонента в DOM?",
        //     answers: [
        //         { answerText: "renderComponent", isCorrect: false },
        //         { answerText: "ReactDOM.render", isCorrect: true },
        //         { answerText: "React.render", isCorrect: false },
        //         { answerText: "Component.render", isCorrect: false }
        //     ]
        // },
        // {
        //     questionText: "Как в React обработать клик по элементу?",
        //     answers: [
        //         { answerText: "Использовать событие onclick", isCorrect: false },
        //         { answerText: "Использовать событие onClick", isCorrect: true },
        //         { answerText: "Использовать метод addEventListener", isCorrect: false },
        //         { answerText: "Использовать атрибут HTML onclick", isCorrect: false }
        //     ]
        // }
      ];
  
     
  
      // Функция для добавления вопросов и ответов
      const addQuestionsWithAnswers = async (test, questions) => {
          for (const questionData of questions) {
            const question = await Question.create({ 
              questionText: questionData.questionText, 
              testId: test.id 
            });
    
            for (const answerData of questionData.answers) {
              await Answer.create({ 
                answerText: answerData.answerText, 
                isCorrect: answerData.isCorrect, 
                questionId: question.id 
              });
            }
          }
        }

        await addQuestionsWithAnswers(test1, questionsForTest1);


        const testId = 1; // ID теста, который уже существует в базе данных
        const groupId = 1; // ID группы, которая уже существует в базе данных

        // Добавляем пару расписаний для теста
        const schedules = [
            {
                date: new Date('2024-12-20'),
                startTime: '10:00:00',
                endTime: '11:00:00',
                testId: 1,
                groupId: groupId,
            },
        ];

        // Создаем записи в таблице TestShedule
        await TestShedule.bulkCreate(schedules); 

        console.log('Данные успешно добавлены в базу.');
    } catch (error) {
        console.error('Ошибка при добавлении данных:', error);
    } finally {
        await sequelize.close();
    }
};

initDB()