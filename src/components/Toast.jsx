import { useStore } from '../context/StoreContext';
import './Toast.css';
export default function Toast() {
  const { toast } = useStore();
  return <div className={`toast ${toast ? 'show' : ''}`} role="status" aria-live="polite">{toast}</div>;
}
