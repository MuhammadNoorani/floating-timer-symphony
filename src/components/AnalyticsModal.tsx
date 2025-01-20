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
import { fetchTasks } from "@/lib/notion";

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
  const [allTasks, setAllTasks] = React.useState<any[]>([]);
  const [dailyTotal, setDailyTotal] = React.useState(0);

  React.useEffect(() => {
    if (open) {
      fetchTasks().then((tasks) => {
        setAllTasks(tasks);
        // Calculate daily total
        const today = new Date().toISOString().split('T')[0];
        const todaysTasks = tasks.filter((task: any) => 
          task.startTime?.startsWith(today)
        );
        const total = todaysTasks.reduce((acc: number, task: any) => 
          acc + (task.totalTime || 0), 0
        );
        setDailyTotal(total);
      });
    }
  }, [open]);

  const data = React.useMemo(() => {
    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    
    return [
      {
        name: taskName,
        hours,
        minutes,
      },
    ];
  }, [totalTime, taskName]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Analytics for {taskName}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            Daily Total: {formatTime(dailyTotal)}
          </div>
        </DialogHeader>
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="mt-4">
            <div className="space-y-4">
              <div className="h-[300px]">
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
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Today's Tasks</h3>
                {allTasks
                  .filter((task: any) => {
                    const today = new Date().toISOString().split('T')[0];
                    return task.startTime?.startsWith(today);
                  })
                  .map((task: any) => (
                    <div key={task.id} className="flex items-center justify-between p-2 rounded bg-muted">
                      <span>{task.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatTime(task.totalTime || 0)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="week" className="mt-4">
            {/* Similar structure for weekly data */}
            <div className="text-center text-muted-foreground">
              Weekly analytics coming soon
            </div>
          </TabsContent>
          <TabsContent value="month" className="mt-4">
            {/* Similar structure for monthly data */}
            <div className="text-center text-muted-foreground">
              Monthly analytics coming soon
            </div>
          </TabsContent>
          <TabsContent value="year" className="mt-4">
            {/* Similar structure for yearly data */}
            <div className="text-center text-muted-foreground">
              Yearly analytics coming soon
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}