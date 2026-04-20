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
    enter-active-class="transform transition ease-out duration-300"
    enter-from-class="translate-y-full opacity-0 lg:translate-y-4 lg:scale-95"
    enter-to-class="translate-y-0 opacity-100 lg:scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 lg:scale-100"
    leave-to-class="opacity-0 lg:scale-95"
    mode="out-in"
  >
    <div
      v-if="visible"
      :key="store.lastActionId ?? 'initial'"
      class="fixed right-0 bottom-0 left-0 z-[100] p-4 lg:right-auto lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2 lg:p-0"
    >
      <div
        class="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] backdrop-blur-md lg:justify-start lg:gap-6 lg:px-5 lg:shadow-2xl dark:border-slate-700/50 dark:bg-slate-900 dark:text-white"
      >
        <div class="flex flex-col">
          <span
            class="text-brand dark:text-brand-light/70 text-[9px] font-black tracking-widest uppercase lg:text-[10px]"
          >
            Action Recorded
          </span>
          <span class="truncate text-xs font-bold lg:text-sm">Entry triaged</span>
        </div>

        <div class="hidden h-8 w-px bg-slate-200 sm:block dark:bg-slate-700"></div>

        <div class="flex items-center gap-3 lg:gap-4">
          <button
            class="group text-brand hover:text-brand-dark flex cursor-pointer items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-colors lg:text-xs dark:hover:text-white"
            @click="handleUndo"
          >
            <RotateCcw
              class="h-3.5 w-3.5 transition-transform group-hover:-rotate-45 lg:h-4 lg:w-4"
            />
            Undo
          </button>
          <button
            class="cursor-point p-1 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-white"
            @click="visible = false"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
