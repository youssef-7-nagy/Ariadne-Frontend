import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { MediaPreview } from './MediaPreview';

export const MediaUploader = ({ accept, label, preview, previewType, onChange, onClear, maxSizeMB = 10 }) => {
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState('');
  const ref = useRef();

  const handleFile = (file) => {
    setError('');
    if (!file) return;
    if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File exceeds maximum size of ${maxSizeMB}MB`);
        return;
    }
    onChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      {preview ? (
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <MediaPreview src={preview} type={previewType} />
          <button
            type="button"
            onClick={() => { setError(''); onClear(); }}
            style={{
              position: 'absolute', top: 6, right: 6, background: '#ef4444',
              border: 'none', borderRadius: '50%', width: 26, height: 26,
              color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          ><FiX size={13} /></button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          onClick={() => ref.current?.click()}
          style={{
            border: `2px dashed ${drag ? '#4361ee' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: 10, padding: '22px 16px', textAlign: 'center',
            cursor: 'pointer', marginBottom: 10, transition: 'all .2s',
            background: drag ? 'rgba(67,97,238,0.06)' : 'rgba(255,255,255,0.02)',
            color: '#94a3b8'
          }}
        >
          <FiUploadCloud size={24} style={{ marginBottom: 6 }} />
          <p style={{ fontSize: '0.82rem', margin: 0 }}>{label}</p>
        </div>
      )}
      {error && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 4 }}>{error}</p>}
      <input ref={ref} type="file" accept={accept} style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])} />
    </div>
  );
};
