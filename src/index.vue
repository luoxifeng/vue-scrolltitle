<template>
    <div :class="[prefixCls, wrapCls]">
        <div :class="[prefixCls + '-inner']" ref="inner">
            <div class="scroll-title-slider" :style="sliderStyle" ref="slider">
                <div class="scroll-title-cursor" :style="cursorStyle"></div>
                <ul :class="[prefixCls + '-list']"  ref="barList">
                    <slot></slot>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
let prefixCls = 'scroll-title';
import { is, EventEmitter } from "../util";

export default {
    name: "ScrollTitle",
    data(){
        return {
            bus: new EventEmitter(),
            width: 0,
            prefixCls: prefixCls,
            
            activeInShow: 0,//当前选中的在显示的tab的位置
            itemCount: 0,
        }
    },
    props: {
        wrapCls: {//组件根元素自定义样式
            type: String,
            default: ''
        },
        showCount: {//可视区域最大显示数
            type: Number,
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
        value: {
            type: Number,
            default: 0
        },
        
        

    },
    computed: {
        activeInTotal(){//当前选中的在所有tab的位置
            return this.value;
        },
        itemWidth(){
            return this.width/this.showCount;
        },
        listWidth(){
            return this.$children.length*this.itemWidth;
        },
        sliderStyle(){
            let style = {
                "width": `${this.listWidth}px`,
            };

            return style;
        },
        transform(){
            return `transform ${this.speed}ms ease-in-out`;
        },
        cursorStyle(){
            let style = {
                "width": `${this.itemWidth}px`,
            };
            style["transform"] = `translateX(${this.value*this.itemWidth}px)`;
            style["transition"] = this.transform;

            return style;
        }
    },

    methods: {
        itemStyle(item){
            let styleObj = {'width': 1/this.tabs.length*100 + '%'};
            if(item.align) styleObj['text-align'] = item.align;
            return styleObj;
        },
        itemClass(item, index){
            let cls = [`${prefixCls}` + '-item'];
            if(index == this.activeInTotal) cls.push('active');
            return cls;
        },
        listStyle(){
            return {
                'width': this.tabsCouut/this.maxShow*100 + '%',
                'left': 0
            }
        },
        setActiveInShow(){//获取显示区域，当前选中的应该在什么位置
            let showCount = this.showCount >= 3 ? this.showCount : 3;
            this.activeInShow = this.showCount%2 === 0 ? (this.showCount/2 - 1) : ~~(this.showCount/2);
        },
       
        changeTab(index){

            console.log(111, index)
            //如果当前时已选中的直接返回
            // if(this.activeInTotal === index) return;
            // this.$emit("beforeChange", {
            //     active: this.activeInTotal,
            //     current: index
            // });
            // this.scrollTo(index);
            // this.$emit("afterChanged", {
            //     active: index,
            //     current: index
            // });
        },
        scrollTo(index){
            /**
             *  选中的元素若不能滚动到可视区域的中间位置，
             *  则让整个tab滚动到最左端或者最右边，
             *  若能则让选择的元素滚到中间位置
             * */
            if (index < this.activeInShow) {
                this.barList.style.left = 0;
            } else if (this.tabsCouut - index < this.maxShow - this.activeInShow) {
                    this.barList.style.left = -(this.tabsCouut/this.maxShow - 1)*100 + "%";
            } else {
                this.barList.style.left = -1/this.maxShow*(index - this.activeInShow)*100 + "%";
            }
            this.activeInTotal = index;
        },
        initBusEvent(){
            this.bus.$on("changeTab", index => {
                this.scrollTo(index)
            })
        },
        verifyComponent(){
            //初始要显示的不能小于0，不能大于总数
            if (this.value < 0 || this.value >= this.$children.length) 
                throw new Error(`value out of range ([0, ${this.$children.length - 1}])`);

        }
    },
    created () {
        this.initBusEvent();
        //设置选中的那一项在显示区域的第几个
        this.setActiveInShow();
        //获取当前选中的在所有tab的位置
        // this.activeInTotal = this.getActiveInTotal();
    },
    mounted () {
        this.verifyComponent();
        //获取tabs的dom元素
        this.width = this.$refs.inner.clientWidth;
        // this.$

        this.barList = this.$refs.barList;
        this.scrollTo(this.activeInTotal);



    }
}
</script>

<style lang="less">
@import './index.less';
</style>