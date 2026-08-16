'use client';

import '../Course/course.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000';

export default function LikedCourses({ liked, loading, onUnlike }) {
    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="courses-container">
            <header className="courses-header">
                <h1 className="courses-title-main">Courses you liked</h1>
            </header>

            {liked.length === 0 ? (
                <p className="no-results">You haven't liked any courses yet 🤍</p>
            ) : (
                <div className="courses-grid">
                    {liked.map(course => (
                        <div key={course.id} className="course-card">
                            <div className="course-image-wrapper">
                                <img
                                    src={course.image ? `${API_BASE}/storage/${course.image}` : '/placeholder-course.png'}
                                    alt={course.title}
                                    className="course-image"
                                    loading="lazy"
                                />
                                {course.status && <span className={`status-badge ${course.status}`}>{course.status}</span>}
                            </div>

                            <div className="course-content">
                                <h2 className="course-title">{course.title}</h2>
                                <span className="course-author">Author: {course.author?.name ?? 'Unknown'}</span>
                                <p className="course-description">{course.description}</p>

                                <div className="course-footer">
                                    <span className="course-price">
                                        {parseFloat(course.price) > 0 ? `$${course.price}` : 'Free'}
                                    </span>
                                    <div className="course-actions">
                                        <button
                                            className="like-btn liked"
                                            onClick={e => { e.stopPropagation(); onUnlike(course.id); }}
                                            aria-label="Unlike"
                                        >
                                            <span>❤️</span>
                                            <span>{course.likes_count ?? course.likes?.length ?? 1}</span>
                                        </button>
                                        <button className="course-btn">Details</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}   