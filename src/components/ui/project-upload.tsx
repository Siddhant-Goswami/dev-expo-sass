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
import { MAX_IMAGE_SIZE, MAX_NUMBER_OF_IMAGES } from '@/lib/constants';
import { projectFormSchema } from '@/lib/validations/project';
import { validateAndPersistUpload } from '@/server/actions/projectMedia';
import { uploadNewProject } from '@/server/actions/projects';
import { useMutation } from '@tanstack/react-query';
import { LucideImage, LucideLoader, LucideSave } from 'lucide-react';
import { useState } from 'react';
import { Label } from './label';

type ProjectUploadValues = z.infer<typeof projectFormSchema>;
type ProjectUploadProps = {
  setIsModalOpen: (isOpen: boolean) => void;
};
type Page = 'data-entry' | 'media-upload';

export function ProjectUpload({ setIsModalOpen }: ProjectUploadProps) {
  const { toast } = useToast();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  // const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [isActuallyLoading, setIsActuallyLoading] = useState(false);
  const [actualStatus, setActualStatus] = useState<
    'uploading-images' | 'uploading-data' | 'success' | 'idle' | 'error'
  >('idle');
  const [selectedPage, setSelectedPage] = useState<Page>('data-entry');

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

  const { mutateAsync: submitProjectData, isLoading } = useMutation({
    mutationFn: async () => {
      const formValues = form.getValues();
      return await uploadNewProject(formValues);
    },

    onSuccess: (data) => {
      void uploadAllSelectedImages(data.projectId);
      // toast({
      //   title: 'Project uploaded successfully!',
      // });
      // setIsModalOpen(false);
      // // Redirect user to their new project page
      // window.location.href = `/feed/${data?.projectId}`;
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

  const { upload } = useCloudinaryUpload({
    onSuccess: ({ public_id, projectId }) => {
      void validateAndPersistUpload({
        projectId,
        publicId: public_id,
      }).then(() => {
        toast({ title: 'Project uploaded successfully!' });

        setIsModalOpen(false);
        // Redirect user to their new project page
        window.location.href = `/feed/${projectId}`;
      });
    },
    onError: (err) =>
      toast({
        title:
          'Oops! Something went wrong. ' + (err as Error)?.message ??
          'Unknown error',
      }),
  });

  const uploadAllSelectedImages = async (projectId: number) => {
    if (selectedImages.length === 0) {
      return alert('No images selected!');
    }

    const imageUploadPromises = selectedImages.map((img, index) => {
      const blobUrl = URL.createObjectURL(img);

      return upload({
        type: 'image',
        blobUrl,
        isWebcam: false,
        projectId,
      }).then(() => console.log(`Uploaded image: ${index}`));
    });

    await Promise.all(imageUploadPromises);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async () => {
          // WORKAROUND TO AN ANNOYING BUG: Youtube url get populated automatically from the hostedUrl????
          form.setValue('youtubeUrl', '');

          setSelectedPage('media-upload');
        })}
        method="post"
        // onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {
          {
            'data-entry': (
              <>
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
                              e.target.value
                                .split(',')
                                .map((tag) => tag.trim()),
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Tags help users discover your project. Include keywords
                        that describe your project's technologies and topics.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ),

            'media-upload': (
              <>
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
                                  title: 'Image size should be less than 5MB',
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
                        Upload up to 3 images to showcase your project. Max file
                        size is 5MB.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {selectedImages.length > 0 && (
                  <div className="flex w-full flex-wrap items-start gap-1">
                    {selectedImages.map((image, index) => (
                      <img
                        key={index}
                        className="h-auto w-auto max-w-[10rem] rounded-sm"
                        src={URL.createObjectURL(image)}
                        alt="image"
                      />
                    ))}
                  </div>
                )}
                {/* <FormField
                  // control={form.control}
                  name="videos"
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
                      <FormDescription>
                        Upload a video to showcase your project. Max file size
                        is {MAX_VIDEO_SIZE / 1024 / 1024} MB.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                {/* <FormField
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
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <div className="flex flex-col gap-3">
                  <Label className="">Youtube video URL</Label>

                  <Input
                    className=""
                    placeholder="https://www.youtube.com/watch?v=t4mb0H4lBDQ"
                    onChange={(e) =>
                      form.setValue('youtubeUrl', e.target.value)
                    }
                    value={form.watch('youtubeUrl') ?? ''}
                  />
                </div>
                {/* <Button
                  type="button"
                  onClick={async () => {
                   
                  }}
                >
                  {status === 'idle' ? 'Upload' : 'Uploading...'}
                </Button> */}
              </>
            ),
          }[selectedPage]
        }

        <div className="flex flex-wrap-reverse justify-between gap-3">
          {selectedPage === 'media-upload' && (
            <>
              <Button
                disabled={isActuallyLoading}
                type="button"
                onClick={() => {
                  setSelectedPage('data-entry');
                }}
                variant={'secondary'}
                className="w-full sm:w-36"
              >
                <span className="pr-[1ch]">&larr;</span>
                Go back
              </Button>

              <Button
                type="button"
                className="flex w-full items-center gap-2 sm:w-max"
                disabled={isActuallyLoading}
                onClick={async () => {
                  try {
                    setIsActuallyLoading(true);
                    await submitProjectData();
                  } catch (err) {
                  } finally {
                    setIsActuallyLoading(false);
                  }
                }}
              >
                {isActuallyLoading ? (
                  <LucideLoader size={20} className="animate-spin" />
                ) : (
                  <>
                    <LucideSave className="pr-1" size={18} />
                    Save Project
                  </>
                )}
              </Button>
            </>
          )}
          {selectedPage === 'data-entry' && (
            <Button
              type="submit"
              className="flex w-full items-center gap-2 sm:ml-auto sm:w-max"
            >
              {isLoading ? (
                <LucideLoader size={20} className="animate-spin" />
              ) : (
                <>
                  <LucideImage size={18} />
                  Next: Media
                  <span className="pl-[1ch]">&rarr;</span>
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
