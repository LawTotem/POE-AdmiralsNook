<script lang="ts">
import { SearchEditInterface } from './searchedit'
import { ItemSearch, ItemQuery, Mask, InventorySearch } from '../utils/item_search'

import mod_defs from '../mod_search/mods.json'

declare global {
    interface Window {
        searchedit_access : SearchEditInterface
    }
}

export default {
    data () {
        return {
            inventory_search: new InventorySearch(),
            all_mods: mod_defs.mods.map(a => a.name),
            edit_flag: false,
            sub_edit_flag: [] as Array<boolean>,
            json_flag: false,
            searches: [] as Array<ItemSearch>,
            json_string: ""
        }
    },
    created() {
        window.searchedit_access.get_search().then((data : InventorySearch) => {
            this.inventory_search = new InventorySearch().dejson(data)
            this.searches = this.inventory_search.searches
            this.sub_edit_flag = this.searches.map(() => false)
        })
    },
    methods: {
        toggleJSON() {
            if (this.json_flag) {
                try
                {
                    const parse = JSON.parse(this.json_string)
                    const iq = new InventorySearch().dejson(parse)
                    this.searches = iq.searches
                    this.sub_edit_flag = this.searches.map(() => false)
                    this.json_flag = false
                }
                catch
                {}
            }
            else
            {
                const iq = new InventorySearch()
                iq.searches = this.searches
                this.json_string = JSON.stringify(iq.rejson(), null, 2)
                this.json_flag = true
            }
        },
        cancelEdit() {
            const iq = new InventorySearch().dejson(this.inventory_search)
            this.searches = iq.searches
            this.sub_edit_flag = this.searches.map(() => false)
            this.edit_flag = false
        },
        startEdit() {
            this.edit_flag = true
        },
        saveEdit() {
            const iq = new InventorySearch()
            iq.searches = this.searches
            window.searchedit_access.save_search(iq.rejson())
            this.edit_flag = false
        },
        addSearch() {
            this.searches.push(new ItemSearch())
            this.sub_edit_flag.push(false)
        },
        saveSearch(slot : number, s_obj : object) {
            this.searches[slot] = new ItemSearch().dejson(s_obj)
            this.sub_edit_flag[slot] = false
        },
        setSearchEdit(slot : number, value : boolean) {
            this.sub_edit_flag[slot] = value
        },
        removeSearch(slot : number) {
            this.searches.splice(slot, 1)
            this.sub_edit_flag.splice(slot, 1)
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
}
</script>

<template>
<div v-if="edit_flag" class="search_editing">
    <div v-if="json_flag">
        <textarea class="json_inv_block" v-model="json_string"></textarea>
        <p>
        <button @click="toggleJSON">J</button>
        <button @click="clearJSON">{{ $t("common.clear") }}</button>
        <button @click="copyJSON">{{ $t("common.copy") }}</button>
        <button @click="pasteJSON">{{ $t("common.paste") }}</button>
        </p>
    </div>
    <div class="edit_inv_block" v-else>
        <div class="item_search" v-for="(s, t_ind) in searches">
            <ItemSearchEdit :item_search_obj="s" :item_search_slot="t_ind" :all_mods="all_mods" @save-item-search="saveSearch" @remove-item-search="removeSearch" @set-item-edit="setSearchEdit"></ItemSearchEdit>
        </div>
        <div v-if="! sub_edit_flag.some(Boolean)">
            <button @click="toggleJSON">J</button>
            <button @click="addSearch">+ {{ $t("common.item_search") }}</button>
            <button @click="cancelEdit">{{ $t("common.cancel") }}</button>
            <button @click="saveEdit">{{ $t("common.save") }}</button>
        </div>
        <div v-else>
            <button @click="toggleJSON" disabled>J</button>
            <button @click="addSearch" disabled>+ {{ $t("common.item_search") }}</button>
            <button @click="cancelEdit">{{ $t("common.cancel") }}</button>
            <button @click="saveEdit" disabled>{{ $t("common.save") }}</button>
        </div>
    </div>
</div>
<div v-else>
    <div v-for="s in searches">
        {{ s.name }}
    </div>
    <button @click="startEdit">{{ $t("common.edit") }}</button>
</div>
</template>

<style>
body {
  background-color: #b7ebe8; /* Light teal */
}

.json_inv_block {
    width: 625px;
    height: 400px;
}
.edit_inv_block {
    width: 650px;
}
.item_search {
    border: 3px solid #6AD4DD;
    margin-bottom: 3px;
}
textarea,
input {
  background-color: #f1de91; /* Sandy beige */
}
</style>
