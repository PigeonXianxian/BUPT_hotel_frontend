<template>
  <div class="container">
    <!-- 导航栏 -->
    <div class="button-group">
      <button
        @click="changeReportPeriod('daily')"
        :class="{ active: reportPeriod === 'daily' }"
      >
        日报
      </button>
      <button
        @click="changeReportPeriod('weekly')"
        :class="{ active: reportPeriod === 'weekly' }"
      >
        周报
      </button>
    </div>

    <!-- 表格部分 -->
    <table class="data-table" v-show="reportData.length > 0">
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
    <div v-show="reportData.length > 0" class="chart-container">
      <button @click="viewChart('line')">折线图</button>
      <button @click="viewChart('pie')">饼图</button>
      <div ref="chartContainer" class="chart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts"; // 引入 ECharts
import AirConReport from "../models/Monitor"; // 引入 AirConReport 类

export default {
  name: "MonitorPage",
  data() {
    return {
      reportPeriod: "daily", // 默认为日报
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
        // 获取报表数据
        const data = await this.airConReportInstance.getAirConReport(
          "/api/aircon/report"
        );

        // 更新报表数据
        this.reportData = data;

        // 默认显示折线图
        this.viewChart("line");
      } catch (error) {
        console.error("报表数据获取失败:", error);
      }
    },

    // 查看图表
    viewChart(type = "line") {
      const chartContainer = this.$refs.chartContainer;
      const data = {
        labels: this.reportData.map((item) => item.room), // 房间号作为x轴标签
        datasets: [
          {
            label: "总费用",
            data: this.reportData.map((item) => parseFloat(item.totalCost)), // 总费用作为y轴数据
          },
        ],
      };

      let option = {};
      if (type === "line") {
        // 折线图
        option = {
          xAxis: {
            type: "category",
            data: data.labels,
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: data.datasets[0].data,
              type: "line",
              smooth: true,
              lineStyle: { color: "#ff6384" },
            },
          ],
        };
      } else if (type === "pie") {
        // 饼图
        option = {
          series: [
            {
              name: "总费用",
              type: "pie",
              data: data.labels.map((label, index) => ({
                name: label,
                value: data.datasets[0].data[index],
              })),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
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
      window.addEventListener("resize", () => {
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
.container {
  max-width: 100%; /* 容器宽度设置为 100% 或全屏 */
  margin: 50px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

button.active {
  background-color: #0056b3;
}

button:hover {
  background-color: #0056b3;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

table th,
table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: center;
}

.chart-container {
  text-align: center;
  width: 100%; /* 容器宽度为100% */
  max-width: 100%; /* 最大宽度为100% */
  margin: 0 auto; /* 居中容器 */
  margin-top: 30px;
}

.chart {
  width: 100%; /* 宽度100%，占满容器 */
  height: 400px; /* 固定高度，避免过小 */
}
</style>
