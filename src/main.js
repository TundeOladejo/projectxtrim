import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "bootstrap-icons/font/bootstrap-icons.css";

// Vuetify
import { createVuetify } from 'vuetify'

const vuetify = createVuetify()

const app = createApp(App);

app.use(router).use(vuetify);
app.use(vuetify);
app.mount("#app");
