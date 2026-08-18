import { useCallback, useMemo } from 'react';
import type { BreedingPlan, ChecklistState, PersistedState } from '../types';
import { useStoredState } from './useStorage';

/**
 * PERSISTENCE LAYER — captured Pals, map checklist and saved breeding plans.
 * Single versioned document under one storage key.
 */

const DEFAULT_STATE: PersistedState = {
  version: 1,
  checklist: { captured: {}, alphaDefeated: {}, found: {} },
  breedingPlans: []
};

export function usePersistence() {
  const [state, setState, ready] = useStoredState<PersistedState>('state', DEFAULT_STATE);

  const toggleCaptured = useCallback(
    (palId: string) => {
      setState((s) => ({
        ...s,
        checklist: {
          ...s.checklist,
          captured: { ...s.checklist.captured, [palId]: !s.checklist.captured[palId] }
        }
      }));
    },
    [setState]
  );

  const setCaptured = useCallback(
    (palId: string, value: boolean) => {
      setState((s) => ({
        ...s,
        checklist: { ...s.checklist, captured: { ...s.checklist.captured, [palId]: value } }
      }));
    },
    [setState]
  );

  const toggleMapPoint = useCallback(
    (pointId: string, kind: 'found' | 'alphaDefeated') => {
      setState((s) => {
        const bucket = s.checklist[kind];
        return {
          ...s,
          checklist: {
            ...s.checklist,
            [kind]: { ...bucket, [pointId]: !bucket[pointId] }
          }
        };
      });
    },
    [setState]
  );

  const saveBreedingPlan = useCallback(
    (plan: Omit<BreedingPlan, 'id' | 'createdAt'>) => {
      const full: BreedingPlan = { ...plan, id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: Date.now() };
      setState((s) => ({ ...s, breedingPlans: [full, ...s.breedingPlans].slice(0, 25) }));
      return full;
    },
    [setState]
  );

  const deleteBreedingPlan = useCallback(
    (id: string) => {
      setState((s) => ({ ...s, breedingPlans: s.breedingPlans.filter((p) => p.id !== id) }));
    },
    [setState]
  );

  const resetAll = useCallback(() => setState(DEFAULT_STATE), [setState]);

  const checklist: ChecklistState = useMemo(() => state.checklist, [state.checklist]);

  return {
    ready,
    checklist,
    breedingPlans: state.breedingPlans,
    toggleCaptured,
    setCaptured,
    toggleMapPoint,
    saveBreedingPlan,
    deleteBreedingPlan,
    resetAll
  };
}

export type PersistenceApi = ReturnType<typeof usePersistence>;
