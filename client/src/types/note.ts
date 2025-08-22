export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'work' | 'personal' | 'ideas' | 'tasks';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  color?: string;
}

export type NoteCategory = Note['category'];

export interface NoteFilters {
  category?: NoteCategory;
  search?: string;
  tags?: string[];
}