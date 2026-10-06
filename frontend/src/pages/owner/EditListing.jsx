import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ListingForm from '../../components/forms/ListingForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { roomService } from '../../services/roomService';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await roomService.getRoomById(id);
        setRoom(data);
      } catch (err) {
        setError(err.message || 'Room not found');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const handleUpdate = async (formData) => {
    setSubmitting(true);
    try {
      await roomService.updateRoom(id, formData);
      navigate('/owner/rooms');
    } catch (err) {
      alert(err.message || 'Failed to update listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading room listing..." />;
  if (error || !room) return <ErrorMessage message={error || 'Room not found'} />;

  return (
    <div>
      <ListingForm
        initialValues={room}
        onSubmit={handleUpdate}
        isSubmitting={submitting}
        isEdit={true}
      />
    </div>
  );
};

export default EditListing;
