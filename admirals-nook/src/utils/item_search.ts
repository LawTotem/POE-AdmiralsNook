import { JSONable, getProperty } from "./jsonable"

import { Item } from './stash'

export type querytype_type =
    'BaseType' |
    'Corrupt' |
    'Synthesized' |
    'Fractured' |
    'AnyMod' |
    'FracturedMod' |
    'ExplicitMod' |
    'ImplicitMod' |
    'Unknown'

export const querytype_list = [
    'BaseType',
    'Corrupt',
    'Synthesized',
    'Fractured',
    'AnyMod',
    'FracturedMod',
    'ExplicitMod',
    'ImplicitMod'
]

export class ItemQuery implements JSONable<ItemQuery> {
    THIS_VERSION = "eH61ga"
    version : string
    type : querytype_type
    match : string
    check_max : boolean
    value_max : number
    check_min : boolean
    value_min : number

    constructor() {
        this.version = this.THIS_VERSION
        this.type = 'Unknown'
        this.match = ''
        this.check_max = false
        this.check_min = false
        this.value_max = 0
        this.value_min = 0
    }
    
    checkMod(mod_list : Map<string, number>) : boolean {
        if (mod_list.has(this.match))
        {
            var rvalue = true
            const value = mod_list.get(this.match)
            if (this.check_max)
            {
                if (value > this.value_max)
                {
                    rvalue = false
                }
            }
            if (this.check_min)
            {
                if (value < this.value_min)
                {
                    rvalue = false
                }
            }
            return rvalue
        }
        return false
    }
    matches(item : Item, implicits : Map<string, number>, explicits : Map<string, number>, fractures : Map<string, number>) : boolean {
        if (this.type == 'BaseType')
        {
            return (item.baseType == this.match)
        }
        if (this.type == 'Corrupt')
        {
            if (this.match == 'False' || this.match == 'false')
            {
                return ! item.corrupted
            }
            return item.corrupted
        }
        if (this.type == 'Synthesized')
        {
            if (this.match == 'False' || this.match == 'false')
            {
                return ! item.synthesized
            }
            return item.synthesized
        }
        if (this.type == 'Fractured')
        {
            if (this.match == 'False' || this.match == 'false')
            {
                return ! item.fractured
            }
            return item.fractured
        }
        if (this.type == 'AnyMod')
        {
            if (this.checkMod(explicits))
            {
                return true
            }
            if (this.checkMod(implicits))
            {
                return true
            }
            return this.checkMod(fractures)
        }
        if (this.type == 'ImplicitMod')
        {
            return this.checkMod(implicits)
        }
        if (this.type == 'FracturedMod')
        {
            return this.checkMod(fractures)
        }
        if (this.type == 'ExplicitMod')
        {
            if (this.checkMod(explicits))
            {
                return true
            }
            return this.checkMod(fractures)
        }
        console.warn('Query was not of known type [' + this.type + ']')
        return false
    }
    dejson(input : object) : ItemQuery {
        this.version = getProperty(input, 'version', '') as string
        if (this.version != this.THIS_VERSION)
        {
            console.warn('Invalid Version [' + this.version + ']')
        }
        const temp_type = getProperty(input, 'type', 'Unknown') as string
        if (querytype_list.includes(temp_type))
        {
            this.type = temp_type as querytype_type
        }
        else
        {
            console.warn('Invalid Type [' + temp_type + ']')
            this.type = 'Unknown'
        }
        this.match = getProperty(input, 'match', '') as string
        this.check_max = getProperty(input, 'check_max', false) as boolean
        if (this.check_max)
        {
            this.value_max = getProperty(input, 'value_max', 0.0) as number
        }
        this.check_min = getProperty(input, 'check_min', false) as boolean
        if (this.check_min)
        {
            this.value_min = getProperty(input, 'value_min', 0.0) as number
        }
        return this
    }
    rejson() : object {
        var rvalue = {
            version : this.version,
            type : this.type,
            match : this.match,
            check_max : this.check_max,
            check_min : this.check_min,
            value_max : this.value_max,
            value_min : this.value_min
        } as object
        return rvalue
    }
}

export type masktype_type = 
    'GroupAnd' |
    'GroupCount' |
    'GroupNot' |
    'Unknown'
export const masktype_list = [
    'GroupAnd',
    'GroupCount',
    'GroupNot',
]

export class Mask implements JSONable<Mask> {
    THIS_VERSION = "yVTBmr"
    version : string
    name : string
    type : masktype_type
    queries : Array<ItemQuery>
    check_max : boolean
    check_min : boolean
    value_max : number
    value_min : number
    active : boolean
    constructor() {
        this.version = this.THIS_VERSION
        this.name = ''
        this.type = 'Unknown'
        this.queries = []
        this.check_max = false
        this.check_min = false
        this.value_max = 0
        this.value_min = 0
        this.active = true
    }
    matches(item : Item, implicits : Map<string, number>, explicits : Map<string, number>, fractures : Map<string, number>) : boolean {
        if (!this.active)
        {
            return false
        }
        const queries = this.queries.map(v => v.matches(item, implicits, explicits, fractures))
        if (this.type == 'GroupAnd') {
            return ! queries.includes(false)
        }
        if (this.type == 'GroupNot')
        {
            return queries.includes(false)
        }
        if (this.type == 'GroupCount')
        {
            var rvalue = true
            var cnt = 0
            for (var v of queries)
            {
                if (v)
                {
                    cnt = cnt + 1
                }
                
            }
            if (this.check_max)
            {
                if (cnt > this.value_max)
                {
                    rvalue = false
                }
            }
            if (this.check_min)
            {
                if (cnt < this.value_min)
                {
                    rvalue = false
                }
            }
            return rvalue
        }
        console.warn('Invalid type [' + this.type + ']')
        return false
    }
    dejson(input : object) : Mask {
        this.version = getProperty(input, "version", "") as string
        if (this.version != this.THIS_VERSION)
        {
            console.warn("Invalid version [" + this.version + "]")
        }
        
        this.name = getProperty(input, "name", "") as string
        const temp_type = getProperty(input, "type", "Unknown") as string
        if (masktype_list.includes(temp_type)) {
            this.type = temp_type as masktype_type
        }
        else
        {
            console.warn("Invalid typ [" + temp_type + "]")
            this.type = "Unknown"
        }
        this.queries = []
        if (input.hasOwnProperty("queries"))
        {
            const qt = input["queries" as keyof typeof input] as Array<object>
            for (var q of qt)
            {
                this.queries.push(new ItemQuery().dejson(q))
            }
        }
        this.check_max = getProperty(input, "check_max", false) as boolean
        this.check_min = getProperty(input, "check_min", false) as boolean
        this.value_max = getProperty(input, "value_max", 0) as number
        this.value_min = getProperty(input, "value_min", 0) as number
        this.active = getProperty(input, "active", false) as boolean
        return this
    }
    rejson() : object {
        return {
            version : this.version,
            name : this.name,
            type : this.type,
            queries : this.queries.map(v => v.rejson()),
            check_max : this.check_max,
            check_min : this.check_min,
            value_max : this.value_min,
            value_min : this.value_min,
            active : this.active
        }
    }

}

export class ItemSearch implements JSONable<ItemSearch> {
    THIS_VERSION = "IWksle"
    version : string
    name : string
    masks : Array<Mask>
    constructor() {
        this.version = this.THIS_VERSION
        this.name = ""
        this.masks = [] as Array<Mask>
    }
    matches(item : Item, implicits : Map<string, number>, explicits : Map<string, number>, fractures : Map<string, number>) : boolean {
        const imasks = this.masks.map(m => m.matches(item, implicits, explicits, fractures))
        return ! imasks.includes(false)
    }
    dejson(input : object) : ItemSearch {
        this.version = getProperty(input, "version", "") as string
        if (this.version != this.THIS_VERSION)
        {
            console.warn("Invalid version [" + this.version + "]")
        }
        this.name = getProperty(input, "name", "") as string
        this.masks = [] as Array<Mask>
        if (input.hasOwnProperty("masks")) {
            const mt = input["masks" as keyof typeof input] as Array<object>
            for (var m of mt)
            {
                this.masks.push(new Mask().dejson(m))
            }
        }
        return this
    }
    rejson() : object {
        return {
            version : this.version,
            name: this.name,
            masks : this.masks.map(m => m.rejson())
        }
    }
}

export class InventorySearch implements JSONable<InventorySearch> {
    THIS_VERSION = "VNUQTi"
    version : string
    searches : Array<ItemSearch>
    constructor() {
        this.version = this.THIS_VERSION
        this.searches = []
    }
    matches(item : Item, implicits : Map<string, number>, explicits : Map<string, number>, fractures : Map<string, number>) : Array<string> {
        const imasks = this.searches.filter(m => m.matches(item, implicits, explicits, fractures))
        return imasks.map(i => i.name)
    }
    dejson(input : object) : InventorySearch {
        this.version = getProperty(input, "version", "") as string
        if (this.version != this.THIS_VERSION)
        {
            console.warn("Invalid version [" + this.version + "]")
        }
        this.searches = []
        if (input.hasOwnProperty("searches")) {
            const mt = input["searches" as keyof typeof input] as Array<object>
            for (var m of mt)
            {
                this.searches.push(new ItemSearch().dejson(m))
            }
        }
        return this
    }
    rejson() : object {
        return {
            version : this.version,
            searches : this.searches.map(m => m.rejson())
        }
    }
}