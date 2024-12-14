<template>
  <q-page class="flex flex-center">
    <div class="background"></div>
    <div class="container">
      <div class="left-side">
        <img src="../assets/images/light.png" class="shadow-5" alt="台灯" style="width: 100%; height: auto;" />
      </div>
      <div class="right-side q-pa-md shadow-5">
        <h5 class="text-center">空调控制面板</h5>
        <div class="row items-center justify-between q-mt-sm">
          <span>房间号：{{ customer.roomNumber }}</span>
          <span>工作模式：{{ customer.operationMode || '——' }}</span>
        </div>
        <div style="height: 20px;"></div>
        <div class="row items-center justify-between">
          <span>当前室温: {{ customer.currentTemperature || '——' }}°C</span>
          <div class="row items-center">
            <span>目标温度:</span>
            <q-input v-if="customer.acState" dark
            v-model.number="customer.targetTemperature" type="number"
            style="width: 60px; margin-left: 8px;" />
            <span v-if="!customer.acState">&nbsp;——&nbsp;</span>
            <span>°C</span>
          </div>
        </div>
        <div class="row items-center justify-between q-mt-sm">
          <span>当前风速: {{ customer.currentFanSpeed || '——' }}</span>
          <div class="q-gutter-sm">
            <q-radio :disable="!customer.acState" keep-color v-model="customer.currentFanSpeed" val="低" label="低" color="green" />
            <q-radio :disable="!customer.acState" keep-color v-model="customer.currentFanSpeed" val="中" label="中" color="orange" />
            <q-radio :disable="!customer.acState" keep-color v-model="customer.currentFanSpeed" val="高" label="高" color="red" />
          </div>
        </div>
        <div style="height: 20px;"></div>
        <div class="row items-center justify-between q-mt-sm">
          <span>当前费用: {{ customer.currentCost === null ? '——' : customer.currentCost.toFixed(2) + '元'}}</span>
          <span>累计费用: {{ customer.totalCost === null ? '——' : customer.totalCost.toFixed(2) + '元' }}</span>
        </div>
        <div style="height: 20px;"></div>
        <div class="row justify-center q-mt-lg">
          <q-btn
            outline
            style="color: white; width: 200px;"
            :label="customer.acState ? '关机' : '开机'"
            @click="toggleAC"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>


<script setup>
import { ref, reactive, watch } from 'vue';
import Customer from 'src/models/Customer';

// 创建 Customer 实例并用 Vue 的响应式系统包裹
const customer = reactive(new Customer(2));

const toggleAC = () => {
customer.acState = !customer.acState;
if (customer.acState) {
  customer.PowerOn('/panel/poweron'); // 启动空调，传入相应的API路径
} else{
  customer.PowerOff('/panel/poweroff');
}
};

watch(
() => customer.targetTemperature,
(newTemperature) => {
  console.log('目标温度已成功设置为:', newTemperature);
  customer.ChangeTemp('/panel/changetemp');
}
);

watch(
() => customer.currentFanSpeed,
(newFanSpeed) => {
  console.log('风速已更新为:', newFanSpeed);
  customer.ChangeSpeed('/panel/changespeed')
}
);

let timerId = null;
const RequestState = () => {
if (customer.acState) {
  console.log('发送请求')
  customer.RequestState('/panel/requeststate');
}};

// 监听acState的变化
watch(
() => customer.acState, // 监听acState
(newValue) => {
  console.log(newValue);
  if (newValue) {
    console.log('acState 为 true，启动定时器');
    timerId = setInterval(RequestState, 5000);
  } else {
    console.log('acState 为 false，停止定时器');
    if (timerId) {
      clearInterval(timerId);
      timerId = null; // 清空定时器ID
    }
  }
},
{ immediate: true } // immediate: true 会在初始时就执行一次回调函数
);

</script>

<style scoped>
.background {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-image: url('../assets/images/bedroom.png');
background-size: cover;
filter: blur(4px);
z-index: -1;
}

.container {
display: flex;
width: 80%;
max-width: 800px;
}

.left-side {
width: 50%;
display: flex;
align-items: center;
justify-content: center;
}

.right-side {
width: 50%;
background-color: black;
color: white;
padding-left: 30px;    /* 左侧内边距 */
padding-right: 30px;   /* 右侧内边距 */
}

h5.text-center {
text-align: center;
}

.q-field__native, .q-field__label, .q-toggle__label {
color: white !important;
}

.q-btn--standard {
color: white;
}
</style>
