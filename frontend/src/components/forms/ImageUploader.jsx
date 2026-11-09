import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Plus, FolderOpen } from 'lucide-react';
import { roomService } from '../../services/roomService';

const ImageUploader = ({ images = [], onChange, roomId = null, maxImages = 8 }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAddImage = (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    if (images.length >= maxImages) {
      alert(`Maximum of ${maxImages} images allowed`);
      return;
    }
    onChange([...images, inputUrl.trim()]);
    setInputUrl('');
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (images.length + files.length > maxImages) {
      alert(`Cannot exceed ${maxImages} images total (currently ${images.length})`);
      return;
    }

    // Validate size and format
    const validFiles = files.filter(f => {
      if (f.size > 5 * 1024 * 1024) {
        alert(`File ${f.name} exceeds 5 MB size limit`);
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    if (roomId) {
      setUploading(true);
      try {
        const formData = new FormData();
        validFiles.forEach(f => formData.append('files', f));
        const res = await roomService.uploadImages(roomId, formData);
        if (res && res.length > 0) {
          const newUrls = res.map(img => img.imageUrl);
          onChange([...images, ...newUrls]);
        }
      } catch (err) {
        alert(err.message || 'Failed to upload files to server');
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } else {
      // Preview with object URLs
      const fileUrls = validFiles.map(f => URL.createObjectURL(f));
      onChange([...images, ...fileUrls]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index) => {
    onChange(images.filter((_, idx) => idx !== index));
  };

  const addSampleImage = () => {
    if (images.length >= maxImages) {
      alert(`Maximum of ${maxImages} images reached`);
      return;
    }
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
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="url"
          className="form-input"
          placeholder="Paste image URL (https://...)"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          style={{ minWidth: '220px', flex: 1 }}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleAddImage}
        >
          <Plus size={16} /> Add URL
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <FolderOpen size={16} /> {uploading ? 'Uploading...' : 'Browse Device Files'}
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
            <p style={{ fontSize: '0.85rem' }}>No room photos added yet. Browse device files, paste a URL, or add a sample photo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
