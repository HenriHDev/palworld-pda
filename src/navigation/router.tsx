import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * LIGHTWEIGHT NAVIGATION — typed route union + context, no external router
 * dependency. The AppShell renders a side dock (desktop) or bottom bar
 * (mobile) and swaps screens with fluid fade/slide transitions.
 */

export type Route =
  | { name: 'home' }
  | { name: 'paldeck' }
  | { name: 'pal'; palId: string }
  | { name: 'breeding'; parents?: { a: string; b: string } }
  | { name: 'bases' }
  | { name: 'map'; focusPalId?: string }
  | { name: 'quests' };

interface RouterCtx {
  route: Route;
  navigate: (route: Route) => void;
  back: () => void;
  canGoBack: boolean;
}

const Ctx = createContext<RouterCtx | null>(null);

const sameParents = (a: { a: string; b: string } | undefined, b: { a: string; b: string } | undefined) =>
  a === b || (!!a && !!b && a.a === b.a && a.b === b.b);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stack, setStack] = useState<Route[]>([{ name: 'home' }]);

  const navigate = useCallback((route: Route) => {
    setStack((s) => {
      const last = s[s.length - 1];
      // Same destination → no-op (different Pal dossiers and different
      // breeding pairs DO push).
      const same =
        last.name === route.name &&
        (last.name !== 'pal' || (last as { palId?: string }).palId === (route as { palId?: string }).palId) &&
        (last.name !== 'breeding' ||
          sameParents((last as { parents?: { a: string; b: string } }).parents, (route as { parents?: { a: string; b: string } }).parents));
      if (same) return s;
      return [...s, route];
    });
  }, []);

  const back = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  const value = useMemo<RouterCtx>(
    () => ({
      route: stack[stack.length - 1],
      navigate,
      back,
      canGoBack: stack.length > 1
    }),
    [stack, navigate, back]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useRouter = (): RouterCtx => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useRouter must be used inside RouterProvider');
  return ctx;
};

export const routeKey = (r: Route): string =>
  r.name === 'pal' ? `pal:${r.palId}` : r.name;
