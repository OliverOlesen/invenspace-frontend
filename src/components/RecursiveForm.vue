<script setup lang="ts">
import { defineProps } from 'vue';
import SingleSelectDropDown from '@/components/SingleSelectDropDown.vue'
import MultiSelectDropDown from '@/components/MultiSelectDropDown.vue'

interface Option {
  id: string;
  name: string;
}

const props = defineProps<{
  properties: Record<string, any>;
  values: Record<string, any>;
  requiredFields: Array<string>;
}>();

const getCombinedOptions = (enumValues: string[], enumTitles: string[]): Option[] => {
  return enumValues.map((id, index) => ({
    id: id,
    name: enumTitles[index],
  }));
};
</script>

<template>
  <div class="container" v-if="Object.keys(properties).length > 0">
    <div class="row">
      <template v-for="(property, key) in properties" :key="key">
        <template v-if="property.type === 'object'">
          <RecursiveForm
            :properties="property.properties"
            :values="values[key]"
            :required-fields="property.required"
          />
        </template>

        <!-- Handle multi select enum fields -->
        <template v-else-if="property.type === 'array'">
          <div class="col-md-6 mb-5">
            <label class="form-label" :for="key">
              {{ property.title }}
              <span v-if="props.requiredFields.includes(key)" class="text-danger">*</span>
            </label><br>
            <MultiSelectDropDown
              :options="getCombinedOptions(property.items.enum, property.items.enum_titles)"
              :id-key="(item) => item.id"
              :name-key="(item) => item.name"
              v-model="values[key]"
            />
          </div>
        </template>

        <!-- Handle single select enum fields -->
        <template v-else-if=" property.type === 'string' && property.enum != null">
          <div class="col-md-6 mb-5">
            <label class="form-label" :for="key">
              {{ property.title }}
              <span v-if="props.requiredFields.includes(key)" class="text-danger">*</span>
            </label><br>
            <SingleSelectDropDown
              :options="getCombinedOptions(property.enum, property.enum_titles)"
              :id-key="(item) => item.id"
              :name-key="(item) => item.name"
              v-model="values[key]"
            />
          </div>
        </template>

        <div v-else class="col-md-6 mb-5">
          <label class="form-label" :for="key">
            {{ property.title }}
            <span v-if="props.requiredFields.includes(key)" class="text-danger">*</span>
          </label>
          <input
            class="form-control"
            :id="key"
            v-model="values[key]"
            placeholder=""
            :required="props.requiredFields.includes(key)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>
