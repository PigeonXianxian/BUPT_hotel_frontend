import { API_ENDPOINT } from "../models/config";

export default class User {
  constructor() {
    this.username = "pigeonXian";
    this.password = "114514";
  }

  // 用户登录
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

        const { userType, roomId } = result;

        switch (userType) {
          case "customer":
            // 对于顾客，将房间号添加到URL中
            if (roomId) {
              window.location.href = `/panel${roomId}`;
            } else {
              console.error("顾客登录缺少房间号");
            }
            break;

          case "manager":
            window.location.href = "/monitoring";
            break;

          case "reception":
            window.location.href = "/check-in";
            break;

          case "administrator":
            window.location.href = "/admin";
            break;

          default:
            console.error("未知用户类型:", userType);
        }
      } else {
        // 处理登录失败
        const errorData = await response.json();
        console.error("用户登录失败:", errorData.msg || response.statusText);
      }
    } catch (error) {
      console.error("请求发生错误:", error);
    }
  }

  // 用户注册
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
