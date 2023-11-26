import Grid from '@/components/ui/grid';
import Navbar from '@/components/ui/navbar';
import { OnboardingSteps } from '@/components/ui/onboarding-steps';
import ProjectCard from '@/components/ui/project-card';

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

      <ProjectCard />

      <Grid />
    </div>
  );
}
