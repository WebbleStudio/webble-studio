'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState({
    innerHeight: 0,
    visualHeight: 0,
    diff: 0,
    scrollY: 0,
  });

  useEffect(() => {
    const updateDebugInfo = () => {
      const inner = Math.round(window.innerHeight);
      const visual = Math.round(window.visualViewport?.height || window.innerHeight);
      
      setDebugInfo({
        innerHeight: inner,
        visualHeight: visual,
        diff: inner - visual,
        scrollY: Math.round(window.scrollY),
      });
    };

    updateDebugInfo();

    const interval = setInterval(updateDebugInfo, 300);
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

  return (
    <div style={{ paddingTop: '100px', backgroundColor: '#0b0b0b' }}>
      {/* Debug Overlay Fisso */}
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
          border: '2px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#fbbf24' }}>
          🔍 DEBUG (NO VH)
        </div>
        <div>innerH: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{debugInfo.innerHeight}px</span></div>
        <div>visualH: <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{debugInfo.visualHeight}px</span></div>
        <div>diff: <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{debugInfo.diff}px</span></div>
        <div>scroll: <span style={{ color: '#f97316' }}>{debugInfo.scrollY}px</span></div>
      </div>

      {/* Titolo */}
      <div style={{ 
        padding: '20px', 
        color: 'white', 
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
          DEBUG PAGE - NO VH
        </h1>
        <p style={{ fontSize: '16px', color: '#888' }}>
          5 container da 700px fissi (niente vh/vw)
        </p>
      </div>

      {/* Container 1 */}
      <div
        style={{
          height: '700px',
          margin: '20px',
          backgroundColor: '#1a1a1a',
          border: '2px solid #f20352',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
        <div>CONTAINER 1</div>
        <div style={{ fontSize: '16px', marginTop: '10px', color: '#888' }}>700px fissi</div>
      </div>

      {/* Container 2 */}
      <div
        style={{
          height: '700px',
          margin: '20px',
          backgroundColor: '#1a1a1a',
          border: '2px solid #10b981',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
        <div>CONTAINER 2</div>
        <div style={{ fontSize: '16px', marginTop: '10px', color: '#888' }}>700px fissi</div>
      </div>

      {/* Container 3 */}
      <div
        style={{
          height: '700px',
          margin: '20px',
          backgroundColor: '#1a1a1a',
          border: '2px solid #3b82f6',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
        <div>CONTAINER 3</div>
        <div style={{ fontSize: '16px', marginTop: '10px', color: '#888' }}>700px fissi</div>
      </div>

      {/* Container 4 */}
      <div
        style={{
          height: '700px',
          margin: '20px',
          backgroundColor: '#1a1a1a',
          border: '2px solid #fbbf24',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
        <div>CONTAINER 4</div>
        <div style={{ fontSize: '16px', marginTop: '10px', color: '#888' }}>700px fissi</div>
      </div>

      {/* Container 5 */}
      <div
        style={{
          height: '700px',
          margin: '20px',
          backgroundColor: '#1a1a1a',
          border: '2px solid #8b5cf6',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
        <div>CONTAINER 5</div>
        <div style={{ fontSize: '16px', marginTop: '10px', color: '#888' }}>700px fissi</div>
      </div>

      {/* Footer */}
      <div style={{ 
        padding: '40px 20px', 
        color: '#888', 
        textAlign: 'center',
        fontSize: '14px'
      }}>
        Fine della pagina - Torna su per testare lo scroll
      </div>
    </div>
  );
}

