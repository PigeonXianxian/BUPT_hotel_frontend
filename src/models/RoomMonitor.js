import { API_ENDPOINT } from '../models/config';

// RoomMonitor 类定义
export default class RoomMonitor {
  constructor(index) {
    this.index = index;
    this.roomNumber = null;
    this.currentTemperature = null;
    this.targetTemperature = null;
    this.acState = false;
    this.currentFanSpeed = null;
    this.currentCost = null;
    this.totalCost = null;
    this.operationMode = null;
    this.scheduleStatus = false;
    this.valid = false;
  }

  async MonitorPowerOn(apiPath) {
    const apiUrl = `${API_ENDPOINT}${apiPath}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomNumber: this.roomNumber,
        }),
      });

      if (response.ok) {
        console.log(`房间${this.roomNumber}空调开机成功`);
      } else {
        console.error('请求失败:', response.statusText);
      }
    } catch (error) {
      console.error('请求发生错误:', error);
    }
  }

  async MonitorPowerOff(apiPath) {
    const apiUrl = `${API_ENDPOINT}${apiPath}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomNumber: this.roomNumber,
        }),
      });

      if (response.ok) {
        console.log(`房间${this.roomNumber}空调关机成功`);
      } else {
        console.error('请求失败:', response.statusText);
      }
    } catch (error) {
      console.error('请求发生错误:', error);
    }
  }

  async MonitorRequestStates(apiPath) {
    const apiUrl = `${API_ENDPOINT}${apiPath}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          index: this.index,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        this.valid = data.valid;
        if(data.valid){
          this.roomNumber = data.roomNumber;
          this.currentTemperature = data.currentTemperature;
          this.targetTemperature = data.targetTemperature;
          this.acState = data.acState;
          this.currentFanSpeed = data.currentFanSpeed;
          this.currentCost = data.currentCost;
          this.totalCost = data.totalCost;
          this.operationMode = data.operationMode;
          this.scheduleStatus = data.scheduleStatus;
          console.log(`面板${this.index}状态请求成功`);
          console.log(this.roomNumber);
        } else{
          console.log(`面板${this.index}无对应房间`)
        }
      } else {
        console.error('请求失败:', response.statusText);
      }
    } catch (error) {
      console.error('请求发生错误:', error);
    }
  }
}
