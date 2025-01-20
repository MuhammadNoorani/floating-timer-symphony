import * as React from "react";
import { Play, Pause, RotateCcw, FileText, BarChart2, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotesModal } from "./NotesModal";
import { AnalyticsModal } from "./AnalyticsModal";
import { TaskSelector } from "./TaskSelector";
import { useDraggable } from "@dnd-kit/core";
import { queueUpdate, fetchTasks } from "@/lib/notion";
import { toast } from "sonner";

interface FloatingTimerProps {
  taskName?: string;
  initialTime?: number;
}

export function FloatingTimer({
  taskName = "Current Task",
  initialTime = 0,
}: FloatingTimerProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [time, setTime] = React.useState(initialTime);
  const [isRunning, setIsRunning] = React.useState(false);
  const [showNotes, setShowNotes] = React.useState(false);
  const [showAnalytics, setShowAnalytics] = React.useState(false);
  const [showTaskSelector, setShowTaskSelector] = React.useState(false);
  const [currentTask, setCurrentTask] = React.useState(taskName);
  const [position, setPosition] = React.useState(() => {
    const saved = localStorage.getItem('timer_position');
    return saved ? JSON.parse(saved) : { x: window.innerWidth / 2 - 150, y: 20 };
  });
  const [startTime, setStartTime] = React.useState<Date | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
      
      // Constrain to viewport
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;
      const x = Math.max(0, Math.min(newX, maxX));
      const y = Math.max(0, Math.min(newY, maxY));
      
      setPosition({ x, y });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      localStorage.setItem('timer_position', JSON.stringify(position));
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      if (!startTime) setStartTime(new Date());
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

  const toggleTimer = () => {
    if (!isRunning && !startTime) {
      setStartTime(new Date());
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    if (time > 0 && startTime) {
      queueUpdate({
        taskName: currentTask,
        startTime: startTime.toISOString(),
        endTime: new Date().toISOString(),
        totalTime: time,
        notes: localStorage.getItem(`notes-${currentTask}`) || ''
      });
      toast.success("Task data queued for sync");
    }
    setTime(0);
    setIsRunning(false);
    setStartTime(null);
  };

  const style = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 50,
    cursor: isDragging ? 'grabbing' : 'grab',
  } as const;

  return (
    <>
      <div 
        onMouseDown={handleMouseDown}
        style={style}
      >
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
              {currentTask}
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
              onClick={() => setShowTaskSelector(true)}
              aria-label="Select task"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
              onClick={() => setShowNotes(true)}
              aria-label="View notes"
            >
              <FileText className="h-4 w-4" />
            </button>
            <button
              className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
              onClick={() => setShowAnalytics(true)}
              aria-label="View analytics"
            >
              <BarChart2 className="h-4 w-4" />
            </button>
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

      <NotesModal
        open={showNotes}
        onOpenChange={setShowNotes}
        taskName={currentTask}
      />
      
      <AnalyticsModal
        open={showAnalytics}
        onOpenChange={setShowAnalytics}
        taskName={currentTask}
        totalTime={time}
      />

      <TaskSelector
        open={showTaskSelector}
        onOpenChange={setShowTaskSelector}
        onSelect={(task) => {
          setCurrentTask(task);
          setShowTaskSelector(false);
        }}
      />
    </>
  );
}