import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface NotesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskName: string;
}

export function NotesModal({ open, onOpenChange, taskName }: NotesModalProps) {
  const [notes, setNotes] = React.useState(() => {
    const savedNotes = localStorage.getItem(`notes-${taskName}`);
    return savedNotes || "";
  });

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    localStorage.setItem(`notes-${taskName}`, newNotes);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Notes for {taskName}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Add your notes here..."
            className="min-h-[200px]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}