import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface AnalyticsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskName: string;
  totalTime: number;
}

export function AnalyticsModal({
  open,
  onOpenChange,
  taskName,
  totalTime,
}: AnalyticsModalProps) {
  const data = React.useMemo(() => {
    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    
    return [
      {
        name: "Time Spent",
        hours,
        minutes,
      },
    ];
  }, [totalTime]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Analytics for {taskName}
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="mt-4 h-[300px]">
            <ChartContainer
              config={{
                hours: {
                  label: "Hours",
                  theme: {
                    light: "#0ea5e9",
                    dark: "#0ea5e9",
                  },
                },
                minutes: {
                  label: "Minutes",
                  theme: {
                    light: "#6366f1",
                    dark: "#6366f1",
                  },
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="hours" name="Hours" fill="var(--color-hours)" />
                  <Bar dataKey="minutes" name="Minutes" fill="var(--color-minutes)" />
                  <Tooltip content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-md">
                          <p className="font-medium">{label}</p>
                          {payload.map((entry) => (
                            <p key={entry.name} className="text-sm">
                              {entry.name}: {entry.value}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="week" className="mt-4 h-[300px]">
            {/* Similar chart structure for weekly data */}
          </TabsContent>
          <TabsContent value="month" className="mt-4 h-[300px]">
            {/* Similar chart structure for monthly data */}
          </TabsContent>
          <TabsContent value="year" className="mt-4 h-[300px]">
            {/* Similar chart structure for yearly data */}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}