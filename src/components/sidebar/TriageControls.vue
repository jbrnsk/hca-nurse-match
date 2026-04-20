<script setup lang="ts">
import { ArrowUpDown, Search } from 'lucide-vue-next';

import { useMatchStore } from '@/stores/useMatchStore';

const store = useMatchStore();
</script>

<template>
  <div class="border-border shrink-0 space-y-4 border-b p-5">
    <div class="relative">
      <Search class="text-ink-secondary absolute top-3 left-3 h-4 w-4" />
      <input
        v-model="store.searchQuery"
        class="border-border bg-canvas focus:ring-brand h-10 w-full rounded-md border pr-4 pl-10 text-sm transition-all outline-none focus:ring-1"
        placeholder="Search name or DOB..."
        type="text"
      />
    </div>
    <div class="flex gap-3">
      <select
        v-model="store.filterStatus"
        class="border-border bg-canvas focus:ring-brand h-10 flex-1 cursor-pointer rounded-md border px-3 text-sm font-medium transition-all outline-none focus:ring-1"
      >
        <option value="all">All Records</option>
        <option value="unreviewed">Unreviewed</option>
        <option value="accepted">Accepted</option>
        <option value="rejected">Rejected</option>
        <option value="follow-up">Needs Follow-up</option>
      </select>
      <button
        class="border-border bg-canvas focus:ring-brand flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-colors hover:bg-slate-50 focus:ring-1 dark:hover:bg-slate-800/50"
        title="Toggle Sort Order"
        @click="store.sortOrder = store.sortOrder === 'desc' ? 'asc' : 'desc'"
      >
        <ArrowUpDown class="text-ink-secondary h-4 w-4" />
      </button>
    </div>
  </div>
</template>
