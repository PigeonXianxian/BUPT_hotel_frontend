import { API_ENDPOINT } from '../models/config';  // 引入配置文件

export default class CheckOut {
  constructor() {
    this.roomId = ''; // 房间号，初始化为空字符串
    this.checkInTime = ''; // 入住时间
    this.checkOutTime = ''; // 退房时间
    this.cost = 0; // 房费
    this.airConFare = 0; // 空调费用
    this.clientName = ''; // 客户姓名
    this.clientID = ''; // 客户身份证号
    this.msg = ''; // 返回消息
  }

  // 退房接口
  async checkout(apiPath) {
    const apiUrl = `${API_ENDPOINT.replace(/\/$/, '')}${apiPath}`;

    // 确保 roomId 是整数
    const roomIdInt = parseInt(this.roomId, 10);

    // 检查 roomId 是否为有效的整数
    if (isNaN(roomIdInt)) {
      console.error('房间号无效');
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room_id: roomIdInt, // 确保发送整数类型的 room_id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('退房成功:', data);

        // 处理返回结果
        if (data.msg === '退房成功') {
          // 显示返回信息
          console.log(`入住时间：${data.CheckinTime}`);
          console.log(`退房时间：${data.CheckoutTime}`);
          console.log(`房费：${data.Cost}元`);
          console.log(`空调费用：${data.airConFare}元`);
          console.log(`客户姓名：${data.client_name}`);
          console.log(`客户身份证号：${data.client_ID}`);

          // 将返回的内容映射到本地字段
          this.checkInTime = data.CheckinTime;
          this.checkOutTime = data.CheckoutTime;
          this.cost = data.Cost;
          this.airConFare = data.airConFare;
          this.clientName = data.client_name;
          this.clientID = data.client_ID;
          this.msg = data.msg;  // 退房消息
        } else {
          console.error('退房失败:', data.msg);
        }
      } else {
        console.error('请求失败:', response.statusText);
      }
    } catch (error) {
      console.error('请求发生错误:', error);
    }
  }

  // 设置退房信息
  setCheckOutInfo(roomId) {
    this.roomId = roomId;
  }
}
