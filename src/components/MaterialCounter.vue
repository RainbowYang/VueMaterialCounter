<template>
  <div class="counter">
    <el-row>
      <el-col :span="4">
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
          :span="3"
          :offset="1"
          v-for="(data, index) in selectValue.value"
          :key="index"
      >
        <div v-if="data">
          <el-image
              style="width: 40px; height: 40px"
              :src="`https://raw.githubusercontent.com/CMHopeSunshine/GenshinWikiMap/master/resources/material/${data['图标']}.png`"
              fit="contain"
          />
          <br/>
          {{ data['名称'] }}<br/>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4"> 星级</el-col>
      <el-col
          :span="3"
          :offset="1"
          v-for="(level, index) in levels"
          :key="index"
      >
        <el-popconfirm
            title="消除此等级需求？"
            @confirm="
            () => {
              ownList[index] -= needList[index];
              needList[index] = 0;
            }
          "
        >
          <template #reference>
            <el-button :color="colors[index]">
              {{ `${level}色(${Math.pow(3, 4 - index)})` }}
            </el-button>
          </template>
        </el-popconfirm>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="4"> 需求({{ needSum }})</el-col>
      <el-col
          :span="3"
          :offset="1"
          v-for="(level, index) in levels"
          :key="index"
      >
        <el-input-number
            v-model="needList[index]"
            :min="0"
            @change="onChange"
        />
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="4">最佳组合</el-col>
      <el-col
          :span="3"
          :offset="1"
          v-for="(level, index) in levels"
          :key="index"
      >
        <el-tag>
          {{ betterOwnList[index] }}
        </el-tag>
      </el-col>
    </el-row>

    <!-- 拥有  -->
    <el-row>
      <el-col :span="4">
        拥有({{
          usefulOwnSum
        }}{{ ownSum - usefulOwnSum ? ` + ${ownSum - usefulOwnSum}` : '' }})
      </el-col>
      <template v-for="(level, index) in levels" :key="index">
        <el-col :span="3" :offset="index === 0 ? 1 : 0">
          <el-input-number
              v-model="ownList[index]"
              :min="0"
              @change="onChange"
          />
        </el-col>
        <el-col :span="1" v-if="index < 4">
          <el-tag>
            <el-link
                type="warning"
                @click="
                () => {
                  if (ownList[index + 1] >= 3) {
                    ownList[index + 1] -= 3;
                    ownList[index]++;
                  }
                }
              "
            >&lt;
            </el-link>
          </el-tag>
        </el-col>
      </template>
    </el-row>

    <!--  缺少  -->
    <el-row>
      <el-col :span="4">
        {{ finishStatus }}{{ diffSum ? `(${diffSum})` : '' }}
      </el-col>
      <el-col
          :span="3"
          :offset="1"
          v-for="(level, index) in levels"
          :key="index"
      >
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
      <el-col :span="16" :offset="1">
        <el-progress
            :text-inside="true"
            :stroke-width="24"
            :percentage="parseFloat(progress)"
        />
      </el-col>
      <el-col :span="3">
        <el-button type="danger" @click="onDelete">删除</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import lodash, {
  groupBy,
  zipWith,
  clamp,
  range,
  rangeRight,
  unzipWith,
} from 'lodash-es'
import { match } from 'pinyin-pro'

import originalMaterialDataMap from '../data/材料列表.json'
import { getJsonFromLocalStorage, setJsonToLocalStorage } from '../utils/index'

const materialNameList = Object.keys(originalMaterialDataMap).filter(
    (it) => !['智识之冕'].includes(it),
)

const groups = Object.values(
    groupBy(materialNameList, (name) => {
      const data = originalMaterialDataMap[name]
      return data.id - data['稀有度']
    }),
).filter((it) => it.length >= 3)

const options = groups.map((group) => {
  const groupData = group.map((name) => originalMaterialDataMap[name])

  const label = group.join(' & ')
  const value = Array(5).fill(0).map((_, index) => groupData.find((it) => it['稀有度'] + index === 5))

  return { label, value }
})

const add = (a, b) => a + b
const sub = (a, b) => a - b
const addOf = (arr1, arr2) => zipWith(arr1, arr2, add)
const subOf = (arr1, arr2) => zipWith(arr1, arr2, sub)
const carrySum = (carry) => (sum, value) => sum * carry + value
const sumOf = (arr) => arr.reduce(carrySum(3))

export default {
  name: 'MaterialCounter',
  props: {
    id: String,
    onDelete: Function,
  },
  data () {
    return {
      // const
      levels: ['金', '紫', '蓝', '绿', '灰'],
      colors: [
        'rgb(188,105,50)',
        'rgb(161,86,224)',
        'rgb(81,127,203)',
        'rgb(42,143,114)',
        'rgb(114,119,139)',
      ],

      // var
      screenWidth: window.innerWidth,

      needList: Array(5).fill(0),
      betterOwnList: Array(5).fill(0),
      ownList: Array(5).fill(0),
      usefulOwnList: Array(5).fill(0),
      diffList: Array(5).fill(0),

      needSum: 0,
      betterOwnSum: 0,
      ownSum: 0,
      usefulOwnSum: 0,
      diffSum: 0,

      progress: 0,

      selectValue: '',
      options,
    }
  },
  created () {
    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth
    })

    this.needList =
        getJsonFromLocalStorage(this.id + 'needList') || this.needList
    this.ownList = getJsonFromLocalStorage(this.id + 'ownList') || this.ownList
    this.selectValue =
        getJsonFromLocalStorage(this.id + 'selectValue') || this.selectValue

    this.onChange()
  },
  computed: {
    finishStatus () {
      return this.diffSum > 0 ? '缺少' : this.diffSum === 0 ? '完成' : '超过'
    },
  },
  watch: {
    selectValue () {
      this.onChange()
    },
  },
  methods: {
    zipWith,
    unzipWith,
    onSelectInput (input) {
      this.options = input
          ? options.filter((options) => match(options.label, input))
          : options
    },
    onChange () {
      setJsonToLocalStorage(this.id + 'needList', this.needList)
      setJsonToLocalStorage(this.id + 'ownList', this.ownList)
      setJsonToLocalStorage(this.id + 'selectValue', this.selectValue)

      const calcUsefulOwnList = () => {
        const needs = [...this.needList]
        const owns = [...this.ownList]
        const usefulOwns = []

        range(5).forEach((i) => {
          if (needs[i] > owns[i]) {
            usefulOwns[i] = owns[i]
            needs[i + 1] += 3 * (needs[i] - owns[i])
          } else {
            usefulOwns[i] = needs[i]
          }
        })
        return usefulOwns
      }

      const usefulOwnList = calcUsefulOwnList()
      const usefulDiffList = subOf(this.needList, usefulOwnList)

      const betterDiffList = [...usefulDiffList]
      rangeRight(4).forEach((i) => {
        while (betterDiffList[i + 1] < 0) {
          betterDiffList[i + 1] += 3
          betterDiffList[i]--
        }
      })
      const betterOwnList = addOf(usefulOwnList, betterDiffList)

      // console.log("directDiffList", subOf(this.needList, this.ownList));
      // console.log("usefulOwnList", usefulOwnList, sumOf(usefulOwnList));
      // console.log("usefulDiffList", usefulDiffList, sumOf(usefulDiffList));
      // console.log("betterDiffList", betterDiffList, sumOf(betterDiffList));
      // console.log("betterOwnList", betterOwnList, sumOf(betterOwnList));

      this.betterOwnList = betterOwnList
      this.diffList = betterDiffList
      this.usefulOwnList = usefulOwnList

      this.needSum = sumOf(this.needList)
      this.ownSum = sumOf(this.ownList)

      this.betterOwnSum = sumOf(betterOwnList)
      this.diffSum = sumOf(betterDiffList)
      this.usefulOwnSum = sumOf(usefulOwnList)

      this.progress =
          this.needSum > 0
              ? clamp((this.usefulOwnSum / this.needSum) * 100, 0, 100).toFixed(2)
              : 0

      // /*
      //  * + 优先使用高等级材料
      //  * + 充分使用低等级材料
      //  */
      // const calcDiffList = (needList, ownList) => {
      //   const diffList = zipWith(needList, ownList, sub);
      //
      //   const firstMeet = diffList.findIndex((it) => it < 0);
      //
      //   const carryOn = (indexFrom, indexTo, count = 1) => {
      //     // indexTo > indexFrom
      //     diffList[indexTo] -= count;
      //     diffList[indexFrom] += count * 3 ** (indexFrom - indexTo);
      //   };
      //
      //   range(4).forEach((i) => {
      //     while (diffList[i] > 0) {
      //       carryOn(i + 1, i);
      //     }
      //     console.log(diffList);
      //   });
      //
      //   // rangeRight(1, 5).forEach((i) => {
      //   //   if (diffList[i] >= 3) {
      //   //     carryOn(i, i - 1, -1);
      //   //   }
      //   // });
      //
      //   // rangeRight(1, 5).forEach((i) => {
      //   //   while (diffList[i] >= 3) {
      //   //     carryOn(i, i - 1, -1);
      //   //   }
      //   //   console.log(diffList);
      //   // });
      //
      //   // rangeRight(5).forEach((i) => {
      //   //
      //   // });
      //   //
      //   // range(5).forEach((i) => {
      //   //   if (diffList[i] < 0) {
      //   //     carryOn(diffList, i, 0, -1);
      //   //
      //   //     console.log(diffList);
      //   //   }
      //   // });
      //
      //   // range(0, 5).forEach((j) => {
      //   // range(4, 0, -1).forEach((i) => {
      //   //   while (diffList[i] < 0) {
      //   //     carryOff(diffList, i - 1);
      //   //     console.log(diffList);
      //   //   }
      //   // });
      //   // });
      //
      //   // lodash.forEach(diffList, (v, i) => {
      //   //   while (i < diffList.length - 1 && diffList[i] < 0) {
      //   //     carryOn(diffList, i + 1);
      //   //     console.log(diffList);
      //   //   }
      //   // });
      //
      //   // lodash.forEach(diffList, (v, i) => {
      //   //   while (
      //   //     i < diffList.length - 1 &&
      //   //     diffList[i] < 0 &&
      //   //     diffList[i + 1] > 0
      //   //   ) {
      //   //     diffList[i]--;
      //   //     diffList[i + 1] += 3;
      //   //   }
      //   // });
      //
      //   console.log("------------------------------");
      //   console.log("needList:", needList.toString());
      //   console.log("ownList: ", ownList.toString());
      //   console.log("diffList:", diffList.toString());
      //   console.log("------------------------------");
      //
      //   console.log(
      //     `calcDiffList([${needList.toString()}],[${ownList.toString()}]).toString() === [${diffList.toString()}].toString()`
      //   );
      //
      //   return diffList;
      // };
      //
      // this.diffList = calcDiffList(this.needList, this.ownList);
      //
      // this.usefulownSum = zipWith(this.ownList, this.diffList, (own, diff) =>
      //   diff < 0 ? own + diff : own
      // ).reduce(carrySum(3));
      //
      // this.diffsSum = this.needSum - this.usefulownSum;
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

.el-input-number {
  width: 100px;
}

.counter {
  width: 800px;
  margin: 0 auto;
}

@media (max-width: 500px) {
  .counter {
    flex-direction: column;
    width: 94vw !important;
  }
}
</style>
