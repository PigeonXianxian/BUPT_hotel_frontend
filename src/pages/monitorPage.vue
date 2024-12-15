<template>
  <q-page class="flex flex-center">
    <div class="background"></div>
    <div class="scroll-container">
      <div class="container">
        <div v-for="(room, index) in rooms" :key="index" class="room-container">
          <div class="right-side q-pa-md shadow-5">
            <h5 class="text-center">{{ room.roomNumber || "——" }}房空调监控</h5>
            <q-list bordered separator>
              <q-item>
                <q-item-section>
                  <q-item-label overline>房间信息</q-item-label>
                  <q-item-label
                    >房间号：{{ room.roomNumber || "——" }}</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label overline>空调当前运行状态</q-item-label>
                  <q-item-label>
                    <q-btn
                      v-if="room.valid"
                      outline
                      :label="room.acState ? '开机' : '关机'"
                      @click="toggleAcState(index)"
                    />
                    <span v-if="!room.valid">——</span>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label overline>工作模式</q-item-label>
                  <q-item-label>{{ room.operationMode || "——" }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label overline>温度信息</q-item-label>
                  <q-item-label
                    >当前室温:
                    {{
                      room.currentTemperature || "——"
                    }}°C&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;目标温度:
                    {{ room.targetTemperature || "——" }}°C</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label overline>当前风速</q-item-label>
                  <q-item-label>{{
                    room.currentFanSpeed || "——"
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label overline>费用信息</q-item-label>
                  <q-item-label
                    >当前费用:
                    {{
                      room.currentCost
                        ? room.currentCost.toFixed(2) + "元"
                        : "——"
                    }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;累计费用:
                    {{
                      room.totalCost ? room.totalCost.toFixed(2) + "元" : "——"
                    }}</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label overline>调度状态</q-item-label>
                  <q-item-label v-if="room.valid">{{
                    room.scheduleStatus ? "运行" : "等待"
                  }}</q-item-label>
                  <q-item-label v-if="!room.valid">——</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, onUnmounted, reactive } from "vue";
import RoomMonitor from "src/models/RoomMonitor";

// 创建响应式的rooms数据
const rooms = reactive([
  new RoomMonitor(1),
  new RoomMonitor(2),
  new RoomMonitor(3),
  new RoomMonitor(4),
  new RoomMonitor(5),
  new RoomMonitor(6),
  new RoomMonitor(7),
  new RoomMonitor(8),
  new RoomMonitor(9),
  new RoomMonitor(10),
]);

// 定时器ID，用于在组件卸载时清除
let intervalId = null;

// 切换空调状态的方法
const toggleAcState = (index) => {
  rooms[index].acState = !rooms[index].acState;
  if (rooms[index].acState) {
    rooms[index].MonitorPowerOn("/monitor/monitorpoweron");
  } else {
    rooms[index].MonitorPowerOff("/monitor/monitorpoweroff");
  }
};

// 在组件挂载后初始化定时器
onMounted(() => {
  // 初始状态请求
  rooms.forEach((room) => {
    room.MonitorRequestStates("/monitor/monitorrequeststates");
  });

  // 每隔3秒轮询房间状态
  intervalId = setInterval(() => {
    rooms.forEach((room) => {
      room.MonitorRequestStates("/monitor/monitorrequeststates");
    });
  }, 3000);
});

// 在组件卸载时清除定时器
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
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

.scroll-container {
  overflow-y: scroll;
  height: calc(100vh - 100px); /* 根据需要调整高度 */
  padding: 20px;
  scrollbar-width: none; /* Firefox */
}

.scroll-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.room-container {
  margin: 20px; /* 增加间距 */
  width: 45%; /* 调整宽度以适应两列布局 */
  max-width: 600px;
  transition: transform 0.3s ease; /* 添加过渡效果 */
}

.right-side {
  width: 100%;
  background-color: white;
  color: black;
  opacity: 0.8; /* 设置透明度为80% */
  padding-left: 30px; /* 左侧内边距 */
  padding-right: 30px; /* 右侧内边距 */
  padding-top: 15px; /* 上侧内边距 */
  padding-bottom: 40px; /* 下侧内边距 */
  border-radius: 15px; /* 圆角半径 */
  transition: opacity 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
}

.room-container:hover .right-side {
  opacity: 1; /* 鼠标悬停时透明度变为100% */
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3); /* 鼠标悬停时增加阴影 */
}

.room-container:hover {
  transform: translateY(-10px); /* 鼠标悬停时向上移动10px */
}
</style>



