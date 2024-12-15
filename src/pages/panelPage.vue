<template>
  <q-page class="flex flex-center">
    <div class="background"></div>
    <div class="overlay"></div> <!-- 新增的透明图层 -->
    <div class="container">
      <div class="left-side">
        <img
          src="../assets/images/light.png"
          class="shadow-5"
          alt="台灯"
          style="width: 100%; height: auto"
        />
      </div>
      <div class="right-side q-pa-md shadow-5">
        <h5 class="text-center">空调控制面板</h5>
        <div class="row items-center justify-between q-mt-sm">
          <span>房间号：{{ customer.roomNumber }}</span>
          <span>工作模式：{{ customer.operationMode || "——" }}</span>
        </div>
        <div style="height: 20px"></div>
        <div class="row items-center justify-between">
          <span>当前室温: {{ customer.currentTemperature || "——" }}°C</span>
          <div class="row items-center">
            <span>目标温度:</span>
            <q-input
              v-if="customer.acState"

              v-model.number="customer.targetTemperature"
              type="number"
              style="width: 60px; margin-left: 8px"
            />
            <span v-if="!customer.acState">&nbsp;——&nbsp;</span>
            <span>°C</span>
          </div>
        </div>
        <div class="row items-center justify-between q-mt-sm">
          <span>当前风速: {{ customer.currentFanSpeed || "——" }}</span>
          <div class="q-gutter-sm">
            <q-radio
              :disable="!customer.acState"
              keep-color
              v-model="customer.currentFanSpeed"
              val="低"
              label="低"
              color="green"
            />
            <q-radio
              :disable="!customer.acState"
              keep-color
              v-model="customer.currentFanSpeed"
              val="中"
              label="中"
              color="orange"
            />
            <q-radio
              :disable="!customer.acState"
              keep-color
              v-model="customer.currentFanSpeed"
              val="高"
              label="高"
              color="red"
            />
          </div>
        </div>
        <div style="height: 20px"></div>
        <div class="row items-center justify-between q-mt-sm">
          <span
            >当前费用:
            {{
              customer.currentCost === null
                ? "——"
                : customer.currentCost.toFixed(2) + "元"
            }}</span
          >
          <span
            >累计费用:
            {{
              customer.totalCost === null
                ? "——"
                : customer.totalCost.toFixed(2) + "元"
            }}</span
          >
        </div>
        <div style="height: 20px"></div>
        <div class="row justify-center q-mt-lg">
          <q-btn
            style="color: black; width: 200px; background: rgb(229,193,133)"
            :label="customer.acState ? '关机' : '开机'"
            @click="toggleAC"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onBeforeUnmount } from "vue";
import Customer from "src/models/Customer";

// 创建 Customer 实例并用 Vue 的响应式系统包裹
const customer = reactive(new Customer(1));

const toggleAC = () => {
  customer.acState = !customer.acState;
  if (customer.acState) {
    customer.PowerOn("/panel/poweron"); // 启动空调，传入相应的API路径
  } else {
    customer.PowerOff("/panel/poweroff");
  }
};

watch(
  () => customer.targetTemperature,
  (newTemperature) => {
    if (customer.acState) {
      console.log("目标温度已成功设置为:", newTemperature);
      customer.ChangeTemp("/panel/changetemp");
    }
  }
);

watch(
  () => customer.currentFanSpeed,
  (newFanSpeed) => {
    if (customer.acState) {
      console.log("风速已更新为:", newFanSpeed);
      customer.ChangeSpeed("/panel/changespeed");
    }
  }
);

// 定时器ID变量
let acStateTimerId = null;
let allStateTimerId = null;

// 定期发送 RequestState 的函数
const RequestState = () => {
  if (customer.acState) {
    console.log("发送空调状态请求");
    customer.RequestState("/panel/requeststate");
  }
};

// 定期发送 RequestAllState 的函数
const RequestAllState = () => {
  console.log("发送所有状态请求", customer.acState);
  customer.RequestAllState("/panel/requestallstate");
};

// 监听空调开关状态变化，控制空调状态定时器
watch(
  () => customer.acState,
  (newValue) => {
    if (newValue) {
      console.log("acState 为 true，启动空调状态定时器");
      acStateTimerId = setInterval(RequestState, 5000);
    } else {
      console.log("acState 为 false，停止空调状态定时器");
      if (acStateTimerId) {
        clearInterval(acStateTimerId);
        acStateTimerId = null;
      }
    }
  },
  { immediate: true }
);

// 在组件挂载时启动 RequestAllState 定时器
onMounted(() => {
  console.log("组件挂载，启动全状态定时器");
  allStateTimerId = setInterval(RequestAllState, 3000);
});

// 在组件卸载前清除所有定时器
onBeforeUnmount(() => {
  if (acStateTimerId) {
    clearInterval(acStateTimerId);
  }
  if (allStateTimerId) {
    clearInterval(allStateTimerId);
  }
});
</script>

<style scoped>
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("../assets/images/bedroom.png");
  background-size: cover;
  filter: blur(4px);
  z-index: -1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3); /* 白色透明度30% */
  z-index: 0;
}

.container {
  display: flex;
  width: 80%;
  max-width: 800px;
  z-index: 1; /* 确保容器在最上层 */
  box-shadow: 0 0 30px -1px rgba(0, 0, 0, 0.8); /* 添加较强阴影 */
}

.left-side {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.right-side {
  width: 50%;
  background-color: rgba(255,240,212,0.9); /* 修改背景颜色 */
  color: black; /* 文字颜色调整为黑色以便阅读 */
  padding-left: 30px; /* 左侧内边距 */
  padding-right: 30px; /* 右侧内边距 */
  font-weight: bold; /* 加粗字体 */
}

h5.text-center {
  text-align: center;
  font-weight: bold; /* 加粗字体 */
}

.q-field__native,
.q-field__label,
.q-toggle__label {
  color: black !important; /* 字段文字颜色调整为黑色 */
  font-weight: bold; /* 加粗字体 */
}

.q-btn--standard {
  color: black; /* 按钮文字颜色调整为黑色 */
  font-weight: bold; /* 加粗字体 */
}
</style>



