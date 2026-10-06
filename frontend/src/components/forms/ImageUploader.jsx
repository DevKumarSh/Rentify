import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';

const ImageUploader = ({ images = [], onChange }) => {
  const [inputUrl, setInputUrl] = useState('');

  const handleAddImage = (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    onChange([...images, inputUrl.trim()]);
    setInputUrl('');
  };

  const handleRemoveImage = (index) => {
    onChange(images.filter((_, idx) => idx !== index));
  };

  const addSampleImage = () => {
    const samples = [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1000&q=80'
    ];
    const available = samples.filter(s => !images.includes(s));
    if (available.length > 0) {
      onChange([...images, available[0]]);
    } else {
      onChange([...images, `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80&rand=${Date.now()}`]);
    }
  };

  return (
    <div className="image-uploader-wrapper">
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="url"
          className="form-input"
          placeholder="Paste image URL (https://...)"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleAddImage}
        >
          <Plus size={16} /> Add URL
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={addSampleImage}
          title="Add a high-quality sample room photo"
        >
          <ImageIcon size={16} /> Sample Photo
        </button>
      </div>

      {/* Grid of uploaded images */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: '0.75rem',
        marginTop: '0.5rem'
      }}>
        {images.map((img, index) => (
          <div
            key={index}
            style={{
              position: 'relative',
              height: '100px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: index === 0 ? '2px solid var(--primary)' : '1px solid var(--border-light)'
            }}
          >
            <img
              src={img}
              alt={`Room photo ${index + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {index === 0 && (
              <span style={{
                position: 'absolute',
                top: 4,
                left: 4,
                backgroundColor: 'var(--primary)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                Cover Photo
              </span>
            )}
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                backgroundColor: 'rgba(239, 68, 68, 0.9)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {images.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface)',
            border: '1px dashed var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)'
          }}>
            <Upload size={24} style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '0.85rem' }}>No room photos added yet. Click "Sample Photo" or paste a URL above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
