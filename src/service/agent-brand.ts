import axios from 'axios'
import { ElMessage } from 'element-plus'

export const getAgentBrandList = async () => {
  const res = await axios.get('/agent-brand');
  const { data } = res;
  const { status, message, data: brands } = data;
  if (status === 0) {
    return brands;
  }
  ElMessage(message)
  return [];
}

export const addOrUpdateAgentBrand = async (brand: any) => {
  const res = await axios.post('/agent-brand', brand);
  const { data } = res;
  const { status, message } = data;
  if (status === 0) {
    return true;
  }
  ElMessage(message)
  return false;
}

export const deleteAgentBrand = async (id: number) => {
  const res = await axios.delete('/agent-brand/' + id);
  const { data } = res;
  const { status, message } = data;
  if (status === 0) {
    return true;
  }
  ElMessage(message)
  return false;
}