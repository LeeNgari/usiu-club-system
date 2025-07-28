import React, { useState, useEffect } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../services/events';
import EventForm from '../../components/EventForm';
import EventRegistrations from './EventRegistrations';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setMessage(null);
      try {
        const allEvents = await getEvents();
        const clubEvents = allEvents.filter(event => event.club_id === user.club_id);
        setEvents(clubEvents);
      } catch (err) {
        setMessage({ type: 'error', text: 'Error fetching events' });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user.club_id]);

  const handleCreate = () => {
    setSelectedEvent(null);
    setShowForm(true);
    setShowRegistrations(false);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setShowForm(true);
    setShowRegistrations(false);
  };

  const handleDelete = async (eventId) => {
    setLoading(true);
    setMessage(null);
    try {
      await deleteEvent(eventId);
      setEvents(events.filter(event => event.id !== eventId));
      setMessage({ type: 'success', text: 'Event deleted successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Error deleting event.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (eventData) => {
    setLoading(true);
    setMessage(null);
    try {
      if (selectedEvent) {
        const updatedEvent = await updateEvent(selectedEvent.id, eventData);
        setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
        setMessage({ type: 'success', text: 'Event updated successfully!' });
      } else {
        const newEvent = await createEvent({ ...eventData, club_id: user.club_id });
        setEvents([newEvent, ...events]);
        setMessage({ type: 'success', text: 'Event created successfully!' });
      }
      setShowForm(false);
    } catch (err) {
      console.error('Error saving event:', err.response?.data || err);
      const errorMessage = err.response?.data?.message || 'Error saving event.';
      if (err.response?.data?.errors) {
        // If there are specific validation errors, display them
        const errorMessages = Object.values(err.response.data.errors).flat();
        setMessage({ type: 'error', text: errorMessages.join(' ') });
      } else {
        setMessage({ type: 'error', text: errorMessage });
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleViewRegistrations = (event) => {
    setSelectedEvent(event);
    setShowRegistrations(true);
    setShowForm(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (message) {
    return <AlertMessage message={message.text} type={message.type} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Manage Events</h2>
        <button onClick={handleCreate} className="px-4 py-2 text-white bg-usiu-blue rounded-md hover:bg-blue-700">Create Event</button>
      </div>
      {showForm && (
        <div className="mt-6">
          <EventForm event={selectedEvent} onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} adminClubId={user.club_id} />
        </div>
      )}
      {showRegistrations && selectedEvent && (
        <div className="mt-6">
          <EventRegistrations eventId={selectedEvent.id} />
          <button onClick={() => setShowRegistrations(false)} className="px-4 py-2 mt-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-usiuBlue">Back to Events</button>
        </div>
      )}
      {!showForm && !showRegistrations && (
        <div className="grid grid-cols-1 gap-6 mt-6">
          {events.map((event) => (
            <div key={event.id} className="p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{event.description}</p>
              <div className="flex justify-end mt-4 space-x-4">
                <button onClick={() => handleEdit(event)} className="text-sm text-usiuBlue">Edit</button>
                <button onClick={() => handleDelete(event.id)} className="text-sm text-red-600">Delete</button>
                <button onClick={() => handleViewRegistrations(event)} className="text-sm text-usiuBlue">View Registrations</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEvents;