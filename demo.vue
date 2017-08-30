<template>
    <div>
        <scroll-title v-model="s"
            showCount="5"
            speed="300">
            <scroll-title-item v-for="(v, i) in arr" :key="i" >
                {{v}}
            </scroll-title-item>
        </scroll-title>
    </div>
</template>

<script>
import {ScrollTitle, ScrollTitleItem } from "./index"
export default {
    data(){
        return {
            arr: Array.from({length: 10}).map((t,k) => k),
            s: 3
        }
    },
    components: {
        ScrollTitle,
        ScrollTitleItem
    }
}
</script>

