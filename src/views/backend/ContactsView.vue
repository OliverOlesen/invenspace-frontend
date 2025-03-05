<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

import DataTable from '@/components/DataTable.vue'
import type { Action } from '@/types'

let endpoint = "/management/contacts";
const model = "contacts";
const dataType = "contact";

const handleDoAction = (action: Action) : any => {
  let endpoint = '';
  switch (action.action) {
    case 'create':
      router.push({ name: 'backend.contact.create' });
      break;
    case 'edit':
      router.push({ name: 'backend.contact.edit' , params: { uuid: action.uuid } });
      break;
    case 'delete':
      endpoint += action.uuid + '/delete';
      // this is just a post request
      break;
  }
}

</script>

<template>
  <BasePageHeading
    title="Contacts Management"
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Contacts Management</a>
          </li>
          <li class="breadcrumb-item" aria-current="page">Responsive</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <DataTable :endpoint="endpoint" :model="model" :dataType="dataType" @doAction="handleDoAction" />
</template>
<style scoped>

</style>