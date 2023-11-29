'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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
import { toast } from '@/components/ui/use-toast';
import VideoRecorder from '@/components/video-recorder';
import { useAuth } from '@/hooks/user/auth';
import { isGithubUserValid } from '@/utils';
import { useState } from 'react';
// import { toast } from "@/registry/new-york/ui/use-toast"

const onboardingStepsSchema = z.object({
  displayName: z
    .string()
    .min(5, 'Display Name is required.')
    .max(30, 'Display Name must be less than 30 characters.'),
  githubUsername: z
    .string()
    .min(5, 'GitHub Username is required.')
    .max(50, 'GitHub Username must be less than 50 characters.'),
  portfolioLink: z.string().url('Please enter a valid URL.'),
  twitterLink: z.string().url('Please enter a valid URL.'),
  bio: z
    .string()
    .min(20, 'Bio must be at least 20 characters.')
    .max(300, 'Bio must be less than 300 characters.'),
});

type OnbaordingStepsValues = z.infer<typeof onboardingStepsSchema>;
type VerificationStepValues = 'fields' | 'video';

export function OnbaordingSteps() {
  const [verificationStep, setVerificationStep] =
    useState<VerificationStepValues>('fields');

  const { session } = useAuth();
  const displayName = z
    .string()
    .catch('')
    .parse(session?.user.user_metadata?.name);
  const githubUsername = z
    .string()
    .catch('')
    .parse(session?.user.user_metadata?.user_name);

  const form = useForm<OnbaordingStepsValues>({
    resolver: zodResolver(onboardingStepsSchema),
    defaultValues: {
      displayName,
      githubUsername,
      portfolioLink: '',
      twitterLink: '',
      bio: '',
    },
  });

  async function onSubmit(data: OnbaordingStepsValues) {
    console.log(data);

    const getGithubUsername = githubUsername
      ? githubUsername
      : isGithubUserValid(data.githubUsername);
    console.log(getGithubUsername);

    const isValidGithubUsername = await getGithubUsername;

    if (!isValidGithubUsername) {
      toast({
        title: 'Invalid GitHub Username',
        description: 'Please enter a valid GitHub username.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Form submitted successfully',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
      setVerificationStep('video');
    }
  }

  return (
    <>
      {verificationStep === 'video' && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex w-full gap-4">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your display name" />
                    </FormControl>
                    <FormDescription>
                      Edit your user name if you want to change how it appears
                      on your profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="githubUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your GitHub username"
                        disabled={githubUsername ? true : false}
                      />
                    </FormControl>
                    <FormDescription>
                      Your GitHub username is used to fetch your projects and
                      contributions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex w-full gap-4">
              <FormField
                control={form.control}
                name="portfolioLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio Link</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your portfolio URL"
                      />
                    </FormControl>
                    <FormDescription>
                      Your portfolio link is used to showcase your work on your
                      profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="twitterLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Link</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your Twitter URL" />
                    </FormControl>
                    <FormDescription>
                      Your Twitter link is used to showcase your work on your
                      profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Write a few words describing yourself and your work."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mb-4 flex w-full justify-end">
              <Button type="submit">Get Verfied</Button>
            </div>
          </form>
        </Form>
      )}

      {verificationStep === 'fields' && (
        <>
          {/* <p className="text-center text-2xl font-bold text-white"> </p> */}
          <p className="w-full text-center text-sm font-medium">
            Please record a short video introducing yourself and your work.
          </p>
          <VideoRecorder />
        </>
      )}
    </>
  );
}
