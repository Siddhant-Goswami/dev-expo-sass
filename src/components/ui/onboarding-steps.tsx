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
import useFacecamUpload from '@/hooks/useFacecamUpload';
import { useAuth } from '@/hooks/user/auth';
import { devApplicationSchema } from '@/lib/validations/user';
import { createDevApplication } from '@/server/actions/users';
import { api } from '@/trpc/react';
import { isGithubUserValid } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const onboardingStepsSchema = z.object({
  displayName: z
    .string()
    .min(5, 'Display Name is required.')
    .max(30, 'Display Name must be less than 30 characters.'),
  githubUsername: z
    .string()
    .min(5, 'GitHub Username is required.')
    .max(50, 'GitHub Username must be less than 50 characters.'),
  websiteUrl: z
    .string()
    .transform((val) => {
      if (!val?.startsWith('https://')) {
        val = 'https://' + val;
      }
      return val;
    })
    .pipe(z.string().url('Please enter a valid Portfolio URL')),
  twitterUsername: z.string().min(2, 'Twitter Username is required.'),
  bio: devApplicationSchema.shape.bio,
});

type OnbaordingStepsValues = z.infer<typeof onboardingStepsSchema>;
type VerificationStepValues = 'fields' | 'video' | 'finish';

export function OnboardingSteps() {
  const router = useRouter();

  const [verificationStep, setVerificationStep] =
    useState<VerificationStepValues>('fields');
  const [facecamBlobUrl, setFacecamBlobUrl] = useState<string | null>(null);

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
      githubUsername: 'thecmdrunner',
      websiteUrl: 'https://pranava.dev',
      twitterUsername: 'thecmdrunner',
      bio: 'im nice dev plz work with me',
    },
  });

  async function submitFields(data: OnbaordingStepsValues) {
    console.log(data);

    const validGithubUsername = githubUsername
      ? githubUsername
      : await isGithubUserValid(data.githubUsername);
    console.log(validGithubUsername);

    console.log('isValidGithubUsername', validGithubUsername);

    if (!validGithubUsername) {
      toast({
        title: 'Invalid GitHub Username',
        description: 'Please enter a valid GitHub username.',
        variant: 'destructive',
      });
    } else {
      setVerificationStep('video');
    }
  }

  const {
    mutateAsync: validateAndPersistFacecamUpload,
    isLoading: isValidatingUpload,
  } = api.devApplication.validateAndPersistFacecamUpload.useMutation({
    onSuccess: (data) => {
      if (data?.success) {
        setVerificationStep('finish');
        return toast({
          title: '🎉 Application submitted',
          description: 'Your application has been submitted for review.',
        });
      }

      toast({
        title: 'Could not submit video',
        description: data.message,
      });
    },

    onError: (error) => {
      console.error({ error });
      toast({
        title: 'Could not submit video',
        description: 'Connection lost. Please try again.',
      });
    },
  });

  const { status: facecamUploadStatus, upload: uploadFacecamToCloudinary } =
    useFacecamUpload({
      onSuccess: async (data) => {
        await validateAndPersistFacecamUpload({
          devApplicationId: data.devApplicationId,
          publicId: data.public_id,
        });
      },

      onError: async (error) => {
        console.error({ error });
        toast({
          title: 'Could not upload video!',
          description: 'Something went wrong, please try again.',
        });
      },
    });
  const { isLoading: isSubmittingApplication, mutateAsync: submitAll } =
    useMutation({
      mutationFn: async () => {
        const formValues = form.getValues();

        const { error, devApplicationId } = await createDevApplication({
          bio: formValues.bio,
          displayName: formValues.displayName,
          githubUsername: formValues.githubUsername,
          twitterUsername: formValues.twitterUsername,
          websiteUrl: formValues.websiteUrl,
        });

        if (error ?? !devApplicationId) {
          console.error({ error, devApplicationId });
          throw new Error('Could not submit application');
        }

        await uploadFacecamToCloudinary({
          devApplicationId,
          blobUrl: facecamBlobUrl!,
        });
      },

      onError: (error) => {
        console.error({ error });
        toast({
          title: 'Could not submit application',
          description: 'Something went wrong. Please try again.',
        });
      },
    });
  return (
    <>
      {verificationStep === 'fields' && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitFields)}
            className="space-y-8"
          >
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
                    Edit your user name if you want to change how it appears on
                    your profile.
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

            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio Link</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your portfolio URL" />
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
              name="twitterUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> X (Twitter) Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your Twitter Username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
            <div className="mb-4 flex w-full justify-center">
              <Button type="submit" className="w-full">
                Get Verfied
              </Button>
            </div>
          </form>
        </Form>
      )}

      {verificationStep === 'video' && (
        <>
          {/* <p className="text-center text-2xl font-bold text-white"> </p> */}
          <div className="mr-auto flex w-full items-center justify-start gap-3">
            <Button
              variant={'ghost'}
              onClick={() => setVerificationStep('fields')}
              className="flex items-center self-start"
            >
              <ChevronLeft />
              <span>Edit Form</span>
            </Button>
            <p className="mx-auto text-center text-sm font-medium">
              Please record a short video introducing yourself and your work.
            </p>
          </div>

          <VideoRecorder
            onClickNextStep={submitAll}
            setFacecamBlobUrl={setFacecamBlobUrl}
          />
        </>
      )}
    </>
  );
}
