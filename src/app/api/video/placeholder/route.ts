import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Crea un SVG animato come placeholder video
    const svgContent = `
      <svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#F20352;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#D91848;stop-opacity:0.6" />
          </linearGradient>
          <pattern id="dots" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="3" fill="white" opacity="0.1">
              <animate attributeName="opacity" values="0.1;0.3;0.1" dur="2s" repeatCount="indefinite"/>
            </circle>
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grad1)"/>
        <rect width="100%" height="100%" fill="url(#dots)"/>
        
        <text x="50%" y="45%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold" opacity="0.9">
          VIDEO PLACEHOLDER
        </text>
        <text x="50%" y="55%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" opacity="0.7">
          Carica 1080p.mp4 nel bucket Supabase "videos"
        </text>
        
        <circle cx="50%" cy="70%" r="30" fill="white" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <polygon points="960,760 980,750 980,770" fill="#F20352"/>
      </svg>
    `;

    // Converti SVG in data URL per essere usato come poster
    const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;

    return NextResponse.json({
      message: 'Video placeholder - per video reali carica file nel bucket Supabase',
      posterUrl: dataUrl,
      instructions: {
        step1: 'Vai al dashboard Supabase',
        step2: 'Naviga in Storage > Create bucket "videos" (se non esiste)',
        step3: 'Rendi il bucket pubblico',
        step4: 'Carica il file 1080p.mp4',
        step5: 'Ricarica la pagina',
      },
    });
  } catch (error) {
    console.error('Failed to create placeholder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
