import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initializeNotion } from "@/lib/notion-config";

export function NotionSetup() {
  const [apiKey, setApiKey] = React.useState("");
  const [databaseId, setDatabaseId] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(!localStorage.getItem('notion_api_key'));

  const handleSetup = () => {
    localStorage.setItem('notion_api_key', apiKey);
    localStorage.setItem('notion_database_id', databaseId);
    initializeNotion();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Setup Notion Integration</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Notion API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Input
            placeholder="Notion Database ID"
            value={databaseId}
            onChange={(e) => setDatabaseId(e.target.value)}
          />
          <Button onClick={handleSetup}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}