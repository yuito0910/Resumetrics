import React from "react";

function APHelp() {
  return (
    <div>
      <h1>Help / FAQs</h1>
      <hr />
      <h3>What you should know</h3>
      <p>
        Resumetrics is an AI-driven resume evaluation system that helps recruiters screen job applications faster, fairer, and with less bias.
      </p>

      <h4>Core Features:</h4>
      <ul>
        <li>Automated parsing of resumes (skills, work experience, education).</li>
        <li>Anonymization removes personal data such as name, age, gender, and address to reduce bias.</li>
        <li>Intelligent matching against job requirements.</li>
        <li>Generates a feedback report showing the candidate's suitability for the applied job.</li>
      </ul>

      <h4>Why it matters:</h4>
      <ul>
        <li>Saves recruiters time.</li>
        <li>Ensures fairer evaluations.</li>
        <li>Promotes diversity and inclusivity.</li>
        <li>Helps applicants be assessed mainly on qualifications, not on personal details.</li>
      </ul>

      <hr />
      <h3>Frequently Asked Questions (FAQs)</h3>

      <h4>For Recruiters</h4>
      <ul>
        <li><strong>Q:</strong> How does Resumetrics reduce bias?</li>
        <li><strong>A:</strong> It anonymizes personal identifiers (name, gender, photo, age, address) so that evaluation focuses on qualifications and skills.</li>
        <li><strong>Q:</strong> Will it replace recruiters?</li>
        <li><strong>A:</strong> No. Resumetrics assists only by automating repetitive screening tasks. Final hiring decisions remain with human recruiters for fairness and oversight.</li>
        <li><strong>Q:</strong> How accurate is the system?</li>
        <li><strong>A:</strong> Benchmark studies show AI models can process up to 1,200 resumes/hour with over 80% accuracy in skill matching, outperforming manual review.</li>
      </ul>

      <h4>For Applicants</h4>
      <ul>
        <li><strong>Q:</strong> Does the system change my resume content?</li>
        <li><strong>A:</strong> No. Resumetrics only extracts relevant information and hides personal identifiers. Your qualifications remain unchanged.</li>
        <li><strong>Q:</strong> Is my personal data safe?</li>
        <li><strong>A:</strong> Yes. Personal details are anonymized during screening and stored securely to comply with data privacy standards.</li>
        <li><strong>Q:</strong> Does anonymization mean recruiters won't know who I am?</li>
        <li><strong>A:</strong> Only during initial screening. Once shortlisted, recruiters can access full applicant details.</li>
      </ul>
    </div>
  );
}

export default APHelp;