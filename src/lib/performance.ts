// Configurazione ottimizzazioni prestazioni per PageSpeed Insights

export const PERFORMANCE_CONFIG = {
  // Timeout per caricamenti
  SPLINE_TIMEOUT: 8000, // Ridotto da 10s a 8s
  IMAGE_LAZY_LOAD_DELAY: 100,
  VIDEO_LAZY_LOAD_DELAY: 200,
  
  // Soglie per ottimizzazioni
  SLOW_CONNECTION_THRESHOLD: 2, // 2g o peggio
  LOW_END_DEVICE_CORES: 2,
  
  // Preload strategico
  CRITICAL_RESOURCES: [
    '/img/logo-webble-esteso.svg',
    '/img/thumbnails/webble-thumbnail.jpg',
  ],
  
  // Risorse da caricare con priorità bassa
  LOW_PRIORITY_RESOURCES: [
    'spline.design',
    'unpkg.com',
    'fonts.googleapis.com',
  ],
};

// Helper per rilevare connessione lenta
export const isSlowConnection = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const connection = (navigator as any).connection || 
                   (navigator as any).mozConnection || 
                   (navigator as any).webkitConnection;
  
  if (!connection) return false;
  
  return connection.effectiveType === 'slow-2g' || 
         connection.effectiveType === '2g' || 
         connection.saveData === true;
};

// Helper per rilevare device a bassa potenza
export const isLowEndDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
};

// Strategia di caricamento basata su performance
export const getLoadingStrategy = () => {
  const slowConnection = isSlowConnection();
  const lowEndDevice = isLowEndDevice();
  
  return {
    useSpline: !slowConnection && !lowEndDevice,
    useAnimations: !slowConnection,
    useBlur: !lowEndDevice,
    preloadImages: !slowConnection,
    lazyLoadDelay: slowConnection ? 0 : 100,
  };
};
