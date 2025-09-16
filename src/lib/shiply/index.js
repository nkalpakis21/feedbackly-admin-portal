import Shiply from './core/Shiply';
import './styles/main.css';

// Export the main class
export default Shiply;

// Also make it available globally when loaded via script tag
if (typeof window !== 'undefined') {
  window.Shiply = Shiply;
}
