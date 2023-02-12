<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <div>
    <header>
      <nav class="navbar bg-body-tertiary py-3">
        <div class="container">
          <router-link class="navbar-brand fw-bold" to="/">ProjectXtrim</router-link>
        </div>
      </nav>
    </header>
    <RouterView />
  </div>
</template>

<style lang="scss">
@import "assets/scss/styles";
</style>
