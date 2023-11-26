'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import RadioBtns from '@/components/ui/radio-btns';
import { RadioGroup } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
// import { toast } from '@/registry/new-york/ui/use-toast';

const workTypeArr = [
  { id: 'freelance', label: 'Freelance' },
  { id: 'fulltime', label: 'Fulltime' },
];

const getInTouchSchema = z.object({
  employmentType: z.enum(['freelance', 'fulltime'], {
    required_error: 'Employment type is required.',
  }),
  message: z.string().min(1, 'Message is required.'),
  pricing: z.number().min(0, 'Pricing must be a non-negative number.'),
});

type GetInTouchValues = z.infer<typeof getInTouchSchema>;

export function GetInTouch() {
  const form = useForm<GetInTouchValues>({
    resolver: zodResolver(getInTouchSchema),
  });

  function onSubmit(data: GetInTouchValues) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="employmentType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Employment Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4"
                >
                  <RadioBtns radioArr={workTypeArr} />
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter your message here" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pricing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pricing</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  placeholder="Enter pricing"
                  onChange={(e) => {
                    form.setValue('pricing', Number(e.target.value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
