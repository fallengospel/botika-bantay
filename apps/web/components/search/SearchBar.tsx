'use client';

import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, onSubmit, placeholder }: SearchBarProps) {
  return (
    <form onSubmit={onSubmit} className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
      <input
        type="text"
        placeholder={placeholder || "Search medicine by brand, generic name, or condition..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field pl-12 pr-10"
        aria-label="Search medicines"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
