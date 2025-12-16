import axiosInstance from '../axios/axiosInstance';

export const getModelsApi = () => axiosInstance.get('/models');
export const getModelByIdApi = (id) => axiosInstance.get(`/models/${id}`);
export const createModelApi = (data) => axiosInstance.post('/models', data);
export const updateModelApi = (id, data) => axiosInstance.put(`/models/${id}`, data);
export const deleteModelApi = (id) => axiosInstance.delete(`/models/${id}`);

