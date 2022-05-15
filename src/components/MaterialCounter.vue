<template>
  <div class="hello">
    <el-row>
      <el-col :span="4">
        星级
      </el-col>
      <el-col :span="4" v-for="(level,index) in levels" :key="index">
        <el-tag size="large" :type="colorTypes[index]">
          {{ `${level}色【${5 - index}】= ${Math.pow(3, 4 - index)}` }}
        </el-tag>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        需求({{ needsSum }})
      </el-col>
      <el-col :span="4" v-for="(level,index) in levels" :key="index">
        <el-input-number
            style="width:100px" v-model="needs[index]" :min="0" controls-position="right"
            @change="onChange"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        拥有({{ ownsSum }})
      </el-col>
      <el-col :span="4" v-for="(level,index) in levels" :key="index">
        <el-input-number
            style="width:100px" v-model="owns[index]" :min="0" controls-position="right"
            @change="onChange"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        相差({{ diffsSum }})
      </el-col>
      <el-col :span="4" v-for="(level,index) in levels" :key="index">
        <el-tag :type="diffs[index]<=0?'success':diffs[index]<3?'':'danger'">
          {{ diffs[index] }}
        </el-tag>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-button @click="Object.assign(this.$data, this.$options.data.call(this))">重置</el-button>
      </el-col>
      <el-col :span="18" :offset="1">
        <el-progress
            :text-inside="true"
            :stroke-width="24"
            :percentage="progress"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'MaterialCounter',
  props: {
    msg: String,
  },
  data () {
    return {
      // const
      levels: ['金', '紫', '蓝', '绿', '灰'],
      colorTypes: ['warning', 'danger', '', 'success', 'info'],

      // var
      needs: [0, 0, 0, 0, 0],
      needsSum: 0,
      owns: [0, 0, 0, 0, 0],
      ownsSum: 0,
      diffs: [0, 0, 0, 0, 0],
      diffsSum: 0,
      progress: 0,
    }
  },
  created () {
    try {
      this.needs = localStorage.getItem('needs') ?
          JSON.parse(localStorage.getItem('needs')) : this.needs
      this.owns = localStorage.getItem('owns') ?
          JSON.parse(localStorage.getItem('owns')) : this.owns
    } catch (e) {
      console.log(e)
    }
    this.onChange()
  },
  methods: {
    onChange () {
      localStorage.setItem('needs', JSON.stringify(this.needs))
      localStorage.setItem('owns', JSON.stringify(this.owns))

      let firstNeed = this.needs.findIndex(v => v > 0)

      let calcSum = (sum, value, index) => sum * 3 + (index >= firstNeed ? value : 0)
      this.needsSum = this.needs.reduce(calcSum, 0)
      this.ownsSum = this.owns.reduce(calcSum, 0)
      this.diffsSum = this.needsSum - this.ownsSum

      this.progress = this.needsSum > 0 ? this.ownsSum / this.needsSum * 100 : 0
      this.progress = this.progress > 100 ? 100 : this.progress < 0 ? 0 :
          this.progress.toFixed(2)

      this.diffs = this.levels.map((_, index) =>
          index < firstNeed ? 0 :
              index === firstNeed ?
                  (this.diffsSum / Math.pow(3, 4 - index)) :
                  (this.diffsSum / Math.pow(3, 4 - index)) % 3,
      ).map(Math.floor)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.hello {
  min-width: 750px;
  width: 750px;
  margin: 0 auto 64px;
}

h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
