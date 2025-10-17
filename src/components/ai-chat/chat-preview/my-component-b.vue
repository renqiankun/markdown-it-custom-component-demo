<template>
  <div class="my-component-wrap">
    这是my-component-b组件，
    接受到数据： {{ _data }}
    <el-input v-model="test"></el-input>
    <el-button type="primary" @click="clickHand">提交</el-button>
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

const clickHand = () => {
  if (!test.value) {
    return ElMessage.warning('请输入内容')
  }
}
</script>

<style lang="scss" scoped>
  .my-component-wrap{
    width: 600px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    padding: 20px;
    border-radius: 10px;
    margin: 10px;
  }
</style>
