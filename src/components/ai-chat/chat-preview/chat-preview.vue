<template>
  <!-- 聊天预览 -->
  <div class="preview-wrap">
    
    <div class="preview-item" v-for="(item, index) in props.messages" :key="index">
      <div style="text-align: right;" v-if="item.role=='user'">{{ item.content }}</div>
      <!-- 回答 -->
      <chatAnswer v-else  :receiveLoading="receiveLoading && index + 1 === messages?.length">
        <MdPreview
          editorId="preview-only2"
          id="preview-only"
          :autoFoldThreshold="9999"
          theme="dark"
          previewTheme="default"
          class="chat-content"
          :modelValue="item.content"
        ></MdPreview>
      </chatAnswer>
    </div>
  </div>
</template>

<script setup lang="ts">
import chatAnswer from './chat-answer.vue'

import { MdPreview, config } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import customComponentPlugin, { type MDCustomPluginComponentOptions } from 'markdown-it-custom-component'
import 'markdown-it-custom-component/style.css'
import myComponent from './my-component.vue'
import { getCurrentInstance, onMounted, onUnmounted } from 'vue';

const { customPlugin, destroy } = customComponentPlugin();
const props = withDefaults(
  defineProps<{
    messages: any[]
    /**接受流中 */
    receiveLoading?: boolean
  }>(),
  {}
)
onMounted(() => {
})
onUnmounted(() => {
  destroy()
})

config({
  // markdownItConfig(md, options) {

  // },
  markdownItPlugins(plugins) {
    return [
      ...plugins,
      {
        type: 'customComponentPlugin',
        plugin: customPlugin,
        options: {
          debug: false,
          propsKey: '_data',
          placeholderClass: 'custom-placeholder',
          appContext: getCurrentInstance()?.appContext,
          components: {
             'my-component':{
                component: myComponent,
                forceMount: false,
                renderIntermediate: false,
                propsUseJson: false,
                multipleProps: false,
                propsKey: '_data',
                placeholderClass: 'custom-placeholder',
             } as MDCustomPluginComponentOptions
          }
        }
      }
    ]
  },
})
const getSafeHTML = (html: string) => {
  return html
}
</script>

<style lang="scss" scoped>
.preview-wrap {
  width: 100%;
  .preview-item {
    width: 100%;
  }

  ::v-deep(.reasoning-content) {
    .md-editor-preview {
      color: var(--answer-reason-text-color);
      font-size: 14px;
    }
  }
}
.is-loading--box {
  height: 40px;
  box-sizing: border-box;
  padding-top: 10px;
}

.default-wrap {
  text-align: center;
  padding-top: 80px;
  font-size: 18px;
  color: #dfdfdf;
}
</style>
