import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

// Helper function to get status styling
const getStatusStyle = (status) => {
    switch (status) {
        case "Approved":
            return { color: '#28a745', icon: 'bi-check-circle-fill' };
        case "Rejected":
            return { color: '#dc3545', icon: 'bi-x-circle-fill' };
        case "Pending":
        default:
            return { color: '#ffc107', icon: 'bi-clock-fill' };
    }
};

function APDashboardHome() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ⭐ Fetch applications submitted by the current user
    const fetchMyApplications = async () => {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) {
            setError("Authentication failed. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/applications/me", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`, 
                    "Content-Type": "application/json",
                },
            });

            if (res.status === 401) {
                localStorage.removeItem("authToken");
                navigate("/login");
                return;
            }

            if (!res.ok) {
                throw new Error(`Failed to fetch applications: ${res.status}`);
            }

            const data = await res.json();
            // Filter to only include applications that have a job_title (i.e., the job wasn't deleted)
            setApplications(data.filter(app => app.job_title !== "Job Deleted/Not Found"));
            
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Could not load application statuses.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyApplications();
        // NOTE: Suggested Job Listings remain static for now, as fetching all jobs might be slow.
    }, [navigate]);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Dashboard</h1>
            <hr/><br></br>
            
            {/* Search container remains the same */}
            <div className="search-container">
                <i className="bi bi-search search-icon"></i>
                <input type="text" placeholder="Search for jobs" />
            </div>
            
            {/* Suggested Job Listings remains static for demonstration */}
            <h2>Suggested Job Listings</h2>
            <div className="suggested-job-container" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {[
                    { title: "Graphic Designer", icon: "bi-palette-fill" },
                    { title: "Software Engineer", icon: "bi-code-square" },
                    { title: "Product Manager", icon: "bi-briefcase-fill" },
                    { title: "UX Researcher", icon: "bi-search" },
                ].map((job, index) => (
                    <div 
                        key={index}
                        className="suggested-job-card"
                        onClick={() => navigate("/ap-dashboard/jobs")} 
                    >
                        <div className="suggested-left">
                            <div className="icon-box">
                                <i className={`bi ${job.icon}`}></i>
                            </div>
                            <h3>{job.title}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <hr/>
            <h2>My Applications ({applications.length})</h2>
            {loading && <p>Loading application statuses...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            
            {!loading && applications.length === 0 && !error && (
                <p>You haven't applied for any jobs yet. <span onClick={() => navigate("/ap-dashboard/jobs")} style={{ color: '#2B2D42', cursor: 'pointer', textDecoration: 'underline' }}>View open jobs.</span></p>
            )}

            <div className="job-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {applications.map((app) => {
                    const status = getStatusStyle(app.application_status);
                    
                    return (
                        <div
                            key={app.application_id}
                            className="job-card"
                            // You might want this to navigate to a status/details page later
                            // onClick={() => console.log(`View Status: ${app.job_title}`)} 
                            style={{ 
                                padding: '15px', 
                                border: `2px solid ${status.color}`, 
                                borderRadius: '8px', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center' 
                            }}
                        >
                            <div className="suggested-left" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div className="icon-box" style={{ fontSize: '24px', color: status.color }}>
                                    <i className={`bi ${status.icon}`}></i>
                                </div>
                                <div className="job-info">
                                    <h3 style={{ margin: 0, fontSize: '18px' }}>{app.job_title}</h3>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                                        Applied on: {new Date(app.date_applied).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: 0, fontWeight: 'bold', color: status.color, fontSize: '16px' }}>
                                    {app.application_status}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default APDashboardHome;