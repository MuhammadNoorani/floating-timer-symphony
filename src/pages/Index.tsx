import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { FloatingTimer } from "@/components/FloatingTimer";
import { NotionSetup } from "@/components/NotionSetup";

const Index = () => {
  const handleDragEnd = (event: DragEndEvent) => {
    // Additional drag end handling if needed
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950">
        <NotionSetup />
        <h1 className="mb-4 text-4xl font-bold text-zinc-200">Floating Timer</h1>
        <p className="text-zinc-400">Drag the timer anywhere on the screen.</p>
        <FloatingTimer taskName="Demo Task" />
      </main>
    </DndContext>
  );
};

export default Index;