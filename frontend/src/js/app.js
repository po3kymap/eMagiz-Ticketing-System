import { createApp } from 'vue';
import '@css/main.css';
import '@css/global.css';
import '@css/theme.css';
import App from '@/App.vue';
import router from '@js/router';

const app = createApp(App);
app.use(router);
app.mount('#app');
