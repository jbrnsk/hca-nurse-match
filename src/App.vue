<script setup lang="ts">
import { Search, Filter, CheckCircle2, XCircle, Clock } from 'lucide-vue-next';

import { useMatchStore } from '@/stores/useMatchStore';

const store = useMatchStore();
</script>

<template>
  <div class="bg-canvas flex h-screen w-full flex-col overflow-hidden">
    <header
      class="border-border bg-surface flex h-14 shrink-0 items-center justify-between border-b px-6"
    >
      <div class="flex items-center gap-3">
        <div class="bg-brand flex h-7 w-7 items-center justify-center rounded font-bold text-white">
          N
        </div>
        <h1 class="text-ink-primary text-sm font-bold tracking-widest uppercase">
          NurseMatch <span class="font-normal opacity-50">Triage</span>
        </h1>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <aside class="border-border bg-surface flex w-80 shrink-0 flex-col border-r">
        <div class="border-border space-y-3 border-b p-4">
          <div class="relative">
            <Search class="text-ink-secondary absolute top-2.5 left-2.5 h-4 w-4" />
            <input
              v-model="store.searchQuery"
              type="text"
              placeholder="Search patients..."
              class="border-border bg-canvas focus:ring-brand w-full rounded border py-2 pr-4 pl-9 text-sm focus:ring-1"
            />
          </div>

          <select
            v-model="store.filterStatus"
            class="border-border bg-canvas w-full rounded border p-2 text-xs font-medium"
          >
            <option value="all">All Records</option>
            <option value="unreviewed">Unreviewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="follow-up">Needs Follow-up</option>
          </select>
        </div>

        <div class="flex-1 overflow-y-auto">
          <div
            v-for="match in store.filteredWorklist"
            :key="match.id"
            @click="store.selectedMatchId = match.id"
            :class="[
              'group border-border cursor-pointer border-b p-4 transition-colors hover:bg-slate-50',
              store.selectedMatchId === match.id ? 'ring-brand bg-blue-50 ring-1 ring-inset' : '',
            ]"
          >
            <div class="mb-1 flex items-start justify-between">
              <span class="text-ink-secondary font-mono text-xs font-bold">{{ match.id }}</span>
              <span
                class="rounded px-1.5 py-0.5 text-[10px] font-bold tracking-tighter uppercase"
                :class="
                  match.confidence > 0.8
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                "
              >
                {{ (match.confidence * 100).toFixed(0) }}% Match
              </span>
            </div>
            <p class="text-ink-primary text-sm font-bold">
              {{ match.external.FirstName }} {{ match.external.LastName }}
            </p>
            <p class="text-ink-secondary font-mono text-xs">{{ match.external.DOB }}</p>
          </div>
        </div>
      </aside>

      <main class="flex-1 overflow-y-auto">
        <div v-if="store.selectedMatchId" class="mx-auto max-w-5xl p-8">
          <h2 class="mb-6 text-2xl font-bold">Review Suggested Match</h2>
          <div class="grid grid-cols-2 gap-8"></div>
        </div>

        <div
          v-else
          class="text-ink-secondary flex h-full flex-col items-center justify-center p-12 text-center opacity-40"
        >
          <div
            class="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-current"
          >
            <Filter class="h-6 w-6" />
          </div>
          <p class="text-lg font-medium">Select a patient from the queue to review</p>
          <p class="text-sm">Priority matches are sorted by confidence score</p>
        </div>
      </main>
    </div>
  </div>
</template>
