'use client';

import { create } from 'zustand';
/**
 * Wizard state management — Zustand store
 *
 * Holds every answer the user selects across the 6-step wizard.
 * The page component reads from this store instead of local useState,
 * so the selections persist across step navigation.
 */

export interface WizardAnswers {
  projectName: string;
  description: string;
  projectType: string | null;
  teamSize: string | null;
  requirements: string[];
  priorities: string[];
  preferences: string[];
  analytics: string[];
}

interface WizardStore {
  // ── State ──
  currentStep: number;
  answers: WizardAnswers;
  isSubmitting: boolean;
  error: string | null;

  // ── Actions ──
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  setProjectName: (name: string) => void;
  setDescription: (desc: string) => void;

  setProjectType: (id: string) => void;
  setTeamSize: (id: string) => void;
  toggleRequirement: (id: string) => void;
  togglePriority: (id: string) => void;
  togglePreference: (id: string) => void;
  toggleAnalytics: (id: string) => void;

  canAdvance: () => boolean;
  reset: () => void;

  submitWizard: () => Promise<{ projectId: string; recommendationId: string } | null>;
}

const INITIAL_ANSWERS: WizardAnswers = {
  projectName: '',
  description: '',
  projectType: null,
  teamSize: null,
  requirements: [],
  priorities: [],
  preferences: [],
  analytics: [],
};

export const useWizardStore = create<WizardStore>((set, get) => ({
  // ── State ──
  currentStep: 1,
  answers: { ...INITIAL_ANSWERS },
  isSubmitting: false,
  error: null,

  // ── Navigation ──
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 7) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

  // ── Single-select answers ──
  setProjectName: (name) => set((s) => ({ answers: { ...s.answers, projectName: name } })),
  setDescription: (desc) => set((s) => ({ answers: { ...s.answers, description: desc } })),
  setProjectType: (id) => set((s) => ({ answers: { ...s.answers, projectType: id } })),
  setTeamSize: (id) => set((s) => ({ answers: { ...s.answers, teamSize: id } })),

  // ── Multi-select toggles ──
  toggleRequirement: (id) =>
    set((s) => {
      const arr = s.answers.requirements;
      return {
        answers: {
          ...s.answers,
          requirements: arr.includes(id) ? arr.filter((v) => v !== id) : [...arr, id],
        },
      };
    }),

  togglePriority: (id) =>
    set((s) => {
      const arr = s.answers.priorities;
      // Max 2 priorities
      if (!arr.includes(id) && arr.length >= 2) return s;
      return {
        answers: {
          ...s.answers,
          priorities: arr.includes(id) ? arr.filter((v) => v !== id) : [...arr, id],
        },
      };
    }),

  togglePreference: (id) =>
    set((s) => {
      const arr = s.answers.preferences;
      return {
        answers: {
          ...s.answers,
          preferences: arr.includes(id) ? arr.filter((v) => v !== id) : [...arr, id],
        },
      };
    }),

  toggleAnalytics: (id) =>
    set((s) => {
      const arr = s.answers.analytics;
      return {
        answers: {
          ...s.answers,
          analytics: arr.includes(id) ? arr.filter((v) => v !== id) : [...arr, id],
        },
      };
    }),

  // ── Validation ──
  canAdvance: () => {
    const { currentStep, answers } = get();
    switch (currentStep) {
      case 1:
        return (
          !!answers.projectName?.trim() && !!answers.projectType && !!answers.description?.trim()
        );
      case 2:
        return !!answers.teamSize;
      case 3:
        return answers.requirements.length > 0;
      case 4:
        return answers.priorities.length > 0;
      case 5:
        return true; // preferences are optional
      case 6:
        return true; // analytics are optional
      case 7:
        return true;
      default:
        return false;
    }
  },

  // ── Reset ──
  reset: () =>
    set({ currentStep: 1, answers: { ...INITIAL_ANSWERS }, isSubmitting: false, error: null }),

  // ── Submit ──
  submitWizard: async () => {
    const { answers } = get();
    set({ isSubmitting: true, error: null });

    try {
      const res = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      set({ isSubmitting: false });
      return data as { projectId: string; recommendationId: string };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      set({ isSubmitting: false, error: message });
      return null;
    }
  },
}));
