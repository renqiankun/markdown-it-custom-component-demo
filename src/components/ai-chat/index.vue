<template>
  <aiChat v-if="a" v-model="messages"></aiChat>
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
const init = async () => {
  dialogVisible.value = true

  let list = `文本
   :::my-component {"data":[1,2,3]} :::  
   文本
  :::my-component {"data":[1,2,3]} ::: 
  文本`

  //   let list = `文本
  //  :::my-component {"data":[1,2,3]} :`

  list.split('')
  for (var i of list.split('')) {
    await sleepHand(100)
    messages.value[0].content += i
  }
  //  messages.value[0].content = list
}

let a = ref(true)

setTimeout(() => {
  // a.value = false
},1000 * 5)

defineExpose({
  init
})
</script>

<style lang="scss" scoped></style>
