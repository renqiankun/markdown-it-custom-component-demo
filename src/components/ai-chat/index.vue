<template>
  <aiChat v-if="a" v-model="messages"></aiChat>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import aiChat from './Chat.vue'
import { sleepHand } from '@/utils'
  import { eventBus } from '@/utils/eventBus';

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
  initEventHand()
})
const initEventHand = () => {
  eventBus.on('addMessage', (data: any) => {
    messages.value.push({
      role: 'user',
      useReasoner: false,
      content: data
    })
  })
}
const init = async () => {
  dialogVisible.value = true

  let list = `请填写数据
   :::my-component {input{name:'a'},date:{name:'b'}}:::
   `

  //   let list = `文本
  //  :::my-component {"data":[1,2,3]} :`

  list.split('')
  for (var i of list.split('')) {
    await sleepHand(10)
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
