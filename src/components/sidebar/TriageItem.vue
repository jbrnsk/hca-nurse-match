<script setup lang="ts">
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-vue-next';

import type { MatchStatus } from '@/stores/useMatchStore';

defineProps<{
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  confidence: number;
  status: MatchStatus;
  isActive: boolean;
}>();
</script>

<template>
  <div
    :class="[
      'group border-border cursor-pointer border-b p-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50',
      isActive ? 'ring-brand bg-brand/10 z-10 ring-1 ring-inset' : 'bg-canvas',
    ]"
  >
    <div class="mb-1 flex items-start justify-between">
      <span class="text-ink-secondary font-mono text-[10px] font-bold tracking-tight uppercase">
        {{ id }}
      </span>

      <div v-if="status !== 'unreviewed'" class="flex items-center gap-1">
        <CheckCircle2 v-if="status === 'accepted'" class="text-success h-4 w-4" />
        <XCircle v-if="status === 'rejected'" class="text-danger h-4 w-4" />
        <AlertCircle v-if="status === 'follow-up'" class="text-warning h-4 w-4" />
      </div>
      <span
        v-else
        class="rounded px-1.5 py-0.5 text-[10px] font-bold tracking-tighter uppercase"
        :class="
          confidence > 0.8
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        "
      >
        {{ (confidence * 100).toFixed(0) }}% Match
      </span>
    </div>

    <p
      class="text-ink-primary text-sm font-bold transition-colors group-hover:text-slate-900 dark:group-hover:text-white"
    >
      {{ firstName }} {{ lastName }}
    </p>

    <p
      class="text-ink-secondary mt-0.5 font-mono text-[10px] tracking-wide uppercase transition-colors group-hover:text-slate-900 dark:group-hover:text-white"
    >
      {{ dob }}
    </p>
  </div>
</template>
