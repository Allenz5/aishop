import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import './Main.css';

function Main() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, {
        id: Date.now(),
        text: newComment,
        replies: []
      }]);
      setNewComment('');
    }
  };

  const handleAddReply = (commentId, parentReplyId = null) => {
    if (replyText.trim()) {
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          if (parentReplyId) {
            // Add reply to a nested reply
            const updateReplies = (replies) => {
              return replies.map(reply => {
                if (reply.id === parentReplyId) {
                  return {
                    ...reply,
                    replies: [...(reply.replies || []), {
                      id: Date.now(),
                      text: replyText
                    }]
                  };
                }
                if (reply.replies) {
                  return {
                    ...reply,
                    replies: updateReplies(reply.replies)
                  };
                }
                return reply;
              });
            };
            return {
              ...comment,
              replies: updateReplies(comment.replies)
            };
          } else {
            // Add reply to main comment
            return {
              ...comment,
              replies: [...comment.replies, {
                id: Date.now(),
                text: replyText,
                replies: []
              }]
            };
          }
        }
        return comment;
      }));
      setReplyText('');
      setReplyTo(null);
    }
  };

  const renderReplies = (replies, commentId, level = 0) => {
    return replies.map(reply => (
      <div key={reply.id} className="reply" style={{ marginLeft: `${level * 20}px` }}>
        <div className="comment-header">
          <div className="comment-text">{reply.text}</div>
          <div className="reply-button-container">
            <button 
              className="reply-button"
              onClick={() => setReplyTo({ commentId, replyId: reply.id })}
            >
              Reply
            </button>
          </div>
        </div>
        
        {replyTo?.commentId === commentId && replyTo?.replyId === reply.id && (
          <div className="reply-input">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
            />
            <button onClick={() => handleAddReply(commentId, reply.id)}>Submit</button>
          </div>
        )}
        
        {reply.replies && renderReplies(reply.replies, commentId, level + 1)}
      </div>
    ));
  };

  return (
    <div className="main-container">
      <NavBar />
      <div className="main-content">
        <div className="main-content-container">
          {/* Left side containers */}
          <div className="left-side">
            <div className="social-media-bar">
              <div className="social-link">
                <img src="/images/youtube-icon.png" alt="YouTube" />
                <span>YouTube</span>
              </div>
              <div className="social-link">
                <img src="/images/twitch-icon.png" alt="Twitch" />
                <span>Twitch</span>
              </div>
              <div className="social-link">
                <img src="/images/instagram-icon.png" alt="Instagram" />
                <span>Instagram</span>
              </div>
            </div>

            <div className="comment-section">
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment">
                    <div className="comment-header">
                      <div className="comment-text">{comment.text}</div>
                      <div className="reply-button-container">
                        <button 
                          className="reply-button"
                          onClick={() => setReplyTo({ commentId: comment.id })}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                    
                    {replyTo?.commentId === comment.id && !replyTo?.replyId && (
                      <div className="reply-input">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                        />
                        <button onClick={() => handleAddReply(comment.id)}>Submit</button>
                      </div>
                    )}

                    <div className="replies">
                      {renderReplies(comment.replies, comment.id)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="comment-input">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                />
                <button onClick={handleAddComment}>Submit</button>
              </div>
            </div>
          </div>

          {/* Center containers */}
          <div className="center-side">
            <div className="place-container">
              {/* Place container content */}
            </div>
            <div className="advertisement-container">
              {/* Advertisement content */}
            </div>
          </div>

          {/* Right side container */}
          <div className="right-side">
            <div className="chat-container">
              {/* Chat content */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
