import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Login/Signup Pages
import HRSignUpPage from './components/Login-Signup/HRSignup';
import HRLogInPage from './components/Login-Signup/HRLogin';
import APLogInPage from './components/Login-Signup/ApplicantLogin.jsx';
import APSignUpPage from './components/Login-Signup/ApplicantSignup.jsx'


// HR Dashboard Pages
import HRDashboardLayout from './components/HRDashboard/HRDashboardLayout.jsx';
import HRDashboardHome from './components/HRDashboard/HRDashboardHome/HRDashboardHome.jsx';
import HRWelcome from './components/HRDashboard/HRWelcome.jsx';
import HRJobListings from './components/HRDashboard/JobListing/HRJobListing.jsx';
import HRHelp from './components/HRDashboard/Help/HRHelp.jsx';
import HRAccount from './components/HRDashboard/Account/HRAccount.jsx';
import CreateJobRequestForm from './components/HRDashboard/HRDashboardHome/CreateJobRequestForm.jsx';
import ReviewApplicants from './components/HRDashboard/HRDashboardHome/ReviewApplicants.jsx';
import ApprovedApplicants from './components/HRDashboard/HRDashboardHome/ApprovedApplicants.jsx';
import './App.css';

// APPLICANT Dashboard Pages
import APDashboardLayout from './components/ApplicantDashboard/APDashboardLayout.jsx';
import APDashboardHome from './components/ApplicantDashboard/APDashboardHome/APDashboardHome.jsx';
import APWelcome from './components/ApplicantDashboard/APWelcome.jsx';
import APHelp from './components/ApplicantDashboard/Help/APHelp.jsx';
import APAccount from './components/ApplicantDashboard/Account/APAccount.jsx';
import APJobListings from './components/ApplicantDashboard/JobListing/APJobListing.jsx';
import APJobInfo from './components/ApplicantDashboard/JobListing/APJobInfo.jsx';
import APUpload from './components/ApplicantDashboard/JobListing/APUpload.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to AP login */}
        <Route path="/" element={<Navigate to="/ap/login" replace />} />

        {/* Auth Routes */}
        <Route path="/hr/signup" element={<HRSignUpPage />} />
        <Route path="/hr/login" element={<HRLogInPage />} />
        <Route path="/ap/login" element={<APLogInPage />} />
        <Route path="/ap/signup" element={<APSignUpPage />} />

        {/* HR Dashboard Layout with nested routes */}
        <Route path="/hr-dashboard" element={<HRDashboardLayout />}>
          <Route index element={<HRWelcome />} />
          <Route path="hr-dashboard-home" element={<HRDashboardHome />} />
          <Route path="job-listings" element={<HRJobListings />} />
          <Route path="account" element={<HRAccount />} />
          <Route path="help" element={<HRHelp />} />
          <Route path="createrequest" element={<CreateJobRequestForm />} />
          <Route path="review" element={<ReviewApplicants />} />
          <Route path="approved" element={<ApprovedApplicants />} />
        </Route>
        
        {/*Applicant Dashboard Layout with nested routes */ }
        <Route path="/ap-dashboard" element={<APDashboardLayout />}>
          <Route index element={<APWelcome/>} />
          <Route path="ap-dashboard-home" element={<APDashboardHome />} />
          <Route path="help" element={<APHelp />} />
          <Route path="account" element={<APAccount />} />
          <Route path="job-listings" element={<APJobListings />} />
          
          {/* ⭐ FIX IS HERE: Add the dynamic ':jobId' parameter to the route */}
          <Route path="job-info/:jobId" element={<APJobInfo/>} /> 
          
          {/* Note: If you also want to navigate to upload-resume from the job listing page, 
             the path below is correctly defined for direct navigation from APJobInfo.jsx: */}
          <Route path="upload-resume" element={<APUpload/>} />
        </Route>

        
        {/* Fallback */}
        <Route path="*" element={<h2>404 – Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}