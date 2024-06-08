import { contextBridge, ipcRenderer } from "electron";
import { SettingsInterface } from "./settings";
import { TabFetch } from "../utils/stash";
import { InventorySearch } from "../utils/item_search";

contextBridge.exposeInMainWorld(
  'settings_access',
  {
    async get_setting(name : string, default_value : string | number | boolean) {
        return ipcRenderer.invoke("getSetting", [name, default_value])
    },
    async set_setting(name : string, value : string | number | boolean) {
        return ipcRenderer.invoke("setSetting", [name, value])
    },
    async encrypt_string(string : string) {
        return ipcRenderer.invoke("encryptString", string)
    },
    async get_tabs() {
      try
      {
        const tab_0_s = await ipcRenderer.invoke("fetchTab", 0) as string
        const tab_0 = new TabFetch().dejson(JSON.parse(tab_0_s))
        return tab_0.tabs
      }
      catch
      {
        const tab_0 = new TabFetch()
        return tab_0.tabs
      }
    },
    async get_items() {
      try
      {
        const tab_0_s = await ipcRenderer.invoke("fetchTab", 0) as string
        const tab_0 = new TabFetch().dejson(JSON.parse(tab_0_s))
        return tab_0.items
      }
      catch
      {
        const tab_0 = new TabFetch()
        return tab_0.items
      }
    }
  } as SettingsInterface
)