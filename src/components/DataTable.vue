<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import type { Action } from '@/types';
import axios from 'axios';
import { icons } from '@/constants/icons';

const router = useRouter()
const route = useRoute()

const props = defineProps({
  endpoint: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true,
  },
  dataType: {
    type: String,
    required: true,
  }
});

let DataValue = {
  datatable: {
    columns: [],
    records: [],
  },
  actions: [],
  bulkActions: []
}

const emit = defineEmits<{
  (event: 'doAction', payload: Action): void;
}>();

const doAction = (uuid: string, data: string) => {
  let action: Action = {
    uuid: uuid,
    action: data,
  };
  emit('doAction', action);
};

let Data = ref(DataValue);

onMounted(async () => {
  try {
    const pathToData = "http://localhost:80/api" + props.endpoint;

    // Using Axios to fetch data with credentials
    const response = await axios.get(pathToData, {
      withCredentials: true  // Ensures cookies are sent with the request
    });

    Data.value = response.data;
  } catch (error) {
    console.error('There was a problem with the axios operation:', error);
  }
});

</script>
<template>
  <div class="content">
    <BaseBlock :title="model">
      <template #options>
        <button type="submit" class="btn btn-sm btn-primary" @click="doAction('', 'create')">
          <i class="fa fa-fw fa-plus"></i>
          New {{ dataType.charAt(0).toUpperCase() + dataType.slice(1) }}
        </button>
      </template>

      <div v-if="Data.datatable && Data.datatable.columns.length > 0 && Data.datatable.records.length > 0" class="table-responsive">
        <table class="table table-bordered table-striped table-vcenter">
          <thead>
          <tr>
            <template v-for="column in Data.datatable.columns" :key="column.name">
              <th v-if="!column.key">
                {{ column.options.label || column.name }}
              </th>
            </template>
            <th class="text-center" style="width: 100px">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="record in Data.datatable.records" :key="record.values.uuid">
            <template v-for="column in Data.datatable.columns" :key="column.name">
              <td v-if="!column.key" class="fw-semibold fs-sm">
                {{ record.values[column.name] }}
              </td>
            </template>
            <td class="text-center">
              <div class="btn-group">
                <button
                  v-for="action in Data.datatable.actions"
                  :key="action"
                  type="button"
                  class="btn btn-sm btn-alt-secondary"
                  @click="doAction(record.values['uuid'], action)"
                >
                  <i :class="icons[action]"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </BaseBlock>
  </div>
</template>

<style scoped></style>