// Data structure for a blog post
export interface BlogPost {
  id: string;
  title: string;
  path: string; // e.g., "tech/react-notes.md"
  content: string;
  date: string; // ISO date string
  tags: string[];
  banner?: string; // Optional banner image URL
}

// Tree node structure for directory view
export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  post?: BlogPost; // If it's a file, link to the post data
}

// Navigation modes: Simplified to just Latest and Tree
export type NavMode = 'latest' | 'tree';

// State interface for GeminiStudio component
export interface GeminiImageState {
  originalImage: string | null;
  generatedImage: string | null;
  prompt: string;
  isLoading: boolean;
  error: string | null;
}