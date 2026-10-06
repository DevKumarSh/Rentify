import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Flag, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [adminRemark, setAdminRemark] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await reportService.getReports();
      setReports(res.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (id) => {
    await reportService.resolveReport(id, adminRemark || 'Reviewed and resolved by moderation team');
    setSelectedReport(null);
    setAdminRemark('');
    fetchReports();
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Flagged Listing Reports</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Review user reports on fraud, incorrect prices, or inappropriate content.
          </p>
        </div>
        <span className="badge badge-danger">
          {reports.filter(r => r.status === 'OPEN').length} Open Reports
        </span>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching reported listings..." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {reports.map((rep) => {
            const isOpen = rep.status === 'OPEN';

            return (
              <div
                key={rep.id}
                className="card"
                style={{
                  padding: '1.5rem',
                  borderLeft: isOpen ? '4px solid var(--danger)' : '4px solid var(--success)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className={`badge ${isOpen ? 'badge-danger' : 'badge-success'}`}>
                        {rep.status}
                      </span>
                      <span className="badge badge-neutral">Reason: {rep.reason?.replace('_', ' ')}</span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                      Reported Room: <Link to={`/rooms/${rep.roomId}`}>{rep.roomTitle}</Link>
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Reported by: {rep.seekerName} on {formatDate(rep.createdAt)}
                    </p>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--bg-surface)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  margin: '0.75rem 0'
                }}>
                  <p style={{ fontSize: '0.925rem', color: 'var(--text-primary)' }}>
                    <strong>Complainant Statement:</strong> "{rep.description || 'No detailed description provided.'}"
                  </p>
                </div>

                {rep.adminRemark && (
                  <div style={{ backgroundColor: '#f0fdf4', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.85rem', color: '#166534' }}>
                      <strong>Admin Resolution Remark:</strong> {rep.adminRemark}
                    </p>
                  </div>
                )}

                {isOpen && (
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Add resolution note (e.g. Warning sent to owner, price updated)..."
                      value={selectedReport === rep.id ? adminRemark : ''}
                      onChange={(e) => {
                        setSelectedReport(rep.id);
                        setAdminRemark(e.target.value);
                      }}
                      style={{ maxWidth: '500px' }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-success"
                      onClick={() => handleResolve(rep.id)}
                    >
                      <CheckCircle2 size={14} /> Resolve Report
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reports;
