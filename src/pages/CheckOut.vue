<template>
  <q-page class="flex flex-center">
    <div class="background"></div>
    <div class="overlay"></div> <!-- 透明图层 -->
    <div class="container">
      <!-- 左侧房间号查询 -->
      <div class="left-side q-pa-md shadow-5">
        <h5 class="text-center">房间号查询</h5>
        <q-input
          filled
          v-model="roomNumber"
          label="请输入房间号"
          type="number"
          class="q-w-sm q-mb-md"
          label-color="black"
        />
        <q-btn
          label="查询房间"
          icon="search"
          @click="queryRoom"
          class="full-width q-mt-md"
          style="color: black; width: 200px; background: rgb(229,193,133)"
        />
      </div>

      <!-- 右侧账单下载和详情 -->
      <div class="right-side q-pa-md shadow-5">
        <h5 class="text-center">账单管理</h5>
        <div class="q-mb-md">
          <q-input
            filled
            v-model="billRoomId"
            label="请输入房间号以下载账单"
            type="number"
            class="q-w-sm"
            label-color="black"
          />
          <q-btn
            label="下载账单"
            icon="download"
            @click="downloadBill"
            class="full-width q-mt-md"
            style="color: black; width: 200px; background: rgb(229,193,133)"
          />
        </div>
        <div class="q-mb-md">
          <q-input
            filled
            v-model="detailRoomId"
            label="请输入房间号以下载详单"
            type="number"
            class="q-w-sm"
            label-color="black"
          />
          <q-btn
            label="下载详单"
            icon="download"
            @click="downloadDetails"
            class="full-width q-mt-md"
            style="color: black; width: 200px; background: rgb(229,193,133)"
          />
        </div>
        <q-separator class="q-mt-md q-mb-md" />

        <!-- 账单展示 -->
        <div v-if="showBill" class="bill-section">
          <h3 class="text-center">账单</h3>
          <q-table :rows="billItems" :columns="columns" flat class="q-mt-md">
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="item" :props="props">{{ props.row.item }}</q-td>
                <q-td key="cost" :props="props">{{ props.row.cost }}</q-td>
              </q-tr>
            </template>
          </q-table>
        </div>

        <!-- 支付按钮 -->
        <q-btn
          label="立即支付"
          icon="payment"
          style="color: black; width: 200px; background: rgb(229,193,133)"
          @click="pay"
          class="full-width q-mt-lg"
          v-if="showBill"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import CheckOut from "../models/Checkout";
import DownloadBill from "../models/download_bill";
import DownloadDetail from "../models/download_detail";

export default {
  name: "CheckOut",
  data() {
    return {
      roomNumber: "",
      billRoomId: "",
      detailRoomId: "",
      showBill: false,
      billItems: [],
      columns: [
        { name: "item", label: "项目", align: "left", field: "item" },
        { name: "cost", label: "费用", align: "left", field: "cost" },
      ],
      checkoutInstance: new CheckOut(),
      downloadBillAPI: new DownloadBill(),
      downloadDetailAPI: new DownloadDetail(),
    };
  },
  methods: {
    async queryRoom() {
      if (!this.roomNumber) {
        this.$q.notify({
          color: "negative",
          position: "top",
          message: "请输入房间号",
          icon: "warning",
        });
        return;
      }
      const roomIdInt = parseInt(this.roomNumber, 10);
      if (isNaN(roomIdInt)) {
        this.$q.notify({
          color: "negative",
          position: "top",
          message: "请输入有效的房间号",
          icon: "warning",
        });
        return;
      }
      await this.fetchBill(roomIdInt);
    },

    async fetchBill(roomId) {
      try {
        this.checkoutInstance.setCheckOutInfo(roomId);
        await this.checkoutInstance.checkout("/api/checkout");

        const {
          checkInTime,
          checkOutTime,
          cost,
          airConFare,
          clientID,
          clientName,
          msg,
        } = this.checkoutInstance;

        if (msg === "退房成功") {
          this.billItems = [
            { item: "用户姓名", cost: clientName },
            { item: "身份证号", cost: clientID },
            { item: "房费", cost: `￥${cost}元` },
            { item: "空调使用费", cost: `￥${airConFare}元` },
            { item: "入住时间", cost: checkInTime },
            { item: "离开时间", cost: checkOutTime },
            { item: "总计", cost: `￥${cost + airConFare}元` },
          ];
          this.showBill = true;
        } else {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: `错误: ${msg}`,
            icon: "error",
          });
        }
      } catch (error) {
        console.error("获取账单失败：", error);
        this.$q.notify({
          color: "negative",
          position: "top",
          message: "获取账单失败，请稍后再试",
          icon: "error",
        });
      }
    },

    async downloadBill() {
      if (!this.billRoomId) {
        this.$q.notify({
          color: "negative",
          position: "top",
          message: "请输入房间号以下载账单",
          icon: "warning",
        });
        return;
      }

      try {
        this.downloadBillAPI.setRoomID(this.billRoomId);
        const billContent = await this.downloadBillAPI.downloadBill("/api/print-bill");
        this.downloadPDF(billContent, "账单.pdf");
      } catch (error) {
        console.error("下载账单失败:", error);
      }
    },

    async downloadDetails() {
      if (!this.detailRoomId) {
        this.$q.notify({
          color: "negative",
          position: "top",
          message: "请输入房间号以下载详单",
          icon: "warning",
        });
        return;
      }

      try {
        this.downloadDetailAPI.setRoomID(this.detailRoomId);
        const detailsContent = await this.downloadDetailAPI.downloadDetail("/api/print-detail");
        this.downloadPDF(detailsContent, "详单.pdf");
      } catch (error) {
        console.error("下载详单失败:", error);
      }
    },

    downloadPDF(blob, filename) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    },
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
  justify-content: space-between;
  width: 80%;
  max-width: 900px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.left-side, .right-side {
  width: 48%;
  background-color: rgba(255, 240, 212, 0.9);
  padding: 20px;
  border-radius: 8px;
}

h5.text-center {
  text-align: center;
  font-weight: bold;
}

.q-btn--standard {
  font-weight: bold;
}

.q-btn {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.q-table {
  border-radius: 8px;
}

.q-mt-md, .q-mb-md {
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>
