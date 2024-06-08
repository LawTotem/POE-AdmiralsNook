import { createApp } from 'vue';
import Settings from './Settings.vue';
import ItemRender from '../components/ItemRender.vue'
import ItemReq from '../components/ItemReq.vue'
import ItemProp from '../components/ItemProp.vue'
import ItemSmall from '../components/ItemSmall.vue'
import { i18n } from '../locales/i18n';

const settng = createApp(Settings)
settng.component('ItemRender', ItemRender)
settng.component('ItemReq', ItemReq)
settng.component('ItemProp', ItemProp)
settng.component('ItemSmall', ItemSmall)
settng.use(i18n)
settng.mount('#settings')