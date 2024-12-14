<template>
  <div class="welcome-container">
    <div class="header">
      <h1><q-icon name="hotel" />welcome</h1>
      <h2>欢迎来到波普特廉价大酒店</h2>
      <h4>点击左边的导航栏以进入不同功能的界面</h4>
    </div>
  </div>
</template>

<script>
export default {
  name: "WelcomePage",
};
</script>

<style scoped>
.welcome-container {
  text-align: center;
  margin-top: 0px;
  background-image: url("src/assets/images/hotel-background.jpg");
  background-size: cover;
  color: #fff; /* 文字颜色 */
}
.header {
  padding: 200px;
  background: rgba(0, 0, 0, 0.5); /* 半透明背景 */
}
</style>
