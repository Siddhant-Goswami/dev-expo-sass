'use client';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/ui/navbar';
import { OnboardingSteps } from '@/components/ui/onboarding-steps';
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

<Button onClick={()=>{
        void createUser({
          authId: 123,
          username: 'johndoe',
          displayName: 'John Doe',
          displayPictureUrl: 'https://example.com/profile.jpg',
          bio: 'Software Engineer',
        });
      }}>
        create rishabh
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
