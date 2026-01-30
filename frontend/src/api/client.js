import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sendMessage = async (message) => {
  const response = await api.post('/agent/chat', { message });
  return response.data.response;
};

export const fetchInteractions = async () => {
  const response = await api.get('/interactions');
  return response.data;
}

export const createInteraction = async (data) => {
  // We'll use the agent endpoint or a direct DB endpoint. 
  // Since the backend 'log_interaction' tool does the logic, let's just make a direct POST endpoint in backend for manual entry 
  // OR we can make a direct POST /interactions endpoint in main.py.
  // Let's assume we will add POST /interactions to main.py for manual saving.
  const response = await api.post('/interactions', data);
  return response.data;
};

export default api;
