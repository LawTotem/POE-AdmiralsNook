<script lang="ts">
import { defineComponent } from 'vue'
import { ItemRequirement } from '../utils/stash'
export default defineComponent({
    props: {
        req_obj: Object
    },
    data() {
        return {
            name: "",
            values: [] as Array<[string, number]>,
            mode: -1,
            type: -1
        }
    },
    mounted() {
        const req = new ItemRequirement().dejson(this.req_obj)
        this.name = req.name
        this.values = req.values
        this.mode = req.displayMode
        this.type = req.type
    }
})
</script>

<template>
    <span v-if="this.mode == 0">
        {{ this.name }} {{ this.values[0][0] }}
    </span>
    <span v-if="this.mode == 1">
        {{ this.values[0][0] }} {{ this.name }}
    </span>
    <span v-if="this.mode == 3">
        {{ this.name }}
    </span>
</template>

