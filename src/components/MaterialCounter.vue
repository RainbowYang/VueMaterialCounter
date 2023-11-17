<template>
  <div class="counter">
    <!--    <div v-if="screenWidth <= 750">-->
    <!--      <el-row>-->
    <!--        <el-col :span="5">-->
    <!--          <el-row>-->
    <!--            星级-->
    <!--          </el-row>-->
    <!--          <el-row v-for="(level,index) in levels" :key="index">-->
    <!--            <el-button :color="colors[index]" @click="evt => needs[index]++">-->
    <!--              {{ level }}={{ Math.pow(3, 4 - index) }}-->
    <!--            </el-button>-->
    <!--          </el-row>-->
    <!--        </el-col>-->
    <!--        <el-col :span="8">-->
    <!--          <el-row>-->
    <!--            需求 <br>-->
    <!--            ({{ needsSum }})-->
    <!--          </el-row>-->
    <!--          <el-row v-for="(level,index) in levels" :key="index">-->
    <!--            <el-input-number-->
    <!--                style="width:100px" v-model="needs[index]" :min="0"-->
    <!--                @change="onChange" small-->
    <!--            />-->
    <!--          </el-row>-->
    <!--        </el-col>-->

    <!--        <el-col :span="8">-->
    <!--          <el-row>-->
    <!--            拥有 <br>-->
    <!--            ({{ ownsSum }})-->
    <!--          </el-row>-->
    <!--          <el-row v-for="(level,index) in levels" :key="index">-->
    <!--            <el-input-number-->
    <!--                style="width:100px" v-model="owns[index]" :min="0"-->
    <!--                @change="onChange" small-->
    <!--            />-->
    <!--          </el-row>-->
    <!--        </el-col>-->
    <!--        <el-col :span="3">-->
    <!--          <el-row>-->
    <!--            {{ finishStatus }}<br>({{ Math.abs(diffsSum) }})-->
    <!--          </el-row>-->
    <!--          <el-row v-for="(level,index) in levels" :key="index">-->
    <!--            <el-tag :type="diffs[index]<=0?'success':diffs[index]<3?'':'danger'">-->
    <!--              {{ Math.abs(diffs[index]) }}-->
    <!--            </el-tag>-->
    <!--          </el-row>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--      <el-row align="middle">-->
    <!--        <el-col :span="5">-->
    <!--          <el-button @click="Object.assign(this.$data, this.$options.data.call(this))">重置</el-button>-->
    <!--        </el-col>-->
    <!--        <el-col :span="17" :offset="1">-->
    <!--          <el-progress-->
    <!--              :text-inside="true"-->
    <!--              :stroke-width="24"-->
    <!--              :percentage="progress"-->
    <!--          />-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--    </div>-->
    <div>
      <el-row>
        <el-col :span="4">
          {{ selectInput }}
          <el-select
            v-model="selectValue"
            value-key="label"
            filterable
            placeholder="Select"
            :filter-method="onSelectInput"
          >
            <el-option
              v-for="item in options"
              :key="item.label"
              :label="item.label"
              :value="item"
            >
              <div style="display: flex; align-items: center">
                <span>
                  {{ item.label }}
                </span>
              </div>
            </el-option>
          </el-select>
        </el-col>
        <el-col
          :span="4"
          v-for="(data, index) in selectValue.value"
          :key="index"
        >
          <div v-if="data">
            <el-image
              style="width: 40px; height: 40px"
              :src="`https://raw.githubusercontent.com/CMHopeSunshine/GenshinWikiMap/master/resources/material/${data['图标']}.png`"
              fit="contain"
            />
            <br />
            <!--            {{ data }}-->
            {{ data["名称"] }}<br />
            <!--            {{ data["稀有度"] }}<br />-->
            <!--            {{ data['图标'] }}-->
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4"> 星级</el-col>
        <el-col :span="4" v-for="(level, index) in levels" :key="index">
          <el-button :color="colors[index]" @click="(evt) => needList[index]++">
            {{ `${level}色(${Math.pow(3, 4 - index)})` }}
          </el-button>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4"> 需求({{ needsSum }})</el-col>
        <el-col :span="4" v-for="(level, index) in levels" :key="index">
          <el-input-number
            v-model="needList[index]"
            :min="0"
            @change="onChange"
          />
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4"> 期望组合</el-col>
        <el-col :span="4" v-for="(level, index) in levels" :key="index">
          <el-tag>
            {{ ownList[index] + diffList[index] }}
          </el-tag>
        </el-col>
      </el-row>

      <!-- 拥有  -->
      <el-row>
        <el-col :span="4">
          拥有({{ usefulOwnsSum }} + {{ ownsSum - usefulOwnsSum }})
        </el-col>
        <el-col :span="4" v-for="(level, index) in levels" :key="index">
          <el-input-number
            v-model="ownList[index]"
            :min="0"
            @change="onChange"
          />
        </el-col>
      </el-row>

      <!--  缺少  -->
      <el-row>
        <el-col :span="4"> {{ finishStatus }}{{ diffsSum ? `(${diffsSum})` : "" }}</el-col>
        <el-col :span="4" v-for="(level, index) in levels" :key="index">
          <el-tag
            :type="
              diffList[index] <= 0
                ? 'success'
                : diffList[index] < 3
                ? ''
                : 'danger'
            "
          >
            {{ diffList[index] }}
          </el-tag>
        </el-col>
      </el-row>

      <!--  进度条  -->
      <el-row>
        <el-col :span="4">
          <el-button
            @click="Object.assign(this.$data, this.$options.data.call(this))"
            >重置
          </el-button>
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
import { groupBy, zipWith, clamp } from "lodash-es";
import { match } from "pinyin-pro";

import originalMaterialDataMap from "../data/材料列表.json";

const materialNameList = Object.keys(originalMaterialDataMap).filter(
  (it) => !["智识之冕"].includes(it)
);

const groups = Object.values(
  groupBy(materialNameList, (name) => {
    const data = originalMaterialDataMap[name];
    return data.id - data["稀有度"];
  })
).filter((it) => it.length >= 3);

const options = groups.map((group) => {
  const groupData = group.map((name) => originalMaterialDataMap[name]);

  const label = group.join(" & ");
  const value = Array(5)
    .fill(0)
    .map((_, index) => groupData.find((it) => it["稀有度"] + index === 5));

  return { label, value };
});

export default {
  name: "MaterialCounter",
  props: {},
  data() {
    return {
      // const
      levels: ["金", "紫", "蓝", "绿", "灰"],
      colors: [
        "rgb(188,105,50)",
        "rgb(161,86,224)",
        "rgb(81,127,203)",
        "rgb(42,143,114)",
        "rgb(114,119,139)",
      ],

      // var
      screenWidth: window.innerWidth,

      needList: [0, 0, 0, 0, 0],
      needsSum: 0,
      ownList: [0, 0, 0, 0, 0],
      ownsSum: 0,
      usefulOwnsSum: 0,

      diffList: [0, 0, 0, 0, 0],
      diffsSum: 0,

      progress: 0,

      selectValue: "",
      options,
    };
  },
  created() {
    const that = this;

    const throttle = function (type, name, obj) {
      obj = obj || window;
      var running = false;
      var func = function () {
        if (running) {
          return;
        }
        running = true;
        requestAnimationFrame(function () {
          obj.dispatchEvent(new CustomEvent(name));
          running = false;
        });
      };
      obj.addEventListener(type, func);
    };

    throttle("resize", "optimizedResize");
    window.addEventListener("optimizedResize", function () {
      that.screenWidth = window.innerWidth;
    });

    try {
      this.needList = localStorage.getItem("needs")
        ? JSON.parse(localStorage.getItem("needs"))
        : this.needList;
      this.ownList = localStorage.getItem("owns")
        ? JSON.parse(localStorage.getItem("owns"))
        : this.ownList;
    } catch (e) {
      console.log(e);
    }
    this.onChange();
  },
  computed: {
    finishStatus() {
      return this.diffsSum > 0 ? "缺少" : this.diffsSum === 0 ? "完成" : "超过";
    },
  },
  methods: {
    onSelectInput(input) {
      this.options = input
        ? options.filter((options) => match(options.label, input))
        : options;
    },
    onChange() {
      localStorage.setItem("needs", JSON.stringify(this.needList));
      localStorage.setItem("owns", JSON.stringify(this.ownList));

      const sub = (a, b) => a - b;
      this.diffList = zipWith(this.needList, this.ownList, sub);

      // for (let i = this.diffList.length; i > 0; i--) {
      //   while (this.diffList[i] < 0 ) {
      //     this.diffList[i - 1]--;
      //     this.diffList[i] += 3;
      //   }
      // }

      // for (let i = 0; i < this.diffList.length; i++) {
      //   for (let j = i + 1; j < this.diffList.length; j++) {
      //     while (this.diffList[i] > 0 && this.diffList[j] < 0) {
      //       this.diffList[i]--;
      //       this.diffList[j] += 3 ** (j - i);
      //     }
      //   }
      // }
      for (let i = 1; i < this.diffList.length; i++) {
        while (this.diffList[i - 1] > 0) {
          this.diffList[i - 1]--;
          this.diffList[i] += 3;
        }
      }

      for (let i = this.diffList.length; i > 0 ; i--) {
        while (this.diffList[i] >= 3) {
          this.diffList[i] -= 3;
          this.diffList[i - 1]++;
        }
      }

      const carrySum = (carry) => (sum, value) => sum * carry + value;
      this.needsSum = this.needList.reduce(carrySum(3));
      this.ownsSum = this.ownList.reduce(carrySum(3));
      this.usefulOwnsSum = zipWith(this.ownList, this.diffList, (own, diff) =>
        diff < 0 ? own + diff : own
      ).reduce(carrySum(3));

      this.diffsSum = this.needsSum - this.usefulOwnsSum;

      this.progress =
        this.needsSum > 0
          ? clamp((this.usefulOwnsSum / this.needsSum) * 100, 0, 100).toFixed(2)
          : 0;
    },
  },
};
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

.el-input-number {
  width: 100px;
}

.counter {
  width: 750px;
  margin: 0 auto;
}

@media (max-width: 500px) {
  .counter {
    flex-direction: column;
    width: 94vw !important;
  }
}
</style>
