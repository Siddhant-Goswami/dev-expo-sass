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
import { useAuth } from '@/hooks/user/auth';
import { projectFormSchema } from '@/lib/validations/project';
import { useState } from 'react';
import { Label } from './label';

type ProjectUploadValues = z.infer<typeof projectFormSchema>;
export function ProjectUpload() {
  const { userId } = useAuth();
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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!userId) {
      return alert('Oops! You must be logged in to upload a project.');
    }
    const formValues = form.getValues();

    console.log('fields:', formValues);
    console.log('files:', {
      images: selectedImages,
      videos: selectedVideos,
    });
    const images = selectedImages;

    const {
      title,
      description,
      hostedUrl,
      sourceCodeUrl,
      tags: tagsList,
    } = formValues;

    const requestObject = {
      userId,
      title,
      description,
      hostedUrl,
      sourceCodeUrl,
      tagsList,
      images,
    };

    console.log('requestObject', requestObject);

    const formData = new FormData();
    formData.append('projectData', JSON.stringify(formValues));

    if (selectedImages[0]) formData.append('image0', selectedImages[0]);
    if (selectedImages[1]) formData.append('image1', selectedImages[1]);
    if (selectedImages[2]) formData.append('image2', selectedImages[2]);

    if (selectedVideos[0]) formData.append('video', selectedVideos[0]);

    const res = await fetch(`/api/project`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      alert('Project uploaded successfully!');
      const { projectId } = (await res.json()) as { projectId: string };

      // Redirect user to their new project page
      window.location.href = `/feed/${projectId}`;
    } else {
      alert('Oops! Something went wrong. Please try again. ' + res.statusText);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
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

        <Label>Files</Label>

        <Input
          multiple
          id="images"
          type="file"
          onChange={(e) => {
            console.log('images:', e.target.files);

            const images = e.target.files;

            if (!images) return;

            const imagesArray = Array.from(images);
            setSelectedImages(imagesArray);

            // alert("You've selected " + imagesArray.length + ' images.');
          }}
        />

        <Input
          multiple
          id="video"
          type="file"
          onChange={(e) => {
            console.log('Videos:', e.target.files);

            const videos = e.target.files;

            if (!videos) return;

            const VideosArray = Array.from(videos);
            setSelectedVideos(VideosArray);

            // alert("You've selected " + VideosArray.length + ' Videos.');
          }}
        />

        {/* <FormField
          control={form.control}
          name="videos"
          render={(
            {
              // field
            },
          ) => (
            <FormItem>
              <FormLabel>Files</FormLabel>
              <FormControl>
                <Input
                  id="videos"
                  type="file"
                  // {...field}
                  onChange={(e) => {
                    console.log('videos:', e.target.files);
                    form.setValue('videos', e.target.files);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <div className="flex justify-end">
          <Button type="submit" className="ml-auto">
            Submit Project
          </Button>
        </div>
      </form>
    </Form>
  );
}
