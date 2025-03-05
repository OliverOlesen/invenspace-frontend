<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import RecursiveForm from '@/components/RecursiveForm.vue'

const props = defineProps({
  endpoint: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  }
});

const loading = ref(false)
const schema = ref({})
const formIdentifier = ref(null)
const token = ref(null)
const errors = ref(null)
const model = ref({})
const endpoint = ref(null)

const url = `http://localhost:80/api/${props.endpoint}/${props.action}`;

onBeforeMount(async () => {
  loading.value = true;
  await loadData();
  loading.value = false;
});

const loadData = async () => {
  await axios.get(url)
    .then(res => {
      if (res.data?.form) {
        setData(res.data.form);
        loading.value = false;
      }
    }).catch(error => {
      // handle error
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log(error.config);
    });
}

const setData = (jsonForm: any) => {
  let form = jsonForm
  schema.value = form.schema;

  formIdentifier.value = form.schema.title;
  if (form.csrf_token) {
    token.value = form.csrf_token.value;
  }
  errors.value = form.errors;
  model.value = form.values;
  console.log(form)
}

const submit = async () => {
  let data: FormData;
  if (!formIdentifier.value) {
    return;
  }
  data = convertJsonToFormData(model.value, new FormData(), formIdentifier.value);

  // Add the formIdentifier if the formdata object is empty to pass symfony's isSubmitted check.
  if(data.entries().next().done) {
    data.append(formIdentifier.value, '');
  }

  try {
    const res = await axios.post(url, data);

    if (res.data.success == false && formHasErrors(res)) {
      handleSubmitFailed(res);
    }
  } catch (err) {
    console.error({ err });
    loading.value = false;
  } finally {
    loading.value = false;
  }
}



const formHasErrors = (res: AxiosResponse<any>) => {
  return res.data.form?.errors;
}

const handleSubmitFailed = (res: AxiosResponse<any>) => {
  if (formHasErrors(res)) {
    setData(res.data.form);
  }
}

const convertJsonToFormData = (data: any, form: FormData, namespace = '') => {
  if (data === false || data === null) {
    return form;
  }

  /**
   * if data is a File, we are done, and it should just be appended.
   */
  if (data instanceof File) {
    form.append(namespace, data);
    return form;
  }

  if (data instanceof Date) {
    form.append(namespace, data.toISOString());
    return form;
  }

  if (data instanceof Array) {
    data.forEach((element: any, index: number) => {
      convertJsonToFormData(element, form, `${namespace}[${index}]`);
    });

    return form;
  }

  // if data is an object, we remove all falsely and nulled children.
  if (typeof data === 'object') {
    Object.keys(data).forEach(propertyName => {
      const formKey = namespace ? `${namespace}[${propertyName}]` : propertyName;
      return convertJsonToFormData(data[propertyName], form, formKey);
    });
    return form;
  }

  form.append(namespace, data);
  return form;
}

</script>

<template>
  <div class="container-fluid mt-7">
    <div class="row row-cols-1">
      <div class="block block-rounded offset-1 p-0 col-10">
        <form v-if="Object.keys(schema).length" @submit.prevent="submit">
          <div class="block-header block-header-default d-flex align-items-center rounded-2">
            <h1 class="m-2">{{ $t(schema.title) }}</h1>
            <button class="btn btn btn-primary">{{props.action}}</button>
          </div>
          <div class="block-content block-content-full">
            <RecursiveForm v-if="schema" :properties="schema.properties" :values="model" :required-fields="schema.required"  />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
