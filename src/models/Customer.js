// src/models/Customer.js
import { API_ENDPOINT } from '../models/config'; // 假设 API_ENDPOINT 是 'http://192.168.1.100:8080'

export default class Customer {
  constructor(roomNumber) {
    this.roomNumber = roomNumber;
    this.acState = false;
    this.currentTemperature = null;
    this.operationMode = null;
    this.targetTemperature = -1;
    this.currentCost = null;
    this.totalCost = null;
    this.currentFanSpeed = null; // 默认风速
  }

  async PowerOn(apiPath) {
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
        const data = await response.json();
        this.operationMode = data.operationMode;
        this.currentTemperature = data.currentTemperature;
        this.targetTemperature = data.targetTemperature;
        this.currentCost = data.currentCost;
        this.totalCost = data.totalCost;
        this.currentFanSpeed = data.currentFanSpeed;

        console.log('空调启动成功:', data);
      } else {
        console.error('请求失败:', response.statusText);
      }
    } catch (error) {
      console.error('请求发生错误:', error);
    }
  }

  async PowerOff(apiPath) {
    this.operationMode = null;
    this.currentFanSpeed = null;
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
        const data = await response.json();
        this.currentCost = data.currentCost;
        this.totalCost = data.totalCost;

        console.log('空调关机成功:', data);
      } else {
        console.error('请求失败:', response.statusText);
      }
    } catch (error) {
      console.error('请求发生错误:', error);
    }
  }

  async ChangeTemp(apiPath) {
    const apiUrl = `${API_ENDPOINT}${apiPath}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomNumber: this.roomNumber,
          targetTemperature: this.targetTemperature,
        }),
      });

      if (response.ok) {
        console.log('调温请求成功');
      } else {
        console.error('请求失败:', response.statusText);
      }
    } catch (error) {
      console.error('请求发生错误:', error);
    }
  }

  async ChangeSpeed(apiPath) {
    const apiUrl = `${API_ENDPOINT}${apiPath}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomNumber: this.roomNumber,
          currentFanSpeed: this.currentFanSpeed,
        }),
      });

      if (response.ok) {
        console.log('调温请求成功');
      } else {
        console.error('请求失败:', response.statusText);
      }
    } catch (error) {
      console.error('请求发生错误:', error);
    }
  }

  async RequestState(apiPath) {
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
        const data = await response.json();
        this.currentCost = data.currentCost;
        this.totalCost = data.totalCost;
        this.currentTemperature = data.currentTemperature;

        console.log('状态请求成功', data);
      } else {
        console.error('请求失败:', response.statusText);
      }
    } catch (error) {
      console.error('请求发生错误:', error);
    }
  }

  async RequestAllState(apiPath) {
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
        const data = await response.json();
        this.acState = data.acState;
        this.currentTemperature = data.currentTemperature;
        this.operationMode = data.operationMode;
        this.targetTemperature = data.targetTemperature;
        this.currentCost = data.currentCost;
        this.totalCost = data.totalCost;
        this.currentFanSpeed = data.currentFanSpeed;

        console.log('状态请求成功', data);
      } else {
        console.error('请求失败:', response.statusText);
      }
    } catch (error) {
      console.error('请求发生错误:', error);
    }
  }
}
