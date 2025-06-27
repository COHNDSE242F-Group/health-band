import './Topbar.css';
import { FaHome, FaUser, FaEnvelope, FaCog, FaHeartbeat, FaUsers } from 'react-icons/fa';

export default function Topbar() {
  return (
    <div className="topbar">
      {/* Left side: Health Band always visible */}
      <div className="top-label">
       <FaHeartbeat className="icon red-heart" />

        <span className="label">Health Band</span>
      </div>

      {/* Middle menu: icons with label on hover */}
      <ul className="menu-list">
        <li>
          <div className="menu-item">
            <div className="icon"><FaHome /></div>
            <div className="label">Home</div>
          </div>
        </li>
        <li>
          <div className="menu-item">
            <div className="icon"><FaUser /></div>
            <div className="label">Profile</div>
          </div>
        </li>
        <li>
          <div className="menu-item">
            <div className="icon"><FaEnvelope /></div>
            <div className="label">Messages</div>
          </div>
        </li>
        <li>
          <div className="menu-item">
            <div className="icon"><FaCog /></div>
            <div className="label">Settings</div>
          </div>
        </li>
      </ul>

      {/* Right side: Developer Team button */}
<div className="menu-item developer-button">
  <FaUsers className="icon developer " />
  <span className="label">Developer Team</span>
</div>

    </div>
  );
}
