<script lang="ts">
import { defineComponent } from 'vue'
import { Item } from '../utils/stash'

import ItemReq from './ItemReq.vue'

export default defineComponent({
    props: {
        item_obj : Object
    },
    data() {
        return {
            name: "",
            icon: "",
            type: "",
            reqs: [] as Array<object>,
            props: [] as Array<object>,
            implicits: [] as Array<string>,
            explicits: [] as Array<string>,
            flavour: [] as Array<string>,
            corrupted: false,
            frame: -1,
            desc: "",
            secdesc: ""
        }
    },
    mounted() {
        const item = new Item().dejson(this.item_obj as object)
        this.name = item.name
        this.icon = item.icon
        this.type = item.typeLine
        this.implicits = item.implicitMods
        this.explicits = item.explicitMods
        this.corrupted = item.corrupted
        this.frame = item.frameType
        this.flavour = item.flavourText
        this.desc = item.descrText
        this.secdesc = item.secDescrText
        this.props = item.properties.map(t => {return t.rejson()})
        this.reqs = item.requirements.map(t => {return t.rejson()})
    }
})
</script>

<template>
    <div v-if="this.frame == 3">
        <div class="title">{{ this.name }}</div>
        <div class="general">{{ this.type }}</div>
        <hr>
        <div class="general" v-for="prop in this.props">
            <ItemProp :prop_obj="prop" />
        </div>
        <hr>
        <div class="general">
            <span v-for="(req,index) in this.reqs">
                <ItemReq :req_obj="req"/>
                <span v-if="index + 1 < this.reqs.length">,</span>
            </span>
        </div>
        <hr>
        <div class="general" v-for="mod in this.implicits"><span>{{ mod }}</span></div>
        <hr>
        <div class="general" v-for="mod in this.explicits"><span>{{ mod }}</span></div>
        <div v-if="this.corrupted" style="color:red"><span>Corrupted</span></div>
        <hr>
        <div class="general" v-for="txt in this.flavour">{{ txt }}</div>
        <div>{{ this.desc }}</div>
        <div><img :src="this.icon" style="display: block;margin-left:auto;margin-right:auto;"></div>
    </div>
    <div v-if="this.frame == 0">
        <div class="title">{{ this.type }}</div>
        <hr>
        <div class="general" v-for="prop in this.props">
            <ItemProp :prop_obj="prop" />
        </div>
        <hr>
        <div class="general">
            <span v-for="(req,index) in this.reqs">
                <ItemReq :req_obj="req"/>
                <span v-if="index + 1 < this.reqs.length">,</span>
            </span>
        </div>
        <hr>
        <div class="general" v-for="mod in this.implicits"><span>{{ mod }}</span></div>
        <hr>
        <div class="general" v-for="mod in this.explicits"><span>{{ mod }}</span></div>
        <div v-if="this.corrupted" style="color:red"><span>Corrupted</span></div>
        <hr>
        <div class="general" v-for="txt in this.flavour">{{ txt }}</div>
        <div class="general">{{ this.desc }}</div>
        <div><img :src="this.icon" style="display: block;margin-left:auto;margin-right:auto;"></div>
    </div>
    <div v-if="this.frame == 1">
        <div class="title">{{ this.type }}</div>
        <hr>
        <div class="general" v-for="prop in this.props">
            <ItemProp :prop_obj="prop" />
        </div>
        <hr>
        <div class="general">
            <span v-for="(req,index) in this.reqs">
                <ItemReq :req_obj="req"/>
                <span v-if="index + 1 < this.reqs.length">,</span>
            </span>
        </div>
        <hr>
        <div class="general" v-for="mod in this.implicits"><span>{{ mod }}</span></div>
        <hr>
        <div class="general" v-for="mod in this.explicits"><span>{{ mod }}</span></div>
        <div v-if="this.corrupted" style="color:red"><span>Corrupted</span></div>
        <hr>
        <div class="general" v-for="txt in this.flavour">{{ txt }}</div>
        <div class="general">{{ this.desc }}</div>
        <div><img :src="this.icon" style="display: block;margin-left:auto;margin-right:auto;"></div>
    </div>
    <div v-if="this.frame == 2">
        <div class="title">{{ this.name }}</div>
        <div class="general">{{ this.type }}</div>
        <hr>
        <div class="general" v-for="prop in this.props">
            <ItemProp :prop_obj="prop" />
        </div>
        <hr>
        <div class="general">
            <span v-for="(req,index) in this.reqs">
                <ItemReq :req_obj="req"/>
                <span v-if="index + 1 < this.reqs.length">,</span>
            </span>
        </div>
        <hr>
        <div class="general" v-for="mod in this.implicits"><span>{{ mod }}</span></div>
        <hr>
        <div class="general" v-for="mod in this.explicits"><span>{{ mod }}</span></div>
        <div v-if="this.corrupted" class="general" style="color:red"><span>Corrupted</span></div>
        <hr>
        <div class="general" v-for="txt in this.flavour">{{ txt }}</div>
        <div class="general">{{ this.desc }}</div>
        <div><img :src="this.icon" style="display: block;margin-left:auto;margin-right:auto;"></div>
    </div>
    
    <div v-if="this.frame == 4">
        <div class="title">{{ this.type }}</div>
        <hr>
        <div class="general" v-for="prop in this.props">
            <ItemProp :prop_obj="prop" />
        </div>
        <hr>
        <div class="general">
            <span v-for="(req,index) in this.reqs">
                <ItemReq :req_obj="req"/>
                <span v-if="index + 1 < this.reqs.length">,</span>
            </span>
        </div>
        <hr>
        <div class="general">{{ this.secdesc }}</div>
        <hr>
        <div class="general" v-for="mod in this.explicits"><span>{{ mod }}</span></div>
        <div v-if="this.corrupted"><span>Corrupted</span></div>
        <hr>
        <div class="general" v-for="txt in this.flavour">{{ txt }}</div>
        <div class="general">{{ this.desc }}</div>
        <div><img :src="this.icon" style="display: block;margin-left:auto;margin-right:auto;"></div>
    </div>
    <div v-if="this.frame == 5">
        <div class="title">{{ this.type }}</div>
        <hr>
        <div class="general" v-for="prop in this.props">
            <ItemProp :prop_obj="prop" />
        </div>
        <hr>
        <div class="general">
            <span v-for="(req,index) in this.reqs">
                <ItemReq :req_obj="req"/>
                <span v-if="index + 1 < this.reqs.length">,</span>
            </span>
        </div>
        <hr>
        <div class="general">{{ this.secdesc }}</div>
        <hr>
        <div class="general" v-for="mod in this.explicits"><span>{{ mod }}</span></div>
        <div v-if="this.corrupted"><span>Corrupted</span></div>
        <hr>
        <div class="general" v-for="txt in this.flavour">{{ txt }}</div>
        <div class="general">{{ this.desc }}</div>
        <div><img :src="this.icon" style="display: block;margin-left:auto;margin-right:auto;"></div>
    </div>
</template>


<style lang="css">
.title {
    text-align:center;
    font-size: 5vw
}
.general {
    text-align:center;
    font-size: 3vw
}
</style>