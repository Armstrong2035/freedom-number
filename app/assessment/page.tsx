import type { Metadata } from "next";
import { AssessmentWizard } from "@/components/AssessmentWizard";

export const metadata: Metadata = {
  title: "Assessment | Find Your Freedom Number",
  description: "Answer a few questions to estimate your Freedom Number.",
};

export default function AssessmentPage() {
  return <AssessmentWizard />;
}
