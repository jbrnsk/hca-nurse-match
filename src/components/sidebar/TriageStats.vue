<script setup lang="ts">
import { useTriageStore } from '@/stores/useTriageStore.ts';
const store = useTriageStore();
</script>

<template>
  <div
    class="border-border shrink-0 border-b bg-slate-50/50 px-4 py-4 backdrop-blur-sm dark:bg-slate-900/50"
  >
    <div class="mb-2 flex items-end justify-between">
      <span class="text-ink-secondary text-[10px] font-black tracking-widest uppercase">
        Triage Progress
      </span>
      <span class="text-brand font-mono text-xs font-bold">{{ store.progress.percent }}%</span>
    </div>
    <div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
      <div
        class="bg-brand h-full transition-all duration-500 ease-out"
        :style="{ width: `${store.progress.percent}%` }"
      ></div>
    </div>
  </div>
</template>
