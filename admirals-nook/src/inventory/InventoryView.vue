<script lang="ts">

import { Item, TabFetch } from "../utils/stash"
import { InventorySearch } from "../utils/item_search"
import { parseMod, joinMods } from "../mod_search/modparse"
import { InventoryViewInterface } from "./inventoryview"
import { globalShortcut } from "electron"

declare global {
    interface Window {
        inventoryview_access : InventoryViewInterface
    }
}

class tab_option {
    text : string
    value : string
}

export default {
    data() {
        return {
            tab : 0,
            tab_titles: [] as Array< [Number,String] >,
            fetch: false,
            grab: false,
            processing: false,
            url: "",
            grab_string: "",
            items : [] as Array<Item>,
            match_strs: [] as Array<String>,
            search : null as InventorySearch | null
        }
    },
    created() {
        this.reloadSearch()
        window.inventoryview_access.get_setting("dump_tab_0", 0).then(data => {
            this.tab = data as number
        })
    },
    methods: {
        reloadSearch() {
            window.inventoryview_access.get_searches().then((srch) => {
                this.search = srch
            })
        },
        urlTab() {
            window.inventoryview_access.fetch_url(this.tab).then((s_url) => {
                this.url = s_url
            })
            this.grab = true
        },
        parseGrab() {
            this.processing = true
            window.inventoryview_access.get_searches().then((srch) => {
                try
                {
                    this.search = srch
                    const a = new TabFetch().dejson(JSON.parse(this.grab_string))
                    this.items = a.items
                    this.tab_titles = a.tabs.map(b => [b.i, b.n])
                    this.processing = false
                    this.grab = false
                }
                catch
                {
                    this.processing = false
                    this.items = []
                }
            })
        },
        loadTab() {
            this.items = [] as Array<Item>
            var grab = -1
            if (this.tab_num == 0)
            {
                grab = this.tab_0 as number
            }
            else if (this.tab_num == 1)
            {
                grab = this.tab_1 as number
            }
            else if (this.tab_num == 2)
            {
                grab = this.tab_2 as number
            }
            else if (this.tab_num == 3)
            {
                grab = this.tab_3 as number
            }
            if (grab != -1)
            {
                window.inventoryview_access.fetch_tab(grab).then(items =>{
                    this.items = items
                })
            }
        },
        matches(srch : InventorySearch, itm : Item) : Array<string> {
            if (this.search != null)
            {
                const exp = joinMods(itm.explicitMods.map(m => {return parseMod(m)}))
                const imp = joinMods(itm.implicitMods.map(m => {return parseMod(m)}))
                const frac = joinMods(itm.fracturedMods.map(m => {return parseMod(m)}))
                return srch.matches(itm, imp, exp, frac)
            }
            return []
        },
        copyLink() {
            window.inventoryview_access.copy_board(this.url)
        },
        pasteInventory() {
            window.inventoryview_access.paste_board().then(v => this.grab_string = v)
        },
        clearInventory() {
            this.grab_string = "{}"
        },
        clickItem(itm : Object, event : Event) {
            window.inventoryview_access.show_item(JSON.parse(JSON.stringify(itm)))
            event.preventDefault()
        }
    },
    watch : {
        items(new_value : Array<Item>) {
            if (this.search != null)
            {
                const srch = new InventorySearch().dejson(this.search)
                this.match_strs = new_value.map((a) => this.matches(srch,a).join())
            }
        }
    }
}
</script>

<template>
    <div v-if="grab">
        <button @click="copyLink()">{{ $t("common.copy") }}</button>
        <p>{{ url }}</p>
        <div><textarea class="json_inv" v-model="grab_string"></textarea></div>
        <button @click="clearInventory()">{{ $t("common.clear") }}</button>
        <button @click="pasteInventory()">{{ $t("common.paste") }}</button>
        <button @click="parseGrab()">Done</button>
        <span v-if="processing">{{ $t("common.processing") }}</span>
    </div>
    <div v-else>
        <button @click="urlTab()">{{ $t("common.load_tabs") }}</button>
        <select v-if="tab_titles.length != 0" v-model="tab">
            <option v-for="t in tab_titles" :value="t[0]">
                {{ t[1] + " [" + t[0].toString() + "]"}}
            </option>
        </select>
        <div style="width:500px; height:500px; position: relative;">
            <!--<ItemSmall v-for="it in item_strs.length" color="red" :item_obj="item_strs[it]" :wdx="20" :x="item_strs[it].x" :y="item_strs[it].y" /> -->
            <ItemSmall v-for="(item,i_ind) in items" :matches="match_strs[i_ind]" :item_obj="item" :wdx="20" :x="item.x" :y="item.y" @click="clickItem(item.rejson(), $event)"/>
        </div>
    </div>
</template>

<style>
.json_inv {
    width: 600px;
    height: 390px;
    background-color: #F8F6E3;
}
body {
    background-color: #b7ebe8;
}
</style>