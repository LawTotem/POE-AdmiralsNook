<script lang="ts">
import { ItemQuery, querytype_list } from '../utils/item_search';
import { defineComponent } from 'vue'

import { SearchEditInterface } from './searchedit'
declare global {
    interface Window {
        searchedit_access : SearchEditInterface
    }
}

export default defineComponent({
    props: {
        query_obj : Object,
        all_mods: [String],
        query_slot: Number
    },
    emits : [
        'save-query',
        'remove-query',
        'set-query-edit'
    ],
    data() {
        return {
            edit_flag: false,
            json_flag: false,
            match: "",
            type: "",
            check_max: false,
            value_max: 0,
            check_min: false,
            value_min: 0,
            delete_toggle: false,
            query_types : querytype_list,
            json_string: "",
            safe_mods: []
        }
    },
    mounted() {
        this.cancelEdit()
    },
    methods : {
        parseInput() {
            const iq = new ItemQuery().dejson(this.query_obj)
            this.match = iq.match
            this.type = iq.type
            this.check_max = iq.check_max
            this.value_max = iq.value_max
            this.check_min = iq.check_min
            this.value_min = iq.value_min
            this.delete_toggle = false
            this.json_flag = false
            this.edit_flag = false
        },
        toggleJSON() {
            if (this.json_flag) {
                try
                {
                    const parse = JSON.parse(this.json_string)
                    const iq = new ItemQuery().dejson(parse)
                    this.match = iq.match
                    this.type = iq.type
                    this.check_max = iq.check_max
                    this.value_max = iq.value_max
                    this.check_min = iq.check_min
                    this.value_min = iq.value_min
                    this.json_flag = false
                }
                catch
                {}
            }
            else
            {
                const iq = new ItemQuery()
                iq.match = this.match
                iq.type = this.type
                iq.check_max = this.check_max
                iq.value_max = this.value_max
                iq.check_min = this.check_min
                iq.value_min = this.value_min
                this.json_string = JSON.stringify(iq.rejson(),null,2)
                this.json_flag = true
            }

        },
        cancelEdit() {
            const iq = new ItemQuery().dejson(this.query_obj)
            this.match = iq.match
            this.type = iq.type
            this.check_max = iq.check_max
            this.value_max = iq.value_max
            this.check_min = iq.check_min
            this.value_min = iq.value_min
            this.edit_flag = false
            this.$emit('set-query-edit', this.query_slot, false)
        },
        startEdit() {
            this.edit_flag = true
            this.$emit('set-query-edit', this.query_slot, true)
        },
        saveEdit() {
            const iq = new ItemQuery()
            iq.match = this.match
            iq.type = this.type
            iq.check_max = this.check_max
            iq.value_max = this.value_max
            iq.check_min = this.check_min
            iq.value_min = this.value_min
            this.$emit('save-query', this.query_slot as number, iq.rejson())
            this.edit_flag = false
        },
        remove() {
            this.$emit('remove-query', this.query_slot as number)
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
    },
    watch :{
        query_obj(new_value) {
            this.parseInput()
        }
    },
    computed : {
        isMod : function() {
            const mod_types = [
                'AnyMod',
                'FracturedMod',
                'ExplicitMod',
                'ImplicitMod'
            ]
            return mod_types.includes(this.type)
        },
        filteredMods : function() {
            const searchTerm = this.match.toLowerCase()
            return this.all_mods.filter((t : string) => t.toLowerCase().includes(searchTerm))
        }
    }
})

</script>


<template>
    <div v-if="edit_flag" class="match_edit">
        <div v-if="json_flag">
            <textarea class="json_q_block" v-model="json_string"></textarea>
            <p>
                <button @click="toggleJSON">J</button>
                <button @click="clearJSON">{{ $t("common.clear") }}</button>
                <button @click="copyJSON">{{ $t("common.copy") }}</button>
                <button @click="pasteJSON">{{ $t("common.paste") }}</button>
            </p>
        </div>
        <div class="edit_q_block" v-else>
            <v-select :options="query_types.map(q => ({ value: q, label: $t('querytype.' + q) } ))" v-model="type"></v-select>
            <span v-if="isMod">
                <v-select :options="all_mods" v-model="match" searchable="true"></v-select>
                <p>
                    <span>{{ $t("common.value_max") }}:<input type="checkbox" v-model="check_max"/> <input class="number_block" v-if="check_max" v-model="value_max"/></span>
                    <span>{{ $t("common.value_min") }}:<input type="checkbox" v-model="check_min"/> <input class="number_block" v-if="check_min" v-model="value_min"/></span>
                </p>
            </span>
            <span v-else-if="type == 'BaseType'">
                <input v-model="match"/>
            </span>
            <button @click="toggleJSON">J</button>
            <button @click="cancelEdit">{{ $t("common.cancel") }}</button>
            <button @click="saveEdit">{{ $t("common.save") }}</button>
        </div>
    </div>
    <div v-else>
        <span>{{ $t("querytype." + type) }} - </span>
        <span v-if="isMod">&quot;{{ match }}&quot;</span>
        <span v-else-if="type == 'BaseType'">&quot;{{ match }}&quot;</span>
        <div>
            <span v-if="check_max">&le;{{ value_max }}</span>
            <span v-if="check_max">&ge;{{ value_min }}</span>
        </div>
        <button @click="startEdit">{{ $t("common.edit") }}</button>
        {{ $t("common.remove") }}:<input v-model="delete_toggle" type="checkbox"/>
        <button v-if="delete_toggle" @click="remove">{{ $t("common.confirm_remove") + " " + $t("common.query_search") }}</button>
    </div>
</template>

<style src="@vueform/multiselect/themes/default.css"></style>

<style>
.json_q_block {
    width: 500px;
    height: 150px;
}
.edit_q_block {
    width: 500px;
}
.number_block {
    width: 50px;
}
.match_edit {
    background-color: #F8F6E3;
}
</style>