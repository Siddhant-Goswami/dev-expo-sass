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
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/user/auth';
import { createRecruiterReachout } from '@/server/actions/reachouts';
import { useMutation } from '@tanstack/react-query';
import { LucideLoader } from 'lucide-react';
// import { toast } from '@/registry/new-york/ui/use-toast';

const workTypeArr = [
  { id: 'freelance', label: 'Freelance' },
  { id: 'full-time', label: 'Full-time' },
];

const getInTouchSchema = z.object({
  employmentType: z.enum(['freelance', 'full-time'], {
    required_error: 'Employment type is required.',
  }),
  message: z.string().min(20, 'Message is should have atleast 20 characters.'),
  pricing: z.number().min(1000, 'Pricing must be a more than 1000 Rupees.'),
});

type GetInTouchValues = z.infer<typeof getInTouchSchema>;
type GetInTouchProps = {
  setIsModalOpen: (isOpen: boolean) => void;
  devId: string;
};

export function GetInTouch({ setIsModalOpen, devId }: GetInTouchProps) {
  const user = useAuth();
  const { userId } = user;

  const requestReachOut = async () => {
    const data = form.getValues();
    if (!userId) {
      return;
    }

    const requestObject = {
      workType: data.employmentType,
      quotePrice: data.pricing,
      message: data.message,
      devId: devId,
    };

    const { success } = await createRecruiterReachout(requestObject);
    if (success) {
      toast({
        title: 'Your message has been sent.',
      });

      setIsModalOpen(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    }
  };

  const { isLoading, mutate } = useMutation({
    mutationFn: requestReachOut,
  });

  const { toast } = useToast();
  const form = useForm<GetInTouchValues>({
    resolver: zodResolver(getInTouchSchema),
    defaultValues: {
      employmentType: 'freelance',
      message: '',
      pricing: 1000,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => mutate())} className="space-y-8">
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
          <Button disabled={isLoading} type="submit">
            {isLoading ? (
              <LucideLoader size={20} className="animate-spin" />
            ) : (
              <>Submit</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
