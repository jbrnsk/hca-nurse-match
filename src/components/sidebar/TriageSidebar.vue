<script setup lang="ts">
import { useTriageStore } from '@/stores/useTriageStore.ts';

import TriageControls from './TriageControls.vue';
import TriageItem from './TriageItem.vue';
import TriageStats from './TriageStats.vue';

const store = useTriageStore();
</script>

<template>
  <aside
    class="border-border bg-surface z-20 flex w-full shrink-0 flex-col border-b shadow-sm lg:w-80 lg:border-r lg:border-b-0"
  >
    <TriageStats class="hidden lg:flex" />
    <TriageControls />
    <div class="custom-scrollbar flex-1 overflow-y-auto">
      <TriageItem
        v-for="match in store.filteredWorklist"
        :id="match.id"
        :key="match.id"
        :confidence="match.confidence"
        :dob="match.external.DOB"
        :first-name="match.external.FirstName"
        :is-active="store.selectedMatchId === match.id"
        :last-name="match.external.LastName"
        :status="match.status"
        @select="store.selectedMatchId = match.id"
      />
    </div>
    <div class="border-border mt-auto border-t bg-slate-50 p-2 lg:p-4">
      <button
        class="text-ink-secondary hover:text-danger w-full cursor-pointer rounded-lg border border-dashed border-slate-300 py-2 text-[9px] font-black tracking-widest uppercase transition-all hover:bg-red-50 lg:text-[10px]"
        @click="store.resetAll"
      >
        Reset Decisions
      </button>
    </div>
  </aside>
</template>
