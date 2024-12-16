<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated :style="{ backgroundColor: 'rgb(254,166,113)' }">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> BUPT大酒店 </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen">
      <q-list>
        <q-item-label style="color: rgb(0, 0, 0)" header> </q-item-label>

        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
            <q-icon name="home" style="color: rgb(254, 166, 113)" />
          </q-item-section>
          <q-item-section>
            <q-item-label style="color: rgb(0, 0, 0)">回到首页</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/check-in">
          <q-item-section avatar>
            <q-icon name="hotel" style="color: rgb(254, 166, 113)" />
          </q-item-section>
          <q-item-section>
            <q-item-label style="color: rgb(0, 0, 0)">入住界面</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/check-out">
          <q-item-section avatar>
            <q-icon name="money" style="color: rgb(254, 166, 113)" />
          </q-item-section>
          <q-item-section>
            <q-item-label style="color: rgb(0, 0, 0)">结账界面</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/monitoring">
          <q-item-section avatar>
            <q-icon name="remove_red_eye" style="color: rgb(254, 166, 113)" />
          </q-item-section>
          <q-item-section>
            <q-item-label style="color: rgb(0, 0, 0)"
              >监控界面_经理</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin">
          <q-item-section avatar>
            <q-icon name="person" style="color: rgb(254, 166, 113)" />
          </q-item-section>
          <q-item-section>
            <q-item-label style="color: rgb(0, 0, 0)">管理员界面</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/monitor">
          <q-item-section avatar>
            <q-icon name="remove_red_eye" style="color: rgb(254, 166, 113)" />
          </q-item-section>
          <q-item-section>
            <q-item-label style="color: rgb(0, 0, 0)"
              >监控界面_管理员</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/panel1">
          <q-item-section avatar>
            <q-icon name="person" style="color: rgb(254, 166, 113)" />
          </q-item-section>
          <q-item-section>
            <q-item-label style="color: rgb(0, 0, 0)"
              >房间1控制面板</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/panel2">
          <q-item-section avatar>
            <q-icon name="person" style="color: rgb(254, 166, 113)" />
          </q-item-section>
          <q-item-section>
            <q-item-label style="color: rgb(0, 0, 0)"
              >房间2控制面板</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/panel3">
          <q-item-section avatar>
            <q-icon name="person" style="color: rgb(254, 166, 113)" />
          </q-item-section>
          <q-item-section>
            <q-item-label style="color: rgb(0, 0, 0)"
              >房间3控制面板</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/panel4">
          <q-item-section avatar>
            <q-icon name="person" style="color: rgb(254, 166, 113)" />
          </q-item-section>
          <q-item-section>
            <q-item-label style="color: rgb(0, 0, 0)"
              >房间4控制面板</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/panel5">
          <q-item-section avatar>
            <q-icon name="person" style="color: rgb(254, 166, 113)" />
          </q-item-section>
          <q-item-section>
            <q-item-label style="color: rgb(0, 0, 0)"
              >房间5控制面板</q-item-label
            >
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";

defineOptions({
  name: "MainLayout",
});

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
