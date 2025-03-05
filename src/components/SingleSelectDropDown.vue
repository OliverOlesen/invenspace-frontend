<script setup lang="ts" generic="T">
import { ref, watch, computed, type PropType } from 'vue';

// Define a generic interface for options
interface Option<T> {
  id: string | number;
  name: string;
  raw: T; // The original object
}

const props = defineProps({
  options: {
    type: Array as PropType<(string | T)[]>,
    required: true,
  },
  idKey: {
    type: [String, Function] as PropType<string | ((item: T) => string | number)>,
    default: 'id',
  },
  nameKey: {
    type: [String, Function] as PropType<string | ((item: T) => string)>,
    default: 'name',
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Select an option',
  },
});

const emit = defineEmits(['update:modelValue']);

const selectedValue = ref(props.modelValue);

const normalizedOptions = computed<Option<T>[]>(() => {
  return props.options.map((option) => {
    if (typeof option === "string") {
      return { id: option, name: option, raw: option as unknown as T };
    } else {
      const id =
        typeof props.idKey === "function"
          ? props.idKey(option)
          : String(option[props.idKey as keyof T]);
      const name =
        typeof props.nameKey === "function"
          ? props.nameKey(option)
          : String(option[props.nameKey as keyof T]);

      return { id, name, raw: option };
    }
  });
});

watch(selectedValue, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>

<template>
  <select v-model="selectedValue">
    <option v-if="!selectedValue" value="" disabled hidden>
      {{ placeholder }}
    </option>
    <option v-for="option in normalizedOptions" :key="option.id" :value="option.id">
      {{ option.name }}
    </option>
  </select>
</template>
<style>
select {
  background-color: #202020;
  color: #ffffff;
  border: 1px solid #3a3a3a;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

select:hover {
  border-color: #555555;
}

select:focus {
  border-color: #888888;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
}

select option {
  background-color: #202020;
  color: #ffffff;
}

select option:hover {
  background-color: #333333;
}

select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

</style>
