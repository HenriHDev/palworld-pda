import { useWindowDimensions } from 'react-native';

/** Responsive breakpoints: desktop → side dock; tablet/mobile → bottom nav. */
export const useBreakpoint = () => {
  const { width } = useWindowDimensions();
  return {
    width,
    isDesktop: width >= 1024,
    isTablet: width >= 768 && width < 1024,
    isMobile: width < 768,
    columns: width >= 1280 ? 5 : width >= 1024 ? 4 : width >= 768 ? 3 : 2
  };
};
