import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getEvent, registerForEvent, getRegisteredEvents } from '../services/events';
import CommentSection from '../components/CommentSection';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, Clock, Users, CheckCircle2, Loader2, AlertCircle } from "lucide-react"

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isFull, setIsFull] = useState(false);

  const fetchEvent = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const eventData = await getEvent(id);
      setEvent(eventData);
      setIsFull(eventData.seats_available <= 0);

      const registeredEvents = await getRegisteredEvents();
      if (registeredEvents.some(reg => reg.event.id === parseInt(id))) {
        setIsRegistered(true);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error fetching event details' });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleRegister = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await registerForEvent(id);
      setIsRegistered(true);
      setMessage({ type: 'success', text: 'Successfully registered for the event!' });
      // Optimistically update the seat count
      setEvent(prevEvent => ({
        ...prevEvent,
        seats_available: prevEvent.seats_available - 1,
      }));
      setIsFull(event.seats_available - 1 <= 0);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error registering for event.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !event) { // Show spinner only on initial load
    return <LoadingSpinner />;
  }

  if (message && message.type === 'error' && !event) {
    return <AlertMessage message={message.text} type={message.type} />;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="p-8">
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-6">
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{event.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <img
            src={event.cover_image}
            alt={event.title}
            className="h-full rounded-lg object-cover"
          />

          <Separator className="my-4" />

          <p className="text-lg">{event.description}</p>

          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <span>{new Date(event.event_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>
                {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>
                {event.seats_available} seats available / {event.max_seats} total
              </span>
            </div>
          </div>

          <div className="mt-8">
            {isRegistered ? (
              <Alert className="bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  You are registered for this event.
                </AlertDescription>
              </Alert>
            ) : isFull ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This event is full.
                </AlertDescription>
              </Alert>
            ) : (
              <Button
                onClick={handleRegister}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Register for this event
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <CommentSection eventId={id} />
    </div>
  );
};

export default EventDetails;
