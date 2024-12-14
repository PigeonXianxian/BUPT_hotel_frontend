<template>
  <q-page class="flex flex-center">
    <div class="background"></div>
    <div class="container">
      <div class="left-side">
        <img src="../assets/images/light.png" class="shadow-5" alt="台灯" style="width: 100%; height: auto;">
      </div>
      <div class="right-side q-pa-md shadow-5">
        <h5 class="text-center">空调控制面板 管理员</h5>
        <div class="row items-center justify-between q-mt-sm">
          <span>当前工作模式：
            <q-btn outline style="color: white;" :label="administrator.operationMode" @click="toggleOperationMode" />
          </span>
          <span>
            <q-input dark label="缺省的目标温度：(°C)" label-color="orange"
            v-model.number="administrator.defaultTargetTemperature" type="number" style="max-width: 120px;"/>
          </span>
        </div>
        <div style="height: 20px;"></div>
        <div class="row items-center justify-between">
          <span>有效温度区间:</span>
          <span>最低温：{{ administrator.temperatureRange.min }}°C</span>
          <span>最高温：{{ administrator.temperatureRange.max }}°C</span>
        </div>
        <div class="q-pa-md">
          <q-range
            v-model="administrator.temperatureRange"
            :min="15"
            :max="35"
            :step="1"
            label
            color="white"
            label-text-color="black"
          />
        </div>
        <div><span>空调计费费率设置：（元/1°C）</span></div>
        <div style="height: 20px;"></div>
        <div class="row items-center justify-between q-mt-sm">
          <q-input dark v-model="administrator.lowSpeedRate" label="低速费率" label-color="green" style="max-width: 70px;"/>
          <q-input dark v-model="administrator.mediumSpeedRate" label="中速费率" label-color="orange" style="max-width: 70px;"/>
          <q-input dark v-model="administrator.highSpeedRate" label="高速费率" label-color="red" style="max-width: 70px;"/>
        </div>
        <div style="height: 20px;"></div>
        <div class="row justify-center q-mt-lg">
          <q-btn
            outline
            style="color: white; width: 200px;"
            :label="administrator.acStatus ? '关机' : '开机'"
            @click="toggleAC"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import Administrator from 'src/models/Administrator';

const administrator = reactive(new Administrator());

// 切换空调开关
const toggleAC = () => {
  administrator.acStatus = !administrator.acStatus;
  if(administrator.acStatus){
    administrator.AdminPowerOn('/admin/adminpoweron');
  } else{
    administrator.AdminPowerOff('/admin/adminpoweroff');
  }
};

// 切换工作模式
const toggleOperationMode = () => {
  administrator.operationMode = administrator.operationMode === '制冷' ? '制热' : '制冷';
  if(administrator.acStatus){
    administrator.ChangeMode('/admin/changemode');
  }
};

// 监听温度范围变化
watch(
  () => administrator.temperatureRange,
  (newValue) => {
    console.log(newValue);
    if(administrator.acStatus){
      administrator.ChangeTempRange('/admin/changetemprange');
    }
  }
);

watch(
  () => administrator.defaultTargetTemperature,
  (newValue) => {
    console.log(newValue);
    if(administrator.acStatus){
      administrator.ChangeDefaultTemp('/admin/changedefaulttemp');
    }
  }
);

watch(
  () => ({
    lowSpeedRate: administrator.lowSpeedRate,
    mediumSpeedRate: administrator.mediumSpeedRate,
    highSpeedRate: administrator.highSpeedRate,
  }),
  (newValue) => {
    console.log(newValue);
    if(administrator.acStatus){
      administrator.ChangeRate('/admin/changerate');
    }
  }
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
