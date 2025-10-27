import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection/navigation

export default function ReviewApplicants() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ⭐ 1. Fetch Applications relevant to the HR's posted jobs
    const fetchApplications = async () => {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) {
            setError("Authentication failed. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/applications", {
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
                throw new Error(`Failed to fetch applications: ${res.status}`);
            }

            const data = await res.json();
            setApplications(data);
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Could not load applications. Server error.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [navigate]);


    // ⭐ 2. Handle Approve/Reject API Calls
    const handleStatusUpdate = async (appId, status) => {
        const token = localStorage.getItem("authToken");
        if (!token) return navigate("/hr/login");

        try {
            const res = await fetch(`http://127.0.0.1:8000/applications/${appId}/${status}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`, 
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to ${status} application.`);
            }

            // ⭐ Success: Refresh the list to remove the approved/rejected item
            await fetchApplications(); 

        } catch (err) {
            console.error(`Error updating status to ${status}:`, err);
            alert(`Failed to update status: ${err.message}`);
        }
    };

    const handleApprove = (appId) => handleStatusUpdate(appId, "approve");
    const handleReject = (appId) => handleStatusUpdate(appId, "reject");


    if (loading) {
        return <div style={{ padding: '20px' }}>Loading applicants...</div>;
    }

    if (error) {
        return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
    }

    if (applications.length === 0) {
        return <div style={{ padding: '20px' }}>No pending applications for your posted jobs.</div>;
    }

    // ⭐ 3. Render the fetched data
    return (
        <div style={{ padding: '20px' }}>
            
            <h2>Pending for Approval ({applications.length})</h2>
            <hr />
            {applications.map((app) => (
                <div className="pending-container" key={app._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #ccc', marginBottom: '10px', padding: '15px', borderRadius: '5px' }}>
                    <div className="pending-left" style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="icon-box" style={{ marginRight: '15px' }}>
                            <i className="bi bi-envelope-arrow-up-fill" style={{ fontSize: '24px' }}></i>
                        </div>
                        <div className="pending-info">
                            <h3>Applicant: {app.applicant_email}</h3>
                            <p>Applying for: {app.title}</p>
                            <p>Suitability Score: <span >{app.suitability_score}%</span></p>
                        </div>
                    </div>
                    <div className="pending-btn-group" style={{ display: 'flex', gap: '10px' }}>
                        {/* Approve Button */}
                        <button 
                            className="icon-btn" 
                            onClick={() => handleApprove(app._id)}
                            >
                            <i className="bi bi-check-circle"></i>
                        </button>
                        {/* Reject Button */}
                        <button 
                            className="icon-btn" 
                            onClick={() => handleReject(app._id)}
                            >
                            <i className="bi bi-x-circle"></i>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}