<template>
  <div
    style="
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #0f9876;
    "
  >
    <div
      style="
        display: flex;
        background-color: white;
        width: 50%;
        border-radius: 5px;
        overflow: hidden;
      "
    >
      <div style="flex: 1">
        <img src="src/assets/images/login.jpg" alt="" style="width: 100%" />
      </div>
      <div
        style="
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <el-form
          :model="user"
          style="width: 80%"
          :rules="rules"
          ref="registerRef"
        >
          <div
            style="
              font-size: 20px;
              font-weight: bold;
              text-align: center;
              margin-bottom: 20px;
            "
          >
            BUPT酒店管理系统
          </div>
          <el-form-item prop="username">
            <el-input
              size="large"
              placeholder="请输入账号"
              v-model="user.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              size="large"
              show-password
              placeholder="请输入密码"
              v-model="user.password"
            ></el-input>
          </el-form-item>
          <el-form-item prop="confirmPass">
            <el-input
              size="large"
              show-password
              placeholder="请确认密码"
              v-model="user.confirmPass"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="width: 100%; background-color: #0f9876; height: 40px"
              @click="register"
              >注册</el-button
            >
          </el-form-item>
          <div style="display: flex">
            <div style="flex: 1; text-align: left">
              已有账号？<span
                style="color: #0f9876; cursor: pointer"
                @click="$router.push('/login')"
                >登录</span
              >
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import User from "src/models/Login";
const USER = reactive(new User());
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';

export default {
  name: "SystemRegister",
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton
  },
  data() {
    // 验证码校验
    const validatePassword = (rule, confirmPass, callback) => {
      if (confirmPass === "") {
        callback(new Error("请确认密码"));
      } else if (confirmPass !== this.user.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };

    return {
      user: {
        username: "",
        password: "",
        confirmPass: "",
      },
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        confirmPass: [{ validator: validatePassword, trigger: "blur" }],
      },
    };
  },
  created() {},
  methods: {
    register() {
      this.$refs["registerRef"].validate((valid) => {
        if (valid) {
          // 验证通过
          console.log("发送注册请求");
          USER.username = this.user.username;
          USER.password = this.user.password;
          //console.log("当前USER数据:", USER);
          USER.Register("/api/register");
          //this.$request.post('/login', this.user).then(res => {
          //    if (res.code === '200') {
          //        this.$router.push('/') // 跳转界面
          //        this.$message.success('登录成功')
          //    } else {
          //        this.$message.error(res.msg)
          //    }
          //})
        }
      });
    },
  },
};
</script>
