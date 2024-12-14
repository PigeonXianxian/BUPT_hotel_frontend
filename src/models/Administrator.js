import { API_ENDPOINT } from '../models/config';

export default class Administrator {
  constructor() {
    this.acStatus = false;
    this.operationMode = '制冷'; // 默认工作模式
    this.temperatureRange = {
      min: 15,
      max: 30
    };
    this.lowSpeedRate = 0.5;
    this.mediumSpeedRate = 1;
    this.highSpeedRate = 2;
    this.defaultTargetTemperature = 24; // 缺省的目标温度
  }

  async AdminPowerOn(apiPath) {
    const apiUrl = `${API_ENDPOINT}${apiPath}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operationMode: this.operationMode,
          minTemperature: this.temperatureRange.min,
          maxTemperature: this.temperatureRange.max,
          lowSpeedRate: this.lowSpeedRate,
          mediumSpeedRate: this.mediumSpeedRate,
          highSpeedRate: this.highSpeedRate,
          defaultTargetTemperature: this.defaultTargetTemperature,
        }),
      });

      if (response.ok) {
        console.log('管理员空调启动成功');
      } else {
        console.error('请求失败:', response.statusText);
      }
    } catch (error) {
      console.error('请求发生错误:', error);
    }
  }

  async AdminPowerOff(apiPath) {
    const apiUrl = `${API_ENDPOINT}${apiPath}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('管理员空调关闭成功:');
      } else {
        console.error('请求失败:', response.statusText);
      }
    } catch (error) {
      console.error('请求发生错误:', error);
    }
  }

  async ChangeMode(apiPath) {
    const apiUrl = `${API_ENDPOINT}${apiPath}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operationMode: this.operationMode,
        }),
      });
      if (response.ok) {
        console.log('模式切换设置成功');
      } else {
        console.error('请求失败:', response.statusText);
      }
    } catch (error) {
      console.error('请求发生错误:', error);
    }
  }

  async ChangeTempRange(apiPath) {
    const apiUrl = `${API_ENDPOINT}${apiPath}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          minTemperature: this.temperatureRange.min,
          maxTemperature: this.temperatureRange.max,
        }),
      });
      if (response.ok) {
        console.log('温度范围设置成功');
      } else {
        console.error('请求失败:', response.statusText);
      }
    } catch (error) {
      console.error('请求发生错误:', error);
    }
  }

  async ChangeDefaultTemp(apiPath) {
    const apiUrl = `${API_ENDPOINT}${apiPath}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          defaultTargetTemperature: this.defaultTargetTemperature,
        }),
      });
      if (response.ok) {
        console.log('缺省温度设置成功');
      } else {
        console.error('请求失败:', response.statusText);
      }
    } catch (error) {
      console.error('请求发生错误:', error);
    }
  }

  async ChangeRate(apiPath) {
    const apiUrl = `${API_ENDPOINT}${apiPath}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lowSpeedRate: this.lowSpeedRate,
          mediumSpeedRate: this.mediumSpeedRate,
          highSpeedRate: this.highSpeedRate,
        }),
      });
      if (response.ok) {
        console.log('费率设置成功');
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
        this.operationMode = data.operationMode,
        this.minTemperature = data.temperatureRange.min,
        this.maxTemperature = data.temperatureRange.max,
        this.lowSpeedRate = data.lowSpee = data
        this.mediumSpeedRate = data.mediumSpeedRate,
        this.highSpeedRate = data.highSpeedRate,
        this.defaultTargetTemperature = data.defaultTargetTemperature,

        console.log('状态请求成功', data);
      } else {
        console.error('请求失败:', response.statusText);
      }
    } catch (error) {
      console.error('请求发生错误:', error);
    }
  }
}

