import { contextBridge, ipcRenderer } from "electron";

import { InventorySearch } from "../utils/item_search";

export declare interface SearchEditInterface {
    get_search : () => Promise<object>,
    save_search : (search : object) => Promise<void>,
    copy_board : (text : string) => Promise<void>,
    paste_board : () => Promise<string>
}