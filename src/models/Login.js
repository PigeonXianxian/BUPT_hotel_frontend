import { API_ENDPOINT } from "../models/config";

export default class User {
  constructor() {
    this.username = "pigeonXian";
    this.password = "114514";
    this.userType = "administrator";
  }

  async Login(apiPath) {
    const apiUrl = `${API_ENDPOINT}${apiPath}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("用户登录成功", result);
        const userType = result.userType;
        if (userType === "customer") {
          console.log("跳转命令执行");
          window.location.href = "/panel"; // 顾客
        } else if (userType === "manager") {
          window.location.href = "/customer"; // 经理
        } else if (userType === "reception") {
          window.location.href = "/customer";
        } else if (userType === "reception") {
          // 前台
          window.location.href = "/customer";
        } else if (userType === "administrator") {
          // 管理员
          window.location.href = "/admin";
        } else {
          console.error("未知用户类型");
        }
      } else {
        console.error("用户登录失败:", response.statusText);
      }
    } catch (error) {
      console.error("请求发生错误:", error);
    }
  }

  async Register(apiPath) {
    const apiUrl = `${API_ENDPOINT}${apiPath}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
          userType: this.userType,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("用户注册成功", result);
        window.location.href = "/login";
      } else {
        console.error("用户注册失败:", response.statusText);
      }
    } catch (error) {
      console.error("请求发生错误:", error);
    }
  }
}
