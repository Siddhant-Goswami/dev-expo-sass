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
import { createProject } from '@/server/actions/projects';

const projectFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Please provide a title for your project.')
    .max(50, 'Title must not exceed 50 characters.'),
  hostedUrl: z.string().url('Please enter a valid URL for the hosted project.'),
  sourceCodeUrl: z.string().url('Please enter a valid source code URL.'),
  tags: z
    .array(z.string())
    .min(1, 'Please provide at least one tag for your project.'),
  description: z
    .string()
    .min(20, 'Please provide a description for your project.')
    .max(500, 'Description must not exceed 500 characters.'),
});

type ProjectUploadValues = z.infer<typeof projectFormSchema> & {
  files: FileList | null;
};

export function ProjectUpload() {
  const form = useForm<ProjectUploadValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      hostedUrl: '',
      sourceCodeUrl: '',
      tags: [],
      description: '', // Default description value
      files: null, // Default files value
    },
  });

  function onSubmit(data: ProjectUploadValues) {
    console.log(' data:', data);
    console.log(' form:', form.getValues('files'));
    const images = form.getValues('files') ?? [];

    const {
      title,
      description,
      hostedUrl,
      sourceCodeUrl,
      tags: tagsList,
    } = data;

    const requestObject = {
      userId: 1,
      title,
      description,
      hostedUrl,
      sourceCodeUrl,
      tagsList,
      images,
    };

    console.log('requestObject', requestObject);

    createProject.bind(requestObject);
  }

  const requestAction = () => {
    const data = form.getValues();

    const {
      title,
      description,
      hostedUrl,
      sourceCodeUrl,
      tags: tagsList,
    } = data;

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    // const images = form.getValues('files');

    // if (images) {
    const requestObject = {
      userId: 1,
      title,
      description,
      hostedUrl,
      sourceCodeUrl,
      tagsList,
      // images,
    };

    void createProject(requestObject);
    // }
  };

  return (
    <Form {...form}>
      <form
        action={requestAction}
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
          control={form.control}
          name="files"
          render={(
            {
              // field
            },
          ) => (
            <FormItem>
              <FormLabel>Files</FormLabel>
              <FormControl>
                <Input
                  id="files"
                  type="file"
                  // {...field}
                  onChange={(e) => {
                    console.log('Files:', e.target.files);
                    form.setValue('files', e.target.files);
                  }}
                  multiple
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" className="ml-auto">
            Submit Project
          </Button>
        </div>
      </form>
    </Form>
  );
}
