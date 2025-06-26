import axios from 'axios'
import { ElMessage } from 'element-plus'

export const getMessageList = async (params: any) => {
  const res = await axios.post('/messages/list', params);
  const { data } = res;
  const { status, message, data: list } = data;
  if (status === 0) {
    return list;
  }
  ElMessage(message)
  return [];
}

export const markAsRead = async (id: number) => {
  const res = await axios.patch('/messages/' + id + '/read');
  const { data } = res;
  const { status, message } = data;
  if (status === 0) {
    return true;
  }
  ElMessage(message)
  return false;
}