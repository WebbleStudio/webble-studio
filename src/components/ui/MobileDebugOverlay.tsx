'use client';

import { useEffect, useState } from 'react';

export default function MobileDebugOverlay() {
  const [debugInfo, setDebugInfo] = useState({
    innerHeight: 0,
    visualHeight: 0,
    diff: 0,
    scrollY: 0,
    width: 0,
    changes: 0,
  });

  useEffect(() => {
    let changeCount = 0;
    const startTime = Date.now();

    const updateDebugInfo = () => {
      changeCount++;
      const inner = Math.round(window.innerHeight);
      const visual = Math.round(window.visualViewport?.height || window.innerHeight);
      
      setDebugInfo({
        innerHeight: inner,
        visualHeight: visual,
        diff: inner - visual,
        scrollY: Math.round(window.scrollY),
        width: Math.round(window.innerWidth),
        changes: changeCount,
      });
    };

    // Update immediato
    updateDebugInfo();

    // Update continuo ogni 300ms
    const interval = setInterval(updateDebugInfo, 300);

    // Update su eventi
    window.addEventListener('resize', updateDebugInfo);
    window.addEventListener('scroll', updateDebugInfo, { passive: true });
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateDebugInfo);
      window.visualViewport.addEventListener('scroll', updateDebugInfo);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateDebugInfo);
      window.removeEventListener('scroll', updateDebugInfo);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateDebugInfo);
        window.visualViewport.removeEventListener('scroll', updateDebugInfo);
      }
    };
  }, []);

  // SEMPRE visibile
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        zIndex: 99999,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '11px',
        lineHeight: '1.6',
        fontFamily: 'monospace',
        maxWidth: '200px',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#fbbf24', fontSize: '13px' }}>
        🔍 DEBUG
      </div>
      <div>innerH: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{debugInfo.innerHeight}px</span></div>
      <div>visualH: <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{debugInfo.visualHeight}px</span></div>
      <div>diff: <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{debugInfo.diff}px</span></div>
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', marginTop: '6px', paddingTop: '6px' }}>
        <div>scroll: <span style={{ color: '#f97316' }}>{debugInfo.scrollY}px</span></div>
        <div>width: <span style={{ color: '#8b5cf6' }}>{debugInfo.width}px</span></div>
        <div>updates: <span style={{ color: '#ec4899' }}>{debugInfo.changes}</span></div>
      </div>
    </div>
  );
}

