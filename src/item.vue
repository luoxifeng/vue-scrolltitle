<template>
    <li :index="index" class="scroll-title-item" 
        :class="[active == index ? 'scroll-title-item-active' : '']"
        @click="changeTab(index)">
        <slot></slot>
    </li>
</template>

<script>
export default {
    name: "ScrollTitleItem",
    data(){
        return {
            index: 0,
        }
    },
    computed: {
        bus(){
            return this.$parent.bus;
        },
        width(){
            return this.$parent.itemWidth;
        },
        active(){
            return this.$parent.value;
        },
        activeInShow(){
            return this.$parent.activeInShow;
        }
    },
    created(){
        this.index = this.$parent.$children.length - 1;
    },
    methods: {
        changeTab(index){
            this.bus.$emit("changeTab", {
                "index": index,
                "type": "click"
            })
        }
    },
    mounted(){
        
    }


}
</script>
