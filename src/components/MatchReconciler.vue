<script setup lang="ts">
import { computed } from 'vue';
import { useMatchStore, type Patient } from '@/stores/useMatchStore';
import { isMatch, normalizeDate } from '@/utils/comparison';
import { Check, X, AlertCircle, RotateCcw } from 'lucide-vue-next';

const props = defineProps<{ matchId: string }>();
const store = useMatchStore();

const match = computed(() => store.worklist.find((m) => m.id === props.matchId));

const fields: (keyof Patient)[] = [
  'FirstName',
  'LastName',
  'DOB',
  'Sex',
  'PhoneNumber',
  'Address',
  'City',
  'ZipCode',
];

const handleDecision = (status: 'accepted' | 'rejected' | 'follow-up') => {
  if (status === 'rejected') {
    const reason = window.confirm(
      "Is this a 'Not the same person' rejection? (Cancel for 'Changed PCP')"
    )
      ? 'Not the same person'
      : 'Patient changed PCP/clinic';
    store.recordDecision(props.matchId, { status, reason });
  } else {
    store.recordDecision(props.matchId, { status });
  }
};
</script>

<template>
  <div v-if="match" class="space-y-6">
    <div class="border-border flex items-center justify-between border-b pb-4">
      <div>
        <h2 class="text-ink-primary text-xl font-bold">Patient Comparison</h2>
        <p class="text-ink-secondary text-sm">
          Comparing External (Clinic) vs. Internal (Hospital)
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div class="mr-4 text-right">
          <p class="text-ink-secondary text-xs font-bold tracking-widest uppercase">
            Confidence Score
          </p>
          <p class="text-brand font-mono text-lg font-bold">
            {{ (match.confidence * 100).toFixed(1) }}%
          </p>
        </div>
        <button
          v-if="match.status !== 'unreviewed'"
          @click="store.undoDecision(match.id)"
          class="text-ink-secondary hover:text-brand flex items-center gap-2 text-xs font-bold tracking-wider uppercase"
        >
          <RotateCcw :size="14" /> Undo Decision
        </button>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4 text-sm">
      <div
        class="text-ink-secondary col-span-2 py-2 text-[10px] font-bold tracking-wider uppercase"
      >
        Field
      </div>
      <div
        class="text-ink-secondary col-span-5 py-2 text-[10px] font-bold tracking-wider uppercase"
      >
        Clinic Record (Ext)
      </div>
      <div
        class="text-ink-secondary col-span-5 py-2 text-[10px] font-bold tracking-wider uppercase"
      >
        Hospital Record (Int)
      </div>

      <template v-for="field in fields" :key="field">
        <div class="text-ink-secondary col-span-2 border-t border-slate-100 py-3 font-medium">
          {{ field }}
        </div>

        <div
          class="col-span-5 rounded border-t border-slate-100 px-2 py-3"
          :class="
            !isMatch(field, match.external[field], match.internal[field])
              ? 'text-danger bg-red-50 font-bold'
              : 'text-ink-primary'
          "
        >
          {{ field === 'DOB' ? normalizeDate(match.external[field]) : match.external[field] }}
        </div>

        <div class="col-span-5 border-t border-slate-100 px-2 py-3">
          {{ field === 'DOB' ? normalizeDate(match.internal[field]) : match.internal[field] }}
        </div>
      </template>
    </div>

    <div class="border-border mt-8 flex items-center justify-end gap-4 border-t pt-6">
      <button
        @click="handleDecision('follow-up')"
        class="text-warning flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold hover:bg-amber-50"
      >
        <AlertCircle :size="18" /> Needs Follow-up
      </button>
      <button
        @click="handleDecision('rejected')"
        class="text-danger flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold hover:bg-red-50"
      >
        <X :size="18" /> Reject Match
      </button>
      <button
        @click="handleDecision('accepted')"
        class="bg-success flex items-center gap-2 rounded-md px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-emerald-700"
      >
        <Check :size="18" /> Accept Match
      </button>
    </div>
  </div>
</template>
