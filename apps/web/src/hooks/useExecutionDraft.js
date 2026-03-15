
import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage.js';

export function useExecutionDraft(executionId, initialData) {
  const [draft, setDraft] = useLocalStorage(`execution_draft_${executionId}`, initialData);
  const [lastSaved, setLastSaved] = useLocalStorage(`execution_last_saved_${executionId}`, null);

  // Memoized to prevent unnecessary re-renders in components using this hook
  const saveDraft = useCallback((data) => {
    setDraft(data);
    setLastSaved(new Date().toISOString());
  }, [setDraft, setLastSaved]);

  const clearDraft = useCallback(() => {
    window.localStorage.removeItem(`execution_draft_${executionId}`);
    window.localStorage.removeItem(`execution_last_saved_${executionId}`);
  }, [executionId]);

  return { draft, saveDraft, lastSaved, clearDraft };
}
