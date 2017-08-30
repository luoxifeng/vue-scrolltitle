<template>
    <li :index="index" class="scroll-title-item" 
        :class="[activeInTotal == index ? 'scroll-title-item-active' : '']"
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
            // activeInTotal: 0,
            activeInShow: 0
        }
    },
    computed: {
        bus(){
            return this.$parent.bus;
        },
        width(){
            return this.$parent.itemWidth;
        },
        activeInTotal(){
            return this.$parent.activeInTotal;
        }
    },
    created(){
        this.index = this.$parent.$children.length - 1;
    },
    methods: {
        changeTab(index){
            this.bus.$emit("changeTab", index)
        }
    },
    mounted(){
        
    }


}
</script>
