import { createApp } from 'vue';
import SearchEdit from './SearchEdit.vue';
import { i18n } from '../locales/i18n';
import QueryEdit from './QueryEdit.vue';
import MaskEdit from './MaskEdit.vue';
import ItemSearchEdit from './ItemSearchEdit.vue';
import VMultiselect from '@vueform/multiselect';


const srchedit = createApp(SearchEdit)
srchedit.use(i18n)
srchedit.component('QueryEdit', QueryEdit)
srchedit.component('MaskEdit', MaskEdit)
srchedit.component('ItemSearchEdit', ItemSearchEdit)
srchedit.component('v-select', VMultiselect)
srchedit.mount('#searchedit')