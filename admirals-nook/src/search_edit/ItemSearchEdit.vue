<script lang="ts">
import { ItemSearch, Mask } from '../utils/item_search';
import { defineComponent } from 'vue';
import MaskEdit from './MaskEdit.vue'

import { SearchEditInterface } from './searchedit'
declare global {
    interface Window {
        searchedit_access : SearchEditInterface
    }
}

export default defineComponent({
    props: {
        item_search_obj: Object,
        all_mods: [String],
        item_search_slot: Number
    },
    emits : [
        'save-item-search',
        'remove-item-search',
        'set-item-edit'
    ],
    data() {
        return {
            edit_flag: false,
            sub_edit_flag: [] as Array<boolean>,
            json_flag: false,
            json_string: "",
            delete_toggle: false,
            name: "",
            masks: [] as Array<Mask>
        }
    },
    mounted() {
        this.cancelEdit()
    },
    methods: {
        toggleJSON() {
            if (this.json_flag)
            {
                try
                {
                    const parse = JSON.parse(this.json_string)
                    const iq = new ItemSearch().dejson(parse)
                    this.name = iq.name
                    this.masks = iq.masks
                    this.sub_edit_flag = this.masks.map(() => false) 
                    this.json_flag = false
                }
                catch
                {}
            }
            else
            {
                const iq = new ItemSearch()
                iq.name = this.name
                iq.masks = this.masks as Array<Mask>
                this.sub_edit_flag = this.masks.map(() => false)
                this.json_string = JSON.stringify(iq.rejson(), null, 2)
                this.json_flag = true
            }
        },
        cancelEdit() {
            const iq = new ItemSearch().dejson(this.item_search_obj)
            this.name = iq.name
            this.masks = iq.masks
            this.sub_edit_flag = this.masks.map(() => false)
            this.edit_flag = false
            this.$emit('set-item-edit', this.item_search_slot, false)
        },
        startEdit() {
            this.edit_flag = true
            this.$emit('set-item-edit', this.item_search_slot, true)
        },
        saveEdit() {
            const iq = new ItemSearch()
            iq.name = this.name
            iq.masks = this.masks
            this.sub_edit_flag = this.masks.map(() => false)
            this.$emit('save-item-search', this.item_search_slot as number, iq.rejson())
            this.edit_flag = false
        },
        addMask() {
            this.masks.push(new Mask())
            this.sub_edit_flag.push(false)
        },
        saveMask(slot : number, m_obj : object) {
            this.masks[slot] = new Mask().dejson(m_obj)
            this.sub_edit_flag[slot] = false
        },
        removeMask(slot : number) {
            this.masks.splice(slot, 1)
            this.sub_edit_flag.splice(slot, 1)
        },
        setMaskEdit(slot : number, value : boolean) {
            this.sub_edit_flag[slot] = value
        },
        remove() {
            this.$emit('remove-item-search', this.item_search_slot as number)
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
<div v-if="edit_flag" class="item_search_edit">
    <div v-if="json_flag">
        <textarea class="json_is_block" v-model="json_string"></textarea>
        <p>
        <button @click="toggleJSON">J</button>
        <button @click="clearJSON">{{ $t("common.clear") }}</button>
        <button @click="copyJSON">{{ $t("common.copy") }}</button>
        <button @click="pasteJSON">{{ $t("common.paste") }}</button>
        </p>
    </div>
    <div class="edit_is_block" v-else>
        {{ $t("common.item_search_name") }}:<input v-model="name"/>
        <div class="mask" v-for="(m,t_ind) in masks">
            <MaskEdit :mask_obj="m" :all_mods="all_mods" :mask_slot="t_ind" @save-mask="saveMask" @remove-mask="removeMask" @set-mask-edit="setMaskEdit"/>
        </div>
        <div v-if="! sub_edit_flag.some(Boolean)">
            <button @click="addMask">+ {{ $t("common.group_search") }}</button>
            <button @click="toggleJSON">J</button>
            <button @click="cancelEdit">{{ $t("common.cancel") }}</button>
            <button @click="saveEdit">{{ $t("common.save") }}</button>
        </div>
        <div v-else>
            <button @click="addMask">+ {{ $t("common.group_search") }}</button>
            <button @click="toggleJSON" disabled>J</button>
            <button @click="cancelEdit">{{ $t("common.cancel") }}</button>
            <button @click="saveEdit" disabled>{{ $t("common.save") }}</button>
        </div>
    </div>
</div>
<div v-else>
    <p>{{ name }}</p>
    <button @click="startEdit">{{ $t("common.edit") }}</button>
    {{ $t("common.remove") }}:<input v-model="delete_toggle" type="checkbox"/>
    <button v-if="delete_toggle" @click="remove">{{ $t("common.confirm_remove") + " " + $t("common.item_search") }}</button>
</div>
</template>

<style>

.json_is_block {
    width: 625px;
    height: 150px;
}
.edit_is_block {
    width: 625px;
}
.mask {
    border: 3px solid #7AA2E3;
    margin-bottom: 3px;
}
.item_search_edit {
    background-color: #6AD4DD;
}

</style>