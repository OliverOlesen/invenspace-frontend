<script lang="ts" setup>
import { useTemplateStore } from "@/stores/template";

import BaseLayout from "../BaseLayout.vue";

// Main store
const store = useTemplateStore();

// Set default elements for this layout
store.setLayout({
  header: false,
  sidebar: false,
  sideOverlay: false,
  footer: false,
});

// Set various template options for this layout variation
store.mainContent({ mode: "full" });
</script>

<template>
  <BaseLayout />
</template>
