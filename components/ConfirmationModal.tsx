import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmation-modal-title"
        >
          <motion.div 
            className="bg-card-light dark:bg-card-dark w-full max-w-md rounded-xl p-6 shadow-xl m-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="confirmation-modal-title" className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-4">{title}</h2>
            <p className="text-foreground-muted-light dark:text-foreground-muted-dark mb-6">{message}</p>
            <div className="grid grid-cols-2 gap-4">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={onClose} 
                className="w-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-foreground-light dark:text-foreground-dark font-bold py-3 px-4 rounded-xl hover:bg-black/[.05] dark:hover:bg-border-dark transition-colors"
                aria-label={cancelText}
              >
                {cancelText}
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm} 
                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity"
                aria-label={confirmText}
              >
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;