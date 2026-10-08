import { createFileRoute } from "@tanstack/react-router";
import { CabinetPage } from "@/components/cabinet-page";

export const Route = createFileRoute("/cabinet/$purchaseId")({
  component: CabinetRoute,
});

function CabinetRoute() {
  const { purchaseId } = Route.useParams();
  return <CabinetPage purchaseId={purchaseId} />;
}
