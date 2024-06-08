<script lang="ts">
import { ItemQuery, Mask, masktype_list } from '../utils/item_search';
import { defineComponent } from 'vue';
import QueryEdit from './QueryEdit.vue';

import { SearchEditInterface } from './searchedit'
declare global {
    interface Window {
        searchedit_access : SearchEditInterface
    }
}

export default defineComponent({
    props: {
        mask_obj: Object,
        all_mods: [String],
        mask_slot: Number
    },
    emits : [
        'save-mask',
        'remove-mask',
        'set-mask-edit'
    ],
    data() {
        return {
            edit_flag: false,
            sub_edit_flag: [] as Array<boolean>,
            json_flag: false,
            name: "",
            type: "",
            queries: [] as Array<ItemQuery>,
            check_max: false,
            value_max: 0,
            check_min: false,
            value_min: 0,
            active: false,
            delete_toggle: false,
            mask_types: masktype_list,
            json_string: ""
        }
    },
    mounted() {
        this.cancelEdit()
    },
    methods: {
        toggleJSON() {
            if  (this.json_flag) {
                try
                {
                    const parse = JSON.parse(this.json_string)
                    const iq = new Mask().dejson(parse)
                    this.name = iq.name
                    this.type = iq.type
                    this.queries = iq.queries
                    this.sub_edit_flag = this.queries.map(()=>false)
                    this.check_max = iq.check_max
                    this.check_min = iq.check_min
                    this.value_max = iq.value_max
                    this.value_min = iq.value_min
                    this.active = iq.active
                    this.json_flag = false
                }
                catch
                {}
            }
            else
            {
                const iq = new Mask()
                iq.name = this.name
                iq.type = this.type
                iq.queries = this.queries
                iq.check_max = this.check_max
                iq.check_min = this.check_min
                iq.value_max = this.value_max
                iq.value_min = this.value_min
                iq.active = this.active
                this.json_string = JSON.stringify(iq.rejson(), null, 2)
                this.json_flag = true
            }
        },
        cancelEdit() {
            const iq = new Mask().dejson(this.mask_obj)
            this.name = iq.name
            this.type = iq.type
            this.queries = iq.queries
            this.sub_edit_flag = this.queries.map(()=>false)
            this.check_max = iq.check_max
            this.check_min = iq.check_min
            this.value_max = iq.value_max
            this.value_min = iq.value_min
            this.active = iq.active
            this.edit_flag = false
            this.$emit('set-mask-edit', this.mask_slot, false)
        },
        startEdit() {
            this.edit_flag = true
            this.$emit('set-mask-edit', this.mask_slot, true)
        },
        saveEdit() {
            const iq = new Mask()
            iq.name = this.name
            iq.type = this.type
            iq.queries = this.queries
            iq.check_max = this.check_max
            iq.check_min = this.check_min
            iq.value_max = this.value_max
            iq.value_min = this.value_min
            iq.active = this.active
            this.$emit('save-mask', this.mask_slot as number, iq.rejson())
            this.edit_flag = false
        },
        addQuery() {
            this.queries.push(new ItemQuery())
            this.sub_edit_flag.push(false)
        },
        saveQuery(slot : number, q_obj : object) {
            this.queries[slot] = new ItemQuery().dejson(q_obj)
            this.sub_edit_flag[slot] = false
            //this.q1.dejson(q_obj)
        },
        setQueryEdit(slot : number, value : boolean){
            this.sub_edit_flag[slot] = value
        },
        removeQuery(slot : number) {
            this.queries.splice(slot, 1)
            this.sub_edit_flag.splice(slot, 1)
        },
        remove() {
            this.$emit('remove-mask', this.mask_slot as number)
        },
        clearJSON() {
            this.json_string = ""
        },
        copyJSON() {
            window.searchedit_access.copy_board(this.json_string)
        },
        pasteJSON() {
            window.searchedit_access.paste_board().then(v => this.json_string = v)
        }
    }
})
</script>

<template>
    <div class="mask_editing" v-if="edit_flag">
        <div v-if="json_flag">
            <textarea class="json_mask_block" v-model="json_string"></textarea>
            <p>
            <button @click="toggleJSON">J</button>
            <button @click="clearJSON">{{ $t("common.clear") }}</button>
            <button @click="copyJSON">{{ $t("common.copy") }}</button>
            <button @click="pasteJSON">{{ $t("common.paste") }}</button>
            </p>
        </div>
        <div class="edit_mask_block" v-else>
            {{ $t("common.group_name") }}:<input v-model="name"/>
            <select v-model="type">
                <option v-for="t in mask_types" :value="t">{{ $t("masktype." + t) }}</option>
            </select>
            <p>
                <span>{{ $t("common.value_max") }}:<input type="checkbox" v-model="check_max"/> <input class="number_block" v-if="check_max" v-model="value_max"/></span>
                <span>{{ $t("common.value_min") }}:<input type="checkbox" v-model="check_min"/> <input class="number_block" v-if="check_min" v-model="value_min"/></span>
                <span>{{ $t("common.active") }} <input type="checkbox" v-model="active"/></span>
            </p>
            <div class="query" v-for="(q,t_ind) in queries">
                <QueryEdit :query_obj="q" :all_mods="all_mods" :query_slot="t_ind" @save-query="saveQuery" @remove-query="removeQuery" @set-query-edit="setQueryEdit"/>
            </div>
            <div v-if="! sub_edit_flag.some(Boolean)">
                <button @click="addQuery">+ {{ $t("common.query_search") }}</button>
                <button @click="toggleJSON">J</button>
                <button @click="cancelEdit">{{ $t("common.cancel")}}</button>
                <button @click="saveEdit">{{ $t("common.save")}}</button>
            </div>
            <div v-else>
                <button @click="addQuery">+ {{ $t("common.query_search") }}</button>
                <button @click="toggleJSON" disabled>J</button>
                <button @click="cancelEdit">{{ $t("common.cancel")}}</button>
                <button @click="saveEdit" disabled>{{ $t("common.save")}}</button>
            </div>
        </div>
    </div>
    <div v-else>
        <p>{{ name }}</p>
        <button @click="startEdit">{{ $t("common.edit") }}</button>
        {{ $t("common.remove") }}:<input v-model="delete_toggle" type="checkbox"/>
        <button v-if="delete_toggle" @click="remove">{{ $t("common.confirm_remove") + " " + $t("common.mask_search") }}</button>
    </div>
</template>

<style>
.json_mask_block {
    width: 575px;
    height: 150px;
}
.edit_mask_block {
    width: 600px;
}
.query {
    border: 3px solid #F8F6E3;
    margin-bottom: 3px;
}
.mask_editing {
    background-color: #7AA2E3;
}
</style>