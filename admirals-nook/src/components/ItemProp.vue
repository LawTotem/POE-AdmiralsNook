<script lang="ts">
import { defineComponent } from 'vue'
import { ItemProperty } from '../utils/stash'
export default defineComponent({
    props: {
        prop_obj: Object
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
        const req = new ItemProperty().dejson(this.prop_obj)
        this.name = req.name
        this.values = req.values
        this.mode = req.displayMode
        this.type = req.type
    }
})
</script>

<template>
    <span v-if="this.mode == 0">
        {{ this.name }} <span v-if="this.values.length > 0">{{ this.values[0][0] }}</span>
    </span>
    <span v-if="this.mode == 1">
        {{ this.values[0][0] }} {{ this.name }}
    </span>
    <span v-if="this.mode == 3">
        {{ this.name }}
    </span>
</template>

