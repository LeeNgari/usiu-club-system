import React, { useState, useEffect } from 'react';
import { getClubs } from '../services/clubs';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const EventForm = ({ event, onSubmit, onCancel, isSuperAdmin = false, adminClubId = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [clubId, setClubId] = useState('');
  const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [errorClubs, setErrorClubs] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const data = await getClubs();
        setClubs(data);
      } catch (err) {
        setErrorClubs('Error fetching clubs');
      } finally {
        setLoadingClubs(false);
      }
    };

    if (isSuperAdmin) {
      fetchClubs();
    } else {
      setLoadingClubs(false);
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setCoverImage(event.cover_image);
      setEventDate(event.event_date);
      setStartTime(event.start_time);
      setEndTime(event.end_time);
      setClubId(event.club_id || '');
    } else if (adminClubId) {
      setClubId(adminClubId);
    }
  }, [event, adminClubId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, cover_image: coverImage, event_date: eventDate, start_time: startTime, end_time: endTime, club_id: clubId });
  };

  if (loadingClubs) {
    return <div>Loading clubs...</div>;
  }

  if (errorClubs) {
    return <div>{errorClubs}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl p-6 shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Event description"
          required
          className="min-h-[120px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">Cover Image URL</Label>
        <Input
          id="coverImage"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="eventDate">Event Date</Label>
          <Input
            id="eventDate"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>

      {(isSuperAdmin || adminClubId) && (
        <div className="space-y-2">
          <Label htmlFor="clubId">Club</Label>
          <Select
            value={clubId}
            onValueChange={setClubId}
            disabled={!isSuperAdmin && adminClubId !== null}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Club" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Select Club</SelectItem>
              {clubs.map(club => (
                <SelectItem key={club.id} value={club.id}>
                  {club.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">
          Save Event
        </Button>
      </div>
    </form>
  );
};

export default EventForm;