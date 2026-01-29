import { VIEW_COUNTER_CONFIG } from '../constants';
import { useArticleStore } from '../stores/articleStore';

interface CountApiResponse {
  value?: number;
}

export function useViewCounter() {
  const articleStore = useArticleStore();

  const getCachedViews = (path: string): number | undefined => {
    const cached = articleStore.getCachedStats(path);
    return cached ? cached.views : undefined;
  };

  const getCachedVisitors = (path: string): number | undefined => {
    const cached = articleStore.getCachedStats(path);
    return cached ? cached.visitors : undefined;
  };

  const getNamespace = () => {
    let namespace = VIEW_COUNTER_CONFIG.countApiNamespace;
    if (!namespace && typeof window !== 'undefined') {
      namespace = window.location.hostname || 'sakura-notes';
    }
    return namespace;
  };

  const hitCounter = async (namespace: string, key: string): Promise<number | undefined> => {
    const encodedNamespace = encodeURIComponent(namespace);
    const encodedKey = encodeURIComponent(key);
    const response = await fetch(`https://api.countapi.xyz/hit/${encodedNamespace}/${encodedKey}`);
    if (!response.ok) {
      return undefined;
    }
    const data = (await response.json()) as CountApiResponse;
    return typeof data.value === 'number' ? data.value : undefined;
  };

  const incrementAndGetViews = async (path: string): Promise<number | undefined> => {
    const cached = articleStore.getCachedStats(path);
    if (cached) return cached.views;

    if (VIEW_COUNTER_CONFIG.provider !== 'countapi') return cached?.views;

    const namespace = getNamespace();
    if (!namespace) {
      return cached?.views;
    }

    try {
      const viewsKey = `views:${path}`;
      const visitorsKey = `visitors:${path}`;

      const views = await hitCounter(namespace, viewsKey);
      let visitors = cached?.visitors;

      if (!articleStore.hasVisited(path)) {
        const v = await hitCounter(namespace, visitorsKey);
        if (typeof v === 'number') {
          visitors = v;
          articleStore.markVisited(path);
        }
      }

      if (typeof views === 'number') {
        articleStore.setCachedStats(path, views, typeof visitors === 'number' ? visitors : visitors ?? 0);
        return views;
      }
    } catch {
      return cached?.views;
    }

    return cached?.views;
  };

  return {
    getCachedViews,
    getCachedVisitors,
    incrementAndGetViews
  };
}
