import React, { useEffect, useState } from "react";
import { createGroup, fetchGroups, deleteGroup } from "../services/api";
import "./GroupManagementPage.css"

const GroupManagementPage = () => {
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Загрузка групп
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const groupData = await fetchGroups();
        setGroups(groupData);
      } catch (error) {
        console.error("Ошибка загрузки групп:", error.message);
      }
    };

    loadGroups();
  }, []);

  // Создание группы
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError("Название группы не может быть пустым");
      return;
    }

    try {
      const newGroup = await createGroup({ name: groupName });
      setGroups((prevGroups) => [...prevGroups, newGroup]);
      setGroupName("");
      setError("");
      setSuccess("Группа успешно создана");
    } catch (error) {
      console.error("Ошибка при создании группы:", error);
      setError("Ошибка при создании группы");
      setSuccess("");
    }
  };

  // Удаление группы
  const handleDeleteGroup = async (groupId) => {
    try {
      await deleteGroup(groupId);
      setGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));
      setSuccess("Группа успешно удалена");
    } catch (error) {
      console.error("Ошибка при удалении группы:", error);
      setError("Ошибка при удалении группы");
      setSuccess("");
    }
  };

  return (
    <div className="GroupManagementPage">
      <h1>Управление группами</h1>

      {/* Форма для создания группы */}
      <form className="label_title" onSubmit={handleCreateGroup}>
        <div className="label_title">
          <label htmlFor="groupName">Название группы</label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Введите название группы"
          />
        </div>
        <button type="submit">Создать группу</button>
      </form>

      {/* Уведомления об ошибках и успехах */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* Список групп */}
      <h2>Список групп</h2>
      {groups.length > 0 ? (
        <ul className="groups">
          {groups.map((group) => (
            <li className="group" key={group.id}>
              {group.name}
              <button
                onClick={() => handleDeleteGroup(group.id)}
                className="delete"
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Группы отсутствуют</p>
      )}
    </div>
  );
};

export default GroupManagementPage;
