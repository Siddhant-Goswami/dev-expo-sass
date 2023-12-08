'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

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
import { useToast } from '@/components/ui/use-toast';
import useCloudinaryUpload from '@/hooks/useCloudinaryUpload';
import { useAuth } from '@/hooks/user/auth';
import logClientEvent from '@/lib/analytics/posthog/client';
import { MAX_IMAGE_SIZE, MAX_NUMBER_OF_IMAGES, URLs } from '@/lib/constants';
import { projectFormSchema } from '@/lib/validations/project';
import { validateAndPersistUpload } from '@/server/actions/projectMedia';
import { uploadNewProject } from '@/server/actions/projects';
import { useMutation } from '@tanstack/react-query';
import {
  LucideLoader,
  LucideRocket,
  LucideTrash2,
  LucideUploadCloud,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Label } from './label';

type ProjectUploadValues = z.infer<typeof projectFormSchema>;
const acceptedImageTypes = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
];
export function ProjectUploadForm(props: {
  onProjectUploadSuccess?: (props: { projectId: number }) => void;
}) {
  const { userId } = useAuth();

  const router = useRouter();

  const { toast } = useToast();
  const [selectedImages, setSelectedImages] = useState<
    {
      uniqueId: string;
      file: File;
    }[]
  >([]);

  const [actualStatus, setActualStatus] = useState<
    'uploading-images' | 'uploading-data' | 'success' | 'idle' | 'error'
  >('idle');

  const form = useForm<ProjectUploadValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      description: '', // Default description value
      hostedUrl: '',
      sourceCodeUrl: '',
      youtubeUrl: '',
      tags: [],
    },
  });

  const { mutate: submitProjectData } = useMutation({
    mutationFn: async () => {
      setActualStatus('uploading-data');

      logClientEvent('click_project_submit', {
        userId: userId!,
        timestamp: Date.now(),
      });
      const formValues = form.getValues();
      return await uploadNewProject(formValues);
    },

    onSuccess: (data) => {
      setActualStatus('uploading-images');
      void uploadAllSelectedImages(data.projectId);
    },

    onError: (err) => {
      toast({
        variant: 'destructive',
        title:
          'Oops! Something went wrong. Please try again.' +
            (err as Error)?.message ?? 'Unknown error',
      });

      logClientEvent('project_submit_failed', {
        userId: userId!,
        reason: (err as Error)?.message ?? JSON.stringify({ err }),
      });
    },
  });

  const { upload: uploadToCloudinary } = useCloudinaryUpload({
    onSuccess: async ({ public_id, projectId, fileSize }) => {
      try {
        const { success, error } = await validateAndPersistUpload({
          projectId,
          publicId: public_id,
        });

        if (!success) {
          throw new Error('Failed to validate and persist upload');
        }

        return console.log(`Uploaded image: ${public_id}`);
      } catch (err) {
        setActualStatus('error');
      }
    },
    onError: async ({ error, projectId, fileSize, public_id }) => {
      setActualStatus('error');

      const errorMessage = (error as Error)?.message ?? String(error);

      toast({
        variant: 'destructive',
        title: errorMessage ?? 'Unknown error',
      });

      logClientEvent('project_image_upload_failed', {
        userId: userId!,
        projectId: projectId.toString(),
        reason: errorMessage ?? 'Unknown error',
        publicId: public_id ?? undefined,
        imageSize: fileSize ?? undefined,
      });
    },
  });

  const uploadAllSelectedImages = async (projectId: number) => {
    if (selectedImages.length === 0) {
      return alert('No images selected!');
    }

    const imageUploadPromises = selectedImages.map(async (img, index) => {
      const blobUrl = URL.createObjectURL(img.file);

      await uploadToCloudinary({
        type: 'image',
        blobUrl,
        isWebcam: false,
        projectId,
      });
      return console.log(`Uploaded image: ${index}`);
    });

    try {
      await Promise.all(imageUploadPromises);

      setActualStatus('success');

      // Log event is handled in `onProjectUploadSuccess`
      props?.onProjectUploadSuccess?.({ projectId });

      toast({ title: '🎉 Project uploaded successfully!' });

      await new Promise((resolve) => setTimeout(resolve, 2500));

      void router.push(URLs.projectPage(projectId.toString()));
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Failed to upload images!',
        description:
          'Oops! Something went wrong. ' + (err as Error)?.message ??
          'Unknown error',
      });
    }

    // Redirect user to their new project page
  };

  const isActuallyLoading =
    actualStatus === 'uploading-data' || actualStatus === 'uploading-images';

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {
          if (selectedImages.length === 0) {
            return alert('No images selected!');
          }
          submitProjectData();
        })}
        method="post"
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  className="scroll-mt-24"
                  required
                  placeholder="Project Title"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  required
                  className="scroll-mt-24"
                  placeholder="A short description about the project or yourself"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hostedUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hosted URL</FormLabel>
              <FormControl>
                <Input
                  required
                  className="scroll-mt-24"
                  placeholder="https://yourproject.com"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sourceCodeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source Code URL</FormLabel>
              <FormControl>
                <Input
                  required
                  className="scroll-mt-24"
                  placeholder="https://github.com/yourproject"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  required
                  className="scroll-mt-24"
                  placeholder="Enter tags separated by commas"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.split(',').map((tag) => tag.trim()),
                    )
                  }
                />
              </FormControl>
              <FormDescription>
                Tags help users discover your project. Include keywords that
                describe your project's technologies and topics.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="youtubeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Youtube video URL</FormLabel>
              <FormControl>
                <Input
                  // required
                  className="scroll-mt-24"
                  placeholder="https://www.youtube.com/watch?v=t4mb0H4lBDQ"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>
                Upload a video that showcases your project. Help users
                understand your project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          // control={form.control}
          name="images"
          render={() => (
            <FormItem>
              {/* <FormLabel> Upload Images </FormLabel> */}
              <FormControl>
                <>
                  <Button asChild variant="secondary">
                    <Label htmlFor="imageFiles" className={'cursor-pointer'}>
                      <LucideUploadCloud size={16} className="mr-2" />
                      Upload Images
                    </Label>
                  </Button>
                  <Input
                    multiple
                    accept="image/*"
                    id="imageFiles"
                    type="file"
                    className="hidden"
                    // value={selectedImages}
                    onChange={(e) => {
                      const images = e.target.files;
                      if (!images) return;

                      const imagesArray = Array.from(images).filter(
                        (img, idx) => {
                          const isExceedingMaxSize = img.size > MAX_IMAGE_SIZE;
                          const isExceedingMaxQuantity =
                            idx + 1 > MAX_NUMBER_OF_IMAGES;
                          const isValidAcceptedType =
                            acceptedImageTypes.includes(img.type);

                          if (!isValidAcceptedType) {
                            toast({
                              variant: 'destructive',
                              title: `Please supply a valid image type!`,
                            });
                          }

                          if (isExceedingMaxSize) {
                            toast({
                              variant: 'destructive',
                              title: `Image size should not exceed ${
                                MAX_IMAGE_SIZE / 1024 / 1024
                              } MB`,
                            });
                          }

                          if (isExceedingMaxQuantity) {
                            toast({
                              variant: 'destructive',
                              title: `You can only upload up to ${MAX_NUMBER_OF_IMAGES} images`,
                            });
                          }

                          const toInclude =
                            !isExceedingMaxSize && !isExceedingMaxQuantity;

                          return toInclude;
                        },
                      );

                      const selectedImagesWithIds = imagesArray.map((img) => ({
                        uniqueId: Math.random().toString(36).substring(2, 9),
                        file: img,
                      }));

                      setSelectedImages(selectedImagesWithIds);
                      e.target.files = null;
                    }}
                  />
                </>
              </FormControl>
              <FormDescription>
                Upload at least 1 image to showcase your project.
                <br />
                The first image will be used as the cover image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedImages.length > 0 && (
          <>
            <div className="flex w-full flex-wrap items-start gap-1">
              {selectedImages.map((img, index) => (
                <div
                  key={index}
                  className="relative flex items-center justify-center"
                >
                  <Image
                    width={250}
                    height={250}
                    className="h-auto w-auto max-w-[10rem] rounded-sm"
                    src={URL.createObjectURL(img.file)}
                    alt={`Selected image ${index + 1}`}
                  />

                  <Button
                    variant={'secondary'}
                    type="button"
                    onClick={() => {
                      const newSelectedImages = selectedImages.filter(
                        (image) => image.uniqueId !== img.uniqueId,
                      );
                      setSelectedImages(newSelectedImages);
                    }}
                    className="absolute right-2 top-2 aspect-square h-8 w-8 rounded-sm p-0"
                  >
                    <LucideTrash2 size={15} />
                  </Button>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500">
              {selectedImages.length} / {MAX_NUMBER_OF_IMAGES} images selected
              <br />
              Max file size is {MAX_IMAGE_SIZE / 1024 / 1024} MB per image
            </p>
          </>
        )}

        <div className="flex flex-wrap-reverse justify-end gap-3">
          <Button
            variant="brand"
            type="submit"
            className="w-full rounded-[0.375rem] sm:w-max"
            loading={isActuallyLoading}
            // disabled={selectedImages.length === 0}
          >
            {isActuallyLoading ? (
              <LucideLoader size={16} className="animate-spin" />
            ) : (
              <>
                <LucideRocket className="mr-2" size={16} />
                {/* Submit */}
                {/* Publish now */}
                Launch now
                {/* Schedule for later (No img required) */}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
