<script setup lang="ts">
import { RotateCcw, X } from 'lucide-vue-next';
import { ref, watch } from 'vue';

import { useMatchStore } from '@/stores/useMatchStore';

const store = useMatchStore();
const visible = ref(false);
let timer: ReturnType<typeof setTimeout>;

watch(
  () => store.lastActionId,
  (newId) => {
    if (newId) {
      visible.value = true;
      clearTimeout(timer);
      timer = setTimeout(() => {
        visible.value = false;
        store.lastActionId = null;
      }, 6000);
    }
  }
);

const handleUndo = () => {
  store.undoLastAction();
  visible.value = false;
};
</script>

<template>
  <Transition
    enter-active-class="transform transition ease-out duration-300"
    enter-from-class="translate-y-10 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="visible" class="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
      <div
        class="flex items-center gap-6 rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 text-white shadow-2xl dark:bg-slate-800"
      >
        <div class="flex flex-col">
          <span class="text-[10px] font-black tracking-widest text-slate-400 uppercase"
            >Action Recorded</span
          >
          <span class="text-sm font-bold">Patient record updated</span>
        </div>
        <div class="h-8 w-px bg-slate-700"></div>
        <button
          class="text-brand flex cursor-pointer items-center gap-2 text-xs font-black tracking-widest uppercase transition-colors hover:text-white"
          @click="handleUndo"
        >
          <RotateCcw class="h-4 w-4" />
          Undo
        </button>
        <button
          class="cursor-pointer text-slate-500 transition-colors hover:text-white"
          @click="visible = false"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </div>
  </Transition>
</template>
