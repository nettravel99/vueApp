<template>
<div ref="rightPanel" :class="{show:value}" class="rightPanel-container">
    <div class="rightPanel-background" />
    <div class="rightPanel">
        <el-button style="float:right" type="primary" size="mini" @click="$emit('input',false);$emit('change',false);">X</el-button>
        <div class="rightPanel-items">
            <vue-friendly-iframe :src="src" class="ifram_ads" v-if="value"></vue-friendly-iframe>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'RightPanel',
    props: ['value', 'LiteType', 'LiteValue'],
    data() {
        return {}
    },
    computed: {
        src() {
            if (this.LiteType === 'T') {
                return `transwrapper^mwdn?T${this.formatTrans(this.LiteValue)}`
            } else if (this.LiteType === 'TASK') {
                return `taskwrapper^mwdn?${this.LiteValue}`
            } else if (this.LiteType === 'DEMO') {
                return `demowrapper^mwdn?${this.LiteValue}`
            } else if (this.LiteType === 'DENIAL') {
                return `premier/denial/denialwrapper^mwdn?${this.LiteValue}`
            }else {
                return '';
            }
        }
    },
    watch: {
        value(value) {
            if (value) {
                this.addEventClick()
            }
        }
    },
    mounted() {
        this.insertToBody();
    },
    beforeDestroy() {
        const elx = this.$refs.rightPanel
        elx.remove()
    },
    methods: {
        formatTrans(trans) {
            trans = String(trans);
            if (trans.indexOf(".") > -1) {
                trans = trans.replace(".", "-");
            } else if (trans.indexOf("/") > -1) {
                trans = trans.replace("/", "-");
            } else if (trans.indexOf("\\") > -1) {
                trans = trans.replace("\\", "-");
            }
            return trans;
        },
        addEventClick() {
            window.addEventListener('click', this.closeSidebar)
        },
        closeSidebar(evt) {
            const parent = evt.target.closest('.rightPanel')
            if (!parent) {
                this.$emit('input',false);
                this.$emit('change',false);
                window.removeEventListener('click', this.closeSidebar)
            }
        },
        insertToBody() {
            const elx = this.$refs.rightPanel
            const body = document.querySelector('body')
            body.insertBefore(elx, body.firstChild)
        }
    }
}
</script>

<style>
.ifram_ads>iframe {
    width: 980px !important;
    height: 100vh !important;
}

.showRightPanel {
    overflow: hidden;
    position: relative;
    width: calc(100% - 15px);
}
</style><style lang="scss" scoped>
.rightPanel-background {
    position: fixed;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity .3s cubic-bezier(.7, .3, .1, 1);
    background: rgba(0, 0, 0, .2);
    z-index: -1;
}

.rightPanel {
    width: 100%;
    max-width: 980px;
    height: 100vh;
    position: fixed;
    top: 0;
    right: 0;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, .05);
    transition: all .25s cubic-bezier(.7, .3, .1, 1);
    transform: translate(100%);
    background: #fff;
    z-index: 40000;
}

.show {
    transition: all .3s cubic-bezier(.7, .3, .1, 1);

    .rightPanel-background {
        z-index: 20000;
        opacity: 1;
        width: 100%;
        height: 100%;
    }

    .rightPanel {
        transform: translate(0);
    }
}

.handle-button {
    width: 48px;
    height: 48px;
    position: absolute;
    left: -48px;
    text-align: center;
    font-size: 24px;
    border-radius: 6px 0 0 6px !important;
    z-index: 0;
    pointer-events: auto;
    cursor: pointer;
    color: #fff;
    line-height: 48px;

    i {
        font-size: 24px;
        line-height: 48px;
    }
}
</style>
