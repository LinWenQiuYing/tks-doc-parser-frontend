<template>
  <div :class="['table-list', listClass]">
    <div class="table-list-top">
      <div class="table-list-top-title">{{ title }}</div>
      <div class="table-list-top-filter">
        <slot name="searchOptions"></slot>
      </div>
    </div>

    <div class="table-list-bottom">
      <a-table
        ref="tableRef"
        :class="['table-list-bottom-table', tableClass]"
        :dataSource="dataSource"
        :columns="columns"
        :rowKey="rowKey"
        :pagination="pagination"
        :rowSelection="rowSelection"
        :loading="loading"
        :scroll="{ x: 'max-content', y: `${tableHeight}px` }"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key === 'action'">
            <slot name="action" :record="record"></slot>
          </template>
          <template v-if="column.key === 'status'">
            <slot name="status" :text="text"></slot>
          </template>
           <template v-if="column.key === 'resultType'">
            <slot name="resultType" :text="text"></slot>
          </template>
          <template v-if="column.key === 'analyticType'">
            <slot name="analyticType" :text="text"></slot>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { Table, Button } from "ant-design-vue";
import { ref, onMounted, watch, nextTick } from "vue";

export default {
  name: "TableList",
  props: {
    // 当前组件的类名
    listClass: {
      type: String,
      default: () => "",
    },
    // 表格类名
    tableClass: {
      type: String,
      default: () => "",
    },
    title: {
      type: String,
      default: () => "",
    },
    columns: {
      type: Array,
      default: () => [],
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    rowKey: {
      type: [String, Function],
      default: () => (record) => record.id,
    },
    pagination: {
      type: Object,
      default: () => ({
        size: "small",
        total: 0,
        current: 1,
        pageSize: 15,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20"],
      }),
    },
    rowSelection: {
      type: Object,
      default: () => null,
    },
    // isDefaultFold: {
    //   type: Boolean,
    //   default: () => false,
    // },
    // topHeight: {
    //   type: Number,
    //   default: () => 0,
    // },
  },
  components: {
    ATable: Table,
    AButton: Button,
  },
  setup(props) {
    const tableRef = ref(null);
    const tableHeight = ref(undefined); // 表格的高度
    const clientHeight = ref(undefined); // 组件的高度

    // 监听scrollHeight变化，动态改变table高度
    watch(
      clientHeight,
      (value, oldValue) => {
        clientHeight.value = value;
        tableHeight.value = clientHeight.value - 110;
      }
      // { immediate: true }
    );

    onMounted(() => {
      clientHeight.value = tableRef.value.$el.clientHeight;
      tableHeight.value = clientHeight.value - 110;
      window.onresize = () => {
        clientHeight.value = tableRef.value.$el.clientHeight;
      };
    });

    return {
      tableRef,
      tableHeight,
      clientHeight,
    };
  },
};
</script>

<style lang="less">
.ant-table-thead > tr > th {
  color: #3c485c;
  padding: 12px 16px;
  font-size: 14px;
}
// .ant-table{
//   font-size: 14px;
//   height:44px;
//   color: red;
// }
.table-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #ffffff;
  box-shadow: 0px 2px 8px rgba(31, 48, 78, 0.05),
    0px 10px 16px 4px rgba(31, 48, 78, 0.04);
  border-radius: 6px;

  &-top {
    height: 32px;
    display: flex;
    margin-bottom: 16px;
    transition: all 0.3s;
    justify-content: space-between;

    &-title {
      font-weight: 600;
      font-size: 20px;
      line-height: 32px;
      color: #3c485c !important;
    }

    &-filter {
      // flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    &-item {
      display: flex;
      margin-right: 24px;
      align-items: center;
      justify-content: flex-start;

      &:last-child {
        margin-right: 0;
      }

      &-label {
        margin-right: 8px;
      }

      &-select {
        width: 120px;
      }

      &-input {
        width: 180px;
      }

      &-range {
        width: 245px;
      }

      &.btns {
        .ant-btn {
          &:not(:last-child) {
            margin-right: 8px;
          }
        }

        .btns-right {
          margin-left: 24px;
        }
      }
    }
  }

  &-bottom {
    flex: 1;
    height: calc(100% - 56px);

    &-table {
      height: 100%;
      .ant-spin-nested-loading {
        height: 100%;

        .ant-spin-container {
          height: 100%;

          .ant-table {
            height: calc(100% - 56px);
          }
        }
      }
    }
  }
}
</style>
