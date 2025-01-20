// Store Notion credentials
const NOTION_API_KEY = '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';
const NOTION_DATABASE_ID = '180696307881808fa98fea7443453403';

export const getNotionConfig = () => ({
  apiKey: NOTION_API_KEY,
  databaseId: NOTION_DATABASE_ID
});

// Initialize Notion client on app start
export const initializeNotion = () => {
  localStorage.setItem('notion_api_key', NOTION_API_KEY);
  localStorage.setItem('notion_database_id', NOTION_DATABASE_ID);
};