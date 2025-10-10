<template>
<span>

组件数据：{{ type }} {{ _data }} {{ _isComplete }}
  <el-input v-model="test"></el-input>
</span>

</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    type: string
    _data: any
    _isComplete: boolean
  }>(),
  {}
)

let test = ref('test')

onMounted(() => {
  console.log('mounted')
  console.log(test.value)
})
onBeforeUnmount(() => {
  console.log('unmounted')
})
</script>

<style lang="scss" scoped></style>
