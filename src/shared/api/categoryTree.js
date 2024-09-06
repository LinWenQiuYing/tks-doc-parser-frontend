import axiosInstance from "./index.js";

const categoryUrl = "/doc/categories";

// 分类树查询
export async function getCategoryTree(type) {
  // type: 分类类型：1、文档分类；2、规则分类；3、任务分类
  const res = await axiosInstance.get(`${categoryUrl}/${type}`);
  return res;
}
