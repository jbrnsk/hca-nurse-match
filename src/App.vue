<script setup lang="ts">
import { ChevronLeft, Filter } from 'lucide-vue-next';

import TriageSidebar from '@/components/sidebar/TriageSidebar.vue';
import TriageReconciler from '@/components/TriageReconciler.vue';
import UndoToast from '@/components/UndoToast.vue';
import { useTriageStore } from '@/stores/useTriageStore.ts';

const store = useTriageStore();

const deselectPatient = () => {
  store.selectedMatchId = null;
};
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
      <TriageSidebar
        class="border-border w-full shrink-0 lg:w-80 lg:border-r"
        :class="[store.selectedMatchId ? 'hidden lg:block' : 'block']"
      />
      <main
        class="bg-canvas flex flex-1 flex-col overflow-hidden"
        :class="[store.selectedMatchId ? 'flex' : 'hidden lg:flex']"
      >
        <div
          v-if="store.selectedMatchId"
          class="border-border shrink-0 border-b bg-white p-4 lg:hidden"
        >
          <button
            class="text-brand flex items-center gap-2 text-sm font-bold"
            @click="deselectPatient"
          >
            <ChevronLeft class="h-4 w-4" />
            BACK TO PATIENT LIST
          </button>
        </div>
        <div
          v-if="store.selectedMatchId"
          :key="store.selectedMatchId"
          class="flex-1 overflow-y-auto p-4 lg:p-8"
        >
          <div class="mx-auto max-w-5xl">
            <TriageReconciler :match-id="store.selectedMatchId" />
          </div>
        </div>
        <div
          v-else
          class="text-ink-secondary flex h-full flex-col items-center justify-center p-12 text-center opacity-30"
        >
          <Filter class="mb-4 h-16 w-16" />
          <p class="text-lg font-medium">Select a patient to begin</p>
        </div>
      </main>
      <UndoToast />
    </div>
  </div>
</template>
