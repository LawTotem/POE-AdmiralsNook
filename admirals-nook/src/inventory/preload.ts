import { contextBridge, ipcRenderer } from "electron";
import { InventoryViewInterface } from "./inventoryview";
import { Item, TabFetch } from "../utils/stash";
import { InventorySearch } from "../utils/item_search";



contextBridge.exposeInMainWorld(
    'inventoryview_access',
    {
        async fetch_tab(n : number) : Promise<Array<Item>> {
            const tab_s = await ipcRenderer.invoke("fetchTab", n) as string
            try
            {
                const tab = new TabFetch().dejson(JSON.parse(tab_s))
                return tab.items
            }
            catch
            {
                const tab = new TabFetch()
                return tab.items
            }
        },
        async get_searches() : Promise<InventorySearch> {
            const s_ob = await ipcRenderer.invoke('fetchSearch') as object
            const ss = new InventorySearch().dejson(s_ob)
            return ss
        },
        async get_setting(name : string, default_value : string | number | boolean) {
            return ipcRenderer.invoke("getSetting", [name, default_value])
        },
        async fetch_url(tab : number) : Promise<String> {
            return await ipcRenderer.invoke('tabURL', tab)
        },
        async copy_board(text : string) {
            return await ipcRenderer.invoke('copyBoard', text)
        },
        async paste_board() {
            return await ipcRenderer.invoke('pasteBoard')
        },
        async show_item(item : Object) {
            return await ipcRenderer.invoke('showItemWindow', item)
        }
    } as InventoryViewInterface
)