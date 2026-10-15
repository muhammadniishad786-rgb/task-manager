
import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

export const getTasks = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createTask = async (title) => {
  const response = await axios.post(API_URL, { title });
  return response.data;
};

export const toggleTask = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}`);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
