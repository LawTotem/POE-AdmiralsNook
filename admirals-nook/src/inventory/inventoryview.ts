import { Item } from "../utils/stash"
import { InventorySearch } from "../utils/item_search"
import { ANSettingsType } from "../settings/settings"

export declare interface InventoryViewInterface {
    get_searches : () => Promise<InventorySearch>,
    fetch_tab : (n: number) => Promise<Array<Item>>,
    get_setting : (n: string, v : ANSettingsType) => Promise<ANSettingsType>,
    fetch_url : (n: number) => Promise<String>,
    copy_board : (text : string) => Promise<void>,
    paste_board : () => Promise<string>,
    show_item : (item : Object) => Promise<void>
}