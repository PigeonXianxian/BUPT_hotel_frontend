<template>
  <div
    style="
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #669fef;
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
        <el-form :model="user" style="width: 80%" :rules="rules" ref="loginRef">
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
              prefix-icon="el-icon-user"
              size="large"
              placeholder="请输入账号"
              v-model="user.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              prefix-icon="el-icon-lock"
              size="large"
              show-password
              placeholder="请输入密码"
              v-model="user.password"
            ></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <div style="display: flex">
              <el-input
                prefix-icon="el-icon-circle-check"
                size="large"
                placeholder="请输入验证码"
                style="flex: 1"
                v-model="user.code"
              ></el-input>
              <div style="flex: 1; height: 36px">
                <valid-code
                  @input="getCode"
                  style="margin-top: 5px; margin-left: 5px"
                />
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="width: 100%; background-color: #669fef; height: 40px"
              @click="login"
              >登录</el-button
            >
          </el-form-item>
          <div style="display: flex">
            <div style="flex: 1; text-align: left">
              还没有账号？<span
                style="color: #669fef; cursor: pointer"
                @click="$router.push('/register')"
                >注册</span
              >
            </div>
            <div style="flex: 1; text-align: right">
              <span style="color: #669fef; cursor: pointer">忘记密码</span>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import ValidCode from "src/components/ValidCode.vue";
import User from "src/models/Login";
const USER = reactive(new User());

export default {
  name: "SystemLogin",
  components: {
    ValidCode,
  },
  data() {
    // 验证码校验
    const validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (value.toLowerCase() !== this.code) {
        callback(new Error("验证码错误"));
      } else {
        callback();
      }
    };

    return {
      code: "", // 验证码组件传递过来的code
      user: {
        code: "", // 表单里用户输入的code验证码
        username: "",
        password: "",
      },
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "blur" }],
      },
    };
  },
  created() {},
  methods: {
    getCode(code) {
      console.log(code);
      this.code = code.toLowerCase();
    },
    login() {
      this.$refs["loginRef"].validate((valid) => {
        if (valid) {
          // 验证通过
          console.log("发送登录验证请求");
          USER.username = this.user.username;
          USER.password = this.user.password;
          //console.log("当前USER数据:", USER);
          USER.Login("/api/login");
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
