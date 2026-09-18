'use client';

import { mediaUrl } from '../../lib/api';
import '../Course/course.css';

export default function LikedCourses({ liked, loading, onUnlike }) {
    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="courses-container">
            <header className="courses-header">
                <h1 className="courses-title-main">Liked Courses</h1>
            </header>

            {liked.length === 0 ? (
                <p className="no-results">No liked courses yet</p>
            ) : (
                <div className="courses-grid">
                    {liked.map(course => (
                        <div key={course.id} className="course-card">
                            <div className="course-image-wrapper">
                                <img
                                    src={mediaUrl(course.image)}
                                    alt={course.title}
                                    className="course-image"
                                    loading="lazy"
                                />
                            </div>
                            <div className="course-content">
                                <h2 className="course-title">{course.title}</h2>
                                <span className="course-author">Author: {course.author?.name ?? 'Unknown'}</span>
                                <p className="course-description">{course.description}</p>
                                <div className="course-footer">
                                    <span className="course-price">
                                        {parseFloat(course.price) > 0 ? `$${course.price}` : 'Free'}
                                    </span>
                                    <button className="like-btn liked" onClick={() => onUnlike(course.id)}>
                                        <span>❤️</span>
                                        <span>{course.likes_count ?? 0}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
