<template>
  <!-- 用户头像及描述 -->
  <div class="user-info-wrap">
    <!-- <div class="user-head">A</div> -->
    <div class="user-question">
      <slot></slot>
      <!-- <div class="is-loading--box" v-if="receiveLoading">
          <el-icon class="is-loading" size="28" color="#999" 
            ><Loading
          /></el-icon>
        </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
// import { Loading } from '@element-plus/icons-vue'


</script>

<style lang="scss" scoped>
.user-info-wrap {
  display: flex;
  align-items: start;
  column-gap: 20px;
  box-sizing: border-box;
  padding-right: 2px;
  margin-bottom: 32px;
  color: var(--user-question-text-color);
}
.user-head {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--user-question-bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  margin-top: 6px;
}
.user-question {
  // padding-top: 3px;
  flex: 1;
  overflow: hidden;
}
</style>
