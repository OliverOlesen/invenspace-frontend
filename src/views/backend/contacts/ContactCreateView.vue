<script setup lang="ts">

import BaseFormCreation from '@/components/BaseFormCreation.vue';

const endpoint = "management/contacts";
const action = "create";

</script>

<template>
  <BaseFormCreation :endpoint=endpoint :action=action />
</template>

<style scoped>

</style>