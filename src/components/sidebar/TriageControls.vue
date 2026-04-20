<script setup lang="ts">
import { ArrowUpDown, Search } from 'lucide-vue-next';

import { useMatchStore } from '@/stores/useMatchStore';
const store = useMatchStore();
</script>

<template>
  <div class="border-border shrink-0 space-y-3 border-b p-4">
    <div class="relative">
      <Search class="text-ink-secondary absolute top-2.5 left-2.5 h-4 w-4" />
      <input
        v-model="store.searchQuery"
        class="border-border bg-canvas focus:ring-brand w-full rounded border py-2 pr-4 pl-9 text-sm outline-none focus:ring-1"
        placeholder="Search name or DOB..."
        type="text"
      />
    </div>

    <div class="flex gap-2">
      <select
        v-model="store.filterStatus"
        class="border-border bg-canvas flex-1 rounded border p-2 text-xs font-medium outline-none"
      >
        <option value="all">All Records</option>
        <option value="unreviewed">Unreviewed</option>
        <option value="accepted">Accepted</option>
        <option value="rejected">Rejected</option>
        <option value="follow-up">Needs Follow-up</option>
      </select>

      <button
        class="border-border bg-canvas rounded border px-3 transition-colors hover:bg-slate-50"
        title="Toggle Sort Order"
        @click="store.sortOrder = store.sortOrder === 'desc' ? 'asc' : 'desc'"
      >
        <ArrowUpDown class="text-ink-secondary h-3 w-3" />
      </button>
    </div>
  </div>
</template>
