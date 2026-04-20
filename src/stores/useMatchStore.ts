import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import externalData from '@/data/external.json';
import internalData from '@/data/internal.json';
import matchesData from '@/data/matches.json';

// --- Types ---
export type MatchStatus = 'unreviewed' | 'accepted' | 'rejected' | 'follow-up';

export interface Patient {
  FirstName: string;
  LastName: string;
  DOB: string;
  Sex: string;
  PhoneNumber: string;
  Address: string;
  City: string;
  ZipCode: string | number;
}

export interface Decision {
  status: MatchStatus;
  reason?: string;
  note?: string;
  timestamp: number;
}

export interface RawInternalPatient extends Patient {
  InternalPatientId: string;
}

export interface RawExternalPatient extends Patient {
  ExternalPatientId: string;
}

export interface WorklistItem {
  id: string;
  internalId: string;
  confidence: number;
  internal: Patient;
  external: Patient;
  status: MatchStatus;
  decision?: Decision;
}

// --- The Store ---
export const useMatchStore = defineStore('matches', () => {
  // --- STATE ---
  const decisions = useStorage<Record<string, Decision>>('hca-nurse-decisions', {});
  const selectedMatchId = ref<string | null>(null);
  const searchQuery = ref('');
  const filterStatus = ref<MatchStatus | 'all'>('unreviewed');
  const sortOrder = ref<'asc' | 'desc'>('desc');
  const lastActionId = ref<string | null>(null);

  // --- GETTERS ---
  const worklist = computed<WorklistItem[]>(() => {
    return matchesData.map((m) => {
      const internal = (internalData as RawInternalPatient[]).find(
        (p) => p.InternalPatientId === m.InternalPatientId
      );
      const external = (externalData as RawExternalPatient[]).find(
        (p) => p.ExternalPatientId === m.ExternalPatientId
      );
      const decision = decisions.value[m.ExternalPatientId];

      return {
        id: m.ExternalPatientId,
        internalId: m.InternalPatientId,
        confidence: m.ConfidenceScore,
        internal: internal as Patient,
        external: external as Patient,
        status: decision?.status || 'unreviewed',
        decision,
      };
    });
  });

  const filteredWorklist = computed(() => {
    let list = [...worklist.value];

    if (filterStatus.value !== 'all') {
      list = list.filter((m) => m.status === filterStatus.value);
    }

    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase();
      list = list.filter((m) => {
        return [
          m.internal.FirstName,
          m.internal.LastName,
          m.internal.DOB,
          m.external.FirstName,
          m.external.LastName,
          m.external.DOB,
        ]
          .join(' ')
          .toLowerCase()
          .includes(query);
      });
    }

    return list.sort((a, b) =>
      sortOrder.value === 'desc' ? b.confidence - a.confidence : a.confidence - b.confidence
    );
  });

  const selectedMatch = computed(
    () => worklist.value.find((m) => m.id === selectedMatchId.value) || null
  );

  const progress = computed(() => {
    const total = matchesData.length;
    const reviewed = Object.keys(decisions.value).length;
    return {
      total,
      reviewed,
      percent: Math.round((reviewed / total) * 100),
    };
  });

  // --- ACTIONS ---
  function recordDecision(id: string, status: MatchStatus, note?: string) {
    decisions.value[id] = { status, note, timestamp: Date.now() };
    lastActionId.value = id;

    // Advance to next unreviewed item
    const list = filteredWorklist.value;
    const currentIndex = list.findIndex((m) => m.id === id);
    let next = list.slice(currentIndex + 1).find((m) => m.status === 'unreviewed');

    if (!next) {
      next = list.find((m) => m.status === 'unreviewed');
    }

    selectedMatchId.value = next ? next.id : null;
  }

  function undoLastAction() {
    if (!lastActionId.value) return;
    const idToUndo = lastActionId.value;
    delete decisions.value[idToUndo];
    selectedMatchId.value = idToUndo;
    lastActionId.value = null;
  }

  function resetAll() {
    if (confirm('Clear all triage decisions?')) {
      decisions.value = {};
      selectedMatchId.value = null;
      lastActionId.value = null;
    }
  }

  // Explicitly return everything you want exposed
  return {
    decisions,
    selectedMatchId,
    searchQuery,
    filterStatus,
    sortOrder,
    lastActionId,
    worklist,
    filteredWorklist,
    selectedMatch,
    progress,
    recordDecision,
    undoLastAction,
    resetAll,
  };
});
