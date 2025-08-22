import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NoteCategory, NoteFilters } from '@/types/note';

interface SearchAndFilterProps {
  filters: NoteFilters;
  onFiltersChange: (filters: NoteFilters) => void;
  noteCount: number;
}

const categories: { value: NoteCategory; label: string }[] = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'ideas', label: 'Ideas' },
  { value: 'tasks', label: 'Tasks' },
];

export function SearchAndFilter({ filters, onFiltersChange, noteCount }: SearchAndFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const handleCategoryFilter = (category: NoteCategory) => {
    const newCategory = filters.category === category ? undefined : category;
    onFiltersChange({ ...filters, category: newCategory });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.category || filters.search;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-12 bg-card border-border/50 focus:border-primary/50 transition-colors"
        />
        {filters.search && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSearchChange('')}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Filter controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`${isFilterOpen ? 'bg-primary/10 border-primary/50' : ''}`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <span className="text-sm text-muted-foreground">
          {noteCount} {noteCount === 1 ? 'note' : 'notes'}
        </span>
      </div>

      {/* Category filters */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-card border border-border/50 rounded-lg">
              <h4 className="text-sm font-medium text-card-foreground mb-3">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map(({ value, label }) => (
                  <Button
                    key={value}
                    variant="outline"
                    size="sm"
                    onClick={() => handleCategoryFilter(value)}
                    className={`category-pill category-${value} ${
                      filters.category === value 
                        ? 'ring-2 ring-primary/50 bg-primary/10' 
                        : 'hover:bg-card-hover'
                    }`}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}