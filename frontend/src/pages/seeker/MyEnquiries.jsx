import React, { useState, useEffect } from 'react';
import { enquiryService } from '../../services/enquiryService';
import EnquiryCard from '../../components/enquiry/EnquiryCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { MessageSquare, Clock, CheckCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchEnquiries = async () => {
      setLoading(true);
      try {
        const res = await enquiryService.getSeekerEnquiries();
        setEnquiries(res.content || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Property Enquiries</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Check owner answers, scheduled visits, and communication threads.
          </p>
        </div>

        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn btn-sm ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter('ALL')}
          >
            All ({enquiries.length})
          </button>
          <button
            className={`btn btn-sm ${statusFilter === 'RESPONDED' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter('RESPONDED')}
          >
            Responded
          </button>
          <button
            className={`btn btn-sm ${statusFilter === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter('PENDING')}
          >
            Pending
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching your enquiries..." />
      ) : filteredEnquiries.length > 0 ? (
        <div>
          {filteredEnquiries.map((enquiry) => (
            <EnquiryCard key={enquiry.id} enquiry={enquiry} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center' }}>
          <MessageSquare size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No enquiries found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            When you see a room you like, click "Send Enquiry" to contact the landlord.
          </p>
          <Link to="/rooms" className="btn btn-primary">
            <Search size={16} /> Explore Rooms Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyEnquiries;
