import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function APJobListings() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("authToken"); 
      
      if (!token) {
        setError("You must be logged in to view job listings.");
        setLoading(false);
        // navigate("/login"); // Optional: redirect to login
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/jobs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, 
          },
        });

        if (res.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("authToken");
          // navigate("/login");
          return;
        }

        const data = await res.json();
        setJobs(data); 
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load jobs. Server might be down.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [navigate]); 

  if (loading) {
    return <div>Loading job listings...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;
  }
  
  if (jobs.length === 0) {
    return <div>No jobs are currently posted.</div>;
  }

  const formatSalary = (minRate, maxRate, rateType) => {
    return `₱${minRate} - ₱${maxRate} per ${rateType}`;
  };


  return (
    <div>
      <h1>Current Available Job Listings ({jobs.length})</h1>
      <hr />
      <br />
      <div className="search-container">
        <i className="bi bi-search search-icon"></i>
        <input type="text" placeholder="Search for jobs" />
      </div>
      <br />
      <div className="job-container">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="job-card"
            // Click the card to view job info (this is the desired behavior)
            onClick={() => {
              navigate(`/ap-dashboard/job-info/${job._id}`, { state: { job } });
            }}
            style={{ cursor: "pointer" }}
          >
            <div className="suggested-left">
              <div className="icon-box">
                <i className={`bi bi-briefcase-fill`}></i> 
              </div>
              <div className="job-info">
                <h3>{job.title}</h3>
                <p className="job-description">{job.description}</p>
                <p className="job-meta"><strong>Category:</strong> {job.category}</p>
                <p className="job-meta"><strong>Type:</strong> {job.type}</p>
                <p className="job-meta">
                    <strong>Salary:</strong> {formatSalary(job.min_rate, job.max_rate, job.rate_type)}
                </p>
              </div>
            </div>

            <div className="job-actions" onClick={(e) => e.stopPropagation()}>
              <button
                className="apply-btn"
                // ⭐ FIX: Navigate to the job details page when 'Apply' is clicked.
                // This prevents the 404 and ensures the user sees the full job details first.
                onClick={() => {
                    navigate(`/ap-dashboard/job-info/${job._id}`, { state: { job } });
                }}
              >
                Apply
              </button>
              <button
                className="save-btn"
                onClick={() => console.log(`Save: ${job.title}`)}
              >
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default APJobListings;