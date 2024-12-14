<template>
  <q-page class="container">
    <h2 class="q-mb-md"><q-icon name="hotel" /> 入住流程</h2>
    <q-stepper
      ref="stepper"
      v-model="step"
      vertical
      color="primary"
      class="q-pa-md"
    >
      <!-- 入住流程表单 -->
      <q-step default name="info" title="提供身份证" :done="step > 'info'">
        <q-input filled v-model="name" label="姓名：" autocomplete="name" />
        <q-input filled v-model="id" label="身份证号：" autocomplete="id" />
        <q-btn
          @click="next"
          :disable="!id || !name"
          color="primary"
          label="下一步"
          icon-right="arrow"
        />
      </q-step>
      <q-step name="deposit" title="收取押金" :done="step > 'deposit'">
        <q-input filled v-model="deposit" label="押金金额：" />
        <q-btn
          @click="next"
          :disable="!deposit"
          color="primary"
          label="下一步"
          icon-right="arrow_forward"
        />
      </q-step>
      <q-step name="room" title="分配房间" :done="step > 'room'">
        <q-input filled v-model="room" label="房间号：" autocomplete="room" />
        <q-input filled v-model="wifiPassword" label="Wi-Fi密码：" />
        <q-btn
          @click="submit"
          color="primary"
          label="完成入住"
          icon-right="done"
        />
      </q-step>
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
          <q-btn flat label="关闭" v-close-popup icon="close" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
.container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

body {
  font-family: "KaiTi", "楷体", Arial, sans-serif;
}
</style>
