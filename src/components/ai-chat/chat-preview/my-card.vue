<template>
  <div class="my-card-wrap">
    这是my-card组件， 接受到数据： {{ _data }}
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { onBeforeUnmount, onMounted, ref } from 'vue'
const props = withDefaults(
  defineProps<{
    type: string
    _data: any
    _isComplete: boolean
  }>(),
  {}
)

let test = ref('')

onMounted(() => {
  console.log('mounted')
})
onBeforeUnmount(() => {
  console.log('unmounted')
})

</script>

<style lang="scss" scoped>
  .my-card-wrap{
    width: 500px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    padding: 20px;
    border-radius: 10px;
    margin: 10px;
  }
</style>
