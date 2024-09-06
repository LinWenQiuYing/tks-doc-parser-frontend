import { Modal, message } from "ant-design-vue";
// 确认弹窗
export function modalConfirm(title, content, onOk) {
  Modal.confirm({
    title: title,
    // icon: <exclamation-circle-outlined style="color: #FE9E17 " />,
    content: content,
    okText: "确认",
    okType: "primary",
    centered: true,
    cancelText: "取消",
    onOk: onOk,
    onCancel: () => {
      message.info("已取消");
    },
  });
}

// 重置toRefs导出的响应式变量
export const resetData = (data) => {
  const keys = Object.keys(data);
  let obj = {};
  keys.forEach((item) => {
    if (Array.isArray(data[item])) {
      obj[item] = [];
    } else if (data[item] instanceof Object) {
      obj[item] = {};
    } else {
      obj[item] = undefined;
    }
  });
  Object.assign(data, obj);
};

// 根据id递归查找树状节点
export const findTreeNodeById = (node, id) => {
  if (node.key === id) {
    return node;
  }
  if (node.children && node.children.length > 0) {
    for (let i = 0; i < node.children.length; i++) {
      const foundNode = findTreeNodeById(node.children[i], id);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return null;
};

/**
 * 将树形数据转换为分类树所需的选项数据格式。
 * @param {Array} tree 树形数据
 * @param {String} valueStr 节点值所对应的字段名
 * @param {String} labelStr 节点标签所对应的字段名
 * @returns {Array} 返回级联选择器所需的选项数据格式
 */
export function processCategoryTree(
  tree,
  valueStr = "value",
  labelStr = "label"
) {
  // 递归处理树形数据
  const processTree = (tree) =>
    tree.map((item) => {
      const { children } = item;
      const newItem = {
        ...item,
        key: item[valueStr],
        title: item[labelStr],
      };
      if (children && children.length > 0) {
        newItem.children = processTree(children);
      }
      return newItem;
    });

  // 调用递归函数生成级联选择器所需的选项数据
  return processTree(tree);
}
