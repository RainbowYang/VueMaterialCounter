<template>
  <img alt="Vue logo" src="./assets/logo.png" @click="count++">
  <MaterialCounter v-for="(v,i) in new Array(count).fill('')" :key="i"/>
</template>

<script>
import MaterialCounter from './components/MaterialCounter.vue'

export default {
  name: 'App',
  components: {
    MaterialCounter,
  },
  data () {
    return {
      count: 1,
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
