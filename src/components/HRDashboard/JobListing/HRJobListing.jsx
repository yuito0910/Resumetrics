import React, { useState } from "react";
import "../HRDashboard.css";

function HRJobListings() {
  const [expandedDraftIndex, setExpandedDraftIndex] = useState(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const options = [
    "Software Engineer",
    "Associate Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "UI/UX Designer",
    "Project Manager",
    "QA Tester",
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    const filtered = options.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
  };

  return (
    <div>
      <h1>Job Listings</h1>

      <div className="search-container">
        <i className="bi bi-search search-icon"></i>
        <input
          type="text"
          placeholder="Search for applicant requirements"
          value={query}
          onChange={handleSearchChange}
        />
        {query && suggestions.length > 0 && (
          <ul className="dropdown-list">
            {suggestions.map((item, index) => (
              <li key={index} className="dropdown-item">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      <h2>Drafted Job Listings</h2>
      <hr />
      {[...Array(2)].map((_, i) => {
        const isExpanded = expandedDraftIndex === i;

        return (
          <div key={i}>
            <div
              className="pending-container"
              onClick={() => setExpandedDraftIndex(isExpanded ? null : i)}
              style={{ cursor: "pointer" }}
            >
              <div className="pending-left">
                <div className="icon-box">
                  <i className="bi bi-envelope-arrow-up-fill"></i>
                </div>
                <div className="pending-info">
                  <h3>Associate Software Engineer</h3>
                  <p>Developers/Programmers (Information & Communication Technology)</p>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="draft-details">
                <p><strong>Job Description:</strong> Full-stack development with React and Node.js</p>
                <p><strong>Employement Type:</strong> Full Time</p>
                <p><strong>Start Date:</strong> November 1, 2025 1:30 pm</p>
              </div>
            )}
          </div>
        );
      })}

      <h2>Current Job Listings</h2>
      <hr />
      {[...Array(2)].map((_, i) => (
        <div className="pending-container" key={i}>
          <div className="pending-left">
            <div className="icon-box">
              <i className="bi bi-envelope-arrow-up-fill"></i>
            </div>
            <div className="pending-info">
              <h3>Software Engineer</h3>
              <p>"Software Engineer"</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HRJobListings;
