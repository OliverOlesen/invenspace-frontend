<script setup lang="ts">
import { useRoute } from 'vue-router'
import BaseFormCreation from '@/components/BaseFormCreation.vue';

const route = useRoute();
const uuid = route.params.uuid;
const endpoint = "management/products/" + uuid;
const action = "edit";
</script>

<template>
  <BaseFormCreation :endpoint=endpoint :action=action />
</template>

<style scoped>

</style>