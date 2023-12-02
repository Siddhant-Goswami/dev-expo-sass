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
import { MAX_IMAGE_SIZE, MAX_NUMBER_OF_IMAGES, URLs } from '@/lib/constants';
import { projectFormSchema } from '@/lib/validations/project';
import { validateAndPersistUpload } from '@/server/actions/projectMedia';
import { uploadNewProject } from '@/server/actions/projects';
import { useMutation } from '@tanstack/react-query';
import { LucideLoader, LucideSave } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ProjectUploadValues = z.infer<typeof projectFormSchema>;
// type Page = 'data-entry' | 'media-upload';

export function ProjectUpload() {
  const router = useRouter();

  const { toast } = useToast();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  // const [selectedVideos, setSelectedVideos] = useState<File[]>([]);

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
      // title: 'TEST PROJECT',
      // hostedUrl: 'http://localhost:3000',
      // sourceCodeUrl: 'http://localhost:3000',
      // youtubeUrl: 'https://www.youtube.com/watch?v=EeHJUijhszw',
      // tags: ['1', '2'],
      // description: 'TEST PROJECTTEST PROJECT', // Default description value
    },
  });

  const { mutate: submitProjectData } = useMutation({
    mutationFn: async () => {
      setActualStatus('uploading-data');
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
    },
  });

  const { upload: uploadToCloudinary } = useCloudinaryUpload({
    onSuccess: ({ public_id, projectId }) => {
      try {
        void validateAndPersistUpload({
          projectId,
          publicId: public_id,
        });
      } catch (err) {
        setActualStatus('error');
      }
    },
    onError: (err) => {
      setActualStatus('error');

      toast({
        title:
          'Oops! Something went wrong. ' + (err as Error)?.message ??
          'Unknown error',
      });
    },
  });

  const uploadAllSelectedImages = async (projectId: number) => {
    if (selectedImages.length === 0) {
      return alert('No images selected!');
    }

    const imageUploadPromises = selectedImages.map((img, index) => {
      const blobUrl = URL.createObjectURL(img);

      return uploadToCloudinary({
        type: 'image',
        blobUrl,
        isWebcam: false,
        projectId,
      }).then(() => console.log(`Uploaded image: ${index}`));
    });

    await Promise.all(imageUploadPromises).then(() => {
      setActualStatus('success');
      toast({ title: 'Project uploaded successfully!' });
      // Redirect user to their new project page
      void router.push(URLs.projectPage(projectId.toString()));
    });
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
                <Input placeholder="Project Title" {...field} />
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
              <FormLabel> Upload Images </FormLabel>
              <FormControl>
                <Input
                  required
                  multiple
                  accept="image/*"
                  id="imageFile"
                  type="file"
                  // value={selectedImages}
                  onChange={(e) => {
                    const images = e.target.files;
                    if (!images) return;

                    const imagesArray = Array.from(images);
                    console.log(`Selected images:`, imagesArray);
                    imagesArray.forEach((image) => {
                      if (!image.type.startsWith('image/')) {
                        return toast({
                          variant: 'destructive',
                          title: 'Image type should be png or jpeg',
                        });
                      }
                      if (image.size > MAX_IMAGE_SIZE) {
                        return toast({
                          variant: 'destructive',
                          title: `Image size should be less than ${
                            MAX_IMAGE_SIZE / 1024 / 1024
                          } MB per image`,
                        });
                      }
                    });
                    const filteredImages = imagesArray.filter(
                      (image, index) =>
                        image.size < MAX_IMAGE_SIZE &&
                        index < MAX_NUMBER_OF_IMAGES,
                    );

                    console.log(`Filtered images:`, filteredImages);
                    setSelectedImages(filteredImages);

                    // alert("You've selected " + imagesArray.length + ' images.');
                  }}
                />
              </FormControl>
              <FormDescription>
                Upload up to 3 images to showcase your project. Max file size is
                {MAX_IMAGE_SIZE / 1024 / 1024} MB per image
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedImages.length > 0 && (
          <div className="flex w-full flex-wrap items-start gap-1">
            {selectedImages.map((image, index) => (
              <Image
                width={250}
                height={250}
                key={index}
                className="h-auto w-auto max-w-[10rem] rounded-sm"
                src={URL.createObjectURL(image)}
                alt="image"
              />
            ))}
          </div>
        )}

        <div className="flex flex-wrap-reverse justify-end gap-3">
          <Button
            type="submit"
            className="flex w-full items-center gap-2 sm:w-36"
            loading={isActuallyLoading}
          >
            {isActuallyLoading ? (
              <LucideLoader size={20} className="animate-spin" />
            ) : (
              <>
                <LucideSave className="pr-1" size={18} />
                Submit
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
