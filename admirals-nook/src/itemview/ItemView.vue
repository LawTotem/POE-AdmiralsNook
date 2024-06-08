<script lang="ts">
import { defineComponent } from 'vue'
import { Item } from '../utils/stash'
import { ItemViewInterface } from "./itemview"

declare global {
    interface Window {
        itemview_access : ItemViewInterface
    }
}
export default defineComponent({
    data() {
        return {
            data_key: "",
            item: new Item(),
            have_item: false
        }
    },
    mounted() {
        this.data_key = window.itemview_access.fetch_key()
        console.log(this.data_key)
        window.itemview_access.fetch_item(this.data_key).then((item) => {
            console.log(item)
            this.item = item
            this.have_item = true
        })
    }
})
</script>

<template>
    <ItemRender v-if="have_item" :item_obj="item"></ItemRender>
</template>
