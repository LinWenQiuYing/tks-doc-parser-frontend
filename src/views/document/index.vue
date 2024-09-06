<template>
  <div class="document">
    <div class="document-left">
      <LeftTreeList
        type="document"
        treeTitle="文档列表"
        :data="treeData"
        :loading="treeLoading"
        @treeSelected="handleSelectTree"
      />
    </div>
    <div class="document-right">
      <div class="document-right-header">
        <div class="header-left">{{ docTitle }}</div>
      </div>
      <div class="document-right-content">
        <iframe
          src="/审计局分支接口文档.html"
          frameborder="0"
          class="content-box"
          ref="iframe"
          @contextmenu.prevent.stop="rightClick"
        ></iframe>
      </div>
    </div>
  </div>

  <RightMenu
    :show="rightMenuShow"
    :contextMenuData="contextMenuData"
    @onMenuClick="onMenuClick"
  />
</template>

<script>
import { Button, message, Upload } from "ant-design-vue";
import { ref, reactive, onMounted } from "vue";
import LeftTreeList from "@/components/leftTreeList";
import RightMenu from "@/components/rightMenu";
import useClipboard from "vue-clipboard3";
import { getCategoryTree } from "@/shared/api/categoryTree";
import { resetData, processCategoryTree } from "@/utils/common";
import { getHtmlByFileId } from "@/shared/api/document";

export default {
  name: "Document",
  components: {
    AButton: Button,
    AUpload: Upload,
    LeftTreeList,
    RightMenu,
  },
  setup() {
    const treeData = ref([
      {
        title: "全部",
        key: "0",
        icon: "icon-folder",
        children: [],
      },
    ]);
    const treeLoading = ref(false);
    const { toClipboard } = useClipboard(); // 复制到剪切板方法
    const docTitle = ref("网络暴力信息治理规定.pdf"); // 文章标题
    const selectedKeys = ref(""); // 选中的文档的id
    const iframe = ref(null);
    const rightMenuShow = ref(false); // 右击菜单是否显示
    const contextMenuData = reactive({
      position: {},
      context: [
        {
          title: "获取xpath路径",
          key: "get-xpath",
          show: true,
        },
      ],
    }); // 右击菜单数据
    const targetDom = ref(undefined); // 右击时的target

    // 读取xpath路径
    const readXPath = (element) => {
      if (element.id) {
        //判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
        return '//*[@id="' + element.id + '"]';
      }

      // if (element.getAttribute("class")) {
      //   //判断class属性，如果这个元素有class，则显 示//*[@class="xPath"]  形式内容
      //   return '//*[@class="' + element.getAttribute("class") + '"]';
      // }
      //因为Xpath属性不止id和class，所以还可以更具class形式添加属性

      //这里需要需要主要字符串转译问题
      if (
        element === iframe.value.contentDocument ||
        element.tagName.toUpperCase() == "HTML" ||
        element.tagName.toUpperCase() == "BODY"
      ) {
        // 防止点击到#document元素
        // 防止点击到html元素
        // 递归到body处，结束递归
        return "/html/" + "body";
      }

      let ix = 0, //在nodelist中的位置，且每次点击初始化
        siblings = element.parentNode.children; //同级的子元素
      let samTagNum = 0;
      for (let i = 0; i < siblings.length; i++) {
        const item = siblings[i];
        if (samTagNum > 1) {
          // 大于1之后就没有继续遍历下去的必要了
          break;
        }
        if (item.tagName == element.tagName) {
          samTagNum += 1;
        }
      }
      for (let i = 0, l = siblings.length; i < l; i++) {
        let sibling = siblings[i];
        if (sibling == element) {
          //如果这个元素是siblings数组中的元素，则执行递归操作
          return (
            readXPath(element.parentNode) +
            "/" +
            element.tagName.toLowerCase() +
            (samTagNum === 1 ? "" : "[" + (ix + 1) + "]")
          ); //ix+1是因为xpath是从1开始计数的，element.tagName+((ix+1)==1?'':'['+(ix+1)+']')三元运算符，如果是第一个则不显示，从2开始显示
        } else if (
          sibling.nodeType == 1 &&
          sibling.tagName == element.tagName
        ) {
          // sibling.nodeType：
          // 如果节点是元素节点，则 nodeType 属性将返回 1。
          // 如果节点是属性节点，则 nodeType 属性将返回 2。
          // 如果节点是文本节点，则 nodeType 属性将返回 3。
          // 如果节点是注释节点，则 nodeType 属性将返回 8。
          //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
          ix++;
        }
      }
    };

    // 右击iframe
    const rightClick = (e) => {
      rightMenuShow.value = true;
      targetDom.value = e.target;
      contextMenuData.position = {
        x: e.screenX,
        y: e.screenY - 100,
      };
      // console.log(e.screenX,e.screenY)
      // console.log(contextMenuData.position)
    };

    const onMenuClick = async (key) => {
      let result = null;
      switch (key.key) {
        case "get-xpath":
          result = readXPath(targetDom.value);
          break;

        default:
          break;
      }
      // 处理xpath里可能存在的tbody
      if (result) {
        const str = result.replace(/\/tbody/g, "");
        await copy(str);
        console.log("str", str);
        let copyText = await navigator.clipboard.readText();
        console.log(111111,"copyText", copyText);
      }
    };

    // copy到剪切板方法
    const copy = async (text) => {
      try {
        await toClipboard(text);
        console.log("Copied to clipboard");
      } catch (e) {
        console.error(e);
      }
    };

    // 获取左侧分类树以及分类下拉框选项
    const getLeftCategory = async () => {
      treeLoading.value = true;
      const res = await getCategoryTree(1);
      treeLoading.value = false;
      if (res.message === "成功") {
        // 获取左侧分类树
        const result = handleTreeData(res.data);
        treeData.value = processCategoryTree(result, "id", "categoryName");
      } else {
        message.error(res.message);
      }
    };

    // 处理treeData----添加icon
    const handleTreeData = (tree) => {
      tree.map((item) => {
        item.icon = "icon-folder"

        if (item.children && item.children.length) {
          item.children = handleTreeData(item.children);
        }
      });
      return tree;
    };

    // 点击treeItem
    const handleSelectTree = async (keys, e) => {
      console.log("handleSelectTree", keys, e);
      if (selectedKeys.value === keys[0]) return;
      if (e.node.dataRef.status === -1) {
        message.info("正在上传中，请稍后查看！", 3);
        return;
      } else if (e.node.dataRef.status === 0) {
        message.info("正在解析中，请稍后查看！", 3);
        return;
      }
      const title = e.node.fileName + "." + e.node.filePostfix;
      selectedKeys.value = keys[0];
      const loading = message.loading("正在获取文章内容", 0);
      const res = await getHtmlByFileId(e.node.htmlPath);
      loading();
      docTitle.value = title;
      console.log("res", res, iframe.value, iframe.value.contentWindow.document);
      iframe.value.contentWindow.document.designMode = "on";
      iframe.value.contentWindow.document.open();
      iframe.value.contentWindow.document.write(res);
      iframe.value.contentWindow.document.close();
      iframe.value.contentWindow.document.designMode ="off";
    };

    onMounted(() => {
      iframe.value.onload = function () {
        // iframe绑定右击事件
        iframe.value.contentDocument.oncontextmenu = function (e) {
          e.stopPropagation();
          e.preventDefault();
          rightClick(e);
        };
        // iframe绑定左击事件
        iframe.value.contentDocument.onclick = function (e) {
          e.stopPropagation();
          rightMenuShow.value = false;
        };
      };
      getLeftCategory();
    });

    return {
      treeData,
      treeLoading,
      docTitle,
      iframe,
      rightMenuShow,
      contextMenuData,
      rightClick,
      onMenuClick,
      handleSelectTree,
    };
  },
};
</script>

<style lang="less">
.document {
  width: 100%;
  height: 100%;
  display: flex;

  &-left {
    width: 288px;
    margin-right: 24px;
  }

  &-right {
    width: calc(100% - 312px);

    &-header {
      width: 100%;
      height: 32px;
      display: flex;
      line-height: 32px;
      margin-bottom: 16px;
      justify-content: space-between;

      .header-left {
        font-weight: 600;
        font-size: 20px;
        color: #3c485c;
      }
    }

    &-content {
      width: 100%;
      padding: 16px;
      border-radius: 6px;
      background: #fafbfc;
      height: calc(100% - 48px);
      border: 1px solid #e3e6eb;

      .content-box {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
    }
  }
}
</style>
