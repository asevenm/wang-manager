import axios from 'axios'
import { ElMessage } from 'element-plus'

interface GetPrama {
  name?: string;
  type?: string;
  page?: { currentPage: number, pageSize: number }
}
export const getList = async (params: GetPrama) => {
  const res = await axios.post('/instrument/list', params);
  const { data } = res;
  return data.data;
}

export const addOrUpdateInrtrument = async (instrument: any) => {
  const res = await axios.post('/instrument/save', instrument);
  const { data } = res;
  const { status, message } = data;
  if (status === 0) {
    return true;
  }
  ElMessage(message)
  return false;
}

export const getInstrumentDetail = async (id: number) => {
  const res = await axios.get('/instrument/detail/' + id);
  const { data } = res;
  const { status, message, data: instrument } = data;
  if (status === 0) {
    return instrument;
  }
  ElMessage(message)
  return null;
}

export const deleteInstrument = async (id: number) => {
  const res = await axios.get('/instrument/delete/' + id);
  const { data } = res;
  if (data.status === 0) {
    return true;
  }
  return false;
}

export const getTypes = async () => {
  const res = await axios.get('/instrument/types');
  const { data } = res;
  return data.data;
}

export const createType = async (typeInfo: any) => {
  const res = await axios.post('/instrument/type/save', typeInfo);
  const { data } = res;
  const { status, message } = data;
  if (status === 0) {
    return true;
  }
  ElMessage(message)
  return false;
}

export const deleteType = async (id: number) => {
  const res = await axios.get('/instrument/type/delete/' + id);
  const { data } = res;
  if (data.status === 0) {
    return true;
  }
  return false;
}