import { createApp } from "vue";
import App from "../App.vue";
import vue3GoogleLogin from "vue3-google-login";

const app = createApp(App);

app.use(vue3GoogleLogin, {
  clientId:
    "776312296030-vluputf1kp5viclhfp13plpesk8n22hq.apps.googleusercontent.com",
});

app.mount("#app");
