import React, { useState } from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value = 0, onChange, readOnly = false, size = 18 }) => {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hoverValue || value) >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange && onChange(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: readOnly ? 'default' : 'pointer',
              color: isFilled ? '#f59e0b' : '#cbd5e1',
              display: 'flex'
            }}
          >
            <Star
              size={size}
              fill={isFilled ? '#f59e0b' : 'none'}
              stroke={isFilled ? '#f59e0b' : 'currentColor'}
            />
          </button>
        );
      })}
    </div>
  );
};

export default Rating;
