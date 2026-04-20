<script setup lang="ts">
import { Filter } from 'lucide-vue-next';

import TriageSidebar from '@/components/sidebar/TriageSidebar.vue';
import TriageReconciler from '@/components/TriageReconciler.vue';
import UndoToast from '@/components/UndoToast.vue';
import { useTriageStore } from '@/stores/useTriageStore.ts';

const store = useTriageStore();
</script>

<template>
  <div
    class="bg-canvas text-ink-primary flex h-screen w-full flex-col overflow-hidden font-sans antialiased"
  >
    <header
      class="border-border bg-surface z-30 flex h-14 shrink-0 items-center justify-between border-b px-6 shadow-sm"
    >
      <div class="flex items-center gap-3">
        <div
          class="bg-brand flex h-7 w-7 items-center justify-center rounded font-bold text-white shadow-inner"
        >
          N
        </div>
        <h1 class="text-ink-primary text-sm font-bold tracking-widest uppercase">
          NurseMatch <span class="font-normal opacity-50">Triage</span>
        </h1>
      </div>
    </header>
    <div class="flex flex-1 overflow-hidden">
      <TriageSidebar />
      <main class="bg-canvas relative flex-1 overflow-y-auto">
        <div v-if="store.selectedMatchId" class="mx-auto max-w-5xl p-8">
          <TriageReconciler :key="store.selectedMatchId" :match-id="store.selectedMatchId" />
        </div>
        <div
          v-else
          class="text-ink-secondary flex h-full flex-col items-center justify-center p-12 text-center opacity-30"
        >
          <div
            class="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-current"
          >
            <Filter class="h-6 w-6" />
          </div>
          <p class="text-lg font-medium">Select a patient to begin reconciliation</p>
          <p class="text-sm">High-confidence matches are prioritized by default</p>
        </div>
      </main>
      <UndoToast />
    </div>
  </div>
</template>
