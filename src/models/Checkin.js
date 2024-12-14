import { API_ENDPOINT } from "../models/config"; // 引入配置文件

export default class CheckIn {
  constructor() {
    this.room = 0; // 房间号，初始化为整数 0
    this.client_id = ""; // 客户ID，初始化为空字符串
    this.client_name = ""; // 客户姓名，初始化为空字符串
    this.deposit = 0; // 押金，初始化为0
  }

  // 入住接口
  async checkIn(apiPath) {
    const apiUrl = `${API_ENDPOINT}${apiPath}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room_id: this.room, // 房间号，作为整数传入
          client_id: this.client_id, // 客户ID，作为字符串传入
          client_name: this.client_name, // 客户姓名，作为字符串传入
          deposit: this.deposit, // 押金，作为整数传入
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("入住成功:", data);

        // 处理返回结果
        if (data.msg === "入住成功") {
          console.log(`房间号：${data.RoomID}`);
        } else {
          console.error("入住失败:", data.msg);
        }
      } else {
        console.error("请求失败:", response.statusText);
      }
    } catch (error) {
      console.error("请求发生错误:", error);
    }
  }

  // 设置入住信息
  setCheckInInfo(room, client_id, client_name, deposit) {
    // 确保房间号是整数类型
    this.room = Number.isInteger(room) ? room : parseInt(room, 10);
    this.client_id = client_id;
    this.client_name = client_name;
    this.deposit = Number.isInteger(deposit) ? deposit : parseInt(deposit, 10); // 设置押金字段
  }
}
