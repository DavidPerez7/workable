import axios from 'axios';

const API_URL = 'http://localhost:8080/api/postulacion';

export const crearPostulacion = async (postulacion) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(API_URL, postulacion, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const obtenerPostulaciones = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const eliminarPostulacion = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
