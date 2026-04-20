<script setup lang="ts">
import { ArrowUpDown, ChevronsUpDown, Search } from 'lucide-vue-next';

import { useTriageStore } from '@/stores/useTriageStore.ts';

const store = useTriageStore();
</script>

<template>
  <div class="border-border shrink-0 space-y-4 border-b p-5">
    <div class="relative">
      <Search class="text-ink-secondary absolute top-3 left-3 h-4 w-4" />
      <input
        v-model="store.searchQuery"
        class="border-border bg-canvas focus:border-brand focus:ring-brand/20 h-10 w-full rounded-md border pr-4 pl-10 text-sm transition-all outline-none focus:ring-4"
        placeholder="Search name or DOB..."
        type="text"
      />
    </div>
    <div class="flex gap-3">
      <div class="relative flex-1">
        <select
          v-model="store.filterStatus"
          class="border-border bg-canvas focus:border-brand focus:ring-brand/20 h-10 w-full cursor-pointer appearance-none rounded-md border px-3 pr-10 text-sm font-medium transition-all outline-none focus:ring-4"
        >
          <option value="all">All Records</option>
          <option value="unreviewed">Unreviewed</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="follow-up">Needs Follow-up</option>
        </select>
        <ChevronsUpDown
          class="text-ink-secondary pointer-events-none absolute top-3 right-3 h-4 w-4 opacity-50"
        />
      </div>
      <button
        class="border-border bg-canvas focus:border-brand focus:ring-brand/20 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-all hover:bg-slate-50 focus:ring-4 dark:hover:bg-slate-800/50"
        title="Toggle Sort Order"
        @click="store.sortOrder = store.sortOrder === 'desc' ? 'asc' : 'desc'"
      >
        <ArrowUpDown class="text-ink-secondary h-4 w-4" />
      </button>
    </div>
  </div>
</template>
