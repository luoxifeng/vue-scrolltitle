<template>
    <div :class="['scroll-title', wrapCls]">
        <div class="scroll-title-inner" ref="inner">
            <div class="scroll-title-slider" :style="sliderStyle" ref="slider"
                >
                <div class="scroll-title-cursor"  ref="cursor"></div>
                <ul class="scroll-title-list"  ref="list"
                    @touchstart="onScrollStart"
                    @touchmove="onScrollMove"
                    @touchend="onScrollEnd"
                    >
                    <slot></slot>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { is, EventEmitter } from "../util";

export default {
    name: "ScrollTitle",
    data(){
        return {
            bus: new EventEmitter(),
            width: 0,
            activeInShow: 0,//当前选中的在显示的tab的位置
            itemCount: 0,
            startX: 0,
            tempX: 0,
            cursor: {},
            list: {},
            cursorTranslateX: 0,
            listTranslateX: 0,
        }
    },
    props: {
        wrapCls: {//组件根元素自定义样式
            type: String,
            default: ''
        },
        showCount: {//可视区域最大显示数
            type: [Number, String],
            default: 3
        },
        speed: {
            type: [Number, String],
            default: 300
        },
        animate: {
            type: [Number, String],
            default: 300
        },
        value: {//当前选中的在所有tab的位置
            type: Number,
            default: 0
        },
    },
    computed: {
        itemWidth(){
            return this.width/this.showCount;
        },
        sliderStyle(){
            return {
                "width": `${this.$children.length*this.itemWidth}px`,
            };
        },
        transition(){
            return `transform ${this.speed}ms ease-in-out`;
        },
        cursorPos(){
            let res;
            if (this.value < this.activeInShow) {
                res = 'left';
            } else if (this.itemCount - this.value < this.showCount - this.activeInShow) {
                res = 'right';
            } else {
                res = 'middle';
            }
            return res;
        },
    },
    watch: {
        value(newVal, oldVal){
            this.setCursorStyle();
            this.setListStyle();
        }
    },
    methods: {
        setCursorStyle(){
            let translateX = 0;
            let style = this.cursor.style;
            if (this.cursorPos === "left") {
                translateX = this.value*this.itemWidth;
            } else if (this.cursorPos === "right") {
                translateX = (this.showCount - (this.itemCount - this.value))*this.itemWidth;
            } else if (this.cursorPos === "middle") {
                translateX = this.activeInShow*this.itemWidth;
            }
            this.cursorTranslateX = Math.round(translateX);
            style["width"] = `${this.itemWidth}px`;
            style["transition"] = this.transition;
            style["transform"] = `translateX(${this.cursorTranslateX}px)`;
        },
        setListStyle(){
             /**
             *  选中的元素若不能滚动到可视区域的中间位置，
             *  则让整个tab滚动到最左端或者最右边，
             *  若能则让选择的元素滚到中间位置
             * */
            let translateX = 0;
            let style = this.list.style;
            if (this.cursorPos === "left") {
                translateX = 0;
            } else if (this.cursorPos === "right") {
                translateX = -(this.itemCount - this.showCount)*this.itemWidth;
            } else if (this.cursorPos === "middle") {
                translateX = -(this.value - this.activeInShow)*this.itemWidth;
            }
            this.listTranslateX = translateX;
            style["transitionc"] = this.transition;
            style["transform"] = `translateX(${translateX}px)`;
        },
        setActiveInShow(){//获取显示区域，当前选中的应该在什么位置
            let showCount = this.showCount >= 3 ? this.showCount : 3;
            this.activeInShow = this.showCount%2 === 0 ? (this.showCount/2 - 1) : ~~(this.showCount/2);
        },
        initBusEvent(){
            this.bus.$on("changeTab", ({index, type}) => {
                if (index == this.vaule) return;
                this.eventType = type;
                this.$emit("input", index)
            })
        },
        initVerify(){
            //初始要显示的不能小于0，不能大于总数
            if (this.value < 0 || this.value >= this.$children.length) 
                throw new Error(`value out of range ([0, ${this.$children.length - 1}])`);

        },
        initProcess(){
            this.width = this.$refs.inner.clientWidth;
            this.itemCount = this.$children.length;
            this.cursor = this.$refs.cursor;
            this.list = this.$refs.list;
            this.setActiveInShow();//设置选中的那一项在显示区域的第几个
            this.initBusEvent();
        },
        onScrollStart(e){
            this.tempX = this.startX = e.touches[0].clientX;
        },
        onScrollMove(e){
            let x = e.touches[0].clientX - this.startX;
            let moveX = e.touches[0].clientX - this.tempX;
            this.tempX = e.touches[0].clientX;
            if (this.listTranslateX + x >= 0 || Math.abs(this.listTranslateX + x) > Math.abs(this.itemCount - this.showCount)*this.itemWidth) {
                moveX = moveX/2;
            }
            this.cursor.style["transform"] = `translateX(${this.cursorTranslateX = Math.round(this.cursorTranslateX + moveX)}px)`;
            this.cursor.style["transition"] = "";
            this.list.style["transform"] = `translateX(${this.listTranslateX = Math.round(this.listTranslateX + moveX)}px)`;
            this.list.style["transition"] = "";
        },
        onScrollEnd(e){
            let cursorTranslateX = this.value*this.itemWidth;
            console.log(e.changedTouches[0].clientX - this.tempX, cursorTranslateX, this.cursorTranslateX,10)
            let listStyle = this.list.style;
            let cursorStyle = this.cursor.style;
            let rightX = -(this.itemCount - this.showCount)*this.itemWidth;
            if (this.listTranslateX > 0){
                listStyle["transform"] = `translateX(0px)`;
                this.listTranslateX = 0;
                cursorStyle["transform"] = `translateX(${cursorTranslateX}px)`;
                this.cursorTranslateX = cursorTranslateX;
            } else if (Math.abs(this.listTranslateX) > Math.abs(rightX)) {
                listStyle["transform"] = `translateX(${rightX}px)`;
                this.listTranslateX = rightX;
                this.cursorTranslateX = Math.round(((this.showCount) - (this.itemCount - this.value))*this.itemWidth);
                cursorStyle["transform"] = `translateX(${this.cursorTranslateX}px)`;
            }
            listStyle['transition'] = this.transition;
            cursorStyle['transition'] = this.transition;
        }
    },
    created () {
    },
    mounted () {
        this.initVerify();
        this.initProcess();
        this.setCursorStyle();
        this.setListStyle();
    }
}
</script>

<style lang="less">
@import './index.less';
</style>