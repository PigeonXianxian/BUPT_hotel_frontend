<template>
  <q-page class="flex flex-center">
    <div class="background"></div>
    <div class="overlay"></div>
    <div class="container">
      <!-- 导航栏 -->
      <div class="button-group">
        <q-btn @click="changeReportPeriod('daily')" :class="{'active': reportPeriod === 'daily'}" label="日报" style="color: black; width: 200px; background: rgb(229,193,133)" />
        <q-btn @click="changeReportPeriod('weekly')" :class="{'active': reportPeriod === 'weekly'}" label="周报" style="color: black; width: 200px; background: rgb(229,193,133)" />
      </div>

      <!-- 表格部分 -->
      <table v-show="reportData.length > 0" class="data-table">
        <thead>
          <tr>
            <th>房间号</th>
            <th>开关次数</th>
            <th>调度次数</th>
            <th>详单条数</th>
            <th>调温次数</th>
            <th>调风次数</th>
            <th>请求时长</th>
            <th>总费用</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in reportData" :key="index">
            <td>{{ row.room }}</td>
            <td>{{ row.switchCount }}</td>
            <td>{{ row.dispatchCount }}</td>
            <td>{{ row.detailCount }}</td>
            <td>{{ row.temperatureChangeCount }}</td>
            <td>{{ row.fanSpeedChangeCount }}</td>
            <td>{{ row.duration }}分钟</td>
            <td>{{ row.totalCost }}元</td>
          </tr>
        </tbody>
      </table>

      <!-- 报表图表部分 -->
      <div class="chart-container">
        <q-btn @click="viewChart('line')" label="折线图" style="color: black; width: 200px; background: rgb(229,193,133)" class="chart-btn" />
        <q-btn @click="viewChart('pie')" label="饼图" style="color: black; width: 200px; background: rgb(229,193,133)" class="chart-btn" />
        <div v-show="reportData.length > 0" ref="chartContainer" class="chart"></div>
      </div>
    </div>
  </q-page>
</template>

<script>
import * as echarts from 'echarts';  // 引入 ECharts
import AirConReport from '../models/Monitor';  // 引入 AirConReport 类

export default {
  name: 'MonitorPage',
  data() {
    return {
      reportPeriod: 'daily', // 默认为日报
      reportData: [], // 存储报表数据
      airConReportInstance: new AirConReport(), // 创建 AirConReport 类的实例
    };
  },
  methods: {
    // 切换日报和周报
    changeReportPeriod(period) {
      this.reportPeriod = period;
      this.fetchReportData(); // 切换周期后重新获取数据
    },

    // 获取报表数据
    async fetchReportData() {
      this.airConReportInstance.setPeriod(this.reportPeriod); // 设置报表周期
      try {
        const data = await this.airConReportInstance.getAirConReport('/api/aircon/report');
        this.reportData = data;

        // 使用 nextTick 确保图表容器已经渲染
        this.$nextTick(() => {
          this.viewChart('line'); // 默认显示折线图
        });
      } catch (error) {
        console.error("报表数据获取失败:", error);
      }
    },

    // 查看图表
    viewChart(type = 'line') {
      const chartContainer = this.$refs.chartContainer;
      const data = {
        labels: this.reportData.map(item => item.room), // 房间号作为x轴标签
        datasets: [
          {
            label: '总费用',
            data: this.reportData.map(item => parseFloat(item.totalCost)), // 总费用作为y轴数据
          },
        ],
      };

      let option = {};
      if (type === 'line') {
        // 折线图
        option = {
          grid: {
            left: '10%',
            right: '10%',
            top: '20%',
            bottom: '20%',
          },
          xAxis: {
            type: 'category',
            data: data.labels,
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name: '总费用', // 设置系列名称，用于图例显示
              data: data.datasets[0].data,
              type: 'line',
              smooth: true,
              lineStyle: { color: '#ff6384' },
            },
          ],
        };
      } else if (type === 'pie') {
        // 饼图
        option = {
          series: [
            {
              name: '总费用',
              type: 'pie',
              radius: '50%',  // 设置饼图的半径为50%
              data: data.labels.map((label, index) => ({
                name: label,
                value: data.datasets[0].data[index],
              })),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        };
      }

      // 初始化 ECharts 实例
      const myChart = echarts.init(chartContainer);
      myChart.setOption(option); // 设置图表选项

      // 确保图表在窗口大小变化时自动适应
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
  },
  mounted() {
    this.fetchReportData(); // 页面加载时调用一次获取数据的方法
  },
};
</script>

<style scoped>
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("../assets/images/bedroom.png");
  background-size: cover;
  filter: blur(4px);
  z-index: -1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3);
  z-index: 0;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  max-width: 900px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.button-group {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.q-btn {
  margin: 0 10px;
  font-weight: bold;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

table th, table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: center;
}

.chart-container {
  text-align: center;
  width: 100%; /* 容器宽度为100% */
  margin: 0 auto; /* 居中容器 */
  margin-top: 30px;
}

.chart {
  width: 100%; /* 图表宽度100% */
  height: 500px; /* 固定高度，可以根据需要调整 */
  max-width: 100%; /* 最大宽度为100% */
  margin: 0 auto; /* 居中显示 */
  padding: 20px; /* 给图表内加点边距，避免过于紧凑 */
}
</style>
