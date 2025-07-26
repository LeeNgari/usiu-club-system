import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const ClubForm = ({ club, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');

  useEffect(() => {
    if (club) {
      setName(club.name);
      setDescription(club.description);
      setProfilePhotoUrl(club.profile_photo_url);
    }
  }, [club]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, profile_photo_url: profilePhotoUrl });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl p-6 shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Enter club name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Enter club description"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profilePhotoUrl">Profile Photo URL</Label>
        <Input
          type="text"
          id="profilePhotoUrl"
          value={profilePhotoUrl}
          onChange={(e) => setProfilePhotoUrl(e.target.value)}
          required
          placeholder="Enter image URL"
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ClubForm;
