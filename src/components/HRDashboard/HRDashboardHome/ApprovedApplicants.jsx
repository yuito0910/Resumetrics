import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

export default function ApprovedApplicants() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ⭐ Fetch Approved Applications
    const fetchApprovedApplications = async () => {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) {
            // Redirect to login if unauthenticated
            setError("Authentication failed. Please log in.");
            setLoading(false);
            navigate("/hr/login"); 
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/applications/approved", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`, 
                    "Content-Type": "application/json",
                },
            });

            if (res.status === 401) {
                localStorage.removeItem("authToken");
                navigate("/hr/login");
                return;
            }

            if (!res.ok) {
                throw new Error(`Failed to fetch approved applications: ${res.status}`);
            }

            const data = await res.json();
            setApplications(data);
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Could not load approved applications. Server error.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovedApplications();
    }, [navigate]);

    // --- Loading and Error Handling ---
    if (loading) {
        return <div style={{ padding: '20px' }}>Loading approved applicants...</div>;
    }

    if (error) {
        return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
    }

    if (applications.length === 0) {
        return <div style={{ padding: '20px' }}>No applicants have been approved yet.</div>;
    }

    // --- Render Approved Applications ---
    return (
        <div className="approved-applicants-page" style={{ padding: '20px' }}>
            <h3 className="form-title">Approved Applicants ({applications.length})</h3>
            <hr />

            {applications.map((app) => (
                <div 
                    className="pending-container" 
                    key={app._id} 
                >
                    <div className="pending-left" style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="icon-box" style={{ marginRight: '15px' }}>
                            <i className="bi bi-check-circle-fill" style={{ fontSize: '24px' }}></i>
                        </div>
                        <div className="pending-info">
                            <h3>Applicant: {app._id}</h3>
                            <p>Applying for: {app.title}</p>
                            <p>Suitability Score: <span >{app.suitability_score}%</span></p>
                        </div>
                    </div>
                    {/* Optional: Add a button to view the full analyzed resume (not implemented here) */}
                    <button 
                        style={{ 
                            backgroundColor: '#2B2D42', 
                            color: 'white', 
                            border: 'none', 
                            padding: '10px 15px', 
                            borderRadius: '5px', 
                            cursor: 'pointer' 
                        }}
                    >
                        View Details
                    </button>
                </div>
            ))}
        </div>
    );
}