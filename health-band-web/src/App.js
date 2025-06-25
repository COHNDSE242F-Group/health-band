import Topbar from './Topbar'; // your top bar component
import './App.css';
import chatgptImage from './assets/ChatGPTImage.png'; // your image

function App() {
  return (
    <div className="app-container">
      <Topbar />
      <div className="main-content">
        <div className="hero-section">
          <img src={chatgptImage} alt="Health Band" className="hero-image" />
          {/* Dark overlay for darkening */}
          <div className="overlay"></div>
          <div className="hero-text">
            <h1>Health Band</h1>
            <p>Future of health</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
