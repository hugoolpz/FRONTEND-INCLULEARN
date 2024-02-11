import { createApp } from "vue";
import App from "../App.vue";
import vue3GoogleLogin from "vue3-google-login";

const app = createApp(App);

app.use(vue3GoogleLogin, {
  clientId:
    "776312296030-dlnmhnkoemt3cerr5jiddrpoqtb8ungr.apps.googleusercontent.com",
});

app.mount("#app");