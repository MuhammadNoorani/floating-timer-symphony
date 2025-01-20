import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchTasks } from "@/lib/notion";
import { Loader2 } from "lucide-react";

interface TaskSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (taskName: string) => void;
}

export function TaskSelector({ open, onOpenChange, onSelect }: TaskSelectorProps) {
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [newTaskName, setNewTaskName] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setLoading(true);
      fetchTasks()
        .then(setTasks)
        .finally(() => setLoading(false));
    }
  }, [open]);

  const handleNewTask = () => {
    if (newTaskName.trim()) {
      onSelect(newTaskName.trim());
      setNewTaskName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select or Create Task</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="New task name..."
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNewTask()}
          />
          <Button onClick={handleNewTask}>Create</Button>
        </div>
        <div className="space-y-2">
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            tasks.map((task) => (
              <button
                key={task.id}
                className="w-full text-left px-4 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => onSelect(task.name)}
              >
                {task.name}
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}