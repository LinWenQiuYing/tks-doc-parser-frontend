import axiosInstance from "./index.js";

const taskUrl = "/doc/tasks";

// 任务列表查询
export async function getTaskList(json) {
  const res = await axiosInstance.put(`${taskUrl}/list`, json);
  return res;
}

// 删除任务
export async function deleteTask(id) {
  const res = await axiosInstance.delete(`${taskUrl}/${id}`);
  return res;
}

// 新增任务
export async function addTask(json) {
  const res = await axiosInstance.post(`${taskUrl}/`, json);
  return res;
}
