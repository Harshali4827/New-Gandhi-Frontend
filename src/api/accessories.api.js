import axiosInstance from '../axiosInstance';

export const getAccessoriesApi = () =>
  axiosInstance.get('/accessories');

export const getAccessoryByIdApi = (id) =>
  axiosInstance.get(`/accessories/${id}`);

export const createAccessoryApi = (data) =>
  axiosInstance.post('/accessories', data);

export const updateAccessoryApi = (id, data) =>
  axiosInstance.put(`/accessories/${id}`, data);

export const deleteAccessoryApi = (id) =>
  axiosInstance.delete(`/accessories/${id}`);

export const togglePartNumberStatusApi = (id, status) =>
  axiosInstance.put(`/accessories/${id}/part-number-status`, {
    part_number_status: status,
  });
