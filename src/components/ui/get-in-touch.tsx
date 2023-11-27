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
  pricing: z.number().min(50, 'Pricing must be a more than 50 Rupees.'),
});

type GetInTouchValues = z.infer<typeof getInTouchSchema>;
type GetInTouchProps = {
  setIsModalOpen: (isOpen: boolean) => void;
};

export function GetInTouch({ setIsModalOpen }: GetInTouchProps) {
  const { toast } = useToast();
  const form = useForm<GetInTouchValues>({
    resolver: zodResolver(getInTouchSchema),
  });

  const user = useAuth();
  const { userId } = user;

  const requestReachOut = async (data: GetInTouchValues) => {
    if (!userId) {
      return;
    }

    const requestObject = {
      workType: data.employmentType,
      quotePrice: data.pricing,
      message: data.message,
      devId: userId,
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(requestReachOut)} className="space-y-8">
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
