<template>
  <div class="component-manage">
    <div class="component-manage-tree">
      <LeftTreeList
        treeTitle="规则分类"
        :data="treeData"
        :loading="treeLoading"
        @treeSelected="leftTreeSelected"
        @deleteCategory="deleteLeftCategory"
        @addCategory="addLeftCategory"
      >
      </LeftTreeList>
    </div>
    <TableList
      listClass="component-manage-table"
      title="规则列表"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="searchLoading"
    >
      <template #searchOptions>
        <div class="table-list-top-item btns">
          <div class="btns-right">
            <a-button @click="onReset">刷新</a-button>
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
      </template>

      <template #resultType="{ text }">
          <span v-if="text === 1">
            <icon-svg
                className="resultType-text"
                icon-class="img"
            />图片
          </span>
          <span v-if="text === 2">
            <icon-svg
                className="resultType-text"
                icon-class="text"
            />文字
          </span> 
          <span v-if="text === 3">
            <icon-svg
                className="resultType-text"
                icon-class="table"
            />表格
          </span> 
      </template> 

      <template #analyticType ="{ text }">
        <span v-if="text === 1" class="analyticType-text">
          时间戳
        </span>
        <span v-if="text === 2" class="analyticType-text">
          正则
        </span>
        <span v-if="text === 3" class="analyticType-text">
         Xpath
        </span>
        <span v-if="text === 4" class="analyticType-text">
          字典
        </span>
      </template> 
    </TableList>

    <RightMenu
      :show="rightMenuShow"
      :contextMenuData="contextMenuData"
      @onMenuClick="onMenuClick"
    ></RightMenu>

  </div>

  <a-modal
    v-model:visible="isShow"
    :bodyStyle="{ height: '94vh'}"
    :style="{maxWidth:'100vw',top:'0',paddingBottom: '0' }"
    width="100vw"
   >
    <Document/>
   </a-modal>

  <a-modal
    v-model:visible="isAddModalShow"
    :title="modalTitle"
    @ok="handleAdd"
    @cancel="handleCancel"
    centered
    width="740px"
    class="component-add-modal"
  >
    <div class="component-add-modal-content">
      <div class="content-top">
        <div class="content-top-item">
          <span class="content-top-item-label">
            <!-- <i class="required">*</i> -->
            规则名称：
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
          />
        </div>
        <div class="content-top-item">
           <span class="content-top-item-label">
            <!-- <i class="required">*</i> -->
            提取类型：
          </span>
          <a-select
            v-model:value="addExtType"
            placeholder="请选择"
            class="content-top-item-input"
            :options="extractionTypeOptions"
          />
        </div>
        <div class="content-top-item">
          <span class="content-top-item-label">
            <!-- <i class="required">*</i> -->
            解析方法：
          </span>
          <a-select
            v-model:value="addAnaMethod" 
            placeholder="请选择"
            class="content-top-item-input"
            :options="analyticalMethodOptions"
          />
        </div>
        <div class="content-top-item">
          <!-- 根据解析方法的不同，展示不同的页面 -->
          <div v-show="addAnaMethod === 1">
             <span class="content-top-item-label">时间格式：</span>
             <div class="content-top-item-add">
              <a-textArea
                class="content-top-item-input"
                style="width: 692px"
                v-model:value.trim="notes"
                placeholder="请输入"
                allow-clear
                :auto-size="{ minRows: 4, maxRows: 4 }"
              />
             </div>
          </div> 
          <div v-show="addAnaMethod === 2 ">
             <span class="content-top-item-label">正则表达式：</span>
             <div  class="content-top-item-add">
              <a-textArea
                class="content-top-item-input"
                style="width: 692px"
                v-model:value.trim="expression"
                placeholder="请输入"
                allow-clear
                :auto-size="{ minRows: 4, maxRows: 4 }"
              />
            </div>
          </div> 
          <div v-show ="addAnaMethod ===3 ">
             <div class="content-top-item-label">Xpath路径：</div>
             <div class="content-top-item-add">
                <a-input
                    type="text"
                    class="content-top-item-label-input"
                    v-model:value.trim="path"
                    style="width: 596px"
                    placeholder=""
                    allow-clear
                />
                <a-button class="content-top-item-label-btn" @click="selectPath">重新选择</a-button>
             </div>
          </div> 
          <div v-show = "addAnaMethod === 4 ">
             <div class="content-top-item-label">选择字典：</div>
             <div class="content-top-item-add">
                
              <a-checkbox-group v-model:value="checkedList" :options="plainOptions" />

              <!-- <div class="content-top-item-add">
                <div class="content-top-item-add-item">
                  <div class="name">
                    <input type="checkbox" name="dictionary" value="jungong" class="checkInput" >军工行业字典库
                  </div>
                  <div>
                    <icon-svg className="icon" icon-class="action-add"  />
                    <icon-svg className="icon" icon-class="action-edit" />
                    <icon-svg className="icon" icon-class="action-delete" />
                  </div>
                   
                </div>
                <div class="content-top-item-add-item">
                  <div class="name">
                    <input type="checkbox" name="dictionary" value="jungong" class="checkInput" >金融行业字典库
                  </div>
                  <div>
                    <icon-svg className="icon" icon-class="action-add"  />
                    <icon-svg className="icon" icon-class="action-edit" />
                    <icon-svg className="icon" icon-class="action-delete" />
                  </div>
                </div>
                <div class="content-top-item-add-item">
                  <div class="name">
                    <input type="checkbox" name="dictionary" value="jungong" class="checkInput" >医疗行业字典库
                  </div>
                  <div>
                    <icon-svg className="icon" icon-class="action-add"  />
                    <icon-svg className="icon" icon-class="action-edit" />
                    <icon-svg className="icon" icon-class="action-delete" />
                  </div>
                </div>
                <div class="content-top-item-add-item">
                  <div class="name">
                    <input type="checkbox" name="dictionary" value="jungong" class="checkInput" >地产行业字典库
                  </div>
                  <div>
                    <icon-svg className="icon" icon-class="action-add"  />
                    <icon-svg className="icon" icon-class="action-edit" />
                    <icon-svg className="icon" icon-class="action-delete" />
                  </div>
                </div>

             </div> -->
             </div>
             
          </div> 
          
        </div>
      </div>
    </div>
  </a-modal>
<a-modal
    v-model:visible="isEditModalShow"
    title="编辑规则"
    @ok="handleEdit"
    centered
    width="740px"
    class="component-add-modal"
  >
    <div class="component-add-modal-content">
      <div class="content-top">
        <div class="content-top-item">
          <span class="content-top-item-label">
            <!-- <i class="required">*</i> -->
            规则名称：
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
          />
        </div>
        <div class="content-top-item">
           <span class="content-top-item-label">
            <!-- <i class="required">*</i> -->
            提取类型：
          </span>
          <a-select
            v-model:value="addExtType"
            placeholder="请选择"
            class="content-top-item-input"
            :options="extractionTypeOptions"
          />
        </div>
        <div class="content-top-item">
          <span class="content-top-item-label">
            <!-- <i class="required">*</i> -->
            解析方法：
          </span>
          <a-select
            v-model:value="addAnaMethod" 
            placeholder="请选择"
            class="content-top-item-input"
            :options="analyticalMethodOptions"
          />
        </div>
        <div class="content-top-item">
          <!-- 根据解析方法的不同，展示不同的页面 -->
          <div v-show="addAnaMethod === 1">
             <span class="content-top-item-label">时间格式：</span>
             <div class="content-top-item-add">
              <a-textArea
                class="content-top-item-input"
                style="width: 692px"
                v-model:value.trim="notes"
                placeholder="请输入"
                allow-clear
                :auto-size="{ minRows: 4, maxRows: 4 }"
              />
             </div>
          </div> 
          <div v-show="addAnaMethod === 2 ">
             <span class="content-top-item-label">正则表达式：</span>
             <div  class="content-top-item-add">
              <a-textArea
                class="content-top-item-input"
                style="width: 692px"
                v-model:value.trim="expression"
                placeholder="请输入"
                allow-clear
                :auto-size="{ minRows: 4, maxRows: 4 }"
              />
            </div>
          </div> 
          <div v-show ="addAnaMethod ===3 ">
             <div class="content-top-item-label">Xpath路径：</div>
             <div class="content-top-item-add">
                <a-input
                    type="text"
                    class="content-top-item-label-input"
                    v-model:value.trim="path"
                    style="width: 596px"
                    placeholder=""
                    allow-clear
                />
                <a-button class="content-top-item-label-btn" @click="selectPath">重新选择</a-button>
             </div>
          </div> 
          <div v-show = "addAnaMethod === 4 ">
             <div class="content-top-item-label">选择字典：</div>
             <div class="content-top-item-add">
               <a-checkbox-group v-model:value="checkedList" :options="plainOptions" />
             </div>
          </div> 
        </div>
      </div>
    </div>
  </a-modal>


<!-- 是否填入剪切板中的Xpath路径 -->
  <a-modal
    v-model:visible="isPathModalShow"
    title = "路径选择"
    @ok="handlePath"
    @cancel="cancelPath"
    centered
    width="500px"
    class="component-path-modal"
  >
    <span>检测到剪切板中含有xpath路径，是否填入？</span>
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
    Checkbox
  } from "ant-design-vue";
  import { reactive, ref, toRefs, onMounted , watch} from "vue";
  import store from "@/store";
  import useClipboard from "vue-clipboard3";
  import TableList from "@/components/TableList";
  import RightMenu from "@/components/rightMenu";
  import Document from "@/views/document";
  import { modalConfirm } from "@/utils/common";
  import { getRuleList, delRuleList, getRuleCategory, editRule } from "@/shared/api/ruleManage";
  import { getCategoryTree } from "@/shared/api/categoryTree";
  import { getDicList} from "@/shared/api/dicManage"
  import { cloneDeep } from "lodash";
  import {
    nodeListQuery,
    addNodeConfig,
    nodeConfigDetail,
    queryDictionaryByType,
    addCategory,
    deleteCategory,
  } from "../../shared/api/componentManage";
  import { resetData, processCategoryTree } from "../../utils/common";
  import LeftTreeList from "@/components/leftTreeList.vue";
  // import LeftTree from "../flowEdit/components/leftTree.vue";

  const { Option } = Select;
  const { TextArea } = Input;
  const { Group } = Checkbox;

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
      ACheckboxGroup: Group,
      TableList,
      LeftTreeList,
      RightMenu,
      Document
      // LeftTree,
    },
    setup() {
      let searchLoading = ref(false);
      const selectedKey = ref(null);
      const searchParams = reactive({
        interfaceName: undefined,
        interfaceType: undefined,
        interfaceCode: undefined,
        typeOptions: [],
      });
      const rightMenuShow = ref(false); // 右击菜单是否显示
      const isShow = ref(false); //文档组件是否展示
      const contextMenuData = reactive({
        position: {},
        context: [
          {
            title: "添加子分类",
            key: "delete",
            show: true,
          },
          {
            title: "删除",
            key: "delete",
            show: true,
          },
        ],
     }); // 右击菜单数据

      const columns = [
        {
          title: "规则名称",
          key: "name",
          dataIndex: "name",
          width:"232px",
        },
        {
          title: "类别",
          dataIndex: "category",
          key: "category",
          width:"232px",
        },
        {
          title: "提取类型",
          dataIndex: "resultType",
          key: "resultType",
          width: "232px",
        },
        {
          title: "解析方法",
          dataIndex: "analyticType",
          key: "analyticType",
          width: "232px",
          // sorter: true,
        },
        {
          title: "操作",
          key: "action",
          dataIndex: "action",
          width: "120px",
          fixed: "right",
        },
      ];

      //字典
      //多选:所有字典名称
      const plainOptions = ref([]);
      //选中的字典
      // const checkedList = ref([]);
      //获取所有字典
      const getAllDic = async()=> {
        const res = await getDicList();
        if (res.message === "成功") {
        // 获取左侧分类树
          plainOptions.value = res.data.map((item)=>{
             return {
                    label: item.dicName,
                    value: item.dicName,
                  };
          });
          console.log(98989898,plainOptions)
          // console.log(checkedList)
        } else {
          message.error(res.message);
        }
      }
      


      const dataSource = ref([
        // {
        //   id: 1,
        //   interfaceName: "查询用户转账记录1",
        //   interfaceType: "数据任务",
        //   interfaceKey: "JK0000000001",
        // },
        // {
        //   id: 2,
        //   interfaceName: "查询用户转账记录2",
        //   interfaceType: "数据任务",
        //   interfaceKey: "JK0000000002",
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

      // 查询接口列表方法
      const getList = async () => {
        searchLoading.value = true;
        const json = {
        categoryId: selectedKey.value,
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        };
        const res = await getRuleList(json);
        searchLoading.value = false;
        if (res.message === "成功" && res.data.dateList) {
          dataSource.value = res.data.dateList.map((item, index) => {
            return {
              ...item,
              name: item.ruleName,
              category: item.categoryName,
              resultType: item.resultType,
              analyticType:item.analyticType,
            };
          });

          // pagination.current = res.data.pageNo;
          pagination.total = res.data.totalCount;
        } else {
          message.error(res.message);
        }
      };

      //规则列表刷新
      const onReset = ()=>{
        getList()
      }

      // 删除规则方法
      const handleDelete = (record) => {
        console.log("handleDelete", record);
        const title = "规则删除提示！";
        const content = "是否确认删除该规则？";
        let res = null;
        const onOk = async () => {
          res = await delRuleList(record.id);
          if (res.message === "返回数据结构校验通过") {
            message.success("规则删除成功！");
          } else {
            message.error(res.message);
          }
        };
        modalConfirm(title, content, onOk);
      };

      //重新选择Xpath路径
      const selectPath = ()=>{
        isShow.value = true
      }


      // 查询方法
      const onSearch = (type) => {
        if (type === "init") {
          pagination.current = 1;
        }
        getList();
      };

      

      // 查看接口详情方法
      // const checkDetails = async (record) => {
      //   modalTitle.value = "编辑节点";
      //   await getNodeConfig(record.id);
      // };

    

      // 获取接口详情
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
          obj["addCode"] = nodeCode;
          obj["addCategory"] = String(nodeCategory);
          obj["addTypeValue"] = parseInt(nodeElType);
          obj["addData"] = nodeParams.map((item, index) => {
            return {
              key: index + 1,
              enName: item.paramEsName,
              chName: item.paramCsName,
              type: item.paramType,
              format: item.inputFormat,
              required: String(item.proRequired),
              enumList: JSON.parse(item.enumValue),
            };
          });
          Object.assign(addParams, obj);
          isAddModalShow.value = true;
        } else if (!res.data) {
          message.info("暂无详情信息");
        } else {
          message.error(res.message);
        }
      };

      

      /* 弹窗参数、方法 */
      // 弹窗标题
      const modalTitle = ref("");
      // 新建规则的相关参数
      const addParams = reactive({
        addName: undefined, //规则名称
        addTypeValue: undefined, //类别
        addExtType: undefined, // 提取类型
        addAnaMethod: undefined, //解析方法
        notes: undefined, //时间格式
        expression: undefined, //正则
        path: undefined,//Xpatn路径
        checkedList:[],//选中的字典
        addData: [
          // {
          //   key: 1,
          //   enName: "",
          //   chName: "",
          //   type: undefined,
          //   required: "1",
          //   format: 1,
          //   enumList: [
          //     // {
          //     //   index: 1,
          //     //   enum: "",
          //     //   label: "",
          //     // },
          //   ],
          // },
        ],
      });

      let analyticBody = ref(undefined) //解析方式内容

      // 类别选择
      let addTypeOptions = ref([]); // 添加的节点可选的节点类型
      //提取类型选择
      let extractionTypeOptions = ref([
        {
          label: "图片",
          value: 1,
        },
        {
          label: "文字",
          value: 2,
        },
        {
          label: "表格",
          value: 3,
        },
      ]);
      // 解析方法选择
      let analyticalMethodOptions = ref([
         {
          label: "时间戳",
          value: 1,
        },
        {
          label: "正则",
          value: 2,
        },
        {
          label: "Xpath",
          value: 3,
        },
        {
          label: "字典",
          value: 4,
        },
      ]);
      // 剪切板包含Xpath路径弹框
      let isPathModalShow = ref(false); 
      
     

      // 字段类型选项
      let paramsTypeOptions = ref([]);
      let nodeCategoryOptions = ref([]);
      let addDataIndex = ref(1); // 往addData添加字段时的index
      let addEnumIndex = ref(1); // 往enumList添加字段时的index
      const paramsFormatOptions = ref([
        {
          label: "输入框",
          value: 1,
        },
        {
          label: "文本域",
          value: 2,
        },
        {
          label: "下拉框",
          value: 3,
        },
        {
          label: "时间",
          value: 4,
        },
      ]); // 节点参数输入类型
      let isAddModalShow = ref(false); // 新建规则弹窗是否展示
      let isEditModalShow = ref(false);
      let isAddEnumModalShow = ref(false); // 添加枚举值弹窗是否展示
      let selectParam = ref(undefined); // 打开枚举值弹窗时对应的选中的参数
      const addColumns = [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: 65,
          align: "center",
        },
        {
          title: "字段名称（英文）",
          dataIndex: "enName",
          key: "enName",
          width: 173,
        },
        {
          title: "字段名称（中文）",
          dataIndex: "chName",
          key: "chName",
          width: 173,
        },
        {
          title: "字段类型",
          dataIndex: "type",
          key: "type",
          width: 160,
        },
        {
          title: "输入类型",
          dataIndex: "format",
          key: "format",
          width: 180,
        },
        {
          title: "是否必填",
          dataIndex: "required",
          key: "required",
          width: 100,
        },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          width: 100,
        },
      ];
      let enumList = ref([]); // 枚举值弹窗内的枚举值list
      const enumColumns = [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: 66,
          align: "center",
        },
        {
          title: "枚举值",
          dataIndex: "enum",
          key: "enum",
          width: 300,
        },
        {
          title: "展示字段",
          dataIndex: "label",
          key: "label",
          width: 300,
        },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          width: 80,
        },
      ];


      // 点击展示添加接口弹窗
      const showAddModal =  () => {
        modalTitle.value = "新建规则";
        isAddModalShow.value = true;
        getAllDic();
        let copyText = store.state.copyText.text;
        console.log(777777777,copyText)
        // if(copyText){
        //   setTimeout('isPathModalShow.value = true', 3000)
        //  }
        if(copyText){
          addParams.addAnaMethod = 3,
          isPathModalShow.value = true
        }
        addParams.addData = [
          // {
          //   key: 1,
          //   enName: "",
          //   chName: "",
          //   type: undefined,
          //   required: "1",
          //   enumList: [
          //     {
          //       index: 1,
          //       enum: "",
          //       label: "",
          //     },
          //   ],
          // },
        ];
      };

      const request = ref(undefined) //新建\编辑规则里发送请求的json

      // 新建或编辑规则弹窗确认方法
      const handleAdd = async () => {
        // isAddModalShow.value = false;
        // console.log("handleAdd", addParams);
        if (!addParams.addName) {
          return message.warning("规则名称必填！");
        }
        // if (addParams.addName && addParams.addName.length > 8) {
        //   return message.warning("节点名称不能超过8个字符！");
        // }
        // if (!addParams.addTypeValue) {
        //   return message.warning("请选择规则类别！");
        // }
        if (!addParams. addExtType) {
          return message.warning("请选择提取类型！");
        }
        if (!addParams.addAnaMethod) {
          return message.warning("请选择解析方法！");
        }
        //当前解析内容
         if (addParams.notes){
           analyticBody = addParams.notes;
          //  console.log(analyticBody)
        }else if(addParams.expression){
           analyticBody = addParams.expression;
          //  console.log(analyticBody)
        }else if(addParams.path){
            analyticBody = addParams.path;
          //  console.log(analyticBody)
        }else if(addParams.checkedList){
           analyticBody = Object.values(addParams.checkedList).toString();
          //  console.log(analyticBody)
        }

        if (modalTitle === "新建规则") {
              request.value = {
              ruleName: addParams.addName,
              categoryId: addParams.addTypeValue,
              resultType: addParams.addExtType,
              analyticType: addParams.addAnaMethod,
              analyticBody
             };
        } else {
             request.value = {
              id: targetRecord.value,
              ruleName: addParams.addName,
              categoryId: addParams.addTypeValue,
              resultType: addParams.addExtType,
              analyticType: addParams.addAnaMethod,
              analyticBody
              };
        }
        // console.log(request)
        // const json ={
        //   ruleName: addParams.addName,
        //   categoryId: addParams.addTypeValue,
        //   resultType: addParams.addExtType,
        //   analyticType: addParams.addAnaMethod,
        //   analyticBody

        // }
        // console.log(json)
        
        const res = await editRule(request.value);
        if (res.message === "成功") {
          isAddModalShow.value = false;
          if (modalTitle === "新建规则") {
            message.success("新建规则成功！");
          } else {
            message.success("编辑规则成功！");
          }
          onSearch("init"); //这是????
        } else {
           if (modalTitle === "新建规则") {
             message.error("新建规则失败！");
           } else {
             message.error("编辑规则失败！");
           }
        }
      };

      let targetRecord = ref(undefined) //当前选中规则列表行的id
      const handleEdit = async (record) => {
        modalTitle.value = "编辑规则";
        isAddModalShow.value = true;
        targetRecord.value = record.id;
        // console.log(targetRecord.value)
        // await getNodeConfig(record.id);
      };

     




      // 添加一项字段
      const handleAddParams = () => {
        addParams.addData.push({
          index: addDataIndex.value,
          enName: "",
          chName: "",
          type: undefined,
          required: "1",
          enumList: [
            // {
            //   index: 1,
            //   enum: "",
            //   label: "",
            // },
          ],
        });
        addDataIndex.value += 1;
      };

      

      // 校验节点参数方法
      const checkAddData = (data) => {
        let msg = "";
        let flag = true;
        for (let i = 0; i < data.length; i++) {
          const element = data[i];
          if (
            !element.enName ||
            !element.chName ||
            !element.type ||
            !element.format
          ) {
            msg = "请填写完整的字段参数！";
            flag = false;
            break;
          } else if (element.format === 3) {
            /*
              如果输入类型选中下拉框，则需要配置枚举值，
              校验规则为至少有一个枚举值项，且每项枚举值的label和value都必填
            */
            if (!element.enumList.length) {
              msg = "请至少配置一项枚举值！";
              flag = false;
              break;
            }
          }
        }
        return { msg, flag };
      };

      // 关闭添加节点弹窗
      const handleCancel = () => {
        resetData(addParams);
      };

      // 删除配置的字段
      const addDelete = (index) => {
        addParams.addData.splice(index, 1);
      };

      // 打开枚举值弹窗
      const addEnumModalShow = (record) => {
        selectParam = record;
        isAddEnumModalShow.value = true;
        enumList.value = cloneDeep(record.enumList);
      };

      // 添加枚举值配置
      const handleAddEnum = () => {
        addEnumIndex.value += 1;
        enumList.value.push({
          index: addEnumIndex.value,
          enum: "",
          label: "",
        });
      };

      // 保存枚举值配置
      const handleSaveEnum = () => {
        // 校验枚举值是否均已填好
        let flag = true; // 是否校验通过
        if (enumList.value.length) {
          for (let i = 0; i < enumList.value.length; i++) {
            const element = enumList.value[i];
            if (!element.enum) {
              message.warning(`第${i + 1}项的枚举值未填写！`);
              flag = false;
              break;
            }
            if (!element.label) {
              message.warning(`第${i + 1}项的展示字段未填写！`);
              flag = false;
              break;
            }
          }
        } else {
          message.warning("请填写至少一项枚举值！");
          flag = false;
        }
        if (!flag) return;
        selectParam.enumList = enumList.value;
        isAddEnumModalShow.value = false;
      };

      // 删除枚举值
      const enumDelete = (index) => {
        enumList.value.splice(index, 1);
      };

      /* 分类树参数、方法 */
      const selectedKeys = ref(["0-0-0"]);

      const treeData = ref([
      {
        title: "全部",
        key: "0",
        icon: "icon-folder",
        children: [
        ],
      },
    ]);

      let treeLoading = ref(false);

      // 获取左侧分类树以及分类下拉框选项
      // const getLeftCategory = async () => {
      //   treeLoading.value = true;
      //   const res = await getCategoryTree(1);
      //   treeLoading.value = false;
      //   if (res.message === "成功") {
      //     // 获取节点分类选项
      //     nodeCategoryOptions.value = res.data[0].children.map((item) => {
      //       return {
      //         label: item.categoryName,
      //         value: item.id,
      //       };
      //     });
      //     // 获取左侧分类树
      //     treeData.value = processCategoryTree(res.data, "id", "categoryName");
      //   } else {
      //     message.error(res.message);
      //   }
      // };
     // 获取左侧分类树以及分类下拉框选项
      const getLeftCategory = async () => {
        treeLoading.value = true;
        const res = await getCategoryTree(2);
        treeLoading.value = false;
        if (res.message === "成功") {
        // 获取类别分类选项
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
        // console.log("addTypeOptions", addTypeOptions.value);
        // 获取左侧分类树
        const result = handleTreeData(res.data, 1);
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



      // 删除分类
      const deleteLeftCategory = async (id) => {
        treeLoading.value = true;
        const res = await deleteCategory(id);
        treeLoading.value = false;
        if (res.message === "成功") {
          message.success("删除成功");
          getLeftCategory();
        } else {
          message.error(res.message);
        }
      };
      // 选中分类
      const leftTreeSelected = async (selectedKeys) => {
        if (selectedKeys.length) {
          searchParams.interfaceType = selectedKeys[0];
        } else {
          searchParams.interfaceType = undefined;
        }
        getList();
      };
      // 添加分类
      const addLeftCategory = async (data) => {
        const json = {
          id: data.id,
          parentId: treeData.value[0].id,
          categoryName: data.categoryName,
          icon: data.categoryIcon,
          categoryType: 1, //分类类型:1、内置节点分类；2、脚本节点分类
        };
        treeLoading.value = true;
        const res = await addCategory(json);
        treeLoading.value = false;

        if (res.message === "成功") {
          message.success("添加成功");
          getLeftCategory();
        } else {
          message.error(res.message);
        }
      };
      // 获取选项值
      const getDictionaryByType = async (type) => {
        const res = await queryDictionaryByType(type);
        if (res.message === "成功") {
          if (type === "node_type") {
            addTypeOptions.value = res.data.map((item) => {
              return {
                label: item.dicName,
                value: item.id,
              };
            });
          } else {
            paramsTypeOptions.value = res.data.map((item) => {
              return {
                label: item.dicName,
                value: item.id,
              };
            });
          }
        }
      };

    

      // 右击tree
    const rightClick = (e) => {
      rightMenuShow.value = true;
      targetDom.value = e.target;
      contextMenuData.position = {
        x: e.screenX,
        y: e.screenY - 100,
      };
    };

    const onMenuClick = (key) => {
      
    };

    // 关闭剪切板确Xpath的弹窗
    const cancelPath = () =>{
      isPathModalShow.value = false
    }
    // 向input中填写剪切板中获取到的Xpath
    const handlePath = ()=>{
       let copyText = store.state.copyText.text;
      addParams.path = copyText;
      isPathModalShow.value = false
      // console.log(copyText)
    }

    watch(()=>addParams.checkedList,(newValue,oldValue)=>{
      console.log(newValue,oldValue)
      // console.log(66666666,Object.values(addParams.checkedList)) addParams.checkedList打印出来是对象,这里把他转为数组
    })

    // watch(analyticBody ,(newValue,oldValue)=>{
    //   console.log(newValue,oldValue)
    // },{immediate:true})

      onMounted(async () => {
        // 获取左侧分类树
        getLeftCategory();
        // 获取规则列表
        getList();
       //获取所有字典
        getDicList();
        //根据分类类型查询类别
        getRuleCategory(2);

        
        // // 获取字段类型
        // getDictionaryByType("file_type");
        // // 获取节点类型
        // getDictionaryByType("node_type");
      });

      return {
        columns,
        ...toRefs(searchParams),
        dataSource,
        searchLoading,
        pagination,
        contextMenuData,
        rightMenuShow,
        rightClick,
        onSearch,
        onReset,
        handleDelete,

        modalTitle,
        ...toRefs(addParams),
        addColumns,
        paramsFormatOptions,
        
        isAddEnumModalShow,
        addTypeOptions,
        analyticalMethodOptions,
        extractionTypeOptions,
        nodeCategoryOptions,
        paramsTypeOptions,
        enumColumns,
        enumList,
        showAddModal,
        handleAdd,
        handleEdit,
        addDelete,
        addEnumModalShow,
        handleAddEnum,
        handleAddParams,
        handleSaveEnum,
        enumDelete,
        handleCancel,
        onMenuClick,

        selectedKeys,
        treeData,
        treeLoading,
        deleteLeftCategory,
        getLeftCategory,
        addLeftCategory,
        leftTreeSelected,

        isAddModalShow,
        isPathModalShow,
        isShow,
        plainOptions,
        analyticBody,
        targetRecord,
        request,


        cancelPath,
        handlePath,
        selectPath,
        getAllDic,
      };
    },
  };
</script>

<style lang="less" >
  .component-manage {
    width: 100%;
    height: 100%;
    display: flex;

    &-tree {
      width: 288px;
      margin-right: 24px;
      .tree-list-title {
        // margin: 16px;
        height: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-text {
          font-weight: 600;
          font-size: 20px;
          line-height: 32px;
        }
      }
      .tree-list-content {
        height: calc(100% - 80px);
        // margin: 16px;
        padding: 6px;
        border: 1px solid #d6dbe3;
      }

      .action-img {
        width: 16px;
        height: 16px;
        color: #1776ff;
      }

    }

    &-table {
      width: calc(100% - 312px);
      box-shadow: none;
      border-radius: 0;
      padding: 0;
      
      .resultType-text{
        width: 20px !important;
        height: 20px !important;
      }

      .analyticType-text{
        height: 20px;
        border-radius: 20px;
        background:#E3E6EB;
        padding: 3px 12px;
      }

    }
  }
  .component-add-modal {
   
    &-content {
      
      .content-top {
        display: flex;
        margin-bottom: 16px;
        align-items: center;
        flex-wrap: wrap;

        &-item {
          display: flex;
          align-items: center;

          &-label {
            width: 70px;
            color: #3c485c;
            margin-right: 8px;
            text-align: right;
            white-space: nowrap;
            &-btn{
            margin-left: 8px;
            }
          }

          &-add{
            margin-top: 8px;
            // margin-left: 78px;;
            // &-item{
            //   width:614px;
            //   height:32px;
            //   border-radius: 4px;
            //   margin-bottom: 8px;
            //   background: #F1F2F5;
            //   display: flex;
            //   justify-content: space-between;
            //   align-items: center;
            //   .name{
            //     width:120px;
            //     height: 22px;
            //     margin-left: 12px;
            //   }
            //   .checkInput{
            //     line-height: 22px;
            //     margin-right: 8px;

                
            //   }
            //  .icon{
            //     width: 14px !important;
            //     height: 14px !important;
            //     color:#1776FF;
            //     margin-right: 12px;
              
            //   }
            // }
          }

          &-input {
            flex: 1;
          }

          &:not(:last-child) {
            margin-right: 24px;
            margin-bottom: 16px;
            width: calc((100% - 24px) / 2);
          }

          &:nth-child(2n) {
            margin-right: 0;
          }

          &:last-child {
            width: 100%;
            display: flex;
            align-items: flex-start;
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

  .ant-modal-footer{
    padding: 10px 24px;
  }
  .content-bottom-addbtn {
    width: 100%;
    height: 32px;
    display: flex;
    cursor: pointer;
    margin-top: 16px;
    color: #1776ff;
    user-select: none;
    border-radius: 6px;
    align-items: center;
    background: #e6f4ff;
    justify-content: center;
    border: 1px dashed #1776ff;

    .add-icon {
      font-size: 16px;
      margin-right: 8px;
    }
  }

  .component-del-modal {
    .cancel-modal {
      display: flex;
      align-items: center;
      &-warning {
        width: 22px !important;
        height:22px !important;
        margin-right: 16px;
      }
      &-content {
        font-size: 16x;
      }
    }
  }

.ant-checkbox-group{
    &-item{
      width: 614px;
      height: 32px;
      border-radius: 4px;
      background:  #F1F2F5;
      align-items: center;
      margin-bottom: 8px;
      .ant-checkbox{
        margin-left:12px;
      }
    }

  }
</style>
