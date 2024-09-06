import axiosInstance from "./index.js";

const fileUrl = "/doc/file";

// 根据分类id获取文件列表详情
export async function getFilesByCategoryId(id) {
  const res = await axiosInstance.get(`${fileUrl}/getFileDetails?id=${id}`);
  return res;
}

// 根据文件id获取文件html
export async function getHtmlByFileId(path) {
  const res = await axiosInstance.get(`${fileUrl}/getHtmlFile?filePath=${path}`);
  return res;
}

// 分页查询文档
export async function getFileList(json) {
  const res = await axiosInstance.post(`${fileUrl}/getFileList`, json);
  return res;
}

// 上传文档
export async function uploadDocument(formData) {
  const res = await axiosInstance.post(`${fileUrl}/upload`, formData);
  return res;
}
