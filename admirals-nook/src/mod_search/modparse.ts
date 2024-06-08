var peg = require('pegjs')

const base_rules = "pminteger = '+' digits:[0-9]+ { return parseInt(digits.join(\"\"), 10); }\n" +
                   "          / '-' digits:[0-9]+ { return -parseInt(digits.join(\"\"), 10); }\n" +
                   "\n" +
                   "pcntincdec = digits:[0-9]+ '% increased' { return parseInt(digits.join(\"\"), 10); }\n" +
                   "           / digits:[0-9]+ '% decreased' { return -parseInt(digits.join(\"\"), 10); }\n" +
                   "\n" +
                   "pcntincred = digits:[0-9]+ '% increased' { return parseInt(digits.join(\"\"), 10); }\n" +
                   "           / digits:[0-9]+ '% reduced' { return -parseInt(digits.join(\"\"), 10); }\n" +
                   "\n" +
                   "npcntincdec = digits:[0-9]+ '% decreased' { return parseInt(digits.join(\"\"), 10); }\n" +
                   "            / digits:[0-9]+ '% increased' { return -parseInt(digits.join(\"\"), 10); }\n" +
                   "\n" +
                   "npcntincred = digits:[0-9]+ '% reduced' { return parseInt(digits.join(\"\"), 10); }\n" +
                   "            / digits:[0-9]+ '% increased' { return -parseInt(digits.join(\"\"), 10); }\n" +
                   "\n" +
                   "integer = digits:[0-9]+ { return parseInt(digits.join(\"\"), 10); }\n" +
                   "\n" +
                   "float = digits:[0-9.]+ { return parseFloat(digits.join(\"\"), 10); }\n"

import mod_defs from './mods.json'

const rules = mod_defs.mods.map(a => {return peg.generate(a.rule + base_rules)})

export function parseMod(mod : string) {
    const obj_tag = new Map<string, number>();
    for (let m_index in mod_defs.mods) {
        try {
            const v = rules[m_index].parse(mod)
            const mtags = mod_defs.mods[m_index].tags
            for (var tg in mtags) {
                const scale = mtags[tg as keyof typeof mtags]
                var new_val = scale * v
                if (obj_tag.has(tg)) {
                    new_val = new_val + obj_tag.get(tg)
                }
                obj_tag.set(tg, new_val)
            }
            const otags = new Map<string, number>()
            otags.set(mod_defs.mods[m_index].name, v)
            obj_tag.forEach((v,k) => otags.set(k, v))
            return otags
            /*return {
                name: mod_defs.mods[m_index].name,
                tags: obj_tag,
                value: v
            }*/
        } catch (e) {}
    }
    console.warn("No mod match [" + mod + "]")
    return new Map<string, number>()
}

export function joinMods(mods : Array<Map<string, number>>) : Map<string, number> {
    const rvalue = new Map<string, number>()
    mods.map(m => {
        m.forEach((v,s) => {
            if (rvalue.has(s))
            {
                rvalue.set(s, rvalue.get(s) + v)
            }
            else
            {
                rvalue.set(s, v)
            }
        })
    })
    return rvalue
}