<script setup lang="ts">
import { computed, defineProps } from "vue";

const props = defineProps({
  image: {
    type: String,
  },
  innerClass: {
    type: String,
  },
  imageTop: {
    type: Boolean,
    default: false,
  },
  imageBottom: {
    type: Boolean,
    default: false,
  },
  imageFixed: {
    type: Boolean,
    default: false,
  },
});

const classContainer = computed(() => {
  return {
    "bg-image-top": props.imageTop,
    "bg-image-bottom": props.imageBottom,
    "bg-image-fixed": props.imageFixed,
  };
});

</script>

<template>
  <div
    :style="props.image ? `background-image: url('${props.image}');` : null"
    :class="classContainer"
    class="bg-image"
  >
    <div v-if="props.innerClass" :class="props.innerClass">
      <slot></slot>
    </div>
    <slot v-else></slot>
  </div>
</template>
