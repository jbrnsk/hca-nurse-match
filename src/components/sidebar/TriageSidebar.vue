<script setup lang="ts">
import { useMatchStore } from '@/stores/useMatchStore';

import TriageControls from './TriageControls.vue';
import TriageItem from './TriageItem.vue';
import TriageStats from './TriageStats.vue';

const store = useMatchStore();
</script>

<template>
  <aside class="border-border bg-surface z-20 flex w-80 shrink-0 flex-col border-r shadow-sm">
    <TriageStats />
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
        @click="store.selectedMatchId = match.id"
      />
    </div>
    <div class="border-border mt-auto border-t bg-slate-50 p-4">
      <button
        class="text-ink-secondary hover:text-danger w-full cursor-pointer rounded-lg border border-dashed border-slate-300 py-2.5 text-[10px] font-black tracking-widest uppercase transition-all hover:bg-red-50"
        @click="store.resetAll"
      >
        Reset All Triage Decisions
      </button>
    </div>
  </aside>
</template>
