import { FloatingTimer } from "@/components/FloatingTimer";

const Index = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950">
      <h1 className="mb-4 text-4xl font-bold text-zinc-200">Floating Timer</h1>
      <p className="text-zinc-400">The timer will appear at the top of the screen.</p>
      <FloatingTimer taskName="Demo Task" />
    </main>
  );
};

export default Index;