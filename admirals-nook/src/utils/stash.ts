import { JSONable, getProperty } from "./jsonable";

export type tabtype_type = 
    'NormalStash' |
    'PremiumStash' |
    'QuadStash' |
    'CurrencyStash' |
    'MapStash' |
    'FragmentStash' |
    'DivinationCardStash' |
    'EssenceStash' |
    'Unknown'
export const tabtype_list = [
    'NormalStash',
    'PremiumStash',
    'QuadStash',
    'CurrencyStash',
    'MapStash',
    'FragmentStash',
    'DivinationCardStash',
    'EssenceStash'
]

export class TabTitle implements JSONable<TabTitle> {
    n : string
    i : number
    id : string
    type: tabtype_type
    selected : boolean
    color : [number, number, number]
    src_l : string
    src_c : string
    src_r : string
    constructor() {
        this.n = ""
        this.i = -1
        this.id = ""
        this.type = 'NormalStash'
        this.selected = false
        this.color = [0,0,0]
        this.src_l = ""
        this.src_c = ""
        this.src_r = ""
    }
    dejson(input : object) : TabTitle {
        this.n = getProperty(input, "n", "") as string
        this.i = getProperty(input, "i", -1) as number
        this.id = getProperty(input, "id", "") as string
        const ttype = getProperty(input, "type", "") as string
        if (tabtype_list.includes(ttype))
        {
            this.type = ttype as tabtype_type
        }
        else
        {
            console.warn('Unknown tab type [' + ttype + ']')
            this.type = 'Unknown'
        }
        this.selected = getProperty(input, "selected", false) as boolean
        if (input.hasOwnProperty('colour'))
        {
            const cc = input['colour' as keyof typeof input]
            this.color = [
                getProperty(cc, "r", 0) as number,
                getProperty(cc, "g", 0) as number,
                getProperty(cc, "b", 0) as number
            ]
        }
        this.src_l = getProperty(input, "srcL", "") as string
        this.src_c = getProperty(input, "srcC", "") as string
        this.src_r = getProperty(input, "srcR", "") as string
        return this
    }
    rejson() : object {
        return {
            n : this.n,
            i : this.i,
            id : this.id,
            type: this.type as string,
            selected : this.selected,
            colour : {
                r : this.color[0],
                g : this.color[1],
                b : this.color[2]
            },
            srcL : this.src_l,
            srcC : this.src_c,
            srcR : this.src_r
        }
    }
}

export type socketattr_type =
    'S' | // Strength
    'D' | // Dexterity
    'I' | // Intelligence
    'A' | // Abyss
    'G' | // ? (white)
    'U'

export const socketattr_list = [
    'S',
    'D',
    'I',
    'A',
    'G',
    'U'
]

export type socketcolor_type =
    'R' | // Strength
    'G' | // Green
    'B' | // Blue
    'A' | // Abyss
    'W' | // White
    'U'

export const socketcolor_list = [
    'R',
    'G',
    'B',
    'A',
    'W',
    'U'
]

export class SocketInfo implements JSONable<SocketInfo> {
    group : number
    attr : socketattr_type
    sColour : socketcolor_type
    constructor() {
        this.group = 0
        this.attr = 'U'
        this.sColour = 'U'
    }
    dejson(input : object) : SocketInfo {
        this.group = getProperty(input, "group", 0) as number
        const tattr = getProperty(input, "attr", 'U') as string
        if (socketattr_list.includes(tattr))
        {
            this.attr = tattr as socketattr_type
        }
        else
        {
            console.warn("Unexpected socket attribute [" + tattr + "]")
            this.attr = 'U'
        }
        const tcolor = getProperty(input, "sColour", 'U') as string
        if (socketcolor_list.includes(tcolor))
        {
            this.sColour = tcolor as socketcolor_type
        }
        else
        {
            console.warn("Unexpected socket color [" + tcolor + "]")
            this.sColour = 'U'
        }
        return this
    }
    rejson() : object {
        return {
            group : this.group,
            attr : this.attr,
            sColour : this.sColour
        }
    }
}

export class ItemProperty implements JSONable<ItemProperty> {
    name : string
    values : Array<[string, number]>
    displayMode : number
    type : number
    constructor() {
        this.name = ""
        this.values = []
        this.displayMode = -1
        this.type = -1
    }
    dejson(input : object) : ItemProperty {
        this.name = getProperty(input, "name", "") as string
        this.values = []
        if (input.hasOwnProperty("values"))
        {
            const tv = input["values" as keyof typeof input] as Array<[string, number]>
            this.values = tv
        }
        this.displayMode = getProperty(input, "displayMode", -1) as number
        this.type = getProperty(input, "type", -1) as number
        return this
    }
    rejson() : object {
        return {
            name : this.name,
            displayMode : this.displayMode,
            values : this.values,
            type : this.type
        }
    }
}

export class ItemRequirement implements JSONable<ItemRequirement> {
    name : string // If there is {0} then you look to the zero'th argument
    values : Array<[string, number]>
    displayMode : number // 0 means Requires {name} {value} ?
                         // 1 ? Str 95
                         // 3 means parse name?
    type : number
    constructor() {
        this.name = ""
        this.values = []
        this.displayMode = -1
        this.type = -1
    }
    dejson(input : object) : ItemRequirement {
        this.name = getProperty(input, "name", "") as string
        this.values = []
        if (input.hasOwnProperty("values"))
        {
            const tv = input["values" as keyof typeof input] as Array<[string, number]>
            this.values = tv
        }
        this.displayMode = getProperty(input, "displayMode", -1) as number
        this.type = getProperty(input, "type", -1) as number
        return this
    }
    rejson() : object {
        return {
            name : this.name,
            displayMode : this.displayMode,
            values : this.values,
            type : this.type
        }
    }
}

export class Item {
    verified : boolean
    w : number
    h : number
    icon : string
    league : string
    id : string
    fractured: boolean
    synthesized: boolean
    sockets : Array<SocketInfo>
    name : string
    typeLine : string
    baseType : string
    identified : boolean
    ilvl : number
    corrupted : boolean
    properties : Array<ItemProperty>
    requirements : Array<ItemRequirement>
    implicitMods : Array<string>
    explicitMods : Array<string>
    fracturedMods : Array<string>
    descrText : string // heist items had one
    secDescrText : string
    flavourText : Array<string>
    enchantMods : Array<string>
    frameType : number
    x : number
    y : number
    inventoryId : string
    //socketedItems : Array<>
    constructor() {
        this.verified = false
        this.w = -1
        this.h = -1
        this.icon = ""
        this.league = ""
        this.id = ""
        this.fractured = false
        this.synthesized = false
        this.sockets = []
        this.name = ""
        this.typeLine = ""
        this.baseType = ""
        this.identified = false
        this.ilvl = -1
        this.properties = []
        this.requirements = []
        this.implicitMods = []
        this.explicitMods = []
        this.fracturedMods = []
        this.descrText = ""
        this.secDescrText = ""
        this.flavourText = []
        this.enchantMods = []
        this.corrupted = false
        this.frameType = -1
            // 0 - Golden Brooch, Quicksilver
            // 1 - Magic Sulpher (magic)
            // 2 - (rare)
            // 3 - (unique)
            // 4 - (gem - e.g. Sunder)
            // 5 - currency?
        this.x = -1
        this.y = -1
        this.inventoryId = ""
        // incubatedItem
    }
    dejson(input : object) : Item {
        this.verified = getProperty(input, "verified", false) as boolean
        this.w = getProperty(input, "w", -1) as number
        this.h = getProperty(input, "h", -1) as number
        this.icon = getProperty(input, "icon", "") as string
        this.league = getProperty(input, "league", "") as string
        this.id = getProperty(input, "id", "") as string
        this.fractured = getProperty(input, "fractured", false) as boolean
        this.synthesized = getProperty(input, "synthesised", false) as boolean
        this.sockets = []
        if (input.hasOwnProperty("sockets"))
        {
            const st = input["sockets" as keyof typeof input] as Array<object>
            for (var tval of st)
            {
                this.sockets.push(new SocketInfo().dejson(tval))
            }
        }
        this.name = getProperty(input, "name", "") as string
        this.typeLine = getProperty(input, "typeLine", "") as string
        this.baseType = getProperty(input, "baseType", "") as string
        this.identified = getProperty(input, "identified", false) as boolean
        this.ilvl = getProperty(input, "ilvl", -1) as number
        this.corrupted = getProperty(input, "corrupted", false) as boolean
        this.properties = []
        if (input.hasOwnProperty("properties"))
        {
            const pt = input["properties" as keyof typeof input] as Array<object>
            for (var tval of pt)
            {
                this.properties.push(new ItemProperty().dejson(tval))
            }
        }
        this.requirements = []
        if (input.hasOwnProperty("requirements"))
        {
            const rt = input["requirements" as keyof typeof input] as Array<object>
            for (var tval of rt)
            {
                this.requirements.push(new ItemRequirement().dejson(tval))
            }
        }
        this.enchantMods = []
        if (input.hasOwnProperty("enchantMods"))
        {
            const enc = input["enchantMods" as keyof typeof input] as Array<string>
            this.enchantMods = enc
        }
        this.implicitMods = []
        if (input.hasOwnProperty("implicitMods"))
        {
            const imt = input["implicitMods" as keyof typeof input] as Array<string>
            this.implicitMods = imt
        }
        this.explicitMods = []
        if (input.hasOwnProperty("explicitMods"))
        {
            const emt = input["explicitMods" as keyof typeof input] as Array<string>
            this.explicitMods = emt
        }
        this.fracturedMods = []
        if (input.hasOwnProperty("fracturedMods"))
        {
            const emt = input["fracturedMods" as keyof typeof input] as Array<string>
            this.fracturedMods = emt
        }
        this.descrText = getProperty(input, "descrText", "") as string
        this.secDescrText = getProperty(input, "secDescrText", "") as string
        this.flavourText = []
        if (input.hasOwnProperty("flavourText"))
        {
            const ftt = input["flavourText" as keyof typeof input] as Array<string>
            this.flavourText = ftt
        }
        this.frameType = getProperty(input, "frameType", -1) as number
        this.x = getProperty(input, "x", -1) as number
        this.y = getProperty(input, "y", -1) as number
        this.inventoryId = getProperty(input, "inventoryId", "") as string
        return this
    }
    rejson() : object {
        return {
            verified: this.verified,
            w: this.w,
            h: this.h,
            icon: this.icon,
            league: this.league,
            id: this.id,
            fractured: this.fractured,
            synthesized: this.synthesized,
            sockets: this.sockets.map(v => v.rejson()),
            name: this.name,
            typeLine: this.typeLine,
            baseType: this.baseType,
            identified: this.identified,
            ilvl: this.ilvl,
            corrupted: this.corrupted,
            properties: this.properties.map(v => v.rejson()),
            requirements: this.requirements.map(v => v.rejson()),
            implicitMods: this.implicitMods,
            explicitMods: this.explicitMods,
            fracturedMods: this.fracturedMods,
            descrText: this.descrText,
            secDescrText: this.secDescrText,
            flavourText: this.flavourText,
            frameType: this.frameType,
            x: this.x,
            y: this.y,
            inventoryId: this.inventoryId
        }
    }
}

export class TabFetch implements JSONable<TabFetch> {
    numTabs : number
    tabs : Array<TabTitle>
    items : Array<Item>
    constructor() {
        this.numTabs = 0
        this.tabs = []
        this.items = []
    }
    dejson(input : object) : TabFetch {
        this.numTabs = getProperty(input, "numTabs", 0) as number
        this.tabs = []
        if (input.hasOwnProperty('tabs'))
        {
            const ttabs = input['tabs' as keyof typeof input] as Array<object>
            for (var tval of ttabs)
            {
                this.tabs.push(new TabTitle().dejson(tval))
            }
        }
        this.items = []
        if (input.hasOwnProperty('items'))
        {
            const titems = input['items' as keyof typeof input] as Array<object>
            for (var tval of titems)
            {
                this.items.push(new Item().dejson(tval))
            }
        }
        return this
    }
    rejson() : object {
        return {
            numTabs : this.numTabs,
            tabs : this.tabs.map(i => i.rejson()),
            items : this.items.map(i => i.rejson())
        }
    }
}