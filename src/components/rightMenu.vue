<template>
  <div class="right-menu">
    <a-menu
      v-if="show"
      class="context-menu"
      @click="onMenuClick"
      :style="{
        top: contextMenuData.position.y + 'px',
        left: contextMenuData.position.x + 'px',
      }"
    >
      <a-menu-item
        v-for="item in contextMenuData.context"
        :key="item.key"
        class="context-menu-item"
        :disabled="item.isDisabled"
      >
        <div
          :class="['context-menu-item-box', item.isDisabled ? 'disabled' : '']"
          v-if="item.show"
        >
          <icon-svg
            v-if="item.icon"
            :icon-class="item.icon"
            :color="item.color ? item.color : null"
          />
          <span class="box-title">{{ item.title }}</span>
        </div>
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script>
import { Menu } from "ant-design-vue";
import { onMounted } from "vue";

const { Item } = Menu;

export default {
  name: "RightMenu",
  props: {
    contextMenuData: {
      type: Object,
      default: {},
      required: false,
    }, // 记录菜单的位置与内容
    show: {
      type: Boolean,
      default: true,
      required: false,
    }, // 记录菜单是否展示
  },
  emits: ["onMenuClick"],
  components: {
    AMenu: Menu,
    AMenuItem: Item,
  },
  setup(props, { emit }) {
    const onMenuClick = (key) => {
      emit("onMenuClick", key);
    };
    onMounted(() => {
      console.log("bingo-----------");
    });
    return {
      onMenuClick,
    };
  },
};
</script>
<style lang="less">
.right-menu {
  .context-menu {
    position: absolute;
    min-width: 170px;
    max-width: 400px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    color: #485378;
    background-color: #fff;
    border-radius: 2px;

    &-item {
      padding: 0;
      width: 100%;
      height: auto;
      margin: 0 !important;

      &:not(.ant-menu-item-selected) {
        .context-menu-item-box {
          &:not(.disabled):hover {
            .box-title {
              color: #1890ff;
            }
          }
        }
      }

      &-box {
        height: 32px;
        margin: 4px 0;
        padding: 0 16px;
        line-height: 32px;

        &.disabled {
          .svg-icon,
          .box-title {
            color: rgba(0, 0, 0, 0.25);
          }
        }

        .svg-icon {
          width: 14px;
          height: 14px;
          margin-right: 8px;
        }

        .box-title {
          color: rgba(0, 0, 0, 0.85);
        }
      }
    }
  }
}
</style>
