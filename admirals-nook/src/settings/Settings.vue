<script lang="ts">

import { TabTitle, Item } from "../utils/stash"
import { SettingsInterface } from "./settings"
import { InventorySearch } from "../utils/item_search"
import { parseMod, joinMods } from '../mod_search/modparse'

declare global {
    interface Window {
        settings_access : SettingsInterface
    }
}

class tab_option {
    text : string
    value : string
}

export default {
    data() {
        return {
            league: "",
            account_name: "",
            fetch: false,
            poessesid: "",
            poesessid_e: "",
            search_filename: "",
            dump_tab_0: -1,
            dump_tab_1: -1,
            dump_tab_2: -1,
            dump_tab_3: -1,
            tab_names: [] as Array<tab_option>
        }
    },
    created() {
        window.settings_access.get_setting("league", "").then((data : string) =>{
            this.league = data
        })
        window.settings_access.get_setting("account_name", "").then((data : string) =>{
            this.account_name = data
        })
        window.settings_access.get_setting("fetch", false).then((data : boolean) => {
            this.fetch = data
        })
        window.settings_access.get_setting("poesessid", "").then((data : string) =>{
            this.poessid_e = data
        })
        window.settings_access.get_setting("dump_tab_0", -1).then((data : number) => {
            this.dump_tab_0 = data.toString()
        })
        window.settings_access.get_setting("dump_tab_1", -1).then((data : number) => {
            this.dump_tab_1 = data.toString()
        })
        window.settings_access.get_setting("dump_tab_2", -1).then((data : number) => {
            this.dump_tab_2 = data.toString()
        })
        window.settings_access.get_setting("dump_tab_3", -1).then((data : number) => {
            this.dump_tab_3 = data.toString()
        })
        window.settings_access.get_setting("search_filename", -1).then((data : string) => {
            this.search_filename = data.toString()
        })
        this.loadTabs()
    },
    methods: {
        save() {
            window.settings_access.set_setting("league", this.league)
            window.settings_access.set_setting("account_name", this.account_name)
            window.settings_access.set_setting("fetcH", this.fetch)
            if (this.poessesid)
            {
                window.settings_access.encrypt_string(this.poesessid).then(data => {
                    this.poesessid_e = data
                    window.settings_access.set_setting("poesessid", this.poesessid_e)
                })
                this.poessesid = ""
            }
            else
            {
                window.settings_access.set_setting("poesessid", this.poesessid_e)
            }
            window.settings_access.set_setting("dump_tab_0", Number(this.dump_tab_0))
            window.settings_access.set_setting("dump_tab_1", Number(this.dump_tab_1))
            window.settings_access.set_setting("dump_tab_2", Number(this.dump_tab_2))
            window.settings_access.set_setting("dump_tab_3", Number(this.dump_tab_3))
            window.settings_access.set_setting("search_filename", this.search_filename)
            this.loadTabs()
        },
        loadTabs() {
            window.settings_access.get_tabs().then((data : Array<TabTitle>) => {
                var tab_names : Array<tab_option> = []
                data.forEach(value => {
                    const opt = new tab_option()
                    opt.text = value.n
                    opt.value = value.i.toString()
                    tab_names.push(opt)
                })
                const last = new tab_option()
                last.text = "None"
                last.value = "-1"
                tab_names.push(last)
                this.tab_names = tab_names
                this.item_strs = []
            })
        }
    }
}
</script>

<template>
    <div id="common_setting">
        <h2>{{ $t("common.common_settings")}}</h2>
        <p>{{ $t("common.league") }} <input v-model="league"/></p>
        <p>{{ $t("common.accountname") }} <input v-model="account_name"/></p>
        <!--<p>{{ $t("common.auto_fetch") }} <input type="checkbox" v-model="fetch"/></p>-->
        <!--<p>{{ $t("common.poesessid") }} <input type="password" v-model="poessesid"/></p>-->
        <p>{{ $t("common.search_filename") }}: <input v-model="search_filename"/></p>
    </div>
    <div id="tabs">
        <div>
            <p>{{ $t("common.dumptab") }}: <input v-model="dump_tab_0"/></p>
            <!--<span>{{ $t("common.dumptab") }} - 0 </span>
            <select v-model="dump_tab_0">
                <option v-for="tab in tab_names" :value="tab.value">
                    {{ tab.text }}
                </option>
            </select>-->
        </div>
        <!--<div>
            <span>{{ $t("common.dumptab") }} - 1 </span>
            <select v-model="dump_tab_1">
                <option v-for="tab in tab_names" :value="tab.value">
                    {{ tab.text }}
                </option>
            </select>
        </div>
        <div>
            <span>{{ $t("common.dumptab") }} - 2 </span>
            <select v-model="dump_tab_2">
                <option v-for="tab in tab_names" :value="tab.value">
                    {{ tab.text }}
                </option>
            </select>
        </div>
        <div>
            <span>{{ $t("common.dumptab") }} - 3 </span>
            <select v-model="dump_tab_3">
                <option v-for="tab in tab_names" :value="tab.value">
                    {{ tab.text }}
                </option>
            </select>
        </div>-->
    </div>
    <button @click="save()">{{ $t("common.savesettings") }}</button>
</template>

<style lang="css">
</style>
