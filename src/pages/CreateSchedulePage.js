import React, { useState, useEffect } from "react";
import { createSchedule, fetchGroups, fetchTests } from "../services/api";
import "./CreateSchedulePage.css"

const CreateSchedulePage = () => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [testId, setTestId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groups, setGroups] = useState([]);
  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");

  // Загрузка групп и тестов
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [groupResponse, testResponse] = await Promise.all([
          fetchGroups(),
          fetchTests(),
        ]);
        setGroups(groupResponse);
        setTests(testResponse);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error.message);
      }
    };

    loadOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !startTime || !endTime || !testId || !groupId) {
      setError("Все поля обязательны для заполнения");
      return;
    }

    const scheduleData = {
      date,
      startTime,
      endTime,
      testId,
      groupId,
    };

    try {
      const response = await createSchedule(scheduleData);
      console.log("Расписание успешно создано:", response);
      setDate("");
      setStartTime("");
      setEndTime("");
      setTestId("");
      setGroupId("");
      setError("");
    } catch (error) {
      console.error("Ошибка при создании расписания:", error);
      setError("Ошибка при создании расписания");
    }
  };

  return (
    <div className="CreateSchedulePage">
      <h1>Создание расписания для теста</h1>

      <form className="block" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Дата</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="startTime">Время начала</label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="endTime">Время окончания</label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="testId">Тест</label>
          <select
            id="testId"
            value={testId}
            onChange={(e) => setTestId(e.target.value)}
          >
            <option value="">Выберите тест</option>
            {tests.map((test) => (
              <option key={test.id} value={test.id}>
                {test.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="groupId">Группа</label>
          <select
            id="groupId"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          >
            <option value="">Выберите группу</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Создать расписание</button>
      </form>
    </div>
  );
};

export default CreateSchedulePage;
