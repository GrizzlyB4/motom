import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
    >
      <div 
        className="bg-card-light dark:bg-card-dark w-full max-w-md rounded-xl p-6 shadow-xl m-4 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirmation-modal-title" className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-4">{title}</h2>
        <p className="text-foreground-muted-light dark:text-foreground-muted-dark mb-6">{message}</p>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={onClose} 
            className="w-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-foreground-light dark:text-foreground-dark font-bold py-3 px-4 rounded-xl hover:bg-black/[.05] dark:hover:bg-border-dark transition-colors"
            aria-label={cancelText}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity"
            aria-label={confirmText}
          >
            {confirmText}
          </button>
        </div>
      </div>
       <style>{`
            @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            .animate-fade-in { animation: fade-in 0.2s ease-out; }
        `}</style>
    </div>
  );
};

export default ConfirmationModal;
