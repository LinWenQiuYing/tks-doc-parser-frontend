import axiosInstance from "./index.js";

const ruleUrl = "/doc/rule";

// 规则列表查询
export async function getRuleList(json) {
  const res = await axiosInstance.post(`${ruleUrl}/getRuleList`, json);
  return res;
}

//新增或编辑规则
export async function editRule(json) {
  const res = await axiosInstance.post(`${ruleUrl}/editRule`, json);
  return res;
}

//根据分类类型查询类别
export async function getRuleCategory(type) {
  const res = await axiosInstance.get(`${ruleUrl}/getCategory?id=${type}`);
  return res;
}

// 删除规则操作
export async function delRuleList(id) {
  const res = await axiosInstance.get(`${ruleUrl}/deleteRule?id=${id}`);
  return res;
}

// 根据结果类型获取规则列表
export async function getRuleByResType(resultType) {
  const res = await axiosInstance.get(`${ruleUrl}/list/${resultType}`);
  return res;
}
