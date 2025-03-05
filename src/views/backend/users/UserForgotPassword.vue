<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useRouter } from "vue-router";
import { useTemplateStore } from "@/stores/template";
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import Swal from "sweetalert2";
import BaseBackground from '@/components/BaseBackground.vue'

// Main store and Router
const store = useTemplateStore();
const router = useRouter();

const url = `http://localhost:80/api/security/request/reset`;

// Reactive data to hold schema and values
const formSchema = ref<any>(null);
const formValues = ref<any>(null);
const isLoading = ref(true);

onBeforeMount(async () => {
  await loadData();
});

const loadData = async () => {
  try {
    const res = await axios.get(url);
    if (res.data?.form) {
      setData(res.data.form);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    isLoading.value = false;
  }
};

const setData = (form: any) => {
  formSchema.value = form.schema;
  formValues.value = form.values;
}
// On form submission
async function onSubmit() {
  let formSchemaTitle = formSchema.value.title;
  let data: FormData;
  if (!formSchemaTitle) {
    // notify user form is invalid
    return;
  }

  data = convertJsonToFormData(formValues.value, new FormData(), formSchemaTitle);
  if(data.entries().next().done) {
    data.append(formSchemaTitle, '');
  }

  try {
    const res = await axios.post(url, data);

    if (res.data.success == false && formHasErrors(res)) {
      handleSubmitFailed(res);
    }

      await Swal.fire({
        title: 'Email Sent!',
        html: 'A link has been sent to your mail. <br>Make sure to check spam, if you cannot find it.',
        icon: "success",
        background: "#2b2b2b",
        customClass: {
          title: 'text-white', // Bootstrap class for white text
          htmlContainer: 'text-white', // Bootstrap class for white text
        }
      });

  } catch (err) {
    console.error({ err });
  } finally {

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
  <!-- Page Content -->
  <BaseBackground image="/assets/media/photos/photo28@2x.jpg">
    <div class="row g-0 bg-primary-dark-op">
      <!-- Meta Info Section -->
      <div
        class="hero-static col-lg-4 d-none d-lg-flex flex-column justify-content-center"
      >
        <div class="p-4 p-xl-5 flex-grow-1 d-flex align-items-center">
          <div class="w-100">
            <RouterLink
              :to="{ name: 'landing' }"
              class="link-fx fw-semibold fs-2 text-white"
            >
              Inven<span class="fw-normal">space</span>
            </RouterLink>
            <p class="text-white-75 me-xl-8 mt-2">
              Welcome to your amazing app. Feel free to login and start managing
              your projects and clients.
            </p>
          </div>
        </div>
        <div
          class="p-4 p-xl-5 d-xl-flex justify-content-between align-items-center fs-sm"
        >
          <p class="fw-medium text-white-50 mb-0">
            <strong>{{ store.app.name + " " + store.app.version }}</strong>
            &copy; {{ store.app.copyright }}
          </p>
          <ul class="list list-inline mb-0 py-2">
            <li class="list-inline-item">
              <a class="text-white-75 fw-medium" href="javascript:void(0)"
              >Legal</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-white-75 fw-medium" href="javascript:void(0)"
              >Contact</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-white-75 fw-medium" href="javascript:void(0)"
              >Terms</a
              >
            </li>
          </ul>
        </div>
      </div>
      <!-- END Meta Info Section -->

      <!-- Main Section -->
      <div
        class="hero-static col-lg-8 d-flex flex-column align-items-center bg-body-extra-light"
      >
        <div class="p-3 w-100 d-lg-none text-center">
          <RouterLink
            :to="{ name: 'landing' }"
            class="link-fx fw-semibold fs-3 text-dark"
          >
            One<span class="fw-normal">UI</span>
          </RouterLink>
        </div>
        <div v-if="!isLoading && formValues" class="p-4 w-100 flex-grow-1 d-flex align-items-center">
          <div class="w-100">
            <!-- Header -->
            <div class="text-center mb-5">
              <p class="mb-3">
                <i class="fa fa-2x fa-circle-notch text-primary-light"></i>
              </p>
              <h1 class="fw-bold mb-2">Password Reminder</h1>
              <p class="fw-medium text-muted">
                Please provide your account’s email,
                we will then send you a link to reset password.
              </p>
            </div>
            <!-- END Header -->

            <!-- Reminder Form -->
            <div class="row g-0 justify-content-center">
              <div class="col-sm-8 col-xl-4">
                <form @submit.prevent="onSubmit">
                  <div class="mb-4">
                    <input
                      type="text"
                      class="form-control form-control-lg form-control-alt py-3"
                      id="reminder-credential"
                      name="reminder-credential"
                      placeholder="Email"
                      v-model="formValues.email"
                    />

                  </div>
                  <div class="text-center">
                    <button type="submit" class="btn btn-lg btn-alt-primary">
                      <i class="fa fa-fw fa-envelope me-1 opacity-50"></i> Send
                      Mail
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <!-- END Reminder Form -->
          </div>
        </div>
        <div
          class="px-4 py-3 w-100 d-lg-none d-flex flex-column flex-sm-row justify-content-between fs-sm text-center text-sm-start"
        >
          <p class="fw-medium text-black-50 py-2 mb-0">
            <strong>{{ store.app.name + " " + store.app.version }}</strong>
            &copy; {{ store.app.copyright }}
          </p>
          <ul class="list list-inline py-2 mb-0">
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
              >Legal</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
              >Contact</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
              >Terms</a
              >
            </li>
          </ul>
        </div>
      </div>
      <!-- END Main Section -->
    </div>
  </BaseBackground>
  <!-- END Page Content -->
</template>