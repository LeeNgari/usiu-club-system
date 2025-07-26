import React, { useState, useEffect } from 'react';
import { getEvent } from '../../services/events';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const EventRegistrations = ({ eventId }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      setMessage(null);
      try {
        const data = await getEvent(eventId);
        setEvent(data);
      } catch (err) {
        setMessage({ type: 'error', text: 'Error fetching event registrations' });
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (message) {
    return <AlertMessage message={message.text} type={message.type} />;
  }

  if (!event || !event.event_registrations) {
    return <div>No registrations found for this event.</div>;
  }

  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Registered Users for {event.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {event.event_registrations.map((registration) => (
              <div
                key={registration.id}
                className="flex items-center justify-between p-3 rounded-md bg-muted/50"
              >
                <div>
                  <span className="font-medium">{registration.user.name}</span>
                  <Badge variant="outline" className="ml-2">
                    {registration.user.email}
                  </Badge>
                </div>
                {/* Add additional actions here if needed */}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventRegistrations;
