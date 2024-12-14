import { API_ENDPOINT } from "../models/config";

export default class User {
  constructor() {
    this.username = "pigeonXian";
    this.password = "114514";
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
          window.location.href = "/panel"; // 顾客
        } else if (userType === "manager") {
          window.location.href = "/monitoring"; // 经理
        } else if (userType === "reception") {
          window.location.href = "/check-in"; // 前台
        } else if (userType === "administrator") {
          window.location.href = "/admin"; // 管理员
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
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("用户注册成功", result);
        window.location.href = "/login";
      } else {
        if (response.status === 401) {
          console.error("顾客不存在");
          alert("顾客不存在");
        } else {
          console.error("用户注册失败:", response.statusText);
        }
      }
    } catch (error) {
      console.error("请求发生错误:", error);
    }
  }
}
