
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

// Mock Image globally
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src: string = '';
  naturalWidth: number = 0;
  naturalHeight: number = 0;

  constructor() {
    setTimeout(() => {
        // Simple logic: if src contains 'invalid', trigger error.
        // if src contains 'small', trigger load with small dimensions.
        // otherwise success with valid dimensions.
        if (this.src.includes('invalid')) {
            if (this.onerror) this.onerror();
        } else if (this.src.includes('small')) {
            this.naturalWidth = 100;
            this.naturalHeight = 100;
            if (this.onload) this.onload();
        } else {
            this.naturalWidth = 1920;
            this.naturalHeight = 1080;
            if (this.onload) this.onload();
        }
    }, 10);
  }
}

describe('Wallpaper System', () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    vi.clearAllMocks();
    (global as any).Image = MockImage;
    
    // Default mock
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ light: [], dark: [] })
    } as any);
  });

  afterEach(() => {
     vi.restoreAllMocks();
  });

  it('fetchBaiduWallpaper fetches double the requested limit', async () => {
    const { useWallpapers } = await import('../src/composables/useWallpapers');
    const { fetchBaiduWallpaper } = useWallpapers();
    
    // Mock fetch response
    (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
            code: 200,
            res: Array(10).fill('http://example.com/valid.jpg').map((u, i) => `${u}?id=${i}`)
        })
    });

    // Request 5, should fetch 10 (limit param in URL)
    await fetchBaiduWallpaper('test', 5);

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('limit=10'));
  });

  it('fetchBaiduWallpaper filters out invalid images', async () => {
    const { useWallpapers } = await import('../src/composables/useWallpapers');
    const { fetchBaiduWallpaper, baiduWallpapers } = useWallpapers();

    // Mock fetch: return mixed valid and invalid urls
    (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
            code: 200,
            res: [
                'http://example.com/valid1.jpg',
                'http://example.com/invalid1.jpg', // Will fail validation (onerror)
                'http://example.com/small.jpg',   // Will fail size check (<200)
                'http://example.com/valid2.jpg'
            ]
        })
    });

    // We ask for 2. The mock returns 4 candidates.
    // 2 are invalid. So we should get 2 valid ones.
    await fetchBaiduWallpaper('test', 2);
    
    expect(baiduWallpapers.value.length).toBe(2);
    expect(baiduWallpapers.value.map(w => w.path)).toEqual([
        'http://example.com/valid1.jpg', 
        'http://example.com/valid2.jpg'
    ]);
  });
  
  it('fetchBaiduWallpaper retries/paginates if not enough valid images', async () => {
     const { useWallpapers } = await import('../src/composables/useWallpapers');
     const { fetchBaiduWallpaper, baiduWallpapers } = useWallpapers();
     
     // Mock fetch to return only 1 valid image per page
     (global.fetch as any).mockImplementation((url: string) => {
         // Handle the initial wallpapers.json call or other calls
         if (!url.includes('apihz.cn')) {
             return Promise.resolve({ ok: false });
         }

         const pageMatch = url.match(/page=(\d+)/);
         const page = pageMatch ? parseInt(pageMatch[1]) : 1;
         
         // Each page returns 1 valid image and 1 invalid image
         return Promise.resolve({
             ok: true,
             json: async () => ({
                 code: 200,
                 res: [`http://example.com/valid${page}.jpg`, 'http://example.com/invalid.jpg']
             })
         });
     });
     
     // Request 3 images. 
     await fetchBaiduWallpaper('test', 3);
     
     expect(baiduWallpapers.value.length).toBe(3);
     // Verify it called page 1, 2, and 3
     expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('page=1'));
     expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('page=2'));
     expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('page=3'));
  });

  it('autoChangeWallpaper validates before setting', async () => {
      const { useWallpapers } = await import('../src/composables/useWallpapers');
      const { autoChangeWallpaper, baiduWallpapers } = useWallpapers();
      const appStore = (await import('../src/stores/appStore')).useAppStore();

      // Setup store mode
      appStore.userSettings.autoChangeMode = 'search';
      
      // Setup baidu wallpapers with one invalid and one valid
      baiduWallpapers.value = [
          { filename: 'http://example.com/invalid-auto.jpg', path: 'http://example.com/invalid-auto.jpg', name: 'Invalid', source: 'api' },
          { filename: 'http://example.com/valid-auto.jpg', path: 'http://example.com/valid-auto.jpg', name: 'Valid', source: 'api' }
      ];

      // Mock Math.random to pick invalid (0) first, then valid (1)
      const randomSpy = vi.spyOn(Math, 'random');
      // 1st call: returns 0 -> index 0 (Invalid)
      // 2nd call: returns 0.9 -> index 1 (Valid)
      randomSpy.mockReturnValueOnce(0).mockReturnValueOnce(0.9);

      // Spy on setWallpaper
      const spySet = vi.spyOn(appStore, 'setWallpaper');
      
      // Mock fetch to fail fast for any Baidu calls (triggered by retry)
      (global.fetch as any).mockResolvedValue({ ok: false });

      // Call with false to avoid initial fetch, but retry will trigger fetch
      await autoChangeWallpaper(false);

      // It should eventually set the valid one
      expect(spySet).toHaveBeenCalledWith('http://example.com/valid-auto.jpg');
  });
});
