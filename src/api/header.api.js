import axiosInstance from "../axiosInstance";

export const getHeadersApi = () => axiosInstance.get('/headers');
export const getHeaderByIdApi = (id) => axiosInstance.get(`/headers/${id}`);
export const createHeaderApi = (data) => axiosInstance.post('/headers', data);
export const updateHeaderApi = (id, data) => axiosInstance.put(`/headers/${id}`, data);
export const deleteHeaderApi = (id) => axiosInstance.delete(`/headers/${id}`);
