import * as React from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingTimerProps {
  taskName?: string;
  initialTime?: number;
}

export function FloatingTimer({ taskName = "Current Task", initialTime = 0 }: FloatingTimerProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [time, setTime] = React.useState(initialTime);
  const [isRunning, setIsRunning] = React.useState(false);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setTime(0);
    setIsRunning(false);
  };

  return (
    <div className="fixed left-1/2 top-4 -translate-x-1/2 z-50 animate-fade-in">
      <div
        className={cn(
          "group relative flex items-center rounded-full bg-zinc-900/90 backdrop-blur-sm transition-all duration-300 ease-in-out",
          isExpanded ? "pr-4" : "pr-2"
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex items-center gap-2 px-4 py-2">
          <span className="text-sm font-medium text-zinc-200 whitespace-nowrap">
            {taskName}
          </span>
          <span className="font-medium text-zinc-200">{formatTime(time)}</span>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 overflow-hidden transition-all duration-300",
            isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
          )}
        >
          <button
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            onClick={toggleTimer}
            aria-label={isRunning ? "Pause timer" : "Start timer"}
          >
            {isRunning ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
          <button
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            onClick={resetTimer}
            aria-label="Reset timer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}