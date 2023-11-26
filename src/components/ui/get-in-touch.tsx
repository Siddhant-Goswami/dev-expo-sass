'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import RadioBtns from '@/components/ui/radio-btns';
import { RadioGroup } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// radio button (freelance, full time)
// message
// pricing

const getInTouchFormSchema = z.object({});

export function GetInTouch() {
  const userName = 'Rishabh';

  const form = useForm({});

  const radioArr = [
    { id: 'freelance', label: 'Hire for freelance work' },
    { id: 'full-time', label: 'Hire for full-time work' },
  ];

  return (
    <>
      <RadioGroup className="flex w-full">
        <RadioBtns radioArr={radioArr} />
      </RadioGroup>
    </>
  );
}
