import { createApp } from 'vue'
import ItemView from './ItemView.vue'
import ItemRender from '../components/ItemRender.vue'
import ItemReq from '../components/ItemReq.vue'

import { i18n } from '../locales/i18n'

const itemview = createApp(ItemView)
itemview.component('ItemRender', ItemRender)
itemview.component('ItemReq', ItemReq)
itemview.use(i18n)
itemview.mount('#itemview')