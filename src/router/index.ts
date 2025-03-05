import { createRouter, createWebHistory } from 'vue-router'

import NProgress from "nprogress";

// Main layouts
import Backend from '@/layouts/variations/Backend.vue'
import ProductsView from '@/views/backend/ProductsView.vue'
import UsersView from '@/views/backend/UsersView.vue'
import ContactsView from '@/views/backend/ContactsView.vue'
import CategoriesView from '@/views/backend/CategoriesView.vue'
import OrdersView from '@/views/backend/OrdersView.vue'
import Simple from '@/layouts/variations/Simple.vue'
import UserCreateView from '@/views/backend/users/UserCreateView.vue'
import CategoryCreateView from '@/views/backend/categories/CategoryCreateView.vue'
import OrderCreateView from '@/views/orders/create/OrderCreateView.vue'
import UserEditView from '@/views/backend/users/UserEditView.vue'
import CategoryEditView from '@/views/backend/categories/CategoryEditView.vue'
import ProductEditView from '@/views/backend/products/ProductEditView.vue'
import ProductCreateView from '@/views/backend/products/ProductCreateView.vue'
import ContactCreateView from '@/views/backend/contacts/ContactCreateView.vue'
import ContactEditView from '@/views/backend/contacts/ContactEditView.vue'
import EditSignedInUser from '@/views/backend/users/EditSignedInUser.vue'
import Profile from '@/views/backend/profile/Profile.vue'
import UserSignUp from '@/views/backend/users/UserSignUp.vue'
import UserForgotPassword from '@/views/backend/users/UserForgotPassword.vue'
import UserResetPassword from '@/views/backend/users/UserResetPassword.vue'

// Frontend: Landing
const Landing = () => import("@/views/landing/LandingView.vue");

// Backend: Dashboard
const Dashboard = () => import("@/views/backend/DashboardView.vue");

// Backend: UserManagement DataTable


// Set all routes
const routes = [
  {
    path: "/",
    component: Simple,
    children: [
      {
        path: "",
        name: "landing",
        component: Landing,
      },
      {
        path: "/user/signUp",
        name: "user.signUp",
        component: UserSignUp,
      },
      {
        path: "/user/forgotPassword",
        name: "user.forgotPassword",
        component: UserForgotPassword,
      },
      {
        path: "/user/resetPassword/:token",
        name: "user.resetPassword",
        component: UserResetPassword,
      },
    ],
  },
  {
    path: "/backend",
    redirect: "/backend",
    component: Backend,
    children: [
      {
        path: "/dashboard",
        name: "backend.dashboard",
        component: Dashboard,
      },
      {
        path: "/users",
        name: "backend.user.datatable",
        component: UsersView,
      },
      {
        path: "/users/create",
        name: "backend.user.create",
        component: UserCreateView,
      },
      {
        path: "/user/:uuid/edit",
        name: "backend.user.edit",
        component: UserEditView,
      },
      {
        path: "/user/:uuid/view",
        name: "backend.profile.view",
        component: Profile,
      },
      {
        path: "/signedInUser/edit",
        name: "backend.signedIn.user.edit",
        component: EditSignedInUser,
      },
      {
        path: "/categories-datatable",
        name: "backend.categories.datatable",
        component: CategoriesView,
      },
      {
        path: "/categories/create",
        name: "backend.category.create",
        component: CategoryCreateView,
      },
      {
        path: "/categories/:uuid/edit",
        name: "backend.category.edit",
        component: CategoryEditView,
      },
      {
        path: "/products-datatable",
        name: "backend.products.datatable",
        component: ProductsView,
      },
      {
        path: "/products/create",
        name: "backend.product.create",
        component: ProductCreateView,
      },
      {
        path: "/products/:uuid/edit",
        name: "backend.product.edit",
        component: ProductEditView,
      },
      {
        path: "/orders-datatable",
        name: "backend.orders.datatable",
        component: OrdersView,
      },{
        path: "/orders/create",
        name: "backend.orders.create",
        component: OrderCreateView,
      },
      {
        path: "/contacts-datatable",
        name: "backend.contacts.datatable",
        component: ContactsView,
      },
      {
        path: "/contacts/create",
        name: "backend.contact.create",
        component: ContactCreateView,
      },
      {
        path: "/contacts/:uuid/edit",
        name: "backend.contact.edit",
        component: ContactEditView,
      },

    ],
  },
];

// Create Router
const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: "active",
  linkExactActiveClass: "active",
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
  routes,
});

// NProgress
/*eslint-disable no-unused-vars*/
NProgress.configure({ showSpinner: false });

router.beforeResolve((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach((to, from) => {
  NProgress.done();
});
/*eslint-enable no-unused-vars*/

export default router;