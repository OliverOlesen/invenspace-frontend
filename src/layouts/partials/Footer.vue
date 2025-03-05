<script lang="ts" setup>
import { useTemplateStore } from "@/stores/template.ts";

// Main store
const store = useTemplateStore();
</script>

<template>
  <!-- Footer -->
  <footer id="page-footer">
    <slot>
      <div class="bg-body-light">
        <div class="content py-3">
          <div class="row fs-sm">
            <div class="col-sm-6 order-sm-2 py-1 text-center text-sm-end">
              <slot name="content-right">
                Created By
                <a
                  class="fw-semibold"
                  href="https://www.linkedin.com/in/oliver-ian-olesen-9340b217a/"
                  target="_blank"

                  >Oliver Olesen</a
                >
              </slot>
            </div>
            <div class="col-sm-6 order-sm-1 py-1 text-center text-sm-start">
              <slot name="content-left">
                <a
                  class="fw-semibold"
                  href="https://pixelcave.com/products/oneui-vue-edition"
                  >{{ store.app.name + " " + store.app.version }}</a
                >
                &copy; {{ store.app.copyright }}
              </slot>
            </div>
          </div>
        </div>
      </div>
    </slot>
  </footer>
  <!-- END Footer -->
</template>
