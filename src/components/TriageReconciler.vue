<script setup lang="ts">
import { AlertCircle, Ban, Check, Info, RotateCcw, X } from 'lucide-vue-next';
import { computed, nextTick, ref, watch } from 'vue';

import { useTriageStore } from '@/stores/useTriageStore';
import { isMatch, normalizeDate } from '@/utils/comparison';

import TriageModal from './TriageModal.vue';

const props = defineProps<{ matchId: string }>();
const store = useTriageStore();
const containerRef = ref<HTMLElement | null>(null);
const triggerElement = ref<HTMLElement | null>(null);

const match = computed(() => store.worklist.find((m) => m.id === props.matchId));
const isReviewed = computed(() => match.value?.status !== 'unreviewed');
const isModalOpen = ref(false);
const modalMode = ref<'rejected' | 'follow-up' | null>(null);

const fields: (keyof typeof match.value.external)[] = [
  'FirstName',
  'LastName',
  'DOB',
  'Sex',
  'PhoneNumber',
  'Address',
  'City',
  'ZipCode',
];

const handleAccept = () => {
  store.recordDecision(props.matchId, 'accepted');
};

const openDecisionModal = (mode: 'rejected' | 'follow-up') => {
  triggerElement.value = document.activeElement as HTMLElement;
  modalMode.value = mode;
  isModalOpen.value = true;
};

const handleModalClose = async () => {
  isModalOpen.value = false;
  modalMode.value = null;

  await nextTick();

  if (triggerElement.value) {
    triggerElement.value.focus();
  }
};

const handleModalConfirm = (payload: {
  status: 'rejected' | 'follow-up';
  note?: string;
  reason?: string;
}) => {
  store.recordDecision(props.matchId, payload.status, {
    note: payload.note,
    reason: payload.reason,
  });
  isModalOpen.value = false;
  modalMode.value = null;
};

watch(
  () => props.matchId,
  async (newId) => {
    if (!newId) return;

    const isLargeScreen = typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)');

    if (!isLargeScreen || !isLargeScreen.matches) {
      return;
    }

    await nextTick();

    if (!containerRef.value) {
      await nextTick();
    }

    if (containerRef.value) {
      requestAnimationFrame(() => {
        const firstButton = containerRef.value?.querySelector('button');
        if (firstButton instanceof HTMLElement) {
          firstButton.focus();
        }
      });
    }
  },
  { immediate: true }
);
</script>

<template>
  <div v-if="match" ref="containerRef" class="bg-surface mb-12 lg:flex lg:h-full lg:flex-col">
    <div
      v-if="isReviewed"
      :class="[
        'flex items-center justify-between border-b border-l-4 px-6 py-4 transition-all',
        match.status === 'accepted'
          ? 'border-emerald-100 border-l-emerald-500 bg-emerald-50/30 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
          : match.status === 'rejected'
            ? 'border-red-100 border-l-red-500 bg-red-50/30 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300'
            : 'border-amber-100 border-l-amber-500 bg-amber-50/30 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300',
      ]"
    >
      <div class="flex items-center gap-3 text-sm font-black tracking-widest uppercase">
        <Check v-if="match.status === 'accepted'" :size="18" stroke-width="3" />
        <X v-if="match.status === 'rejected'" :size="18" stroke-width="3" />
        <AlertCircle v-if="match.status === 'follow-up'" :size="18" stroke-width="3" />
        Decision: {{ match.status }}
      </div>
      <div class="text-[10px] font-black tracking-tighter uppercase opacity-60">
        Review Finalized
      </div>
    </div>
    <div
      class="space-y-8 p-4 lg:flex-1 lg:overflow-y-auto lg:p-8"
      :class="{ 'pointer-events-none opacity-90 select-none': isReviewed }"
    >
      <div class="border-border flex items-center justify-between border-b pb-6">
        <div>
          <h2 class="text-ink-primary text-xl font-black tracking-tight lg:text-2xl">
            Patient Reconciliation
          </h2>
          <p class="text-ink-secondary text-xs lg:text-sm">
            Verify data consistency between records.
          </p>
        </div>
        <div class="text-right">
          <p class="text-ink-secondary text-[10px] font-bold tracking-widest uppercase">
            Confidence
          </p>
          <p class="text-brand font-mono text-xl font-black lg:text-2xl">
            {{ (match.confidence * 100).toFixed(1) }}%
          </p>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-y-2 text-sm lg:grid-cols-12 lg:gap-x-4">
        <div
          class="text-ink-secondary hidden pb-4 text-[10px] font-black tracking-widest uppercase lg:col-span-2 lg:block"
        >
          Field
        </div>
        <div
          class="text-ink-secondary hidden pb-4 text-[10px] font-black tracking-widest uppercase lg:col-span-5 lg:block"
        >
          Clinic Record (Ext)
        </div>
        <div
          class="text-ink-secondary hidden pb-4 text-[10px] font-black tracking-widest uppercase lg:col-span-5 lg:block"
        >
          Hospital Record (Int)
        </div>

        <template v-for="field in fields" :key="field">
          <div
            class="border-border text-ink-secondary col-span-full border-t pt-4 text-[10px] font-black uppercase lg:col-span-2 lg:bg-transparent lg:py-4 lg:text-[11px]"
          >
            {{ field }}
          </div>

          <div
            class="border-border col-span-full px-3 py-3 transition-colors lg:col-span-5 lg:border-t lg:py-4"
            :class="
              !isMatch(field, match.external[field], match.internal[field])
                ? 'bg-danger/10 text-danger border-l-danger border-l-2 font-bold dark:bg-red-500/20 dark:text-red-400'
                : 'text-ink-primary'
            "
          >
            <span class="mb-1 block text-[9px] font-black uppercase opacity-40 lg:hidden"
              >Clinic Record</span
            >
            {{
              field === 'DOB'
                ? normalizeDate(match.external[field] as string)
                : match.external[field]
            }}
          </div>

          <div
            class="border-border text-ink-primary col-span-full px-3 py-3 lg:col-span-5 lg:border-t lg:py-4"
          >
            <span class="mb-1 block text-[9px] font-black uppercase opacity-40 lg:hidden"
              >Hospital Record</span
            >
            {{
              field === 'DOB'
                ? normalizeDate(match.internal[field] as string)
                : match.internal[field]
            }}
          </div>
        </template>
      </div>
    </div>
    <div class="border-border bg-surface border-t p-4 lg:p-6">
      <div v-if="isReviewed" class="space-y-6">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div v-if="match.decision?.reason" class="flex flex-col gap-1.5">
            <span class="text-ink-secondary text-[10px] font-black tracking-widest uppercase">
              Resolution Reason
            </span>
            <div class="text-danger flex items-center gap-2 text-sm font-bold">
              <Ban :size="14" />
              {{ match.decision.reason }}
            </div>
          </div>
          <div
            v-if="match.decision?.note"
            class="flex flex-col gap-1.5"
            :class="{ 'col-span-full': !match.decision?.reason }"
          >
            <span class="text-ink-secondary text-[10px] font-black tracking-widest uppercase">
              Nurse Narrative
            </span>
            <p class="text-ink-primary text-sm leading-relaxed italic">
              "{{ match.decision.note }}"
            </p>
          </div>
        </div>
        <div
          class="border-border flex flex-col items-center justify-between gap-4 border-t pt-4 lg:flex-row"
        >
          <div
            class="text-ink-secondary flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase"
          >
            <Info :size="12" />
            Finalized • {{ new Date(match.decision?.timestamp || Date.now()).toLocaleString() }}
          </div>
          <button
            class="border-border text-ink-primary flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border bg-white px-6 py-2 text-sm font-bold shadow-sm transition-all hover:bg-slate-50 lg:w-auto dark:bg-slate-800 dark:hover:bg-slate-700"
            @click="store.undoDecision(match.id)"
          >
            <RotateCcw :size="14" />
            Modify Decision
          </button>
        </div>
      </div>
      <div v-else class="flex flex-col justify-end gap-3 lg:flex-row">
        <button
          class="text-warning cursor-pointer rounded-md px-4 py-3 text-sm font-bold hover:bg-amber-50 lg:py-2 dark:hover:bg-amber-950/30"
          @click="openDecisionModal('follow-up')"
        >
          Needs Follow-up
        </button>
        <button
          class="text-danger cursor-pointer rounded-md px-4 py-3 text-sm font-bold hover:bg-red-50 lg:py-2 dark:hover:bg-red-950/30"
          @click="openDecisionModal('rejected')"
        >
          Reject Match
        </button>
        <button
          class="bg-success cursor-pointer rounded-md px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 lg:py-2"
          @click="handleAccept()"
        >
          Accept Match
        </button>
      </div>
    </div>
    <TriageModal
      :is-open="isModalOpen"
      :mode="modalMode"
      :patient-name="`${match.external.FirstName} ${match.external.LastName}`"
      @close="handleModalClose"
      @confirm="handleModalConfirm"
    />
  </div>
</template>
