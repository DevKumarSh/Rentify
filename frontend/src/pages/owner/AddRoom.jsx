import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingForm from '../../components/forms/ListingForm';
import { roomService } from '../../services/roomService';

const AddRoom = () => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCreateRoom = async (formData) => {
    setSubmitting(true);
    try {
      await roomService.createRoom(formData);
      navigate('/owner/rooms');
    } catch (err) {
      alert(err.message || 'Failed to create room listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <ListingForm onSubmit={handleCreateRoom} isSubmitting={submitting} />
    </div>
  );
};

export default AddRoom;
