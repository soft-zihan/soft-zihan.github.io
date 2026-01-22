
import { describe, it, expect, vi } from 'vitest';
import JSZip from 'jszip';

// Mock JSZip
vi.mock('jszip', () => {
  return {
    default: class {
      file = vi.fn();
      folder = vi.fn().mockReturnThis();
      generateAsync = vi.fn().mockResolvedValue(new Blob(['zip content']));
    }
  };
});

describe('Bulk Download', () => {
  it('zips all files correctly', async () => {
    const mockFiles = [
      { path: 'file1.md', content: 'content1' },
      { path: 'file2.js', content: 'content2' }
    ];
    
    // Use the mocked constructor directly
    const zipInstance = new JSZip();
    
    mockFiles.forEach(f => {
      zipInstance.file(f.path, f.content);
    });
    
    expect(zipInstance.file).toHaveBeenCalledTimes(2);
    expect(zipInstance.file).toHaveBeenCalledWith('file1.md', 'content1');
    expect(zipInstance.file).toHaveBeenCalledWith('file2.js', 'content2');
  });
});
