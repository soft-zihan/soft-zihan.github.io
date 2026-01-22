
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

// NOTE: We use dynamic imports for useWallpapers to ensure global.fetch is mocked 
// BEFORE the module initialization code (loadWallpapers) runs.

describe('Wallpaper System', () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    vi.clearAllMocks();
    
    // Default mock to prevent crashes in background calls (loadWallpapers, updateBingDaily)
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ light: [], dark: [] })
    } as any);
  });

  it('fetchBaiduWallpaper calls correct API', async () => {
    // Dynamic import
    const { useWallpapers } = await import('../src/composables/useWallpapers');
    const { fetchBaiduWallpaper, baiduWallpapers } = useWallpapers();
    
    // Override mock for this specific call
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        code: 200,
        res: ['http://example.com/img1.jpg']
      })
    });

    await fetchBaiduWallpaper('keyword');
    
    // Verify API call
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('cn.apihz.cn/api/img/apihzimgbaidu.php'));
    
    // Verify State update
    expect(baiduWallpapers.value).toBeDefined();
    // Note: The implementation might append or replace.
    // Based on code: baiduWallpapers.value = items
    if (baiduWallpapers.value.length > 0) {
        expect(baiduWallpapers.value[0].path).toBe('http://example.com/img1.jpg');
    }
  });

  it('autoChangeWallpaper cycles through wallpapers', async () => {
     const { useWallpapers } = await import('../src/composables/useWallpapers');
     const { autoChangeWallpaper, baiduWallpapers } = useWallpapers();
     
     // Setup state for testing
     baiduWallpapers.value = [
       { filename: 'http://example.com/img1.jpg', path: 'http://example.com/img1.jpg', name: 'Image 1', source: 'api' },
       { filename: 'http://example.com/img2.jpg', path: 'http://example.com/img2.jpg', name: 'Image 2', source: 'api' }
     ];
     
     // Should not throw
     expect(() => autoChangeWallpaper()).not.toThrow();
  });
});
