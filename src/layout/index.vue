<template>
  <a-layout class="flow-engine-layout">
    <a-layout-header class="flow-engine-layout-header">
      <div class="layout-header-logo">
        <img
          alt="文本解析"
          class="logo-img"
          src="@/assets/images/img/logo.svg"
        />
      </div>
      <a-menu
        v-model:selectedKeys="current"
        class="layout-menu"
        mode="horizontal"
      >
        <a-menu-item
          key="1"
          class="layout-menu-item"
          @click="handleChangeLink('rule-base', 'rule-base')"
        >
          <template #icon>
            <icon-svg className="layout-menu-item-img" icon-class="rule-base" />
          </template>
          规则库
        </a-menu-item>
        <a-menu-item
          key="2"
          class="layout-menu-item"
          @click="handleChangeLink('dic-base', 'dic-base')"
        >
          <template #icon>
            <icon-svg className="layout-menu-item-img" icon-class="dic-base" />
          </template>
          字典库
        </a-menu-item>
        <a-menu-item
          key="3"
          class="layout-menu-item"
          @click="handleChangeLink('document', 'document')"
        >
          <template #icon>
            <icon-svg className="layout-menu-item-img" icon-class="document" />
          </template>
          文档
        </a-menu-item>
        <a-menu-item
          key="4"
          class="layout-menu-item"
          @click="handleChangeLink('task-extraction', 'task-extraction')"
        >
          <template #icon>
            <icon-svg
              className="layout-menu-item-img"
              icon-class="task-extraction"
            />
          </template>
          抽取任务
        </a-menu-item>
      </a-menu>
      <div class="layout-header-user">
        <div class="layout-header-user-pic">
          <img src="@/assets/images/img/user.png" />
        </div>
        <span class="user-name">星小环</span>
        <down-outlined class="user-arrow" />
      </div>
    </a-layout-header>
    <a-layout-content class="flow-engine-layout-content">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>
<script>
import { Layout, Menu } from "ant-design-vue";
import { reactive, toRefs, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const { Header, Content } = Layout;
const { Item, SubMenu } = Menu;

export default {
  name: "Layout",
  components: {
    ALayout: Layout,
    ALayoutHeader: Header,
    ALayoutContent: Content,
    AMenu: Menu,
    AMenuItem: Item,
    ASubMenu: SubMenu,
  },
  setup() {
    let obj = reactive({
      current: ["1"],
    });
    const router = useRouter();
    const route = useRoute();
    const handleChangeLink = (url, key) => {
      if (route.path === `/${url}`) {
        // 跳转路由与当前路由相同
        return;
      } else {
        obj.current = [key];
        router.push(`/${url}`);
      }
    };

    watch(
      () => route.path,
      (newValue, oldValue) => {
        switch (route.path) {
          case "/rule-base":
            obj.current = ["1"];
            break;
          case "/document":
            obj.current = ["2"];
            break;
          case "/task-extraction":
            obj.current = ["3"];
            break;
        }
      },
      { immediate: true }
    );

    onMounted(() => {});

    return {
      ...toRefs(obj),
      handleChangeLink,
    };
  },
};
</script>
<style lang="less">
.flow-engine-layout {
  width: 100%;
  height: 100%;
  min-width: 1280px;
  background: #ebedf1;

  &-header {
    padding: 0px 0px 0px 24px;
    background: #ffffff;
    display: flex;
    height: 48px;
    z-index: 2;
    line-height: 48px;
    box-shadow: 0 0 8px rgba(31, 48, 78, 0.05);

    .layout-header-logo {
      display: flex;
      align-items: center;

      .logo-img {
        margin-right: 60px;
      }

      .logo-title {
        font-size: 20px;
        line-height: 28px;
        padding-right: 100px;
        color: #3c485c;
      }
    }

    .layout-header-user {
      //width:78px;
      width: 124px;
      display: flex;
      justify-content: flex-end;

      .user-name {
        margin-right: 8px;
        color: #3c485c;
      }

      .user-arrow {
        display: flex;
        color: #97a3b7;
        align-items: center;
      }

      &-pic {
        width: 24px;
        height: 24px;
        margin: 12px 12px 12px 0px;
      }
    }

    .layout-menu {
      width: calc(100% - 305px);

      &-item {
        user-select: none;
        font-size: 16px;

        &.ant-menu-item-selected,
        &:hover {
          .layout-menu-item-img {
            color: #1776ff;
          }
        }
        &:focus-visible {
          box-shadow: none;
        }

        &-img {
          width: 16px;
          height: 16px;
          color: #5f7292;
        }
      }

      &-submenu {
        &.ant-menu-submenu-selected,
        &:hover {
          .ant-menu-submenu-title {
            .layout-submenu-img {
              color: #1776ff;
            }
          }
        }

        .ant-menu-submenu-title {
          .layout-submenu-img {
            width: 16px;
            height: 16px;
            color: #5f7292;
          }
        }
      }
    }
  }

  &-content {
    width: calc(100% - 32px);
    height: 100%;
    margin: 16px;
    padding: 24px;
    display: flex;
    background: #fff;
    border-radius: 16px;
  }
}

.layout-submenu-popup {
  z-index: 3;
  width: 100%;
  height: 104px;
  left: 0px !important;
  background: #fafbfc;
  top: 48px !important;
  box-shadow: 0 4px 8px rgba(31, 48, 78, 0.1),
    0 20px 16px 4px rgba(31, 48, 78, 0.08);

  .ant-menu-sub {
    min-width: 915px;
    box-shadow: none;
    background: #fafbfc;
    height: 100%;
    display: flex;
    padding: 16px 16px 16px 251px;

    .layout-menu-item {
      width: 256px;
      height: 100%;
      padding: 16px;
      display: flex;
      border-radius: 6px;
      margin: 0 24px 0 0;

      &.ant-menu-item-selected,
      &:hover {
        background: #e6f4ff;

        .ant-menu-title-content {
          user-select: none;

          .title-text {
            color: #1776ff;
          }
        }
      }

      &-img {
        border-radius: 6px;
        box-shadow: 0 1px 4px rgb(23 118 255 / 26%),
          0 8px 10px rgb(23 118 255 / 21%);
      }

      .ant-menu-title-content {
        .title-text {
          height: 20px;
          line-height: 20px;
          color: #3c485c;
          font-weight: 600;
          margin-bottom: 3px;
        }

        .title-sub {
          height: 17px;
          line-height: 17px;
          font-size: 12px;
          color: #b7a797;
        }
      }
    }
  }
}
</style>
