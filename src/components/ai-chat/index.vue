<template>
  <aiChat v-if="a" v-model="messages" :defaultSend="initData"></aiChat>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import aiChat from './Chat.vue'
import { sleepHand } from '@/utils'

let dialogVisible = ref(false)

let messages = ref<Array<any>>([
  {
    role: 'assistant',
    useReasoner: false,
    content: ``,
    reasoning_content: ''
  }
])

onMounted(() => {
  init()
})

// 需要重定义格式 如 [my-component] ({"a":"my-component"})
let initData = `请填写数据
:::my-component {"a":"my-component"}::: 
:::my-component-b {"a":"my-component"}::: 
   **文本**
:::my-card {"a":"my-card"}::: 
[my-component] ({"a":"my-component"})
   `

/**
 * 模拟流式返回
 */
const init = async () => {
  dialogVisible.value = true
  initData.split('')
  for (var i of initData.split('')) {
    await sleepHand(150)
    messages.value[0].content += i
  }
}

let a = ref(true)

setTimeout(() => {
  // a.value = false
}, 1000 * 5)

defineExpose({
  init
})
</script>

<style lang="scss" scoped></style>
