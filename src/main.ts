import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import App from "./App.vue";

// You can use the following starter router instead of the default one as a clean starting point
// import router from "./router";
import router from "./router";

// Template components
import BaseBlock from "@/components/BaseBlock.vue";
import BaseBackground from "@/components/BaseBackground.vue";
import BasePageHeading from "@/components/BasePageHeading.vue";

// Template directives
import clickRipple from "@/directives/clickRipple";

// Bootstrap framework
import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap;

import en from "../locales/en.json"

import axios from 'axios'; // For future requests
axios.defaults.withCredentials = true;

const i18n = createI18n({
  inheritLocale: en,
  fallbackLng: en,
  messages: { en },
})

// Craft new application
const app = createApp(App);

// Register global components
app.component("BaseBlock", BaseBlock);
app.component("BaseBackground", BaseBackground);
app.component("BasePageHeading", BasePageHeading);

// Register global directives
app.directive("click-ripple", clickRipple);

// Use Pinia and Vue Router
app.use(createPinia());
app.use(router);
app.use(i18n);

// ..and finally mount it!
app.mount("#app");
