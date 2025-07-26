import React, { useState, useEffect } from 'react';
import { getEvents, cancelRegistration } from '../../services/events';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Loader2 } from "lucide-react";


const RegisteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setMessage(null);
      try {
        const allEvents = await getEvents();
        // This is a placeholder. A real implementation would need a proper way to get user's registered events.
        const registeredEvents = allEvents.filter(event => event.registrations.some(reg => reg.user_id === user.id));
        setEvents(registeredEvents);
      } catch (err) {
        setMessage({ type: 'error', text: 'Error fetching registered events' });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user.id]);

  const handleCancelRegistration = async (eventId) => {
    setLoading(true);
    setMessage(null);
    try {
      await cancelRegistration(eventId);
      setEvents(events.filter(event => event.id !== eventId));
      setMessage({ type: 'success', text: 'Registration cancelled successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Error cancelling registration.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (message) {
    return <AlertMessage message={message.text} type={message.type} />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Registered Events</h2>
      <div className="grid grid-cols-1 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {event.description}
              </p>

              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(event.event_date).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {' '}
                  {new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => handleCancelRegistration(event.id)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Cancel Registration'
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RegisteredEvents;