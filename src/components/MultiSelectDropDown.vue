<script setup lang="ts" generic="T">
import { ref, computed, type PropType } from 'vue';

interface Option<T> {
  id: string | number;
  name: string;
  raw: T;
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
    type: Array as PropType<(string | number)[]>,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Select one or more options',
  },
});

const emit = defineEmits(['update:modelValue']);

const selectedValues = ref<(string | number)[]>(props.modelValue);
const isDropdownOpen = ref(false);
const searchQuery = ref('');

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

const filteredOptions = computed(() => {
  return normalizedOptions.value.filter((option) =>
    option.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const toggleSelection = (value: string | number) => {
  if (selectedValues.value.includes(value)) {
    selectedValues.value = selectedValues.value.filter((v) => v !== value);
  } else {
    selectedValues.value.push(value);
  }
  emit('update:modelValue', selectedValues.value);
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  searchQuery.value = '';
};

const onClickOutside = () => {
  isDropdownOpen.value = false;
};
</script>

<template>
  <div class="multi-select">
    <div class="input-container" @click="toggleDropdown">
      <div v-if="selectedValues.length > 0" class="selected-tags">
        <span v-for="value in selectedValues" :key="value" class="tag" @click.stop="toggleSelection(value)">
          {{ normalizedOptions.find((opt) => opt.id === value)?.name }}
          <span class="remove-tag">⨯</span>
        </span>
      </div>
      <div v-else class="d-flex align-items-center justify-content-between">
        <span>{{ placeholder }}</span>
        <i class="fa-solid fa-angle-down"></i>
      </div>
    </div>
    <div v-if="isDropdownOpen" class="dropdown">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search"
        class="dropdown-search"
      />
      <div
        v-for="option in filteredOptions"
        :key="option.id"
        class="dropdown-item"
        :class="{ selected: selectedValues.includes(option.id) }"
        @click="toggleSelection(option.id)"
      >
        {{ option.name }}
        <span v-if="selectedValues.includes(option.id)" class="checkmark">✓</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.multi-select {
  position: relative;
  width: 100%;
  max-width: 300px;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #2b2b2b;
  cursor: pointer;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: flex;
  align-items: center;
  background-color: #444;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
}
.tag:hover {
  background-color: #616161;
}

.remove-tag {
  margin-left: 8px;
  cursor: pointer;
  color: red !important;
}

.remove-tag:hover {
  color: #fff;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #2b2b2b;
  z-index: 1000;
  margin-top: -1px;
}

.dropdown-search {
  width: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  background-color: #3a3a3a;
  color: #fff;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 4px;
}

.dropdown-search::placeholder {
  color: #888;
}

.dropdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  color: #fff;
}

.dropdown-item.selected {
  background-color: #444;
}

.dropdown-item:hover {
  background-color: #555;
  color: #fff;
}

.checkmark {
  color: #4caf50;
}
</style>