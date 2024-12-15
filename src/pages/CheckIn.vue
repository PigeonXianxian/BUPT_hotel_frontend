<template>
  <q-page class="flex flex-center">
    <div class="background"></div>
    <div class="overlay"></div> <!-- 新增的透明图层 -->
    <div class="container">
      <h2 class="q-mb-md text-center">入住流程</h2>
      <q-stepper
        ref="stepper"
        v-model="step"
        vertical
        color="black"
        class="q-pa-md shadow-5"
      >
        <!-- 入住流程表单 -->
        <q-step__content default name="info" title="提供身份证" :done="step > 'info'">
          <q-input filled v-model="name" label="姓名：" autocomplete="name" label-color="black"/>
          <q-input filled v-model="id" label="身份证号：" autocomplete="id" label-color="black"/>
        </q-step__content>
        <q-step__content name="deposit" title="收取押金" :done="step > 'deposit'">
          <q-input filled v-model="deposit" label="押金金额：" label-color="black"/>
        </q-step__content>
        <q-step__content name="room" title="分配房间" :done="step > 'room'">
          <q-input filled v-model="room" label="房间号：" autocomplete="room" label-color="black"/>
          <q-input filled v-model="wifiPassword" label="Wi-Fi密码：" label-color="black"/>
          <q-btn
            style="color: black; width: 200px; background: rgb(229,193,133)"
            @click="submit"
            label="完成入住"
          />
        </q-step__content>
      </q-stepper>

      <!-- 确认对话框 -->
      <q-dialog v-model="dialog">
        <q-card>
          <q-card-section>
            <div v-if="checkInDetails">
              <h5 class="text-center">入住信息确认</h5>
              <p>姓名：{{ checkInDetails.name }}</p>
              <p>身份证号：{{ checkInDetails.id }}</p>
              <p>押金金额：{{ checkInDetails.deposit }}元</p>
              <p>房间号：{{ checkInDetails.room }}</p>
              <p>Wi-Fi密码：{{ checkInDetails.wifiPassword }}</p>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              label="关闭"
              style="color: black; width: 200px; background: rgb(229,193,133)"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import CheckIn from "../models/Checkin"; // 引入 CheckIn 类

export default {
  name: "CheckIn",
  data() {
    return {
      step: "info",
      name: "",
      id: "",
      deposit: "", // 押金字段
      room: "",
      wifiPassword: "",
      dialog: false,
      checkInDetails: null,
      checkInInstance: new CheckIn(), // 创建 CheckIn 类的实例
    };
  },
  methods: {
    next() {
      this.$refs.stepper.next();
    },

    async submit() {
      console.log("提交按钮被点击");

      // 保存用户输入的入住信息
      this.checkInDetails = {
        name: this.name,
        id: this.id,
        deposit: this.deposit, // 把押金信息保存到 checkInDetails 中
        room: this.room,
        wifiPassword: this.wifiPassword,
      };

      // 显示确认对话框
      this.dialog = true;

      // 设置入住信息（包括押金）
      this.checkInInstance.setCheckInInfo(
        Number(this.room),
        this.id,
        this.name,
        Number(this.deposit)
      ); // 确保 deposit 是整数类型

      // 调用 checkIn 类的方法进行入住操作
      await this.checkInAPI();

      // 重置步骤
      this.$refs.stepper.reset();
    },

    // 调用 CheckIn 类的 checkIn 方法
    async checkInAPI() {
      try {
        await this.checkInInstance.checkIn("/api/checkin");
        // 如果入住成功，显示成功通知
        this.$q.notify({
          type: "positive",
          message: "入住成功！欢迎入住！",
          position: "top",
          timeout: 2000,
        });
      } catch (error) {
        // 错误处理
        console.error("入住失败:", error);
        this.$q.notify({
          type: "negative",
          message: "入住失败，请重试。",
          position: "top",
          timeout: 2000,
        });
      }
    },
  },
};
</script>

<style scoped>
/* 统一的背景 */
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

/* 统一的透明遮罩层 */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3); /* 白色透明度30% */
  z-index: 0;
}

/* 统一的容器样式 */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  max-width: 800px;
  background-color: rgba(255, 240, 212, 0.9); /* 修改背景颜色 */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

/* 统一标题样式 */
h2 {
  font-weight: bold;
  text-align: center;
  color: #333;
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
}

.q-stepper .q-stepper__step-title {
  font-weight: bold;
  color: #333;
}

.q-stepper .q-step__content {
  background-color: rgba(255, 240, 212, 0.9); /* 内容区背景色 */
}

.q-field__native,
.q-field__label {
  color: black !important;
  font-weight: bold;
}

/* 输入框的背景颜色 */
.q-input__control {
  background-color: rgba(255, 240, 212, 0.9);
}

body {
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
}
</style>
