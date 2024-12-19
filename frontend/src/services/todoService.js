
// src/services/todoService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/todos'; 

const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.access_token) {
    return { Authorization: `Bearer ${user.access_token}` };
  }
  return {};
};

export const getAllTodos = async () => {
  const response = await axios.get(API_URL, { headers: authHeader() });
  return response.data;
};

export const createTodo = async (title, description) => {
  const response = await axios.post(
    API_URL,
    { title, description },
    { headers: authHeader() }
  );
  return response.data;
};

export const updateTodo = async (id, data) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    data,
    { headers: authHeader() }
  );
  return response.data;
};

export const deleteTodo = async (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};