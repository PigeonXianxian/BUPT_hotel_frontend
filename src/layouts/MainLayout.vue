<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          BUPT大酒店
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          功能列表
        </q-item-label>

        <q-item clickable v-ripple to="/admin">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>管理员界面</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/monitor">
          <q-item-section avatar>
            <q-icon name="remove_red_eye" />
          </q-item-section>
          <q-item-section>
            <q-item-label>监控界面</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/panel">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label>房间1控制面板</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/panel2">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label>房间2控制面板</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/panel3">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label>房间3控制面板</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/panel4">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label>房间4控制面板</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/panel5">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label>房间5控制面板</q-item-label>
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
import { ref } from 'vue'

defineOptions({
  name: 'MainLayout'
})

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
