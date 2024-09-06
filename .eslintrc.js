module.exports = {
  root: true, //停止在父级目录中寻找
  env: {
    browser: true, // 浏览器全局变量
    es6: true, // 启用 ES6 语法支持以及新的 ES6 全局变量或类型
    node: true, // 浏览器全局变量
  },
  extends: [
    "eslint:recommended", // eslint 推荐版本 recommended
    "plugin:vue/essential", //vue官方eslint插件配置eslint-plugin-vue
    "plugin:prettier/recommended",
  ],
  globals: {
    template: false, // false 不允许被重写
    document: false,
    navigator: false,
    window: false,
    uni: true,
    Component: true,
  },
  parserOptions: {
    parser: "babel-eslint", //词法解析器使用babel-eslint，以更好的适配es6的新api
    ecmaVersion: 6, //启用 ES6 语法支持;默认设置为3，5（默认），
    sourceType: "module", //设置为 "script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)。
  },
  plugins: [
    "vue", // 此插件用来识别 .vue文件中的 代码
  ],
  rules: {
    /**
     * 代码中可能的错误或逻辑错误
     */
    "no-console": "off", //开发时候使用  打包后禁用 console
    "no-debugger": "off", //开发时候使用  打包后禁用 debugger
    "no-control-regex": ["off"], // 允许在正则表达式中使用控制字符
    "no-unsafe-finally": ["off"], // 允许在 finally 语句块中出现控制流语句

    "no-cond-assign": ["error", "always"], // 禁止条件表达式中出现赋值操作符
    "no-constant-condition": ["error", { checkLoops: true }], // 禁止在条件中使用常量表达式
    "no-dupe-args": ["error"], // 禁止 function 定义中出现重名参数
    "no-dupe-keys": ["error"], // 禁止对象字面量中出现重复的 key
    "no-duplicate-case": ["error"], // 禁止出现重复的 case 标签
    "no-empty": ["error", { allowEmptyCatch: true }], // 禁止出现空语句块
    "no-empty-character-class": ["error"], // 禁止在正则表达式中使用空字符集
    "no-ex-assign": ["error"], // 禁止对 catch 子句的参数重新赋值
    "no-extra-boolean-cast": ["error"], // 禁止不必要的布尔转换
    "no-extra-semi": ["error"], // 禁止不必要的分号
    "no-func-assign": ["warn"], // 禁止对 function 声明重新赋值
    "no-inner-declarations": ["error"], // 禁止在嵌套的块中出现变量声明或 function 声明
    "no-invalid-regexp": ["error", { allowConstructorFlags: [] }], // 禁止 RegExp 构造函数中存在无效的正则表达式字符串
    "no-irregular-whitespace": ["error"], // 禁止在字符串和注释之外不规则的空白
    "no-obj-calls": ["error"], // 禁止把全局对象作为函数调用
    "no-regex-spaces": ["error"], // 禁止正则表达式字面量中出现多个空格
    "no-sparse-arrays": ["error"], // 禁用稀疏数组
    "no-unexpected-multiline": ["error"], // 禁止出现令人困惑的多行表达式
    "no-unsafe-negation": ["error"], // 禁止对关系运算符的左操作数使用否定操作符
    "use-isnan": ["error"], // 要求使用 isNaN() 检查 NaN

    /**
     * 最佳实践
     */
    "no-empty-function": ["off"], // 禁止出现空函数

    "default-case": ["error"], // 要求 switch 语句中有 default 分支
    "dot-notation": ["error"], // 强制尽可能地使用点号
    // eqeqeq: ["warn"], // 要求使用 === 和 !==
    "no-caller": ["error"], // 禁用 arguments.caller 或 arguments.callee
    "no-case-declarations": ["error"], // 不允许在 case 子句中使用词法声明
    "no-empty-pattern": ["error"], // 禁止使用空解构模式
    "no-eval": ["error"], // 禁用 eval()
    "no-global-assign": ["error"], // 禁止对原生对象或只读的全局对象进行赋值
    "no-redeclare": ["error", { builtinGlobals: true }], // 禁止重新声明变量
    "no-self-assign": ["error", { props: true }], // 禁止自我赋值
    "no-unused-labels": ["error"], // 禁用出现未使用过的标
    "no-useless-escape": ["error"], // 禁用不必要的转义字符
    // "no-magic-numbers": ["error", { "ignoreArrayIndexes": true }], // 禁用魔术数字
    //"radix": ["error"], // 强制在parseInt()使用基数参数

    /**
     * 变量声明
     */
    "no-unused-vars": ["off"], // 禁止出现未使用过的变量

    "no-delete-var": ["error"], // 禁止删除变量
    "no-undef": ["error"], // 禁用未声明的变量，除非它们在 /*global */ 注释中被提到
    "no-use-before-define": ["error"], // 禁止在变量定义之前使用它们

    /**
     * 风格指南
     */
    quotes: ["error", "double"], // 使用双引号
    indent: ["on"], // 两个空格缩进
    "line-comment-position": [
      "error",
      { position: "above", ignorePattern: "ETC" },
    ], // 强制行注释的位置   强制行注释只在代码上方，单独成行
    semi: ["error", "always"], // 要求或禁止使用分号代替 ASI
    "consistent-this": ["error", "that"], // 当获取当前执行环境的上下文时，强制使用一致的命名 ?
    "func-names": ["off"], // 要求或禁止使用命名的 function 表达式
    "func-style": ["error", "declaration", { allowArrowFunctions: true }], // 强制一致地使用 function 声明或表达式 "allowArrowFunctions": true (默认为 false) 允许使用箭头函数
    "new-cap": ["error", { capIsNew: false }], // 要求构造函数首字母大写 允许调用首字母大写的函数时没有 new 操作符
    "linebreak-style": ["off", "windows"], // 换行符风格/ 换行符风格

    "array-bracket-newline": ["error", { multiline: true }], // 在数组开括号后和闭括号前强制换行
    "array-bracket-spacing": ["error", "never"], //  (默认) 禁止在数组括号内出现空格
    "block-spacing": ["error", "never"], // 禁止或强制在代码块中开括号前和闭括号后有空格
    "brace-style": ["error", "1tbs"], // 强制在代码块中使用一致的大括号风格
    "comma-dangle": ["error", "always-multiline"], // 要求或禁止末尾逗号
    "comma-spacing": ["error", { before: false, after: true }], // 强制在逗号前后使用一致的空格
    "comma-style": ["error", "last"], // 强制使用一致的逗号风格
    "computed-property-spacing": ["error", "never"], // 强制在计算的属性的方括号中使用一致的空格
    "eol-last": ["error", "always"], // 要求或禁止文件末尾存在空行
    "func-call-spacing": ["error", "never"], // 要求或禁止在函数标识符和其调用之间有空格
    "function-paren-newline": ["error", "multiline"], // 强制在函数括号内使用一致的换行
    "implicit-arrow-linebreak": ["error", "beside"], // 强制隐式返回的箭头函数体的位置
    "jsx-quotes": ["error", "prefer-double"], // 强制在 JSX 属性中一致地使用双引号或单引号
    "key-spacing": ["error", { beforeColon: false, afterColon: true }], // 强制在对象字面量的属性中键和值之间使用一致的间距
    "max-depth": ["error", 4], // 强制可嵌套的块的最大深度
    "max-nested-callbacks": ["error", 3], // 强制回调函数最大嵌套深度
    "max-params": ["error", 6], // 强制函数定义中最多允许的参数数量
    "multiline-comment-style": ["error", "separate-lines"], // 强制对多行注释使用特定风格
    "multiline-ternary": ["error", "always-multiline"], // 要求或禁止在三元操作数中间换行
    "no-array-constructor": ["error"], // 禁用 Array 构造函数
    "no-mixed-operators": ["error"], // 禁止混合使用不同的操作符
    "no-mixed-spaces-and-tabs": ["error"], // 禁止空格和 tab 的混合缩进
    "no-multiple-empty-lines": ["error"], // 禁止出现多行空行
    "no-new-object": ["error"], // 禁用 Object 的构造函数
    "no-tabs": ["off"], // 禁用 tab
    "no-trailing-spaces": [
      "error",
      { skipBlankLines: false, ignoreComments: false },
    ], // 禁用行尾空白
    "no-whitespace-before-property": ["error"], // 禁止属性前有空白
    "nonblock-statement-body-position": ["error", "beside"], // 强制单个语句的位置
    "object-curly-spacing": ["error", "always"], // 强制在大括号中使用一致的空格
    "operator-linebreak": [
      "error",
      "after",
      { overrides: { "?": "before", ":": "before" } },
    ], // 强制操作符使用一致的换行符
    "semi-spacing": ["error", { before: false, after: true }], // 强制分号之前和之后使用一致的空格
    "space-before-function-paren": ["off", "never"], // 强制在 function的左括号之前使用一致的空格
    "space-in-parens": ["error", "never"], // 强制在圆括号内使用一致的空格
    "space-infix-ops": ["error"], // 要求操作符周围有空格
    "space-unary-ops": ["error", { words: true, nonwords: false }], // 强制在一元操作符前后使用一致的空格
    "spaced-comment": ["error", "always"], // 强制在注释中 // 或 /* 使用一致的空格  "always"，// 或 /* 必须跟随至少一个空白。

    /**
     * ECMAScript 6
     */
    "arrow-spacing": ["error", { before: true, after: true }], // 强制箭头函数的箭头前后使用一致的空格
    "no-var": ["error"], // 要求使用 let 或 const 而不是 var
    "object-shorthand": ["error", "always"], // 要求或禁止对象字面量中方法和属性使用简写语法
    "prefer-arrow-callback": ["error", { allowNamedFunctions: false }], // 要求回调函数使用箭头函数

    /**
     * vue 的代码风格
     */
    "vue/max-attributes-per-line": [
      2, // 开启错误提示
      {
        singleline: 5, // 每行的最大属性数 默认值为1
        multiline: {
          max: 3, // 每行的最大属性数
          allowFirstLine: false, // 属性与该标签名称在同一行
        },
      },
    ], // 多个特性的元素应该分多行撰写，每个特性一行
    "vue/attribute-hyphenation": 0, // 关闭 闭连字符属性名称
    "vue/html-self-closing": 0, // 关闭 自我封闭的风格
    "vue/component-name-in-template-casing": 0, // 关闭 组件命名样式强制使用特定的大小写
    "vue/html-closing-bracket-spacing": 0, // 关闭右括号之前强制执行一致的间距样式
    "vue/singleline-html-element-content-newline": 0, // 关闭  单行元素的内容之前和之后强制换行
    "vue/no-unused-components": 0, // 关闭  禁止注册模板中未使用的组件
    "vue/multiline-html-element-content-newline": 0, // 关闭  在多行元素的内容之前和之后需要换行
    "vue/no-use-v-if-with-v-for": 0, // 关闭   禁止在与v-for相同的元素上使用v-if
    "vue/html-closing-bracket-newline": 0, // 关闭  在标签的右括号之前要求或不允许换行
    "vue/no-parsing-error": 0, // 关闭  禁止解析错误
  },
};
