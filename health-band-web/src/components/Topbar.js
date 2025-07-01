import '../Topbar.css';
import { FaHome, FaUser, FaSignOutAlt, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Navigate to corresponding routes if using React Router
    navigate(`/${tab === 'home' ? '' : tab}`);
  };

  return (
    <div className="topbar">
      {/* Left side: Health Band always visible */}
      <div className="top-label">
        <FaUsers className="icon red-heart" />
        <span className="label">Health Band</span>
      </div>

      {/* Middle menu: icons with label on hover */}
      <ul className="menu-list">
        <li>
          <div 
            className={`menu-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => handleTabChange('home')}
          >
            <div className="icon"><FaHome /></div>
            <div className="label">Home</div>
          </div>
        </li>
        <li>
          <div 
            className={`menu-item ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => handleTabChange('patients')}
          >
            <div className="icon"><FaUsers /></div>
            <div className="label">Patients</div>
          </div>
        </li>
        <li>
          <div 
            className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile')}
          >
            <div className="icon"><FaUser /></div>
            <div className="label">Profile</div>
          </div>
        </li>
        <li>
          <div 
            className="menu-item"
            onClick={() => {
              // Handle logout logic here
              console.log('Logging out...');
              navigate('/login');
            }}
          >
            <div className="icon"><FaSignOutAlt /></div>
            <div className="label">Logout</div>
          </div>
        </li>
      </ul>
    </div>
  );
}