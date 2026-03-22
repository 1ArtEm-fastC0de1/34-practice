import type { NoteFormValues } from "#/types/note";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type NoteDraft = {
  draft: NoteFormValues;
  setDraft: (note: NoteFormValues) => void;
  clearDraft: () => void;
};

const initialValues = {
  title: "",
  content: "",
};

export const useNoteDraftStore = create<NoteDraft>()(
  persist(
    (set) => ({
      draft: initialValues,
      setDraft: (note) => set(() => ({ draft: note })),
      clearDraft: () => set(() => ({ draft: initialValues })),
    }),
    {
      name: "note-draft",
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);
