import React, { useState, useEffect } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../services/events';
import EventForm from '../../components/EventForm';
import { getClubs } from '../../services/clubs';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ManageAllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [errorClubs, setErrorClubs] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setMessage(null);
      try {
        const [eventsData, clubsData] = await Promise.all([
          getEvents(),
          getClubs()
        ]);
        setEvents(eventsData);
        setClubs(clubsData);
      } catch (err) {
        setMessage({ type: 'error', text: 'Error fetching data' });
      } finally {
        setLoading(false);
        setLoadingClubs(false);
      }
    };

    fetchData();
  }, []);

  const handleCreate = () => {
    setSelectedEvent(null);
    setShowForm(true);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setShowForm(true);
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
        const newEvent = await createEvent(eventData);
        setEvents([newEvent, ...events]);
        setMessage({ type: 'success', text: 'Event created successfully!' });
      }
      setShowForm(false);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error saving event.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading || loadingClubs) {
    return <LoadingSpinner />;
  }

  if (message) {
    return <AlertMessage message={message.text} type={message.type} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Manage All Events</h2>
        <Button onClick={handleCreate} className="bg-usiu-blue hover:bg-blue-700">
          Create Event
        </Button>
      </div>

      {showForm && (
        <div className="mt-6">
          <EventForm
            event={selectedEvent}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
            isSuperAdmin={true}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {events.map((event) => {
          const clubName = clubs.find(club => club.id === event.club_id)?.name;
          return (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {event.description}
                </p>
                {clubName && (
                  <Badge variant="secondary" className="mt-2">
                    {clubName}
                  </Badge>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(event)}
                  className="text-usiuBlue"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(event.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ManageAllEvents;
