import React from 'react';

const DashboardCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'primary',
  gradient
}) => {
  const getGradient = () => {
    if (gradient) return gradient;
    if (color === 'primary') return 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)';
    if (color === 'success') return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    if (color === 'warning') return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
    if (color === 'danger') return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    if (color === 'info') return 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)';
    return 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)';
  };

  return (
    <div className="card dashboard-metric-card" style={{
      padding: '1.25rem 1.4rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.85rem',
      minWidth: 0,
      height: '100%'
    }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          display: 'block',
          lineHeight: 1.3
        }}>
          {title}
        </span>
        <h3 style={{
          fontSize: '1.85rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          margin: '0.2rem 0 0.1rem',
          lineHeight: 1.1
        }}>
          {value}
        </h3>
        {subtitle && (
          <p style={{
            fontSize: '0.775rem',
            color: 'var(--text-muted)',
            lineHeight: 1.3
          }}>
            {subtitle}
          </p>
        )}
      </div>

      {Icon && (
        <div style={{
          background: getGradient(),
          width: '46px',
          height: '46px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          flexShrink: 0
        }}>
          <Icon size={22} />
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
