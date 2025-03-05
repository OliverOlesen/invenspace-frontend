<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import axios from 'axios';

const url = `http://localhost:80/api/user/profile/edit`;

// Reactive data to hold schema and values
const formSchema = ref<any>(null);
const formValues = ref<any>(null);
const loadData = async () => {
  try {
    const res = await axios.get(url);
    if (res.data?.form) {
      formSchema.value = res.data.form.schema;
      formValues.value = res.data.form.values;
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
  <div class="content content-boxed" v-if="formSchema != null && formValues != null">
    <!-- User profile -->
    <BaseBlock title="User Profile">
      <form @submit.prevent>
        <div class="row push">
          <div class="col-lg-4">
            <p class="fs-sm text-muted">
              Your account’s vital info. Your username will be publicly visible.
            </p>
          </div>
          <div class="col-lg-8 col-xl-5">
            <div class="mb-4">
              <label class="form-label" for="one-profile-edit-username"
              >Username</label
              >
              <input
                type="text"
                class="form-control"
                id="one-profile-edit-username"
                name="one-profile-edit-username"
                placeholder="Enter your username.."
                v-model="formValues.username"
              />
            </div>
            <div class="mb-4">
              <label class="form-label" for="one-profile-edit-email"
              >Email</label
              >
              <input
                type="email"
                class="form-control"
                id="one-profile-edit-email"
                name="one-profile-edit-email"
                placeholder="Enter your email.."
                v-model="formValues.email"
              />
            </div>

            <div class="mb-4">
              <button type="submit" class="btn btn-alt-primary">Update</button>
            </div>
          </div>
        </div>
      </form>
    </BaseBlock>
    <!-- END User profile -->

    <!-- Change Password -->
    <BaseBlock title="Change Password">
      <form @submit.prevent>
        <div class="row push">
          <div class="col-lg-4">
            <p class="fs-sm text-muted">
              Changing your sign in password is an easy way to keep your account
              secure.
            </p>
          </div>
          <div class="col-lg-8 col-xl-5">
            <div class="mb-4">
              <label class="form-label" for="one-profile-edit-password"
              >Current Password</label
              >
              <input
                type="password"
                class="form-control"
                id="one-profile-edit-password"
                name="one-profile-edit-password"
              />
            </div>
            <div class="row mb-4">
              <div class="col-12">
                <label class="form-label" for="one-profile-edit-password-new"
                >New Password</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="one-profile-edit-password-new"
                  name="one-profile-edit-password-new"
                />
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-12">
                <label
                  class="form-label"
                  for="one-profile-edit-password-new-confirm"
                >Confirm New Password</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="one-profile-edit-password-new-confirm"
                  name="one-profile-edit-password-new-confirm"
                />
              </div>
            </div>
            <div class="mb-4">
              <button type="submit" class="btn btn-alt-primary">Update</button>
            </div>
          </div>
        </div>
      </form>
    </BaseBlock>
    <!-- END Change Password -->
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
fieldset {
  border: 1px solid #ddd;
}
legend {
  font-size: 0.9rem;
  margin-bottom: 0;
}

</style>
