import onboardingImg from '@assets/images/onboarding.png';
import type { FunctionComponent } from '@common/types';
import { StepDemoReminder } from '@components/ui/Wizard/StepDemoReminder';
import Wizard from '@components/ui/Wizard/Wizard';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

const DemoReminder = (): FunctionComponent => {
  const demoReminderStepsConfig = [StepDemoReminder];
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onDemoReminderFinish = async (): Promise<void> => {
    await navigate({ to: '/dashboard' });
  };

  return (
    <div className="container h-screen md:max-h-[600px] mx-auto bg-white shadow-xs rounded-lg lg:max-w-[66.6%]">
      <div className="flex flex-col md:flex-row h-full">
        <div
          className="shrink-0 grow-0 basis-2/5 md:basis-1/2 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: `url(${onboardingImg})`
          }}
        ></div>
        <Wizard
          key="demo"
          className="shrink-0 grow-0 basis-3/5 md:basis-1/2 px-6 py-12 h-full"
          handleFinish={onDemoReminderFinish}
          header={t('demoReminder.stepDemoReminder.header')}
          wizardSteps={demoReminderStepsConfig}
        />
      </div>
    </div>
  );
};

export default DemoReminder;
