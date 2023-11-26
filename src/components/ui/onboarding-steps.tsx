/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
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
import RadioBtns from '@/components/ui/radio-btns';
import { RadioGroup } from '@/components/ui/radio-group';

type OnboardingStepsOptions = {
  id: string;
  label: string;
}[];

type OnboardingStepProps = {
  skillLevels: OnboardingStepsOptions;
  defaultSkillLevel: string;
};

const createSkillLevelSchema = (skillLevels: OnboardingStepsOptions) => {
  const skillLevelIds = skillLevels.map((skillLevel) => skillLevel.id) as any;
  return z.object({
    skillLevel: z.enum(skillLevelIds, {
      required_error: 'Please select your skill level.',
    }),
  });
};

export const OnboardingSteps: React.FC<OnboardingStepProps> = ({
  skillLevels,
  defaultSkillLevel,
}) => {
  const skillLevelSchema = createSkillLevelSchema(skillLevels);
  type OnboardingStepValues = z.infer<typeof skillLevelSchema>;

  const form = useForm<OnboardingStepValues>({
    resolver: zodResolver(skillLevelSchema),
    defaultValues: {
      skillLevel: defaultSkillLevel,
    },
  });

  function onSubmit(data: OnboardingStepValues) {
    // console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="skillLevel"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Select your skill level</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <RadioBtns radioArr={skillLevels} />
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit Skill Level</Button>
      </form>
    </Form>
  );
};
