<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, getCurrentInstance } from 'vue'
import axios from 'axios'
const router = useRouter()

import DataTable from '@/components/DataTable.vue'
import ConfirmationBox from '@/components/ConfirmationBox.vue'
import type { Action } from '@/types'

let endpoint = "/management/users";
const model = "users";
const dataType = "user";

const emit = defineEmits<{
  (event: 'entityRemoved', uuid: string): void;
}>();

// State for the confirmation box
const showConfirmation = ref(false);
const confirmationMessage = ref('');
const onAcceptCallback = ref<() => void>(() => {});
const onDeclineCallback = ref<() => void>(() => {});

const handleDoAction = (action: Action) : any => {
  let endpoint = '';
  switch (action.action) {
    case 'create':
      router.push({ name: 'backend.user.create' });
      break;
    case 'edit':
      router.push({ name: 'backend.user.edit' , params: { uuid: action.uuid } });
      break;
    case 'delete':
      //endpoint += action.uuid + '/delete';

      confirmationMessage.value = 'Are you sure you want to delete this user?';
      showConfirmation.value = true;

      onAcceptCallback.value = async () => {
        try {
          const url = `http://localhost:80/api/management/users/${action.uuid}/delete`;

          const response = await axios.post(url);
          if (response.status === 200) {
            // TODO:: refresh/rerender the component, so that it calls the *management/users* again. To get all current users.
          }
        } catch (error) {
          console.error('Error deleting user:', error);
        }

        showConfirmation.value = false;
      };

      onDeclineCallback.value = () => {
        showConfirmation.value = false;
      };
      break;
  }
}

</script>

<template>
  <BasePageHeading
    title="Users Management"
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">User Management</a>
          </li>
          <li class="breadcrumb-item" aria-current="page">Responsive</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <DataTable
    :endpoint="endpoint"
    :model="model"
    :dataType="dataType"
    @doAction="handleDoAction"
  />

  <ConfirmationBox
    v-if="showConfirmation"
    :message="confirmationMessage"
    :onAccept="onAcceptCallback"
    :onDecline="onDeclineCallback"
  />
</template>
<style scoped>

</style>