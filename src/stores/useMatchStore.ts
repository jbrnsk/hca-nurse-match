import internalData from '@/data/internal.json';
import externalData from '@/data/external.json';
import matchesData from '@/data/matches.json';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';
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
  ZipCode: string;
}

export interface Decision {
  status: MatchStatus;
  reason?: string;
  note?: string;
  timestamp: number;
}

// --- The Store ---
export const useMatchStore = defineStore('matches', {
  state: () => ({
    decisions: useStorage<Record<string, Decision>>('hca-nurse-decisions', {}),
    selectedMatchId: ref<string | null>(null),
    searchQuery: '',
    filterStatus: 'unreviewed' as MatchStatus | 'all',
  }),

  getters: {
    worklist: (state) => {
      return matchesData.map((m) => {
        const internal = (internalData as any).find(
          (p: any) => p.InternalPatientId === m.InternalPatientId
        );
        const external = (externalData as any).find(
          (p: any) => p.ExternalPatientId === m.ExternalPatientId
        );
        const decision = state.decisions[m.ExternalPatientId];

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
    },

    filteredWorklist(): any[] {
      let list = this.worklist;

      // 1. Filter by Status
      if (this.filterStatus !== 'all') {
        list = list.filter((m) => m.status === this.filterStatus);
      }

      // 2. Search by Name or DOB (Both rosters)
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        list = list.filter((m) => {
          const matchTarget = [
            m.internal.FirstName,
            m.internal.LastName,
            m.internal.DOB,
            m.external.FirstName,
            m.external.LastName,
            m.external.DOB,
          ]
            .join(' ')
            .toLowerCase();

          return matchTarget.includes(query);
        });
      }

      // 3. Sort by Confidence (High -> Low)
      return list.sort((a, b) => b.confidence - a.confidence);
    },
  },

  actions: {
    recordDecision(id: string, decision: Omit<Decision, 'timestamp'>) {
      this.decisions[id] = { ...decision, timestamp: Date.now() };
    },
    undoDecision(id: string) {
      delete this.decisions[id];
    },
  },
});
