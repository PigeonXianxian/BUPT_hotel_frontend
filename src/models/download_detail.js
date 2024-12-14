import { API_ENDPOINT } from '../models/config';  // 引入配置文件

export default class DownloadDetail {
  constructor() {
    this.roomId = 0;  // 房间号，初始化为整数 0
  }

  // 下载详单接口
  async downloadDetail(apiPath) {
    const apiUrl = `${API_ENDPOINT}${apiPath}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',  // 使用 POST 方法
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({  // 传递房间号作为请求体
          room_id: this.roomId,  // 确保字段名为 room_id
        }),
      });

      if (response.ok) {
        const data = await response.blob();  // 接收返回的 PDF 文件流

        // 返回 PDF 文件流
        return data;
      } else {
        console.error('请求失败:', response.statusText);
        const responseData = await response.json();
        console.error('详细错误:', responseData); // 输出后端返回的详细错误信息
        throw new Error('下载详单失败');
      }
    } catch (error) {
      console.error('请求发生错误:', error);
      throw error;  // 抛出错误以便调用方处理
    }
  }

  // 设置房间号
  setRoomID(room) {
    this.roomId = Number.isInteger(room) ? room : parseInt(room, 10); // 确保房间号是整数类型
  }
}
