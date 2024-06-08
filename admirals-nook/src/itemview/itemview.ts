import { Item } from "../utils/stash"

export declare interface ItemViewInterface {
    fetch_key : () => string,
    fetch_item : (key : string) => Promise<Item>
}
