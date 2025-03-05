<script setup lang="ts">
import { ref } from 'vue';

// Props
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  onAccept: {
    type: Function,
    required: true,
  },
  onDecline: {
    type: Function,
    required: true,
  },
});

</script>

<template>
  <div class="modal fade show" tabindex="-1" style="display: block; background: rgba(0, 0, 0, 0.5);" @click="props.onDecline">
    <div class="modal-dialog modal-dialog-centered" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirmation</h5>
          <button type="button" class="btn-close" @click="props.onDecline" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer justify-content-center">
          <button type="button" class="btn btn-success" @click="props.onAccept">Accept</button>
          <button type="button" class="btn btn-danger" @click="props.onDecline">Decline</button>
        </div>
      </div>
    </div>
  </div>
</template>