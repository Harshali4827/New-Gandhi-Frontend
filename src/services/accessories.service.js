import {
    getAccessoriesApi,
    getAccessoryByIdApi,
    createAccessoryApi,
    updateAccessoryApi,
    deleteAccessoryApi,
    togglePartNumberStatusApi,
  } from '../api/accessories.api';
  
  export const fetchAccessoriesService = async () => {
    const res = await getAccessoriesApi();
    return res.data.data.accessories;
  };
  
  export const fetchAccessoryByIdService = async (id) => {
    const res = await getAccessoryByIdApi(id);
    return res.data.data.accessory;
  };
  
  export const createAccessoryService = async (payload) =>
    createAccessoryApi(payload);
  
  export const updateAccessoryService = async (id, payload) =>
    updateAccessoryApi(id, payload);
  
  export const deleteAccessoryService = async (id) =>
    deleteAccessoryApi(id);
  
  export const togglePartNumberStatusService = async (id, status) =>
    togglePartNumberStatusApi(id, status);
  