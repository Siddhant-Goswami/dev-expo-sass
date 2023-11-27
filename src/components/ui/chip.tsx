'use client';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/constants';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';

interface ChipProps {
  label: string;
  active: boolean;
  onClick?: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, active, onClick }) => {
  return (
    <Button
      variant="secondary"
      className={`border-2 ${active ? 'border-primary' : 'border-transparent'}`}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

const ScrollableChips = () => {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');

  console.log('filter', filter);

  return (
    <div className="flex space-x-3 overflow-x-auto py-2">
      {categories.map((item) => (
        <Link href={`?filter=${item.id}`} key={item.id}>
          <Chip key={item.id} label={item.label} active={item.id === filter} />
        </Link>
      ))}
    </div>
  );
};

export default ScrollableChips;
