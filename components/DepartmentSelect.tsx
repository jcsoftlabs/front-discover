'use client';

import { DEPARTMENTS } from '@/lib/constants';

interface DepartmentSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  placeholder?: string;
}

export default function DepartmentSelect({ 
  value, 
  onChange, 
  error,
  className = '',
  placeholder = 'Sélectionnez un département'
}: DepartmentSelectProps) {
  return (
    <div className="w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
      >
        <option value="">{placeholder}</option>
        {DEPARTMENTS.map((dept) => (
          <option key={dept.code} value={dept.name}>
            {dept.name}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
