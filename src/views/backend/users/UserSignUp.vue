<script lang="ts" setup>
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { useRouter } from 'vue-router';
import { reactive, computed, ref, onBeforeMount } from 'vue'
import useVuelidate from "@vuelidate/core";
import { required, minLength, sameAs, email } from '@vuelidate/validators'
import BaseBackground from '@/components/BaseBackground.vue';
import { useTemplateStore } from '@/stores/template'
import Swal from "sweetalert2";

const store = useTemplateStore();
const router = useRouter();

const url = `http://localhost:80/api/management/users/create`;
const formSchema = ref<any>(null);
const formValues = ref<any>(null);

const isLoading = ref(true);
const model = reactive({
  username: null,
  email: null,
  password: null,
  confirmPassword: null,
});
const rules = computed(() => {
  return {
    username: {
      required,
      minLength: minLength(3),
    },
    email: {
      required,
      email,
      minLength: minLength(6),
    },
    password: {
      required,
      minLength: minLength(5),
    },
    confirmPassword: {
      required,
      sameAs: sameAs(model.password),
    },
  };
});
const v$ = useVuelidate(rules, model);

onBeforeMount(async () => {
  isLoading.value = true;
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
async function onSubmit() {
  let formSchemaTitle = formSchema.value.title;
  let data: FormData;
  if (!formSchemaTitle) {
    // notify user form is invalid
    return;
  }
  formValues.value.username = model.username;
  formValues.value.email = model.email;
  formValues.value.password = model.password;

  data = convertJsonToFormData(formValues.value, new FormData(), formSchemaTitle);
  if(data.entries().next().done) {
    data.append(formSchemaTitle, '');
  }

  try {
    const res = await axios.post(url, data);

    if (res.data.success == false && formHasErrors(res)) {
      handleSubmitFailed(res);
    }

      Swal.fire({
        title: 'User Created!',
        text: 'Click "ok" to sign in',
        icon: "success",
        allowOutsideClick: false,
        background: "#2b2b2b",
        customClass: {
          title: 'text-white', // Bootstrap class for white text
          htmlContainer: 'text-white', // Bootstrap class for white text
        },
      }).then(async () => {
        await router.push({ name: "landing" });
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
              Welcome to your amazing app. Feel free to sign up and start managing
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
        <div class="p-4 w-100 flex-grow-1 d-flex align-items-center">
          <div class="w-100">
            <!-- Header -->
            <div class="text-center mb-5">
              <p class="mb-3">
                <i class="fa fa-2x fa-circle-notch text-primary-light"></i>
              </p>
              <h1 class="fw-bold mb-2">Create Account</h1>
              <p class="fw-medium text-muted">
                Get your access today in one easy step,
                or login to continue <RouterLink :to="{ name: 'landing' }">sign in</RouterLink>.
              </p>
            </div>
            <!-- END Header -->

            <!-- Sign Up Form -->
            <div class="row g-0 justify-content-center">
              <div class="col-sm-8 col-xl-4">
                <form @submit.prevent="onSubmit">
                  <div class="mb-4">
                    <div class="input-group">
                      <span class="input-group-text input-group-text-alt">
                        <i class="fa-solid fa-user"></i>
                      </span>
                      <input
                        type="text"
                        class="form-control form-control-lg form-control-alt py-3"
                        id="username"
                        name="username"
                        placeholder="Username"
                        :class="{
                          'is-invalid': v$.username.$errors.length,
                        }"
                        v-model="model.username"
                        @blur="v$.username.$touch"
                      />
                      <div
                        v-if="v$.username.$errors.length"
                        class="invalid-feedback animated fadeIn"
                      >
                        Please enter a username
                      </div>
                    </div>
                  </div>
                  <div class="mb-4">
                    <div class="input-group">
                      <span class="input-group-text input-group-text-alt">
                        <i class="fa-solid fa-user"></i>
                      </span>
                      <input
                        type="email"
                        class="form-control form-control-lg form-control-alt py-3"
                        id="email"
                        name="email"
                        placeholder="email"
                        :class="{
                          'is-invalid': v$.email.$errors.length,
                        }"
                        v-model="model.email"
                        @blur="v$.email.$touch"
                      />
                      <div
                        v-if="v$.email.$errors.length"
                        class="invalid-feedback animated fadeIn"
                      >
                        Please enter an email
                      </div>
                    </div>
                  </div>
                  <div class="mb-4">
                    <div class="input-group">
                      <span class="input-group-text input-group-text-alt">
                        <i class="fa-solid fa-key"></i>
                      </span>
                      <input
                        type="password"
                        class="form-control form-control-lg form-control-alt py-3"
                        id="password"
                        name="password"
                        placeholder="Password"
                        :class="{
                          'is-invalid': v$.password.$errors.length,
                        }"
                        v-model="model.password"
                        @blur="v$.password.$touch"
                      />
                      <div
                        v-if="v$.password.$errors.length"
                        class="invalid-feedback animated fadeIn"
                      >
                        Please provide a password
                      </div>
                    </div>
                  </div>
                  <div class="mb-4">
                    <div class="input-group">
                      <span class="input-group-text input-group-text-alt">
                        <i class="fa-solid fa-key"></i>
                      </span>
                      <input
                        type="password"
                        class="form-control form-control-lg form-control-alt py-3"
                        id="signup-password-confirm"
                        name="signup-password-confirm"
                        placeholder="Confirm Password"
                        :class="{
                          'is-invalid': v$.confirmPassword.$errors.length,
                        }"
                        v-model="model.confirmPassword"
                        @blur="v$.confirmPassword.$touch"
                      />
                      <div
                        v-if="v$.confirmPassword.$errors.length"
                        class="invalid-feedback animated fadeIn"
                      >
                        Password must match!
                      </div>
                    </div>
                  </div>
                  <div class="text-center">
                    <button type="submit" class="btn btn-lg btn-alt-success">
                      <i class="fa fa-fw fa-plus me-1 opacity-50"></i> Sign Up
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <!-- END Sign Up Form -->

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