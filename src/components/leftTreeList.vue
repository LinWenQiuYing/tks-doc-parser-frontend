<template>
  <div class="tree-list">
    <div class="tree-list-title">
      <span class="tree-list-title-text" v-show="treeTitle">{{
        treeTitle
      }}</span>
      <!-- <a-button type="primary" @click="showAddModal">新增</a-button> -->
    </div>
    <div class="tree-list-content">
      <div class="tree-list-spin" v-if="treeLoading">
        <a-spin />
      </div>
      <a-tree
        v-model:selectedKeys="selectedKeys"
        :tree-data="treeData"
        default-expand-all
        class="tree-list-tree"
        @select="handleTreeSelect"
        :load-data="onLoadData"
        v-else-if="treeData[0].children.length"
      >
        <template #switcherIcon="{ switcherCls, key }">
          <down-outlined
            :class="switcherCls"
            v-if="!findTreeNode(treeData[0], key).isLeaf"
          />
        </template>
        <template #title="{ key, selected, title }">
          <span
            :class="[
              'tree-list-item',
              findTreeNode(treeData[0], key).isLeaf ? 'child' : 'parent',
            ]"
          >
            <span class="tree-list-item-left">
              <icon-svg
                :className="
                  selectedKeys[0] === title ? 'action-img active' : 'action-img'
                "
                :icon-class="findTreeNode(treeData[0], key).icon"
                @click="checkDetails(record)"
              />
              <span
                class="tree-list-item-title"
                v-if="findTreeNode(treeData[0], key).isLeaf"
                :title="title"
                >{{ title }}</span
              >
              <span class="tree-list-item-title" v-else>{{ title }}</span>
            </span>
            <span
              class="tree-list-item-right"
              v-if="findTreeNode(treeData[0], key).isLeaf"
            >
              <a-tooltip
                placement="top"
                v-if="findTreeNode(treeData[0], key).status === 1"
              >
                <template #title>
                  <span>已分析</span>
                </template>
                <img
                  src="@/assets/images/img/icon-doc-analysed.svg"
                  alt=""
                  v-show="type === 'document'"
                />
              </a-tooltip>
              <a-tooltip
                placement="top"
                v-else-if="findTreeNode(treeData[0], key).status === 0"
              >
                <template #title>
                  <span>上传完成</span>
                </template>
                <img
                  src="@/assets/images/img/icon-upload-success.svg"
                  alt=""
                  v-show="type === 'document'"
                />
              </a-tooltip>
              <a-tooltip placement="top" v-else>
                <template #title>
                  <span>正在上传</span>
                </template>
                <img
                  src="@/assets/images/img/icon-upload-loading.svg"
                  alt=""
                  v-show="type === 'document'"
                />
              </a-tooltip>
            </span>
            <span
              class="tree-list-item-right"
              v-else-if="findTreeNode(treeData[0], key).isParent && type === 'document'"
            >
              <a-upload
                name="file"
                class="document-upload"
                :beforeUpload="(file) => beforeUpload(file, key)"
                :show-upload-list="false"
              >
                <cloud-upload-outlined style="color: #1776ff" />
              </a-upload>
            </span>
          </span>
        </template>
      </a-tree>
    </div>
     
  </div>
     
  <a-modal
    v-model:visible="isAddModalShow"
    :title="modalTitle"
    @ok="handleAdd"
    @cancel="handleCancleModal"
    centered
    width="572px"
    class="component-add-modal"
  >
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      autocomplete="off"
      class="add-modal-form"
    >
      <a-form-item
        label="分类名称"
        name="categoryName"
        class="add-modal-form-item"
      >
        <a-input v-model:value="formState.categoryName" placeholder="请输入" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Spin,
  Tooltip,
  Tree,
  Upload,
} from "ant-design-vue";
import { reactive, ref, watchEffect, h, toRefs } from "vue";
import { resetData, findTreeNodeById } from "@/utils/common";
import IconSvg from "@/components/IconSvg";
import { getFilesByCategoryId, uploadDocument } from "@/shared/api/document";
import { nanoid } from "nanoid";

const { Item } = Form;

export default {
  name: "LeftTreeList",
  props: {
    data: {
      type: Object,
      default: {},
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
      required: false,
    },
    treeTitle: {
      type: String,
      default: "",
      required: false,
    },
    type: {
      type: String,
      default: "rule",
      required: true,
    },
  },
  emits: ["deleteCategory", "addCategory", "treeSelected"],
  components: {
    AButton: Button,
    AForm: Form,
    AFormItem: Item,
    AInput: Input,
    AModal: Modal,
    APopconfirm: Popconfirm,
    ASelect: Select,
    ASpin: Spin,
    ATooltip: Tooltip,
    ATree: Tree,
    AUpload: Upload,
  },
  setup(props, { emit }) {
    const selectedKeys = ref([]);
    const lastSelectedKeys = ref([]);
    const treeData = ref([
      {
        title: "全部",
        key: "0-0",
        children: [],
      },
    ]);
    let treeLoading = ref(false);

    // 选中某个分类||叶子节点
    const handleTreeSelect = (keys, e) => {
      console.log("handleTreeSelect", keys, e);
      if (!e.node.isLeaf) {
        selectedKeys.value = lastSelectedKeys.value;
        return;
      }
      emit("treeSelected", keys, e);
      if (props.type === "document") {
        selectedKeys.value = [e.node.key];
        lastSelectedKeys.value = [e.node.key];
      } else {
        selectedKeys.value = keys;
        lastSelectedKeys.value = keys;
      }
    };

    // 删除分类
    const handleDelete = (id) => {
      emit("deleteCategory", id);
    };
    const findTreeNode = (node, id) => {
      return findTreeNodeById(node, id);
    };
    // 编辑分类
    const handleEdit = (id) => {
      modalTitle.value = "编辑节点分类";

      const data = findTreeNodeById(treeData.value[0], id);

      const obj = {
        ...data,
        categoryName: data.title,
        categoryIcon: data.icon,
      };
      Object.assign(formState, obj);
      if (data) {
        isAddModalShow.value = true;
      } else {
        message.info("暂无详情信息");
      }
    };

    // 新增节点弹窗
    let isAddModalShow = ref(false);
    let modalTitle = ref("新增节点分类");

    const formState = reactive({
      categoryName: "",
      categoryIcon: undefined,
    });
    // 打开新增节点弹窗
    const showAddModal = () => {
      modalTitle.value = "新增节点分类";
      isAddModalShow.value = true;
    };
    // 取消新增节点弹窗
    const handleCancleModal = () => {
      isAddModalShow.value = false;
      resetData(formState);
    };
    // 添加新的分类
    const handleAdd = () => {
      if (!formState.categoryName) {
        message.error("请添加数据源名称！");
        returnStatement;
      } else if (!formState.categoryIcon) {
        message.error("请选择图标！");
        return;
      }
      emit("addCategory", formState);
      handleCancleModal();
    };

    // 在type为document时，异步加载文档数据
    const onLoadData = async (treeNode) => {
      if (props.type !== "document") return;
      console.log("onLoadData", treeNode);
      if (
        (treeNode.dataRef.children && !treeNode.dataRef.children.length) ||
        !treeNode.dataRef.children
      ) {
        treeNode.loading = true;
        await getFiles(treeNode.dataRef.id);
        treeNode.loading = false;
      }
    };

    // 获取分类下的文件
    const getFiles = async (id) => {
      console.log("getFiles", id);
      const treeNode = findTreeNode(treeData.value[0], id);
      console.log("treeNode", treeNode);
      const res = await getFilesByCategoryId(id);
      if (res.message === "成功") {
        treeNode.children = [];
        res.data.map((item) => {
          treeNode.children.push({
            ...item,
            icon:
              item.filePostfix === "doc" || item.filePostfix === "docx"
                ? "icon-doc"
                : "icon-pdf",
            isLeaf: true,
            title: item.fileName + "." + item.filePostfix,
            key: item.id,
          });
          treeData.value = [...treeData.value];
        });
      } else {
        message.error(res.message);
      }
    };

    // 上传文档之前
    const beforeUpload = async (file, key) => {
      console.log("beforeUpload", file, key);
      const fileName = file.name.split(".")[0];
      const fileType = file.name.split(".")[1];
      if (
        fileType !== "doc" &&
        file.name.split(".")[1] !== "docx" &&
        file.name.split(".")[1] !== "pdf"
      ) {
        message.info("当前只支持上传doc、docx、pdf类型的文件！", 3);
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("categoryId", key);

      const node = findTreeNode(treeData.value[0], key);
      console.log("node", node);
      if (node) {
        const id = nanoid(5);
        node.children.push({
          categoryId: key,
          fileName,
          filePath: null,
          filePostfix: fileType,
          fileType: null,
          htmlPath: null,
          icon: fileType === "pdf" ? "icon-pdf" : "icon-doc",
          id,
          isLeaf: true,
          key: id,
          status: -1,
          title: file.name,
        });
      }

      const res = await uploadDocument(formData);
      if (res.message === "成功") {
        message.success("上传成功");
        getFiles(key);
      } else {
        message.error(res.message);
      }
      return false; // 阻止默认访问当前ip下的某个路径的行为
    };

    watchEffect(() => {
      treeData.value = props.data;
      treeLoading.value = props.loading;
    });

    return {
      selectedKeys,
      treeData,
      treeLoading,
      isAddModalShow,
      formState,
      modalTitle,
      ...toRefs(props),
      handleDelete,
      showAddModal,
      handleCancleModal,
      handleAdd,
      handleEdit,
      findTreeNode,
      handleTreeSelect,
      onLoadData,
      beforeUpload,
    };
  },
};
</script>

<style lang="less">
.tree-list {
  width: 100%;
  height: 100%;

  &-title {
    height: 32px;
    display: flex;
    margin-bottom: 16px;
    align-items: center;
    justify-content: space-between;

    &-text {
      font-weight: 600;
      font-size: 20px;
      line-height: 32px;
      color: #3c485c !important;
    }
  }

  &-content {
    height: calc(100% - 48px);
    border: 1px solid #e3e6eb;
    padding: 16px 12px;
    border-radius: 8px;

    .tree-list-spin {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tree-list-tree {
      .ant-tree-list {
        &-holder {
          .ant-tree-treenode {
            width: 100%;

            .ant-tree-switcher {
              width: 14px;
            }

            .ant-tree-node-content-wrapper {
              width: calc(100% - 62px);
              padding: 0 8px;

              &:hover {
                background-color: #fff;
              }

              &.ant-tree-node-selected {
                background-color: #fff;

                .tree-list-item {
                  color: #1776ff;
                  background-color: #e6f4ff;

                  .action-img {
                    color: #1776ff !important;
                  }
                }
              }

              .tree-list-item {
                display: flex;
                justify-content: space-between;

                .action-img {
                  width: 16px;
                  height: 16px;
                  color: #97a3b7;
                  margin-right: 8px;
                  margin-bottom: 2px;

                  &.active {
                    color: #1776ff;
                  }

                  &.edit {
                    color: #1776ff;
                  }
                  &.disabled {
                    color: #d6dbe3;
                    cursor: not-allowed;
                  }

                  &.delete {
                    margin-left: 8px;
                  }
                }

                &-right {
                  display: flex;
                  align-items: center;
                }

                &-left {
                  overflow: hidden;
                  color: #3c485c;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }

                &.child {
                  margin-left: 3px;

                  &:hover {
                    background-color: #e6f4ff;
                  }
                }

                &.parent {
                  width: calc(100% + 24px);
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
