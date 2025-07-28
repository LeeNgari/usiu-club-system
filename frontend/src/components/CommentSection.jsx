import React, { useState, useEffect, useCallback } from 'react';
import { getComments, addComment, deleteComment, likeComment } from '../services/comments';
import LoadingSpinner from './LoadingSpinner';
import AlertMessage from './AlertMessage';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Trash2, Loader2 } from "lucide-react";

const CommentSection = ({ eventId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const user = JSON.parse(sessionStorage.getItem('user'));

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getComments(eventId);
      setComments(data);
    } catch (err) {
    
      setMessage({ type: 'error', text: 'Could not refresh comments.' });
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    setMessage(null);
    try {
      await addComment(eventId, { body: newComment });
      setNewComment('');
      await fetchComments(); 
    } catch (err) {
      setMessage({ type: 'error', text: 'Error adding comment.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    // Optimistically remove the comment for better UX
    const originalComments = comments;
    setComments(comments.filter((comment) => comment.id !== commentId));
    try {
      await deleteComment(eventId, commentId);
      // No refetch needed if optimistic update is sufficient
    } catch (err) {
      // Revert if the delete fails
      setComments(originalComments);
      setMessage({ type: 'error', text: 'Error deleting comment.' });
    }
  };

  const handleLikeComment = async (commentId) => {
    // Optimistic update for likes
    const originalComments = [...comments];
    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        const userLike = c.likes.find(like => like.user_id === user.id);
        if (userLike) {
          // Unlike
          return { ...c, likes: c.likes.filter(like => like.user_id !== user.id) };
        } else {
          // Like
          return { ...c, likes: [...c.likes, { user_id: user.id }] };
        }
      }
      return c;
    });
    setComments(updatedComments);

    try {
      await likeComment(commentId);
    
    } catch (err) {
      setComments(originalComments); 
      setMessage({ type: 'error', text: 'Error updating like.' });
    }
  };

  if (loading && comments.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Comments</CardTitle>
        </CardHeader>
        <CardContent>
          {message && <AlertMessage message={message.text} type={message.type} />}
          <form onSubmit={handleAddComment} className="space-y-4 my-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Add Comment
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                  <div className="flex items-center">
                    <img
                      src={comment.user.profile_photo_url}
                      alt={comment.user.name}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <CardTitle className="text-base">{comment.user.name}</CardTitle>
                  </div>
                  {user && user.id === comment.user_id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p>{comment.body}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-destructive"
                    onClick={() => handleLikeComment(comment.id)}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${comment.likes.some(l => l.user_id === user.id) ? 'fill-current' : ''}`} />
                    {comment.likes.length}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentSection;