import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const alt = 'Converto — Your Global Financial & Shopping Platform';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #09090b, #18181b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '64px',
          fontFamily: '"Inter", sans-serif',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '80%',
          height: '120%',
          background: 'radial-gradient(circle, rgba(230,255,0,0.1) 0%, rgba(0,0,0,0) 70%)',
          zIndex: 0,
        }} />
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '24px' }}>
          <div style={{ fontSize: '100px', display: 'flex' }}>🌍</div>
          <h1 style={{ 
            fontSize: '72px', 
            fontWeight: '900', 
            textAlign: 'center', 
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            One Platform.<br />Endless Global Possibilities.
          </h1>
          <div style={{ 
            marginTop: '32px',
            fontSize: '36px', 
            fontWeight: 'bold', 
            color: '#e6ff00',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            Converto
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
