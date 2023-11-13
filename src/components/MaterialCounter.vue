<template>
  <div class="hello">
    <div v-if="screenWidth <= 750">
      <el-row>
        <el-col :span="5">
          <el-row>
            星级
          </el-row>
          <el-row v-for="(level,index) in levels" :key="index">
            <el-button :color="colors[index]" @click="evt => needs[index]++">
              {{ level }}={{ Math.pow(3, 4 - index) }}
            </el-button>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row>
            需求 <br>
            ({{ needsSum }})
          </el-row>
          <el-row v-for="(level,index) in levels" :key="index">
            <el-input-number
                style="width:100px" v-model="needs[index]" :min="0"
                @change="onChange" small
            />
          </el-row>
        </el-col>

        <el-col :span="8">
          <el-row>
            拥有 <br>
            ({{ ownsSum }})
          </el-row>
          <el-row v-for="(level,index) in levels" :key="index">
            <el-input-number
                style="width:100px" v-model="owns[index]" :min="0"
                @change="onChange" small
            />
          </el-row>
        </el-col>
        <el-col :span="3">
          <el-row>
            {{ finishStatus }}<br>({{ Math.abs(diffsSum) }})
          </el-row>
          <el-row v-for="(level,index) in levels" :key="index">
            <el-tag :type="diffs[index]<=0?'success':diffs[index]<3?'':'danger'">
              {{ Math.abs(diffs[index]) }}
            </el-tag>
          </el-row>
        </el-col>
      </el-row>
      <el-row align="middle">
        <el-col :span="5">
          <el-button @click="Object.assign(this.$data, this.$options.data.call(this))">重置</el-button>
        </el-col>
        <el-col :span="17" :offset="1">
          <el-progress
              :text-inside="true"
              :stroke-width="24"
              :percentage="progress"
          />
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <el-row>
        <el-col :span="4">
          星级
        </el-col>
        <el-col :span="4" v-for="(level,index) in levels" :key="index">
          <el-button :color="colors[index]" @click="evt => needs[index]++">
            {{ `${level}色 = ${Math.pow(3, 4 - index)}` }}
          </el-button>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          需求({{ needsSum }})
        </el-col>
        <el-col :span="4" v-for="(level,index) in levels" :key="index">
          <el-input-number
              style="width:100px" v-model="needs[index]" :min="0"
              @change="onChange"
          />
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          最佳组合
        </el-col>
        <el-col :span="4" v-for="(level,index) in levels" :key="index">
          <el-tag>
            {{ owns[index] + diffs[index] }}
          </el-tag>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          拥有({{ ownsSum }})
        </el-col>
        <el-col :span="4" v-for="(level,index) in levels" :key="index">
          <el-input-number
              style="width:100px" v-model="owns[index]" :min="0"
              @change="onChange"
          />
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          {{ finishStatus }}({{ Math.abs(diffsSum) }})
        </el-col>
        <el-col :span="4" v-for="(level,index) in levels" :key="index">
          <el-tag :type="diffs[index]<=0?'success':diffs[index]<3?'':'danger'">
            {{ Math.abs(diffs[index]) }}
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
  </div>
</template>

<script>
const throttle = function (type, name, obj) {
  obj = obj || window
  var running = false
  var func = function () {
    if (running) { return }
    running = true
    requestAnimationFrame(function () {
      obj.dispatchEvent(new CustomEvent(name))
      running = false
    })
  }
  obj.addEventListener(type, func)
}

export default {
  name: 'MaterialCounter',
  props: {
    msg: String,
  },
  data () {
    return {
      // const
      levels: ['金', '紫', '蓝', '绿', '灰'],
      colors: ['rgb(188,105,50)', 'rgb(161,86,224)', 'rgb(81,127,203)', 'rgb(42,143,114)', 'rgb(114,119,139)'],

      // var
      screenWidth: window.innerWidth,

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
    const that = this

    throttle('resize', 'optimizedResize')
    window.addEventListener('optimizedResize', function () {
      that.screenWidth = window.innerWidth
    })

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
  computed: {
    finishStatus () {
      return this.diffsSum > 0 ? '缺少' : this.diffsSum === 0 ? '刚好' : '超过'
    },
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

      this.progress = this.needsSum > 0 ? Math.max(0, Math.min(this.ownsSum / this.needsSum * 100, 100)).toFixed(2) : 0

      if (this.diffsSum > 0) {
        // 进位版
        this.diffs = this.levels.map((_, index) =>
            index < firstNeed ? 0 :
                index === firstNeed ?
                    (this.diffsSum / Math.pow(3, 4 - index)) :
                    (this.diffsSum / Math.pow(3, 4 - index)) % 3,
        ).map(Math.floor)
      } else {
        // 不进位
        this.diffs = this.owns.map((it, index) => this.needs[index] - this.owns[index])
        for (let i = 0; i < this.diffs.length; i++) {
          if (this.diffs[i] > 0) {
            this.diffs[i + 1] += this.diffs[i] * 3
            this.diffs[i] = 0
          }
        }
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.hello {
  width: 750px;
  margin: 0 auto;
}

@media (max-width: 500px) {
  .hello {
    flex-direction: column;
    width: 94vw !important;
  }
}
</style>
