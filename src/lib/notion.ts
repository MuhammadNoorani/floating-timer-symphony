import { Client } from "@notionhq/client";
import { toast } from "sonner";
import { getNotionConfig } from "./notion-config";

let notionClient: Client | null = null;

export const initNotion = () => {
  const config = getNotionConfig();
  notionClient = new Client({ auth: config.apiKey });
  startPeriodicSync();
};

// Queue system
interface QueuedUpdate {
  id: string;
  taskName: string;
  startTime: string;
  endTime: string;
  totalTime: number;
  notes: string;
  completed?: boolean;
  retryCount?: number;
}

export const syncQueue = new Map<string, QueuedUpdate>();
let isSyncing = false;

// Load queue from localStorage on init
try {
  const savedQueue = localStorage.getItem('sync_queue');
  if (savedQueue) {
    const queueEntries = JSON.parse(savedQueue);
    queueEntries.forEach(([key, value]: [string, QueuedUpdate]) => {
      syncQueue.set(key, value);
    });
  }
} catch (error) {
  console.error('Error loading sync queue:', error);
}

export const fetchTasks = async () => {
  if (!notionClient) {
    toast.error("Notion client not initialized");
    return [];
  }
  
  try {
    const response = await notionClient.databases.query({
      database_id: getNotionConfig().databaseId,
      sorts: [{ property: 'Start Time', direction: 'descending' }],
    });
    
    const tasks = response.results.map((page: any) => ({
      id: page.id,
      name: page.properties.Name.title[0]?.text.content || 'Untitled',
      startTime: page.properties['Start Time']?.date?.start,
      endTime: page.properties['End Time']?.date?.start,
      totalTime: page.properties['Total Time']?.number || 0,
      notes: page.properties.Notes?.rich_text[0]?.text.content || '',
      completed: page.properties['Completed']?.checkbox || false,
    }));

    localStorage.setItem('cached_tasks', JSON.stringify(tasks));
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    toast.error('Failed to fetch tasks from Notion');
    
    const cachedTasks = localStorage.getItem('cached_tasks');
    return cachedTasks ? JSON.parse(cachedTasks) : [];
  }
};

const processSyncQueue = async () => {
  if (isSyncing || syncQueue.size === 0) return;
  
  isSyncing = true;
  const batchUpdates = Array.from(syncQueue.values());
  
  try {
    for (const update of batchUpdates) {
      if (!notionClient) throw new Error("Notion client not initialized");
      
      try {
        await notionClient.pages.create({
          parent: { database_id: getNotionConfig().databaseId },
          properties: {
            Name: { title: [{ text: { content: update.taskName } }] },
            "Start Time": { date: { start: update.startTime } },
            "End Time": { date: { start: update.endTime } },
            "Total Time": { number: update.totalTime },
            Notes: { rich_text: [{ text: { content: update.notes } }] },
            Completed: { checkbox: update.completed || false }
          }
        });
        
        syncQueue.delete(update.id);
        localStorage.setItem('sync_queue', JSON.stringify(Array.from(syncQueue.entries())));
        toast.success(`Synced: ${update.taskName}`);
      } catch (error) {
        console.error("Error syncing update:", error);
        
        if (!update.retryCount || update.retryCount < 3) {
          update.retryCount = (update.retryCount || 0) + 1;
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, update.retryCount) * 1000));
          continue;
        }
        
        toast.error(`Failed to sync: ${update.taskName}`);
      }
    }
  } catch (error) {
    console.error("Sync error:", error);
    toast.error("Failed to sync with Notion");
  } finally {
    isSyncing = false;
  }
};

export const queueUpdate = (update: Omit<QueuedUpdate, 'id'>) => {
  const id = Date.now().toString();
  syncQueue.set(id, { ...update, id });
  localStorage.setItem('sync_queue', JSON.stringify(Array.from(syncQueue.entries())));
  toast.success("Update queued for sync");
};

// Hybrid sync approach - both periodic and event-based
const startPeriodicSync = () => {
  // Sync every 15 minutes
  setInterval(processSyncQueue, 900000);
  
  // Sync on online event
  window.addEventListener('online', processSyncQueue);
  
  // Initial sync attempt
  processSyncQueue();
};

// Event-based sync trigger
export const triggerSync = () => {
  processSyncQueue();
};