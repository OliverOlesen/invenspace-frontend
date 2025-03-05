<script setup lang="ts">

import BaseFormCreation from '@/components/BaseFormCreation.vue';

const endpoint = "management/products";
const action = "create";

</script>

<template>
  <BaseFormCreation :endpoint=endpoint :action=action />
</template>

<style scoped>

</style>