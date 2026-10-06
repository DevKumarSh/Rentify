import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '2.5rem',
      marginBottom: '1rem'
    }}>
      <button
        className="btn btn-secondary btn-sm"
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={16} /> Previous
      </button>

      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index)}
          className={`btn btn-sm ${currentPage === index ? 'btn-primary' : 'btn-secondary'}`}
          style={{ minWidth: '36px' }}
        >
          {index + 1}
        </button>
      ))}

      <button
        className="btn btn-secondary btn-sm"
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
