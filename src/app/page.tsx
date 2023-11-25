import Navbar from '@/components/ui/navbar';
import { OnboardingSteps } from '@/components/ui/onboarding-steps';

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
