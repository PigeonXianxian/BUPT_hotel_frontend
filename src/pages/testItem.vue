<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-radio  v-model="color" val="teal" label="Teal" color="teal" />
      <q-radio  v-model="color" val="orange" label="Orange" color="orange" />
      <q-radio :disable="color === null" v-model="color" val="red" label="Red" color="red" />
      <q-radio :disable="color === null" v-model="color" val="cyan" label="Cyan" color="cyan" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const color = ref(null)

    // 在这里可以改变 color 为 null 来测试禁用效果
    // color.value = null

    return {
      color
    }
  }
}
</script>
