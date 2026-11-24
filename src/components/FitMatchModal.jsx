import Modal from './Modal';
import FitMatch from './FitMatch';
export default function FitMatchModal({ onClose, onApply, product }) {
  return <Modal title="FitMatch size finder" onClose={onClose}><FitMatch defaultType={product ? (product.kind === 'footwear' ? 'footwear' : 'clothing') : ''} sizes={product?.sizes} onApply={onApply} /></Modal>;
}
