<script setup lang="ts">
import DataTable from '@/components/DataTable.vue'
import { onBeforeMount, ref } from 'vue'
import axios from 'axios';

const url = `http://localhost:80/api/management/order-lines`;

interface ProductItem {
  values: {
    uuid: string;
    id: number;
    createdAt: string;
    product: string;
    price: number;
  };
}

// Reactive data to hold schema and values
const formSchema = ref<any>(null);
const formValues = ref<any>(null);
const uniqueOrderIds = ref<any>(null);
const loadData = async () => {
  try {
    const res = await axios.get(url);
    if (res.data?.datatable) {
      formSchema.value = res.data.datatable.columns;
      formValues.value = res.data.datatable.records;

      const allIds = formValues.value.map((item: any) => item.values.id);
      uniqueOrderIds.value = Array.from(new Set(allIds));
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

onBeforeMount(async () => {
  await loadData();

});

</script>

<template>
  <BaseBlock title="All Orders">
    <template #options>
      <button type="button" class="btn-block-option">
        <i class="si si-settings"></i>
      </button>
    </template>

    <table class="table table-bordered table-striped table-vcenter">
      <thead>
      <tr>
        <th class="text-center" style="width: 100px">
          Order id
        </th>
        <th>Products</th>
        <th class="d-none d-md-table-cell" style="width: 30%">Cost</th>
        <th class="text-center" style="width: 100px">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="id in uniqueOrderIds" :key="id">
        <td>
          {{ id }}
        </td>
        <td>
          <p class="p-0 m-0" v-for="item in formValues.filter((item: ProductItem) => item.values.id == id)" key="product">
            {{ item.values.product }}
          </p>
        </td>
        <td>
          {{
            formValues
              .filter((item: ProductItem) => item.values.id == id)
              .reduce((sum: number, item: ProductItem) => sum + item.values.price, 0)
              .toFixed(2)
          }} $
        </td>
        <td>
          no action
        </td>
      </tr>
      </tbody>
    </table>
  </BaseBlock>
</template>

<style scoped>

</style>