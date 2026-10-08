import { createFileRoute } from "@tanstack/react-router";
import { AcademyLanding } from "@/components/academy-landing";

export const Route = createFileRoute("/")({
  component: AcademyLanding,
});
