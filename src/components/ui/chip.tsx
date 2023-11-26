'use client';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

interface ChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
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

interface ScrollableChipsProps {
  items: string[];
}

const ScrollableChips: React.FC<ScrollableChipsProps> = ({ items }) => {
  const [activeChip, setActiveChip] = useState<string | null>(null);

  const handleChipClick = (label: string) => {
    setActiveChip(label);
  };

  return (
    <div className="flex space-x-3 overflow-x-auto py-2">
      {items.map((item) => (
        <Chip
          key={item}
          label={item}
          active={item === activeChip}
          onClick={() => handleChipClick(item)}
        />
      ))}
    </div>
  );
};

export default ScrollableChips;
