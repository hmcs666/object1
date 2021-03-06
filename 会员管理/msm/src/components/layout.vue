<template>
    <div>
        <app-header></app-header>
        <app-navber></app-navber>
        <app-main></app-main>
    </div>
</template>

<script>
import AppHeader from './AppHeader'
import AppNavber from './AppNavber'
import AppMain from './AppMain'
export default {
    components: {AppHeader, AppNavber, AppMain}
}
</script>

<style scoped>
.header{
    position: absolute;
    line-height: 50px;
    top: 0px;
    left: 0px;
    right: 0px;
    background-color: #2d3a4b;
}
.navber{
    position: absolute;
    width: 230px;
    top: 49px;
    left: 0px;
    bottom: 0px;
    overflow-y: auto;
    background-color: #545c64;
}
.main{
    position: absolute;
    top: 50px;
    left: 230px;
    bottom: 0px;
    padding: 10px;
    right: 0px;
    overflow-y: auto;
}
</style>>