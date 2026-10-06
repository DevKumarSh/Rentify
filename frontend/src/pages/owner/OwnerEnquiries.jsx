import React, { useState, useEffect } from 'react';
import { enquiryService } from '../../services/enquiryService';
import EnquiryCard from '../../components/enquiry/EnquiryCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { MessageSquare } from 'lucide-react';

const OwnerEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await enquiryService.getOwnerEnquiries();
      setEnquiries(res.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleRespond = async (enquiryId, responseText) => {
    await enquiryService.respondToEnquiry(enquiryId, responseText);
    fetchEnquiries();
  };

  const filteredEnquiries = enquiries.filter((enq) => {
    if (statusFilter === 'ALL') return true;
    return enq.status === statusFilter;
  });

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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Tenant Enquiries Inbox</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Answer questions and schedule inspections with prospective tenants.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn btn-sm ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter('ALL')}
          >
            All ({enquiries.length})
          </button>
          <button
            className={`btn btn-sm ${statusFilter === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter('PENDING')}
          >
            Needs Response
          </button>
          <button
            className={`btn btn-sm ${statusFilter === 'RESPONDED' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter('RESPONDED')}
          >
            Responded
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching tenant enquiries..." />
      ) : filteredEnquiries.length > 0 ? (
        <div>
          {filteredEnquiries.map((enquiry) => (
            <EnquiryCard
              key={enquiry.id}
              enquiry={enquiry}
              isOwnerView={true}
              onRespond={handleRespond}
            />
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center' }}>
          <MessageSquare size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No enquiries found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            When prospective renters enquire about your listings, they will show up here.
          </p>
        </div>
      )}
    </div>
  );
};

export default OwnerEnquiries;
