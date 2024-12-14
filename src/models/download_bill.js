import { API_ENDPOINT } from '../models/config';  // 引入配置文件

export default class DownloadBill {
  constructor() {
    this.roomId = '';  // 房间号，初始化为空字符串
  }

  // 下载账单接口
  async downloadBill(apiPath) {
    const apiUrl = `${API_ENDPOINT}${apiPath}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',  // 使用 POST 方法
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({  // 传递房间号作为请求体
          room_id: parseInt(this.roomId, 10),  // 确保字段名为 room_id，且为整数
        }),
      });

      if (response.ok) {
        const data = await response.blob();  // 接收返回的 PDF 文件流

        // 返回 PDF 文件流
        return data;
      } else {
        console.error('请求失败:', response.statusText);
        const responseData = await response.json();
        console.error('详细错误:', responseData.err); // 输出后端返回的详细错误信息
        throw new Error(responseData.msg || '请求失败');
      }
    } catch (error) {
      console.error('请求发生错误:', error);
      throw error;  // 抛出错误以便调用方处理
    }
  }

  // 设置房间号
  setRoomID(room) {
    this.roomId = room;  // 直接使用输入的房间号
  }
}
