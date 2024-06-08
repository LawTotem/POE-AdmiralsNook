import { contextBridge, ipcRenderer } from "electron";
import { ItemViewInterface } from "./itemview";

import { Item } from "../utils/stash"

contextBridge.exposeInMainWorld(
    'itemview_access',
    {
        fetch_key : () => process.argv.slice(-1)[0],
        async fetch_item(key : string) : Promise<Item> {
            const item_s = await ipcRenderer.invoke("fetchItem", key) as object
            try {
                const item = new Item().dejson(item_s)
                return item
            }
            catch
            
            {
                const item = new Item()
                return item
            }
        }
    } as ItemViewInterface
)