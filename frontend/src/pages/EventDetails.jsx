import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEvent, registerForEvent } from '../services/events';
import CommentSection from '../components/CommentSection';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, Clock, Users, CheckCircle2, Loader2 } from "lucide-react"

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setMessage(null);
      try {
        const data = await getEvent(id);
        setEvent(data);
        // Check if user is registered (placeholder logic)
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user && data.event_registrations && data.event_registrations.some(reg => reg.user_id === user.id)) {
          setIsRegistered(true);
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Error fetching event details' });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await registerForEvent(id);
      setIsRegistered(true);
      setMessage({ type: 'success', text: 'Successfully registered for the event!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Error registering for event.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (message && message.type === 'error') {
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
            className="w-full h-64 rounded-lg object-cover"
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
                {new Date(event.start_time).toLocaleTimeString()} - {new Date(event.end_time).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>Open Spots: {event.registrations_count}</span>
            </div>
          </div>

          <div className="mt-8">
            {isRegistered ? (
              <Alert className="bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  You are registered for this event
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
