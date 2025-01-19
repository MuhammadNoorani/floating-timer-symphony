import { Client } from "@notionhq/client";
import { toast } from "sonner";

let notionClient: Client | null = null;

export const initNotion = (apiKey: string) => {
  notionClient = new Client({ auth: apiKey });
  localStorage.setItem('notion_api_key', apiKey);
};

export const syncQueue = new Map();
let isSyncing = false;

const processSyncQueue = async () => {
  if (isSyncing || syncQueue.size === 0) return;
  
  isSyncing = true;
  const batchUpdates = Array.from(syncQueue.values());
  
  try {
    for (const update of batchUpdates) {
      if (!notionClient) throw new Error("Notion client not initialized");
      
      await notionClient.pages.create({
        parent: { database_id: localStorage.getItem('notion_database_id') || '' },
        properties: {
          Name: { title: [{ text: { content: update.taskName } }] },
          "Start Time": { date: { start: update.startTime } },
          "End Time": { date: { start: update.endTime } },
          "Total Time": { number: update.totalTime },
          Notes: { rich_text: [{ text: { content: update.notes } }] }
        }
      });
      
      syncQueue.delete(update.id);
    }
    toast.success("Synced with Notion successfully");
  } catch (error) {
    console.error("Sync error:", error);
    toast.error("Failed to sync with Notion");
  } finally {
    isSyncing = false;
  }
};

export const queueUpdate = (update: any) => {
  const id = Date.now().toString();
  syncQueue.set(id, { ...update, id });
  localStorage.setItem('sync_queue', JSON.stringify(Array.from(syncQueue.entries())));
};

// Hybrid sync approach
setInterval(processSyncQueue, 900000); // Every 15 minutes
window.addEventListener('online', processSyncQueue);