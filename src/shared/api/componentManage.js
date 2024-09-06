import axiosInstance from "./index.js";

const nodeUrl = "/flowEngine/node";
const categoryUrl = "/flowEngine/category";


// 节点列表查询
export async function nodeListQuery(json) {
  const res = await axiosInstance.post(`${nodeUrl}/nodeListQuery`, json);
  return res;
}

// 添加节点配置
export async function addNodeConfig(json) {
  const res = await axiosInstance.post(`${nodeUrl}/addNodeConfig`, json);
  return res;
}

// 查看节点的配置信息
export async function nodeConfigDetail(id) {
  const res = await axiosInstance.get(
    `${nodeUrl}/nodeConfigDetail?nodeId=${id}`
  );
  return res;
}

// 获取字段类型
export async function queryDictionaryByType(type) {
  const res = await axiosInstance.get(
    `${nodeUrl}/queryDictionaryByType?dicType=${type}`
  );
  return res;
}

// 删除节点
export async function deleteNode(type) {
  const res = await axiosInstance.get(`${nodeUrl}/deleteNode?dicType=${type}`);
  return res;
}



// 新建分类
export async function addCategory(json) {
  const res = await axiosInstance.post(`${categoryUrl}/addCategory`, json);
  return res;
}

// 删除分类
export async function deleteCategory(id) {
  const res = await axiosInstance.delete(
    `${categoryUrl}/deleteCategory?id=${id}`
  );
  return res;
}
