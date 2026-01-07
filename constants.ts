import { NodeType } from './types';
import type { FileNode } from './types';

export const MOCK_FILE_SYSTEM: FileNode[] = [
  {
    name: "notes",
    path: "notes",
    type: NodeType.DIRECTORY,
    children: [
      {
        name: "Welcome.md",
        path: "notes/Welcome.md",
        type: NodeType.FILE,
        lastModified: "2023-11-01T10:00:00Z",
        content: "# Welcome to Sakura Notes 🌸\n\nThis is a mock file used when `files.json` cannot be loaded.\n\n## Features\n- Markdown support\n- Live preview\n- Aesthetic design"
      }
    ]
  }
];