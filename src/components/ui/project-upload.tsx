/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { useToast } from '@/components/ui/use-toast';
import { MAX_IMAGE_SIZE, MAX_VIDEO_SIZE } from '@/lib/constants';
import { projectFormSchema } from '@/lib/validations/project';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { LucideLoader } from 'lucide-react';

type ProjectUploadValues = z.infer<typeof projectFormSchema>;
type ProjectUploadProps = {
  setIsModalOpen: (isOpen: boolean) => void;
};

export function ProjectUpload({ setIsModalOpen }: ProjectUploadProps) {
  const { toast } = useToast();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);

  const form = useForm<ProjectUploadValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      hostedUrl: '',
      sourceCodeUrl: '',
      tags: [],
      description: '', // Default description value
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const formValues = form.getValues();

      const formData = new FormData();
      formData.append('projectData', JSON.stringify(formValues));

      if (selectedImages[0]) formData.append('image1', selectedImages[0]);
      if (selectedImages[1]) formData.append('image2', selectedImages[1]);
      if (selectedImages[2]) formData.append('image3', selectedImages[2]);

      if (selectedVideos[0]) formData.append('video', selectedVideos[0]);

      const res = await fetch(`/api/project`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const result = (await res.json()) as { projectId: string };
        return result;
      } else {
        throw new Error('Something went wrong');
      }
    },

    onSuccess: (data) => {
      toast({
        title: 'Project uploaded successfully!',
      });
      setIsModalOpen(false);
      // Redirect user to their new project page
      window.location.href = `/feed/${data?.projectId}`;
    },

    onError: (err) => {
      toast({
        variant: 'destructive',
        title:
          'Oops! Something went wrong. Please try again.' + err?.message ??
          'Unknown error',
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => mutate())}
        method="post"
        // onSubmit={form.handleSubmit(onSubmit)}
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
                <Input placeholder="https://yourproject.com" {...field} />
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
          // control={form.control}
          name="tags"
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
                          title: 'Image size should be less than 5MB',
                        });
                      }
                    });
                    const filteredImages = imagesArray.filter(
                      (image) => image.size < MAX_IMAGE_SIZE,
                    );

                    console.log(`Filtered images:`, filteredImages);
                    setSelectedImages(filteredImages);

                    // alert("You've selected " + imagesArray.length + ' images.');
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          // control={form.control}
          name="tags"
          render={() => (
            <FormItem>
              <FormLabel> Upload Video </FormLabel>
              <FormControl>
                <Input
                  id="video"
                  accept="video/*"
                  type="file"
                  onChange={(e) => {
                    const videos = e.target.files;

                    if (!videos?.[0]) return;

                    if (!videos?.[0]?.type.startsWith('video/')) {
                      return toast({
                        variant: 'destructive',
                        title: 'Please upload a video file',
                      });
                    }
                    if (videos[0]?.size > MAX_VIDEO_SIZE) {
                      return toast({
                        variant: 'destructive',
                        title: 'Video size should be less than 5MB',
                      });
                    } else {
                      const VideosArray = Array.from(videos);
                      setSelectedVideos(VideosArray);
                    }

                    // alert("You've selected " + VideosArray.length + ' Videos.');
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" className="ml-auto w-36" disabled={isPending}>
            {isPending ? <LucideLoader size={20} className='animate-spin'/> :"Submit Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
