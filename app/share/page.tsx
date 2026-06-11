import { StampsGallery } from "@/components/tools/StampsGallery";
import { ToolCard } from "@/components/ui/ToolCard";

export default function SharePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-5 pb-4">
      <ToolCard title="Share" icon="🖼️">
        <StampsGallery />
      </ToolCard>
    </div>
  );
}
