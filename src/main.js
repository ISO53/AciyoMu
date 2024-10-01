import "./assets/main.css";

import {createApp} from "vue";
import App from "./App.vue";

async function setupAnalytics() {
    const {inject} = await import("@vercel/analytics");
    inject();
}

setupAnalytics();

createApp(App).mount("#app");
