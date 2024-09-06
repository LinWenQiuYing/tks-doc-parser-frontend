import { createRouter, createWebHashHistory } from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const layout = () => import(/* webpackChunkName: "layout" */ "@/layout");
const ruleBase = () =>
  import(/* webpackChunkName: "ruleBase" */ "@/views/ruleBase");
const dicBase = () =>
  import(/* webpackChunkName: "dicBase" */ "@/views/dicBase");
const document = () =>
  import(/* webpackChunkName: "document" */ "@/views/document");
const taskExtraction = () =>
  import(/* webpackChunkName: "taskExtraction" */ "@/views/taskExtraction");


const routes = [
  {
    path: "/",
    name: "layout",
    component: layout,
    redirect: "rule-base",
    children: [
      {
        path: "rule-base",
        name: "ruleBase",
        component: ruleBase,
      },
      {
        path: "dic-base",
        name: "dicBase",
        component: dicBase,
      },
      {
        path: "document",
        name: "document",
        component: document,
      },
      {
        path: "task-extraction",
        name: "taskExtraction",
        component: taskExtraction,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;

// 全局路由守卫
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();

  // if (
  //   store.state.rightsOptions.userInfo &&
  //   store.state.rightsOptions.userInfo.token
  // ) {
  //   if (to.path === "/login") {
  //     next(false);
  //   } else {
  //     next();
  //   }
  // } else {
  //   if (to.path === "/login") {
  //     next();
  //   } else {
  //     message.error("登陆超时，请重新登陆！", 2);
  //     next({
  //       name: "pierceLogin",
  //       params: {
  //         target: window.location.pathname,
  //       },
  //     });
  //   }
  // }
});

router.afterEach(() => {
  NProgress.done();
});
