import React, { useState, useEffect, useCallback } from 'react';
import { getRegisteredEvents, cancelRegistration } from '../../services/events';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Loader2 } from "lucide-react";

const RegisteredEvents = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchRegisteredEvents = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const data = await getRegisteredEvents();
      setRegistrations(data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error fetching registered events' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegisteredEvents();
  }, [fetchRegisteredEvents]);

  const handleCancelRegistration = async (eventId) => {
    // Find the correct registration id to cancel
    const registration = registrations.find(r => r.event.id === eventId);
    if (!registration) return;

    setLoading(true);
    setMessage(null);
    try {
      await cancelRegistration(eventId);
      // Refetch the list to ensure it's up-to-date
      fetchRegisteredEvents();
      setMessage({ type: 'success', text: 'Registration cancelled successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Error cancelling registration.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && registrations.length === 0) {
    return <LoadingSpinner />;
  }

  if (message && message.type === 'error' && registrations.length === 0) {
    return <AlertMessage message={message.text} type={message.type} />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Registered Events</h2>
      {message && <AlertMessage message={message.text} type={message.type} />}
      {registrations.length === 0 && !loading ? (
        <p>You have not registered for any events yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {registrations.map(({ event }) => (
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
      )}
    </div>
  );
};

export default RegisteredEvents;