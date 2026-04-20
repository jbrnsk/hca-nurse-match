<script setup lang="ts">
import { AlertCircle, Ban, X } from 'lucide-vue-next';
import { nextTick, ref, watch } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  mode: 'rejected' | 'follow-up' | null;
  patientName: string;
}>();

const emit = defineEmits(['close', 'confirm']);

const note = ref('');
const cardRef = ref<HTMLElement | null>(null);
const reason = ref<'Not the same person' | 'Patient changed PCP/clinic' | null>(null);

watch(
  () => props.isOpen,
  async (open) => {
    if (open) {
      note.value = '';
      reason.value = null;

      await nextTick();

      if (cardRef.value) {
        // 3. Wait for the browser's paint cycle to be ready
        requestAnimationFrame(() => {
          let elementToFocus: HTMLElement | null = null;

          if (props.mode === 'rejected') {
            // Find the first radio button in the list
            elementToFocus = cardRef.value?.querySelector(
              'input[type="radio"]'
            ) as HTMLElement | null;
          } else {
            // Find the optional note textarea
            elementToFocus = cardRef.value?.querySelector('textarea') as HTMLElement | null;
          }

          if (elementToFocus) {
            elementToFocus.focus();
          }
        });
      }
    }
  }
);

const handleConfirm = () => {
  if (props.mode === 'rejected' && !reason.value) return;
  console.log('confirmed!', reason.value, note.value);
  emit('confirm', { status: props.mode, reason: reason.value, note: note.value });
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        ref="cardRef"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="emit('close')"></div>
        <div
          class="border-border relative w-full max-w-md rounded-xl border bg-white p-6 shadow-2xl dark:bg-slate-900"
        >
          <div class="mb-4 flex items-center justify-between">
            <div
              class="flex items-center gap-2 text-sm font-black tracking-widest uppercase"
              :class="mode === 'rejected' ? 'text-danger' : 'text-warning'"
            >
              <Ban v-if="mode === 'rejected'" :size="18" />
              <AlertCircle v-else :size="18" />
              {{ mode === 'rejected' ? 'Reject Match' : 'Flag for Follow-up' }}
            </div>
            <button
              class="text-ink-secondary hover:text-ink-primary transition-colors"
              @click="emit('close')"
            >
              <X :size="20" />
            </button>
          </div>
          <p class="text-ink-secondary mb-6 text-sm">
            Confirming action for <span class="text-ink-primary font-bold">{{ patientName }}</span
            >.
          </p>
          <div v-if="mode === 'rejected'" class="mb-6 space-y-3">
            <label class="text-ink-secondary text-[10px] font-black tracking-widest uppercase"
              >Reason Required</label
            >
            <div class="grid gap-2">
              <label
                class="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all outline-none"
                :class="[
                  reason === 'Not the same person'
                    ? 'border-danger bg-danger/5 ring-danger ring-1'
                    : 'border-border hover:bg-slate-50 dark:hover:bg-slate-800',
                  // This is the magic: if the child input is focused via keyboard, style the label
                  'has-[:focus-visible]:ring-brand has-[:focus-visible]:border-brand has-[:focus-visible]:ring-2',
                ]"
              >
                <input
                  v-model="reason"
                  class="accent-danger h-4 w-4"
                  type="radio"
                  value="Not the same person"
                />
                <span class="text-ink-primary text-sm font-bold">Not the same person</span>
              </label>
              <label
                class="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all outline-none"
                :class="[
                  reason === 'Patient changed PCP/clinic'
                    ? 'border-danger bg-danger/5 ring-danger ring-1'
                    : 'border-border hover:bg-slate-50 dark:hover:bg-slate-800',
                  'has-[:focus-visible]:ring-brand has-[:focus-visible]:border-brand has-[:focus-visible]:ring-2',
                ]"
              >
                <input
                  v-model="reason"
                  class="accent-danger h-4 w-4"
                  type="radio"
                  value="Patient changed PCP/clinic"
                />
                <span class="text-ink-primary text-sm font-bold">Changed PCP / Clinic</span>
              </label>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-ink-secondary text-[10px] font-black tracking-widest uppercase"
              >Internal Note (Optional)</label
            >
            <textarea
              v-model="note"
              class="border-border bg-canvas focus:border-brand focus:ring-brand/20 h-24 w-full resize-none rounded-lg border p-3 text-sm transition-all outline-none focus:ring-2"
              placeholder="Provide additional context..."
            ></textarea>
          </div>
          <div class="mt-8 flex gap-3">
            <button
              class="border-border flex-1 cursor-pointer rounded-lg border py-2.5 text-sm font-bold transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
              @click="emit('close')"
            >
              Cancel
            </button>
            <button
              class="flex-1 cursor-pointer rounded-lg py-2.5 text-sm font-bold text-white shadow-lg transition-all"
              :class="[
                mode === 'rejected'
                  ? 'bg-danger shadow-danger/20 hover:bg-red-700'
                  : 'bg-warning shadow-warning/20 hover:bg-amber-600',
                mode === 'rejected' && !reason ? 'cursor-not-allowed opacity-50' : '',
              ]"
              :disabled="mode === 'rejected' && !reason"
              @click="handleConfirm"
            >
              Confirm {{ mode === 'rejected' ? 'Rejection' : 'Follow-up' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
