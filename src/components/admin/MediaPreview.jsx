import React from 'react';
import { resolveMedia } from '../../utils/mediaResolver';
import { ImageFallback } from '../media/ImageFallback';
import { VideoFallback } from '../media/VideoFallback';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const MediaPreview = ({ src, type, className, style }) => {
  if (!src) return null;
  
  const isAbsolute = src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:');
  const url = isAbsolute ? src : `${API_URL}${src}`;
  const finalStyle = { width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, ...style };

  const resolved = resolveMedia(url);

  if (resolved.isIframe) {
    let thumbUrl = resolved.thumbnail || 'https://cdn-icons-png.flaticon.com/512/1384/1384012.png';
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', background: '#222', borderRadius: 8, overflow: 'hidden' }}>
        <ImageFallback src={thumbUrl} className={className} style={{ ...finalStyle, objectFit: 'cover', opacity: 0.8 }} alt="Embed Thumbnail" />
        <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: '10px', fontWeight: 'bold' }}>VIDEO</div>
      </div>
    );
  }

  if (type === 'video' || resolved.type.includes('video')) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <VideoFallback
          src={resolved.src}
          className={className}
          style={finalStyle}
          controls={false}
          autoPlay={false}
        />
        <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: '10px', fontWeight: 'bold', pointerEvents: 'none' }}>VIDEO</div>
      </div>
    );
  }
  
  return <ImageFallback src={resolved.src} className={className} style={finalStyle} alt="Media" />;
};
