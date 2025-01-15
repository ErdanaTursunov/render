import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Укажите ваш URL API
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Или другой способ хранения токена
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchTests = async () => {
  try {
    const response = await api.get('/tests');
    // console.log(response.data.tests)
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchUserTests = async (userId) => {
  try {
    const response = await api.get(`/tests/user/${userId}`);
    // console.log(response.data.tests)
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchLogin = async (email, password) => {
  try {
    const response = await api.post('/auth/signin', {email, password});
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchRegister = async (formData) => {
  try {
    const response = await api.post('/auth/signup', formData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchQuestions = async (testId) => {
  try {
    const response = await api.get('/tests/' + testId);
    return response.data;
  } catch (error) {
    console.erro('API Error:', error);
    throw error;
  }
};

export const fetchAnswer = async (testSheduleId, questionId, answerId) => {
  try {
    // console.log('ts ',testSheduleId);
    const response = await api.post(`tests/${testSheduleId}/question/${questionId}/answer`, { answerId });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchResult = async (testSheduleId) => {
  try {
    // console.log('result: ', testSheduleId);
    const response = await api.post(`/tests/${testSheduleId}/result`);
    // console.log('result: ', response);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
// module.exports = { fetchTests, fetchLogin }
// *******************************************************

export const fetchResults = async (id) => {
  try {
    // console.log('result: ', testSheduleId);
    const response = await api.get(`/admin/results/${id}`);
    // console.log('result admin: ', response);s
    return response.data;

  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};


// **********************АДМИН_FETCH*********************************

// Создание нового теста
export const createTest = async (testData) => {
  try {
    const response = await api.post('/admin/create/tests', testData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Добавление вопросов к тесту
export const addQuestion = async (questionData) => {
  try {
    const response = await api.post('/admin/create/questions', questionData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Добавление ответов к вопросу
export const addAnswers = async (answersData) => {
  try {
    const response = await api.post('/admin/create/answers', answersData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Создание расписания для теста
export const createSchedule = async (scheduleData) => {
  try {
    const response = await api.post('/admin/create/schedules', scheduleData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Создание группы
export const createGroup = async (groupData) => {
  try {
    const response = await api.post('/admin/create/group', groupData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Удаление теста
export const deleteTest = async (testId) => {
  try {
    const response = await api.delete(`/admin/delete/test/${testId}`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Обновление теста
export const updateTest = async (testId, testData) => {
  try {
    const response = await api.put(`/admin/put/tests/${testId}`, testData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};


// Удаление вопроса
export const deleteQuestion = async (questionId) => {
  try {
    const response = await api.delete(`/admin/delete/question/${questionId}`);
    return response; // Например: { message: "Question deleted successfully" }
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
};

// Удаление ответа
export const deleteAnswer = async (answerId) => {
  try {
    const response = await api.delete(`/admin/delete/answer/${answerId}`);
    return response; // Например: { message: "Answer deleted successfully" }
  } catch (error) {
    console.error("Error deleting answer:", error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    // console.log('result: ', testSheduleId);
    const response = await api.get(`/admin/users`);
    // console.log('result admin: ', response);s
    return response.data;

  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchUser = async (id) => {
  try {
    // console.log('result: ', testSheduleId);
    const response = await api.get(`/admin/user/${id}`);
    // console.log('result admin: ', response);s
    return response.data;

  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchGroups= async () => {
  try {
    const response = await api.get(`/admin/groups`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const deleteuser = async (id) => {
  try {
    const response = await api.delete(`/admin/delete/user/${id}`);
    return response; // Например: { message: "Answer deleted successfully" }
  } catch (error) {
    console.error("Error deleting answer:", error);
    throw error;
  }
};

// Удаление группы
export const deleteGroup = async (groupId) => {
  try {
    const response = await api.delete(`/admin/delete/group/${groupId}`);
    return response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
