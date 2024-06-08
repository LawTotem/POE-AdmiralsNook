<script lang="ts">
import { defineComponent } from 'vue'
import { Item } from '../utils/stash'


export default defineComponent({
    props: {
        item_obj : Object,
        wdx: Number,
        matches: String,
        x: Number,
        y: Number
    },
    data() {
        return {
            icon: "",
            w: 0,
            h: 0,
            title: "",
            color: "black"
        }
    },
    mounted() {
        const item = new Item().dejson(this.item_obj as object)
        this.icon = item.icon
        this.w = item.w
        this.h = item.h
        this.title = item.name
        if (this.title == undefined || this.title == "")
        {
            this.title = item.typeLine
        }
        if (this.title == undefined || this.title == "")
        {
            this.title = item.baseType
        }
        if (this.matches != "")
        {
            this.color = "red"
            this.title = this.title + "\n" + this.matches
        }
    },
    methods : {
        parseInput() {
            const item = new Item().dejson(this.item_obj as object)
            this.icon = item.icon
            this.w = item.w
            this.h = item.h
            this.title = item.name
            if (this.title == undefined || this.title == "")
            {
                this.title = item.typeLine
            }
            if (this.title == undefined || this.title == "")
            {
                this.title = item.baseType
            }
            if (this.matches != "")
            {
                this.color = "red"
                this.title = this.title + "\n" + this.matches
            }
        }
    },
    watch : {
        item_obj(new_value) {
            this.parseInput()
        }
    }
})
</script>

<template>
    <img :title="this.title"
         :src="this.icon"
         :width="this.wdx * this.w"
         :height="this.wdx * this.h"
         :style="{'position':'absolute','background-color': this.color, 'left': (this.x * this.wdx) + 'px', 'top': (this.y * this.wdx) + 'px' }">
</template>


<style lang="css">
.title {
    text-align:center;
    font-size: 5vw
}
.general {
    text-align:center;
    font-size: 3vw
}
</style>