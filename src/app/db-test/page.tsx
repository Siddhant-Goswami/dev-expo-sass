'use client';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/ui/navbar';
import { OnboardingSteps } from '@/components/ui/onboarding-steps';
import { createProject, getAllProjects, getUserProjects } from '@/server/actions/projects';
import { createUser } from '@/server/actions/users';

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
            title: 'testProject3',
            description: 'test project description',
            tagsList: [{ name: 'test-tag-1' }, { name: 'test-tag-2' }],
            hostedUrl: 'test-hosted-url',
            sourceCodeUrl: 'test-source-code-url',
            images: [],
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
          void getUserProjects(0);
        }}
      >
        get user projects
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
