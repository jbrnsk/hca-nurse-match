<script setup lang="ts">
import { RotateCcw, X } from 'lucide-vue-next';
import { ref, watch } from 'vue';

import { useTriageStore } from '@/stores/useTriageStore.ts';

const store = useTriageStore();
const visible = ref(false);
let timer: ReturnType<typeof setTimeout>;

watch(
  () => store.lastActionId,
  async (newId) => {
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
    enter-active-class="transform transition ease-out duration-200"
    enter-from-class="translate-y-4 opacity-0 scale-95"
    enter-to-class="translate-y-0 opacity-100 scale-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
    mode="out-in"
  >
    <div
      v-if="visible"
      :key="store.lastActionId ?? 'initial'"
      class="fixed bottom-8 left-1/2 z-50 -translate-x-1/2"
    >
      <div
        class="flex items-center gap-6 rounded-xl border border-slate-200 bg-white px-5 py-3 text-slate-900 shadow-2xl backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900 dark:text-white"
      >
        <div class="flex flex-col">
          <span
            class="text-brand dark:text-brand-light/70 text-[10px] font-black tracking-widest uppercase"
          >
            Action Recorded
          </span>
          <span class="text-sm font-bold">Entry triaged successfully</span>
        </div>
        <div class="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
        <button
          class="group text-brand hover:text-brand-dark flex cursor-pointer items-center gap-2 text-xs font-black tracking-widest uppercase transition-colors dark:hover:text-white"
          @click="handleUndo"
        >
          <RotateCcw class="h-4 w-4 transition-transform group-hover:-rotate-45" />
          Undo
        </button>
        <button
          class="cursor-pointer text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-white"
          @click="visible = false"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </div>
  </Transition>
</template>
