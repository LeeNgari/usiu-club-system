import React, { useState, useEffect } from 'react';
import { getClubs, createClub, updateClub, deleteClub } from '../../services/clubs';
import ClubForm from '../../components/ClubForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

const ManageClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      setMessage(null);
      try {
        const data = await getClubs();
        setClubs(data);
      } catch (err) {
        setMessage({ type: 'error', text: 'Error fetching clubs' });
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const handleCreate = () => {
    setSelectedClub(null);
    setShowForm(true);
  };

  const handleEdit = (club) => {
    setSelectedClub(club);
    setShowForm(true);
  };

  const handleDelete = async (clubId) => {
    setLoading(true);
    setMessage(null);
    try {
      await deleteClub(clubId);
      setClubs(clubs.filter(club => club.id !== clubId));
      setMessage({ type: 'success', text: 'Club deleted successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Error deleting club.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (clubData) => {
    setLoading(true);
    setMessage(null);
    try {
      if (selectedClub) {
        const updatedClub = await updateClub(selectedClub.id, clubData);
        setClubs(clubs.map(club => club.id === updatedClub.id ? updatedClub : club));
        setMessage({ type: 'success', text: 'Club updated successfully!' });
      } else {
        const newClub = await createClub(clubData);
        setClubs([newClub, ...clubs]);
        setMessage({ type: 'success', text: 'Club created successfully!' });
      }
      setShowForm(false);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error saving club.' });
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Manage Clubs</h2>
        <Button onClick={handleCreate} className="bg-usiuBlue hover:bg-blue-700">
          Create Club
        </Button>
      </div>

      {showForm && (
        <div className="mt-6">
          <ClubForm
            club={selectedClub}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {clubs.map((club) => (
          <Card key={club.id}>
            <CardHeader>
              <CardTitle className="text-lg">{club.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{club.description}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(club)}
                className="text-usiuBlue"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(club.id)}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageClubs;