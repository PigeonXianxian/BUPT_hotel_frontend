<template>
  <q-page class="container">
    <h2 class="q-mb-md"><q-icon name="money" /> 结账</h2>

    <!-- 下载账单部分 -->
    <div class="download-section q-mb-md">
      <!-- 输入框（下载账单） -->
      <div class="q-mb-md flex-center">
        <q-input
          filled
          v-model="billRoomId"
          label="请输入房间号以下载账单："
          type="number"
          class="q-w-sm"
        />
        <q-btn
          label="下载账单"
          icon="download"
          @click="downloadBill"
          color="primary"
          class="q-mt-sm q-w-sm"
        />
      </div>

      <!-- 输入框（下载详单） -->
      <div class="q-mb-md flex-center">
        <q-input
          filled
          v-model="detailRoomId"
          label="请输入房间号以下载详单："
          type="number"
          class="q-w-sm q-mt-md"
        />
        <q-btn
          label="下载详单"
          icon="download"
          @click="downloadDetails"
          color="primary"
          class="q-mt-sm q-w-sm"
        />
      </div>
    </div>

    <q-separator class="q-mt-md q-mb-md" />

    <!-- 房间号查询部分 -->
    <div class="flex-center">
      <q-input
        filled
        v-model="roomNumber"
        label="房间号："
        type="number"
        class="q-w-sm"
      />
      <q-btn
        label="查询房间"
        icon="search"
        @click="queryRoom"
        class="q-mt-sm q-w-sm"
      />
    </div>

    <q-separator class="q-mt-md q-mb-md" />

    <!-- 账单显示部分 -->
    <div v-if="showBill" class="bill-section q-pa-md">
      <h3>账单</h3>
      <q-table :rows="billItems" :columns="columns" flat class="q-mt-md">
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="item" :props="props">
              {{ props.row.item }}
            </q-td>
            <q-td key="cost" :props="props">
              <span v-if="props.row.item.includes('费')">{{
                props.row.cost
              }}</span>
              <span v-else>{{ props.row.cost }}</span>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <!-- 支付按钮 -->
    <q-btn
      label="立即支付"
      icon="payment"
      color="negative"
      @click="pay"
      class="full-width"
      v-if="showBill"
    />
  </q-page>
</template>

<script>
import CheckOut from "../models/Checkout"; // 引入 CheckOut 类
import DownloadBill from "../models/download_bill"; // 引入 DownloadBill 类
import DownloadDetail from "../models/download_detail"; // 引入 DownloadDetail 类

export default {
  name: "CheckOut",
  data() {
    return {
      roomNumber: "", // 房间号（查询用）
      billRoomId: "", // 房间号（下载账单用）
      detailRoomId: "", // 房间号（下载详单用）
      showBill: false, // 是否显示账单
      billItems: [], // 账单项目（总费用）
      columns: [
        {
          name: "item",
          required: true,
          label: "项目",
          align: "left",
          field: "item",
        },
        { name: "cost", label: "费用", align: "left", field: "cost" },
      ],
      checkoutInstance: new CheckOut(), // 新建 CheckOut 实例
      downloadBillAPI: new DownloadBill(), // 新建 DownloadBill 实例
      downloadDetailAPI: new DownloadDetail(), // 新建 DownloadDetail 实例
    };
  },
  methods: {
    // 查询房间信息并生成账单
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

    // 下载账单
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
        const billContent = await this.downloadBillAPI.downloadBill(
          "/api/print-bill"
        );
        this.downloadPDF(billContent, "账单.pdf");
      } catch (error) {
        console.error("下载账单失败:", error);
      }
    },

    // 下载详单
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
        const detailsContent = await this.downloadDetailAPI.downloadDetail(
          "/api/print-detail"
        );
        this.downloadPDF(detailsContent, "详单.pdf");
      } catch (error) {
        console.error("下载详单失败:", error);
      }
    },

    // 下载 PDF 文件
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
.q-w-sm {
  max-width: 300px;
  width: 100%;
}
.flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
