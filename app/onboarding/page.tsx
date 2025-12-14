import OnboardingContent from "@/components/onboarding/OnboardingContent";
import { requireUser } from "@/lib/auth";

export default async function OnboardingPage() {
  await requireUser();
  return <OnboardingContent />;
}
