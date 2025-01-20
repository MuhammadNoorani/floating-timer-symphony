import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimerSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetTimer: (seconds: number) => void;
}

export function TimerSettings({
  open,
  onOpenChange,
  onSetTimer,
}: TimerSettingsProps) {
  const [hours, setHours] = React.useState("");
  const [minutes, setMinutes] = React.useState("");

  const handleSetTimer = () => {
    const totalSeconds = 
      (parseInt(hours || "0") * 3600) + 
      (parseInt(minutes || "0") * 60);
    
    if (totalSeconds > 0) {
      onSetTimer(totalSeconds);
    }
  };

  const presetTimes = [
    { label: "25min", seconds: 1500 },
    { label: "1h", seconds: 3600 },
    { label: "2h", seconds: 7200 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Timer Duration</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex gap-4">
            <div className="grid gap-2">
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-20"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="minutes">Minutes</Label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-20"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {presetTimes.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                onClick={() => onSetTimer(preset.seconds)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <Button onClick={handleSetTimer}>Set Timer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}