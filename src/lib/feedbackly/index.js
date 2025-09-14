import Feedbackly from './core/Feedbackly';
import './styles/main.css';

// Export the main class
export default Feedbackly;

// Also make it available globally when loaded via script tag
if (typeof window !== 'undefined') {
  window.Feedbackly = Feedbackly;
}
