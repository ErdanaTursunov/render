import React, { useEffect, useState } from "react";
import {
  fetchUsers,
  deleteuser,
  fetchRegister,
  fetchGroups,
} from "../services/api";
import "./UserPage.css";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    groupId: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const loadUsersAndGroups = async () => {
      try {
        const [usersResponse, groupsResponse] = await Promise.all([
          fetchUsers(),
          fetchGroups(),
        ]);
        setUsers(usersResponse);
        setGroups(groupsResponse);
      } catch (error) {
        console.error("Error loading users or groups:", error.message);
      }
    };
    loadUsersAndGroups();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await deleteuser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  const toggleAddForm = () => {
    setShowAddForm((prevShowAddForm) => !prevShowAddForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      alert("Пароли не совпадают!");
      return;
    }

    try {
      const newUser = await fetchRegister(formData);
      setUsers((prevUsers) => [...prevUsers, newUser.user]);
      setShowAddForm(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        groupId: "",
      });
      setConfirmPassword("");
      alert("Пользователь успешно добавлен!");
    } catch (error) {
      console.error("Ошибка регистрации пользователя:", error.message);
      alert("Ошибка при добавлении пользователя.");
    }
  };

  const getGroupName = (groupId) => {
    const group = groups.find((g) => g.id === groupId);
    return group ? group.name : "Неизвестная группа";
  };

  return (
    <div className="UserPage">
      <h1>Пользователи</h1>

      <button onClick={toggleAddForm} className="add-user-button">
        {showAddForm ? "Отмена" : "Добавить пользователя"}
      </button>

      {showAddForm && (
        <div className="add-user-form">
          <h2>Добавить пользователя</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Имя"
              value={formData.name}
              name="name"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              placeholder="Электронная почта"
              value={formData.email}
              name="email"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={formData.password}
              name="password"
              onChange={handleChange}
              required
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>

            <select
              name="groupId"
              value={formData.groupId}
              onChange={handleChange}
              required
            >
              <option value="">Выберите группу</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            <input
              type="password"
              placeholder="Подтвердите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Добавить</button>
          </form>
        </div>
      )}

      {users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Электронная почта</th>
              <th>Роль</th>
              <th>Группа</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{getGroupName(user.groupId)}</td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="delete"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Нет пользователей для отображения</p>
      )}
    </div>
  );
};

export default UserPage;
