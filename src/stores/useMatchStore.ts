import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

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
export const useMatchStore = defineStore('matches', {
  state: () => ({
    decisions: useStorage<Record<string, Decision>>('hca-nurse-decisions', {}),
    selectedMatchId: null as string | null,
    searchQuery: '',
    filterStatus: 'unreviewed' as MatchStatus | 'all',
    sortOrder: 'desc' as 'asc' | 'desc',
  }),

  getters: {
    worklist(state): WorklistItem[] {
      return matchesData.map((m) => {
        const internal = (internalData as RawInternalPatient[]).find(
          (p: RawInternalPatient) => p.InternalPatientId === m.InternalPatientId
        );
        const external = (externalData as RawExternalPatient[]).find(
          (p: RawExternalPatient) => p.ExternalPatientId === m.ExternalPatientId
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

    filteredWorklist(): WorklistItem[] {
      let list = [...this.worklist];

      // 1. Filter by Status
      if (this.filterStatus !== 'all') {
        list = list.filter((m) => m.status === this.filterStatus);
      }

      // 2. Search by Name or DOB
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

      // 3. AC: Dynamic Sort of Confidence
      return list.sort((a, b) => {
        return this.sortOrder === 'desc'
          ? b.confidence - a.confidence
          : a.confidence - b.confidence;
      });
    },

    progress(state) {
      const total = matchesData.length;
      const reviewed = Object.keys(state.decisions).length;
      return {
        total,
        reviewed,
        percent: Math.round((reviewed / total) * 100),
      };
    },
  },

  actions: {
    recordDecision(id: string, decision: Omit<Decision, 'timestamp'>) {
      this.decisions[id] = { ...decision, timestamp: Date.now() };
    },
    undoDecision(id: string) {
      const newDecisions = { ...this.decisions };
      delete newDecisions[id];
      this.decisions = newDecisions;
    },
    resetAll() {
      if (confirm('Clear all triage decisions? This cannot be undone.')) {
        this.decisions = {};
        this.selectedMatchId = null;
      }
    },
  },
});
