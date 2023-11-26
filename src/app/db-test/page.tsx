'use client';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/ui/navbar';
import { OnboardingSteps } from '@/components/ui/onboarding-steps';
import { createBookmark, createComment, createLike, createProject, getAllProjects, getProjectById, getUserProjects } from '@/server/actions/projects';
import { approveDev, createUser, getUserInfo } from '@/server/actions/users';

export default function Page() {
  return (
    <div>
      <Navbar />
      <OnboardingSteps
        skillLevels={[
          { id: 'noob', label: 'Noob' },
          { id: 'decent', label: 'Decent' },
          { id: 'pro', label: 'Pro' },
        ]}
        defaultSkillLevel="noob"
      />

      <Button
        onClick={() => {
          void createUser({
            authId: 123,
            username: 'johndoe',
            displayName: 'John Doe',
            displayPictureUrl: 'https://example.com/profile.jpg',
            bio: 'Software Engineer',
          });
        }}
      >
        create rishabh
      </Button>

      <Button
        onClick={() => {
          void createProject({
            userId: 1,
            title: 'testProject4',
            description: 'test project description',
            tagsList: ['lol', 'ok'],
            hostedUrl: 'test-hosted-url',
            sourceCodeUrl: 'test-source-code-url',
          });
        }}
      >
        create project
      </Button>

      <Button
        onClick={() => {
          void getAllProjects();
        }}
      >
        get projects
      </Button>

      <Button
        onClick={() => {
          void getUserProjects({userId: 1});
        }}
      >
        get user projects
      </Button>

      <Button
        onClick={() => {
          void getProjectById({projectId: 12});
        }}
      >
        get project by ID
      </Button>

      <Button
        onClick={() => {
          void createComment({
            userId: 1,
            projectId: 12,
            content: 'test comment',
          });
        }}
      >
        add comment
      </Button>

      <Button
        onClick={() => {
          void createLike({
            userId: 1,
            projectId: 12,
          });
        }}
      >
        add like
      </Button>

      <Button
        onClick={() => {
          void createBookmark({
            userId: 1,
            projectId: 12,
          });
        }}
      >
        add bookmark
      </Button>

      <Button
        onClick={() => {
          void getUserInfo({
            userId: 1,
          });
        }}
      >
        get user info
      </Button>

      <Button
        onClick={() => {
          void approveDev({
            userId: 1,
            availibity: true,
          });
        }}
      >
        approve dev
      </Button>

      <OnboardingSteps
        skillLevels={[
          { id: 'naruto', label: 'Naruto' },
          { id: 'sasuke', label: 'Sasuke' },
          { id: 'sakura', label: 'Sakura' },
        ]}
        defaultSkillLevel="naruto"
      />
    </div>
  );
}
