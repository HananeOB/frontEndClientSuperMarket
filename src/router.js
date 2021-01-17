import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      alias: "/products",
      name: "products",
      component: () => import("./components/productList")
    },
    {
      path: "/products/:id",
      name: "product-details",
      component: () => import("./components/product")
    },
    {
      path: "/add",
      name: "add",
      component: () => import("./components/addProduct")
    },
    {
      path: "/cart",
      name: "showCart",
      component: () => import("./components/cart")
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./components/login")
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("./components/signup")
    }
  ]
});