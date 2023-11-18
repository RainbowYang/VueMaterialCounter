<template>
  <div
    style="
      width: 100vw;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
    "
  >
    <MaterialCounter
      v-for="v in counters"
      :key="v"
      :id="v"
      :onDelete="
        () => {
          counters = counters.filter((it) => it !== v);
        }
      "
    />

    <div>
      <el-button
        type="primary"
        :icon="Plus"
        circle
        @click="
          (evt) => {
            this.counters = [...this.counters, Date.now()];
          }
        "
      />
    </div>
  </div>
</template>

<script>
import MaterialCounter from "./components/MaterialCounter.vue";

import { getJsonFromLocalStorage, setJsonToLocalStorage } from "./utils/index";
import { Delete, Plus } from "@element-plus/icons-vue";

export default {
  name: "App",
  computed: {
    Delete() {
      return Delete;
    },
    Plus() {
      return Plus;
    },
  },
  components: {
    MaterialCounter,
  },
  data() {
    return {
      counters: [],
    };
  },
  created() {
    this.counters = getJsonFromLocalStorage("counters", [Date.now()]);
  },
  watch: {
    counters() {
      setJsonToLocalStorage("counters", this.counters);
    },
  },
};
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  align-items: center;
}
</style>
