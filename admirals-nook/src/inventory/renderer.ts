import { createApp } from 'vue';
import InventoryView from './InventoryView.vue';
//import ItemRender from '../components/ItemRender.vue'
//import ItemReq from '../components/ItemReq.vue'
//import ItemProp from '../components/ItemProp.vue'
import ItemSmall from '../components/ItemSmall.vue'
import { i18n } from '../locales/i18n';

const invview = createApp(InventoryView)
//invview.component('ItemRender', ItemRender)
//invview.component('ItemReq', ItemReq)
//invview.component('ItemProp', ItemProp)
invview.component('ItemSmall', ItemSmall)
invview.use(i18n)
invview.mount('#inventoryview')