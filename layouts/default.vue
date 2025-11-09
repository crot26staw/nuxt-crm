<script lang="ts" setup></script>
<template>
  <div class="nuxt-wrapper">
    <AppHeader />
    <div class="nuxt-content">
      <slot />
    </div>
  </div>
</template>
<style lang="scss">
.nuxt-wrapper {
  display: flex;
}
.nuxt-content{
  padding: 60px 40px;
  width: 100%;
}
</style>