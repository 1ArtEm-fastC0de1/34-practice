export interface NoteFormValues {
  title: string;
  content: string;
}

export interface NoteModelInfo {
  title: string;
  content: string;
  id: string;
}

export interface OneNote {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notes {
  totalPages: number;
  total: number;
  currentPage: number;
  notes: OneNote[];
}

export interface trashNotes {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
