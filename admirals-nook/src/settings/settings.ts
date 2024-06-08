import { TabTitle, Item } from "../utils/stash";
import { JSONable, getProperty } from "../utils/jsonable"
import { InventorySearch } from "../utils/item_search";

export type ANSettingsType = string | number | boolean;

export class ANSettings implements JSONable<ANSettings> {
    league : string
    account_name : string
    fetch: boolean
    poesessid : string
    search_filename : string
    dump_tab_0 : number
    dump_tab_1 : number
    dump_tab_2 : number
    dump_tab_3 : number
    constructor() {
        this.league = "Ancestor"
        this.account_name = ""
        this.fetch = false
        this.poesessid = ""
        this.search_filename = ""
        this.dump_tab_0 = -1
        this.dump_tab_1 = -1
        this.dump_tab_2 = -1
        this.dump_tab_3 = -1
    }
    set(key : keyof ANSettings, value : ANSettingsType) {
        if (key == 'league') {
            this.league = value as string
        }
        if (key == 'account_name') {
            this.account_name = value as string
        }
        if (key == 'fetch') {
            this.fetch = value as boolean
        }
        if (key == 'poesessid') {
            this.poesessid = value as string
        }
        if (key == 'dump_tab_0') {
            this.dump_tab_0 = value as number
        }
        if (key == 'dump_tab_1') {
            this.dump_tab_1 = value as number
        }
        if (key == 'dump_tab_2') {
            this.dump_tab_2 = value as number
        }
        if (key == 'dump_tab_3') {
            this.dump_tab_3 = value as number
        }
        if (key == 'search_filename') {
            this.search_filename = value as string
        }
    }
    dejson(input : object) : ANSettings {
        this.league = getProperty(input, 'league', "League") as string
        this.account_name = getProperty(input, 'account_name',"AccountName") as string
        this.fetch = getProperty(input, 'fetch', false) as boolean
        this.poesessid = getProperty(input, 'poesessid', "") as string
        this.search_filename = getProperty(input, 'search_filename', "") as string
        this.dump_tab_0 = getProperty(input, 'dump_tab_0', -1) as number
        this.dump_tab_1 = getProperty(input, 'dump_tab_1', -1) as number
        this.dump_tab_2 = getProperty(input, 'dump_tab_2', -1) as number
        this.dump_tab_3 = getProperty(input, 'dump_tab_3', -1) as number
        return this
    }
    rejson() : object {
        return {
            league : this.league,
            account_name : this.account_name,
            fetch: this.fetch,
            poesessid : this.poesessid,
            search_filename : this.search_filename,
            dump_tab_0: this.dump_tab_0,
            dump_tab_1: this.dump_tab_1,
            dump_tab_2: this.dump_tab_2,
            dump_tab_3: this.dump_tab_3
        }
    }
}

export declare interface SettingsInterface {
    get_setting : (n: string, v : ANSettingsType) => Promise<ANSettingsType>,
    set_setting : (n: string, v : ANSettingsType) => Promise<void>,
    encrypt_string : (n : string) => Promise<string>,
    get_tabs : () => Promise<Array<TabTitle>>,
    get_items : () => Promise<Array<Item>>,
    get_searches : () => Promise<InventorySearch>,
}
