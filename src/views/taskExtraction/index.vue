<template>
  <div class="task-extraction">
    <div class="task-extraction-left">
      <LeftTreeList
        type="task"
        treeTitle="任务分类"
        :data="treeData"
        :loading="treeLoading"
        @treeSelected="leftTreeSelected"
      />
    </div>
    <TableList
      listClass="task-extraction-table"
      title="任务列表"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="searchLoading"
    >
      <template #searchOptions>
        <div class="table-list-top-item btns">
          <div class="btns-right">
            <a-button @click="onRefresh">刷新</a-button>
            <a-button type="primary" @click="showAddModal">新建</a-button>
          </div>
        </div>
      </template>

      <template #action="{ record }">
        <a-tooltip placement="top" title="编辑">
          <icon-svg
            className="action-img"
            icon-class="action-edit"
            @click="handleEdit(record)"
          />
        </a-tooltip>
        <a-divider type="vertical" />
        <a-tooltip placement="top" title="删除">
          <icon-svg
            className="action-img delete"
            icon-class="action-delete"
            @click="handleDelete(record)"
          />
        </a-tooltip>
        <a-divider type="vertical" />
        <a-tooltip placement="top" title="执行">
          <icon-svg
            className="action-img"
            icon-class="action-execute"
            @click="handleExecute(record)"
          />
        </a-tooltip>
        <a-divider type="vertical" />
        <a-tooltip placement="top" title="执行结果">
          <icon-svg
            className="action-img"
            icon-class="action-result"
            @click="handleCheckResult(record)"
          />
        </a-tooltip>
      </template>
    </TableList>
  </div>

  <a-modal
    v-model:visible="isAddModalShow"
    :title="modalTitle"
    @ok="handleAdd"
    @cancel="handleCancel"
    centered
    width="740px"
    okText="保存"
    class="task-add-modal"
  >
    <div class="task-add-modal-content">
      <div class="content-top">
        <div class="content-top-item">
          <span class="content-top-item-label">
            <!-- <i class="required">*</i> -->
            任务名称：
          </span>
          <a-input
            type="text"
            class="content-top-item-input"
            v-model:value.trim="addName"
            placeholder="请输入"
            allow-clear
          />
        </div>
        <div class="content-top-item">
          <span class="content-top-item-label">
            <!-- <i class="required">*</i> -->
            类别：
          </span>
          <a-select
            v-model:value="addTypeValue"
            placeholder="请选择"
            class="content-top-item-input"
            :options="addTypeOptions"
            allow-clear
          />
        </div>
        <div class="content-top-item">
          <span class="content-top-item-label">任务描述：</span>
          <a-textArea
            class="content-top-item-input"
            v-model:value.trim="desc"
            placeholder="请输入"
            allow-clear
            :auto-size="{ minRows: 4, maxRows: 4 }"
          />
        </div>
        <div class="content-top-item">
          <span class="content-top-item-label">
            <!-- <i class="required">*</i> -->
            选择文档：
          </span>
          <a-button
            type="primary"
            v-if="!documentList.length"
            @click="handleSelectDocuments"
            >选择文档</a-button
          >
          <div class="content-top-item-box" v-else>
            <div
              class="content-top-item-box-item"
              v-for="item in documentList"
              :key="item.index"
            >
              <icon-svg icon-class="icon-doc" className="item-icon" />
              <span class="item-title">{{ item.name }}</span>
              <icon-svg icon-class="action-delete" className="item-action" />
            </div>
            <div
              class="content-top-item-box-btn"
              v-show="documentList.length"
              @click="handleSelectDocuments"
            >
              <icon-svg icon-class="action-edit" className="item-action" />
              <span class="btn-text">重新选择</span>
            </div>
          </div>
        </div>
        <div class="content-top-item">
          <span class="content-top-item-label">
            <!-- <i class="required">*</i> -->
            添加字段：
          </span>
          <a-button type="primary" @click="handleAddParam">添加字段</a-button>
        </div>
        <div class="content-top-item" v-show="paramList.length">
          <div
            class="content-top-item-param"
            v-for="(item, index) in paramList"
            :key="index"
          >
            <minus-square-outlined
              class="param-delete"
              @click="deleteParam(index)"
            />
            <div class="param-box">
              <a-input
                type="text"
                v-model:value="item.name"
                placeholder="请输入"
                class="param-box-input"
              />
              <a-select
                v-model:value="item.type"
                placeholder="请选择"
                class="param-box-input"
                :options="resultTypeOptions"
                @change="(value) => handleSelectResType(value, index)"
                allow-clear
              />
              <div class="param-box-rules">
                <div
                  draggable="true"
                  class="param-box-rule"
                  v-for="(child, num) in item.rules"
                  @drop.native="(e) => handleDrop(e, index, num)"
                  @dragover="(e) => e.preventDefault()"
                  @dragstart.native="(e) => handleDragStart(e, index, num)"
                >
                  <img
                    src="@/assets/images/img/icon-drag.svg"
                    class="icon-drag"
                    alt=""
                    draggable="false"
                  />
                  <div class="param-box-rule-title">
                    <a-select
                      v-model:value="child.name"
                      placeholder="请选择"
                      class="param-box-rule-title-select"
                      allow-clear
                      @change="(value) => handleSelectRule(value, index, num)"
                      :options="
                        item.ruleOptions.filter((cell) => {
                          const index = getIndex(
                            item.rules,
                            (v) => v.id === cell.value
                          );
                          if (index === -1) {
                            return cell;
                          }
                        })
                      "
                    />
                  </div>
                  <a-tooltip placement="top">
                    <template #title>
                      <span>删除当前条件</span>
                    </template>
                    <div class="delete-icon" @click="deleteRule(index, num)">
                      <icon-svg icon-class="action-delete" color="#86909C" />
                    </div>
                  </a-tooltip>
                </div>
                <div class="param-box-add" @click="addRule(index)">
                  <plus-square-outlined class="add-icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>

  <a-modal
    v-model:visible="isDocumentModalShow"
    title="选择文档"
    @ok="handleConfirmDocuments"
    okText="保存"
    centered
    width="740px"
    class="select-document-modal"
  >
    <div class="select-document-modal-content">
      <a-table
        class="content-table"
        :dataSource="documentData"
        :columns="documentColumns"
        :pagination="documentPagination"
        :row-selection="rowSelection"
        :rowKey="(record) => record.index"
        :loading="tableLoading"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'status'">
            <div class="status-slot" v-if="record.status === 0">
              <img src="@/assets/images/img/status-blue.svg" alt="" />
              上传成功
            </div>
            <div class="status-slot" v-else>
              <img src="@/assets/images/img/status-green.svg" alt="" />
              已解析
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </a-modal>
</template>

<script>
import {
  Table,
  Input,
  Button,
  Divider,
  Tooltip,
  Select,
  Modal,
  message,
} from "ant-design-vue";
import { reactive, ref, toRefs, onMounted, computed } from "vue";
import TableList from "@/components/TableList";
import { resetData, processCategoryTree, modalConfirm } from "@/utils/common";
import LeftTreeList from "@/components/leftTreeList.vue";
import { getTaskList, deleteTask, addTask } from "@/shared/api/taskExtraction";
import { getCategoryTree } from "@/shared/api/categoryTree";
import { getFileList } from "@/shared/api/document";
import { getRuleByResType } from "@/shared/api/ruleManage";
import { findIndex, find } from "lodash";

const { Option } = Select;
const { TextArea } = Input;

export default {
  name: "RuleBase",
  components: {
    ATable: Table,
    AInput: Input,
    AButton: Button,
    ADivider: Divider,
    ATooltip: Tooltip,
    ASelect: Select,
    ASelectOption: Option,
    AModal: Modal,
    ATextArea: TextArea,
    TableList,
    LeftTreeList,
    // LeftTree,
  },
  setup() {
    let searchLoading = ref(false);
    const selectedKey = ref(null);
    const columns = [
      {
        title: "任务名称",
        key: "name",
        dataIndex: "name",
        width: 240,
      },
      {
        title: "类别",
        dataIndex: "category",
        key: "category",
        width: 240,
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        width: 240,
        // customRender: (text, record, index) => {
        //   return (

        //   );
        // },
      },
      {
        title: "操作",
        key: "action",
        dataIndex: "action",
        width: 166,
        fixed: "right",
      },
    ];
    const dataSource = ref([
      // {
      //   id: 1,
      //   category: "查询用户转账记录1",
      //   interfaceType: "数据任务",
      //   status: "JK0000000001",
      // },
      // {
      //   id: 2,
      //   category: "查询用户转账记录2",
      //   interfaceType: "数据任务",
      //   status: "JK0000000002",
      // },
    ]);
    const pagination = reactive({
      size: "small",
      total: 0,
      current: 1,
      pageSize: 15,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ["5", "10", "15", "20"],
      showTotal: (total, current) => {
        return `共${total}条记录，当前第${Math.ceil(
          current[0] / pagination.pageSize
        )}页`;
      },
      onChange: (page, pageSize) => {
        pagination.current = page;
        pagination.pageSize = pageSize;
        getList();
      },
      onShowSizeChange: (current, size) => {
        pagination.current = current;
        pagination.pageSize = size;
        getList();
      },
    });

    // 查询任务列表方法
    const getList = async () => {
      searchLoading.value = true;
      const json = {
        categoryId: selectedKey.value,
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
      };
      const res = await getTaskList(json);
      searchLoading.value = false;
      if (res.message === "成功" && res.data.dateList) {
        dataSource.value = res.data.dateList.map((item, index) => {
          return {
            ...item,
            name: item.taskName,
            category: item.categoryName,
            status: item.status, // 0、待执行；1、执行完成；2、执行失败；
          };
        });

        pagination.total = res.data.totalCount;
      } else {
        message.error(res.message);
      }
    };

    // 查询方法
    const onSearch = (type) => {
      if (type === "init") {
        pagination.current = 1;
      }
      getList();
    };

    // 刷新方法
    const onRefresh = () => {
      getList();
    };

    // 执行方法
    const handleExecute = () => {};

    // 查看执行结果
    const handleCheckResult = () => {};

    // 查看任务详情方法
    const handleEdit = async (record) => {
      modalTitle.value = "编辑任务";
      isAddModalShow.value = true;
      await getNodeConfig(record.id);
    };

    // 获取任务详情
    const getNodeConfig = async (id) => {
      const loading = message.loading("正在查询", 0);
      const res = await nodeConfigDetail(id);
      loading();

      if (res.message === "成功" && res.data) {
        const { nodeName, nodeParams, nodeCategory, nodeCode, nodeElType } =
          res.data;
        const obj = {};
        obj["nodeId"] = id;
        obj["addName"] = nodeName;
        obj["addTypeValue"] = parseInt(nodeElType);
        Object.assign(addParams, obj);
        isAddModalShow.value = true;
      } else if (!res.data) {
        message.info("暂无详情信息");
      } else {
        message.error(res.message);
      }
    };

    // 删除任务方法
    const handleDelete = (record) => {
      console.log("handleDelete", record);
      const title = `确定要删除 ${record.name} 吗？`;
      const content = "是否确认删除该任务？";
      let res = null;
      const onOk = async () => {
        res = await deleteTask(record.id);
        if (res.message === "成功") {
          message.success("任务删除成功！");
          getList();
        } else {
          message.error(res.message);
        }
      };
      modalConfirm(title, content, onOk);
    };

    /* 弹窗参数、方法 */
    // 弹窗标题
    const modalTitle = ref("");
    // 添加任务的相关参数
    const addParams = reactive({
      addName: undefined, // 任务名称
      addTypeValue: undefined, // 任务类别
      desc: undefined, // 描述
      documentList: [], // 选择的文档列表
      paramList: [], // 添加的字段列表
    });
    const addTypeOptions = ref([]); // 添加的任务可选的任务类型
    const resultTypeOptions = ref([
      {
        label: "图片",
        value: "1",
      },
      {
        label: "文字",
        value: "2",
      },
      {
        label: "表格",
        value: "3",
      },
    ]); // 添加的规则可选的结果类型
    // 字段类型选项
    const isAddModalShow = ref(false); // 添加任务弹窗是否展示
    const isDocumentModalShow = ref(false); // 选择文档弹窗是否展示
    const documentData = ref([]); // 文档表格数据
    const tableLoading = ref(false);
    const documentColumns = [
      {
        title: "任务名称",
        dataIndex: "name",
        key: "name",
        width: 314,
      },
      {
        title: "类别",
        dataIndex: "category",
        key: "category",
        width: 164,
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        width: 164,
      },
    ];
    const documentPagination = reactive({
      size: "small",
      total: 0,
      current: 1,
      pageSize: 10,
      showQuickJumper: true,
      onChange: (page, pageSize) => {
        documentPagination.current = page;
        documentPagination.pageSize = pageSize;
        queryDocument();
      },
    });
    const checkedList = ref([]); // 选中的文档

    // 拖拽所用到的变量
    let draggingNode = null; // 正在被拖拽的dom节点
    let draggingIndex = null; // 正在被拖拽的节点对应的index
    let draggingParentIndex = null; // 正在被拖拽的节点的父节点对应的index

    // 选择文档computed
    const rowSelection = computed(() => {
      return {
        columnWidth: 48,
        selectedRowKeys: checkedList.value,
        onChange: (selectedRowKeys) => {
          checkedList.value = selectedRowKeys;
        },
      };
    });

    const getIndex = (arr, fn) => {
      return findIndex(arr, fn);
    };

    // 点击展示添加任务弹窗
    const showAddModal = () => {
      modalTitle.value = "添加任务";
      isAddModalShow.value = true;
    };

    // 打开选择文档弹窗
    const handleSelectDocuments = async () => {
      isDocumentModalShow.value = true;
      documentPagination.current = 1;
      queryDocument();
    };

    // 分页获取文档
    const queryDocument = async () => {
      const json = {
        pageNo: documentPagination.current,
        pageSize: documentPagination.pageSize,
      };
      documentData.value = [];
      tableLoading.value = true;
      const res = await getFileList(json);
      tableLoading.value = false;
      if (res.message === "成功") {
        documentPagination.total = res.data.totalCount;
        res.data.dateList.map((item, index) => {
          documentData.value.push({
            index,
            ...item,
            name: item.fileName,
            category: item.categoryName,
            status: item.status,
          });
        });
      } else {
        message.error(res.message);
      }
    };

    // 选择文档确认方法
    const handleConfirmDocuments = () => {
      addParams.documentList = documentData.value.filter((item) => {
        if (checkedList.value.indexOf(item.index) > -1) {
          return item;
        }
      });
      isDocumentModalShow.value = false;
      checkedList.value = [];
    };

    // 根据结果类型查询规则
    const handleSelectResType = async (value, index) => {
      addParams.paramList[index].ruleOptions = [];
      const res = await getRuleByResType(value);
      if (res.message === "成功") {
        res.data.map((item) => {
          addParams.paramList[index].ruleOptions.push({
            label: item.ruleName,
            value: item.id,
          });
        });
      } else {
        message.error(res.message);
      }
    };

    // 选择规则方法
    const handleSelectRule = (value, index, num) => {
      const target = find(
        addParams.paramList[index].ruleOptions,
        (v) => (v.value === value)
      );
      console.log("handleSelectRule", value, index, num, addParams.paramList[index].rules[num], target);
      addParams.paramList[index].rules[num].id = value;
      addParams.paramList[index].rules[num].name = target.label;
    };

    // 添加字段方法
    const handleAddParam = () => {
      addParams.paramList.push({
        name: undefined,
        type: undefined,
        ruleOptions: [],
        rules: [
          {
            name: undefined,
            id: undefined,
          },
        ],
      });
    };

    // 添加规则方法
    const addRule = (index) => {
      addParams.paramList[index].rules.push({
        name: undefined,
        id: undefined,
      });
    };

    // 删除规则方法
    const deleteRule = (parantIndex, index) => {
      if (addParams.paramList[parantIndex].rules.length === 1) {
        message.warning("请至少保留一个规则！");
      } else {
        addParams.paramList[parantIndex].rules.splice(index, 1);
      }
    };

    // 删除字段方法
    const deleteParam = (index) => {
      if (addParams.paramList.length === 1) {
        message.warning("请至少保留一个字段！");
      } else {
        addParams.paramList.splice(index, 1);
      }
    };

    // 新增\编辑任务弹窗确认方法
    const handleAdd = async () => {
      console.log("handleAdd", addParams);
      if (!addParams.addName) {
        return message.warning("任务名称必填！");
      }
      if (!addParams.addTypeValue) {
        return message.warning("请选择任务类型！");
      }
      const json = {
        categoryId: addParams.addTypeValue,
        taskName: addParams.addName,
        taskDesc: addParams.desc,
        docIds: addParams.documentList.map((item) => item.id),
        taskRuleVos: addParams.paramList.map((item) => {
          return {
            fieldName: item.name,
            fieldType: item.type,
            RuleIds: item.rules.map((v) => v.id),
            ruleIds: item.rules.map((v) => v.id),
          };
        }),
      };
      const res = await addTask(json);
      if (res.message === "成功") {
        isAddModalShow.value = false;
        if (modalTitle === "添加任务") {
          message.success("添加任务成功！");
        } else {
          message.success("编辑任务成功！");
        }

        onSearch("init");
      } else {
        if (modalTitle === "添加任务") {
          message.error("添加任务失败！");
        } else {
          message.error("编辑任务失败！");
        }
      }
    };

    // 关闭添加弹窗
    const handleCancel = () => {
      isAddModalShow.value = false;
      resetData(addParams);
    };

    // 拖拽开始方法
    const handleDragStart = (e, parentIndex, index) => {
      console.log("handleDragStart", parentIndex, index);
      draggingNode = e.target;
      draggingIndex = index;
      draggingParentIndex = parentIndex;
    };

    // 拖拽停止方法
    const handleDrop = (e, parentIndex, index) => {
      if (
        draggingNode !== null &&
        draggingIndex !== index &&
        draggingParentIndex === parentIndex
      ) {
        const srcTarget = addParams.paramList[parentIndex].rules[draggingIndex];
        const dstTarget = addParams.paramList[parentIndex].rules[index];
        addParams.paramList[parentIndex].rules.splice(index, 1, srcTarget);
        addParams.paramList[parentIndex].rules.splice(
          draggingIndex,
          1,
          dstTarget
        );
        // 重置相关变量
        draggingNode = null;
        draggingIndex = null;
        draggingParentIndex = null;
      }
    };

    /* 分类树参数、方法 */
    const selectedKeys = ref(["0-0-0"]);

    const treeData = ref([
      {
        title: "全部",
        key: "0-0",
        children: [],
        icon: null,
      },
    ]);

    let treeLoading = ref(false);

    // 获取左侧分类树以及分类下拉框选项
    const getLeftCategory = async () => {
      treeLoading.value = true;
      const res = await getCategoryTree(3);
      treeLoading.value = false;
      if (res.message === "成功") {
        // 获取任务分类选项
        addTypeOptions.value = [];
        res.data[0].children.map((item) => {
          if (item.children && item.children.length) {
            item.children.map((cell) => {
              console.log("cell", cell);
              addTypeOptions.value.push({
                label: cell.categoryName,
                value: cell.id,
              });
            });
          }
        });
        console.log("addTypeOptions", addTypeOptions.value);
        // 获取左侧分类树
        const result = handleTreeData(res.data, 1);
        treeData.value = processCategoryTree(result, "id", "categoryName");
      } else {
        message.error(res.message);
      }
    };

    // 处理treeData---添加icon
    const handleTreeData = (tree, depth) => {
      tree.map((item) => {
        item.icon = "icon-task";
        item.isLeaf = depth === 3;
        if (item.children && item.children.length) {
          item.children = handleTreeData(item.children, depth + 1);
        }
      });                                                               
      return tree;
    };

    // 选中分类
    const leftTreeSelected = async (selectedKeys) => {
      if (selectedKeys.length) {
        selectedKey.value = selectedKeys[0];
      } else {
        selectedKey.value = undefined;
      }
      getList();
    };

    onMounted(async () => {
      // 获取左侧分类树
      getLeftCategory();
      // 获取列表
      getList();
    });

    return {
      columns,
      dataSource,
      searchLoading,
      pagination,
      onRefresh,
      handleExecute,
      handleEdit,
      handleDelete,
      handleCheckResult,

      modalTitle,
      ...toRefs(addParams),
      isAddModalShow,
      isDocumentModalShow,
      documentData,
      documentColumns,
      documentPagination,
      tableLoading,
      addTypeOptions,
      resultTypeOptions,
      rowSelection,
      showAddModal,
      handleAdd,
      handleCancel,
      handleSelectDocuments,
      handleConfirmDocuments,
      handleAddParam,
      deleteRule,
      addRule,
      deleteParam,
      handleDragStart,
      handleDrop,
      handleSelectResType,
      getIndex,
      handleSelectRule,

      selectedKeys,
      treeData,
      treeLoading,
      getLeftCategory,
      leftTreeSelected,
    };
  },
};
</script>

<style lang="less">
.task-extraction {
  width: 100%;
  height: 100%;
  display: flex;

  &-left {
    width: 288px;
    margin-right: 24px;
  }

  &-table {
    width: calc(100% - 312px);
    box-shadow: none;
    border-radius: 0;
    padding: 0;
  }
}

.task-add-modal {
  &-content {
    .content-top {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      &-item {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 16px;

        &-label {
          width: 72px;
          line-height: 32px;
          color: #3c485c;
          margin-right: 8px;
          text-align: right;
          white-space: nowrap;
        }

        &-input {
          flex: 1;
        }

        &:first-child {
          margin-right: 24px;
        }

        &:nth-child(1),
        &:nth-child(2) {
          width: calc((100% - 24px) / 2);
        }

        &:last-child {
          margin-bottom: 0;
        }

        .item-action {
          width: 14px;
          height: 14px;
          cursor: pointer;
          color: #1776ff;
        }

        &-box {
          display: flex;
          flex-wrap: wrap;
          padding-top: 4px;
          position: relative;
          align-items: center;
          padding-bottom: 24px;
          width: calc(100% - 80px);
          justify-content: space-between;

          &-item {
            height: 24px;
            display: flex;
            padding: 0 12px;
            border-radius: 4px;
            margin-bottom: 8px;
            align-items: center;
            background: #f1f2f5;
            width: calc((100% - 12px) / 2);

            .item-icon {
              width: 14px;
              height: 14px;
              margin-right: 8px;
            }

            .item-title {
              color: #3c485c;
              overflow: hidden;
              margin-right: 8px;
              white-space: nowrap;
              text-overflow: ellipsis;
              width: calc(100% - 44px);
            }
          }

          &-btn {
            bottom: 0;
            height: 24px;
            line-height: 24px;
            position: absolute;

            .btn-text {
              cursor: pointer;
              color: #1776ff;
              padding-left: 8px;
            }
          }
        }

        &-param {
          width: 100%;
          display: flex;
          padding-left: 2px;
          margin-bottom: 12px;
          align-items: center;

          .param-delete {
            cursor: pointer;
            font-size: 20px;
            color: #1776ff;
            margin-right: 16px;
          }

          .param-box {
            display: flex;
            padding: 8px 16px;
            align-items: center;
            border-radius: 12px;
            background: #fafbfc;
            width: calc(100% - 36px);
            border: 1px solid #e3e6eb;

            &-input {
              width: 160px;
              margin-right: 8px;
            }

            &-rules {
              width: 288px;
              min-height: 82px;
              padding: 8px 12px;
              border-radius: 8px;
              background: #fff;
              border: 1px solid #d6dbe3;

              .param-box-rule {
                height: 32px;
                padding: 4px;
                display: flex;
                padding: 0 8px;
                border-radius: 6px;
                margin-bottom: 8px;
                align-items: center;
                background: #f2f3f5;

                &-title {
                  height: 24px;
                  color: #3c485c;
                  overflow: hidden;
                  line-height: 24px;
                  position: relative;
                  background: #fff;
                  border-radius: 2px;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  width: calc(100% - 20px);

                  &-select {
                    width: 100%;
                    height: 100%;

                    .ant-select-selector {
                      height: 100%;

                      .ant-select-selection-search {
                        &-input {
                          height: 22px;
                        }
                      }

                      .ant-select-selection-item,
                      .ant-select-selection-placeholder {
                        line-height: 22px;
                      }
                    }
                  }
                }

                .icon-drag {
                  cursor: grab;
                  margin-right: 4px;
                }

                .delete-icon {
                  width: 16px;
                  height: 16px;
                  cursor: pointer;
                  line-height: 16px;
                  margin-left: 4px;
                }

                &:nth-last-child(2) {
                  margin-bottom: 0;
                }
              }

              .param-box-add {
                width: 32px;
                height: 32px;
                padding: 9px;
                display: flex;
                cursor: pointer;

                .add-icon {
                  font-size: 14px;
                  color: #1776ff;
                }
              }
            }
          }

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .content-bottom {
      &-table {
        &-item {
          &-input {
            width: 100%;
          }
        }
      }
    }
  }
}

.select-document-modal {
  .ant-modal-body {
    padding-bottom: 0;
  }

  .content-table {
    .status-slot {
      display: flex;
      align-items: center;

      img {
        margin-right: 8px;
      }
    }
  }
}
</style>
