import panelPage from "src/pages/panelPage.vue";
import panelPage2 from "src/pages/panelPage2.vue";
import panelPage3 from "src/pages/panelPage3.vue";
import panelPage4 from "src/pages/panelPage4.vue";
import panelPage5 from "src/pages/panelPage5.vue";
import adminPage from "src/pages/adminPage.vue";
import monitorPage from "src/pages/monitorPage.vue";
import testItem from "src/pages/testItem.vue";
import testPage from "src/pages/testPage.vue";
import Login from "src/pages/Login.vue";
import Register from "src/pages/Register.vue";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "panel", component: panelPage },
      { path: "panel2", component: panelPage2 },
      { path: "panel3", component: panelPage3 },
      { path: "panel4", component: panelPage4 },
      { path: "panel5", component: panelPage5 },
      { path: "admin", component: adminPage },
      { path: "monitor", component: monitorPage },
      { path: "11", component: testItem },
      { path: "test", component: testPage },
      {
        path: "login",
        name: "login",
        component: Login,
      },
      {
        path: "register",
        name: "register",
        component: Register,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
