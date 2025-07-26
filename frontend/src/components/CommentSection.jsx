import React, { useState, useEffect } from 'react';
import { getComments, addComment, deleteComment, likeComment } from '../services/comments';
import LoadingSpinner from './LoadingSpinner';
import AlertMessage from './AlertMessage';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Trash2, Loader2 } from "lucide-react"


const CommentSection = ({ eventId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setMessage(null);
      try {
        const data = await getComments(eventId);
        setComments(data);
      } catch (err) {
        setMessage({ type: 'error', text: 'Error fetching comments' });
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [eventId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const newCommentData = await addComment(eventId, { body: newComment });
      setComments([newCommentData, ...comments]);
      setNewComment('');
      setMessage({ type: 'success', text: 'Comment added successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Error adding comment.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setLoading(true);
    setMessage(null);
    try {
      await deleteComment(eventId, commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
      setMessage({ type: 'success', text: 'Comment deleted successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Error deleting comment.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    setLoading(true);
    setMessage(null);
    try {
      await likeComment(commentId);
      setMessage({ type: 'success', text: 'Comment liked/unliked successfully!' });
      // You might want to update the comment's like count here
    } catch (err) {
      setMessage({ type: 'error', text: 'Error liking/unliking comment.' });
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
    <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddComment} className="space-y-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="min-h-[100px]"
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Add Comment
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader className="flex flex-row justify-between items-start space-y-0 p-4">
                  <div>
                    <CardTitle className="text-base">{comment.user.name}</CardTitle>
                  </div>
                  {user && user.id === comment.user_id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
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
                    disabled={loading}
                  >
                    <Heart className="mr-2 h-4 w-4" />
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