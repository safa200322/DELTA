import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Container, Row, Col, Nav, NavItem } from "reactstrap";
import "../../styles/user-profile.css";

const MyReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editStars, setEditStars] = useState(0);
  const [editSentence, setEditSentence] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch('http://localhost:5000/api/reviews/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id, stars, sentence) => {
    setEditingId(id);
    setEditStars(stars);
    setEditSentence(sentence);
  };

  const handleEditSave = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stars: editStars, sentence: editSentence })
      });
      if (response.ok) {
        setEditingId(null);
        fetchReviews();
      } else {
        alert('Failed to update review');
      }
    } catch (error) {
      alert('Error updating review');
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to remove this review?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        fetchReviews();
      } else {
        alert('Failed to delete review');
      }
    } catch (error) {
      alert('Error deleting review');
    }
  };

  if (loading) {
    return <div className="user-profile-page"><div className="sidebar"><h3 className="sidebar-title">User Profile</h3></div><div className="main-content"><Container fluid><Row className="justify-content-center"><Col lg="8"><div className="loading-spinner">Loading your reviews...</div></Col></Row></Container></div></div>;
  }
  if (error) {
    return <div className="user-profile-page"><div className="sidebar"><h3 className="sidebar-title">User Profile</h3></div><div className="main-content"><Container fluid><Row className="justify-content-center"><Col lg="8"><div className="error-message">Error: {error}</div></Col></Row></Container></div></div>;
  }

  return (
    <div className="user-profile-page">
      {/* Sidebar */}
      <div className="sidebar">
        <h3 className="sidebar-title">User Profile</h3>
        <Nav vertical className="sidebar-nav">
          <NavItem>
            <NavLink to="/profile/ProfileOverview" className="nav-link" activeClassName="active"><i className="ri-user-line"></i> Profile Overview</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/profile/MyRentals" className="nav-link" activeClassName="active"><i className="ri-briefcase-line"></i> My Rentals</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/profile/MyPayments" className="nav-link" activeClassName="active"><i className="ri-calendar-line"></i> Payments & Wallet</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/profile/MyReviews" className="nav-link" activeClassName="active"><i className="ri-file-text-line"></i> My Reviews</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/profile/NotificationsProfile" className="nav-link" activeClassName="active"><i className="ri-settings-3-line"></i> Notifications</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/profile/AccountSettings" className="nav-link" activeClassName="active"><i className="ri-notification-3-fill"></i> Account Settings</NavLink>
          </NavItem>
        </Nav>
      </div>
      {/* Main Content */}
      <div className="main-content">
        <Container fluid>
          <Row className="justify-content-center">
            <Col lg="8">
              <div className="review-section">
                <h3 className="section-title">My Reviews</h3>
                {reviews.length === 0 ? (
                  <div className="no-reviews"><p>You have not written any reviews yet.</p></div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.reviewID} className="review-card">
                      <div className="review-details">
                        <h4 className="review-vehicle">{review.VehicleDetails}</h4>
                        {editingId === review.reviewID ? (
                          <>
                            <textarea value={editSentence} onChange={e => setEditSentence(e.target.value)} rows={3} style={{ width: '100%' }} />
                            <div className="review-info">
                              <strong>Rating:</strong>{' '}
                              {[1, 2, 3, 4, 5].map(i => (
                                <i
                                  key={i}
                                  className={i <= editStars ? "ri-star-fill" : "ri-star-line"}
                                  style={{ color: i <= editStars ? "#ffc107" : "#ccc", cursor: 'pointer' }}
                                  onClick={() => setEditStars(i)}
                                ></i>
                              ))}
                            </div>
                            <button className="btn-edit" onClick={() => handleEditSave(review.reviewID)}>Save</button>
                            <button className="btn-remove" onClick={() => setEditingId(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <p className="review-text">{review.Sentence}</p>
                            <p className="review-info">
                              <strong>Rating:</strong>{' '}
                              {Array(review.Stars).fill().map((_, i) => (
                                <i key={i} className="ri-star-fill" style={{ color: "#ffc107" }}></i>
                              ))}
                              {Array(5 - review.Stars).fill().map((_, i) => (
                                <i key={i + review.Stars} className="ri-star-line" style={{ color: "#ccc" }}></i>
                              ))}
                            </p>
                            <p className="review-info"><strong>Date:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
                            <div className="review-actions">
                              <button className="btn-edit" onClick={() => handleEdit(review.reviewID, review.Stars, review.Sentence)}>Edit</button>
                              <button className="btn-remove" onClick={() => handleRemove(review.reviewID)}>Remove</button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default MyReviews;
