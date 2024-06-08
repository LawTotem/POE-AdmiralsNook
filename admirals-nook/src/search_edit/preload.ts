import { contextBridge, ipcRenderer } from "electron";
import { SearchEditInterface } from "./searchedit";
import { InventorySearch, ItemSearch } from "../utils/item_search";

contextBridge.exposeInMainWorld(
    'searchedit_access', {
        async get_search() {
            const s_obj = await ipcRenderer.invoke('fetchSearch')
            return s_obj
        },
        async save_search(srch : object) {
            return await ipcRenderer.invoke('saveSearch', srch)
        },
        async copy_board(text : string) {
            return await ipcRenderer.invoke('copyBoard', text)
        },
        async paste_board() {
            return await ipcRenderer.invoke('pasteBoard')
        }
    }
)