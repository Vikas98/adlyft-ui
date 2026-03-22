import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const typeStyles = {
  success: { bar: 'bg-green-500', icon: '✓', bg: 'bg-white border-green-200', text: 'text-green-700', label: 'bg-green-100 text-green-700' },
  error:   { bar: 'bg-red-500',   icon: '✕', bg: 'bg-white border-red-200',   text: 'text-red-700',   label: 'bg-red-100 text-red-700'   },
  warning: { bar: 'bg-yellow-500',icon: '!', bg: 'bg-white border-yellow-200',text: 'text-yellow-700',label: 'bg-yellow-100 text-yellow-700'},
  info:    { bar: 'bg-blue-500',  icon: 'i', bg: 'bg-white border-blue-200',  text: 'text-blue-700',  label: 'bg-blue-100 text-blue-700'  },
};

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function Toast({ toast, onRemove }) {
  const style = typeStyles[toast.type] || typeStyles.info;
  return (
    <div
      className={`pointer-events-auto relative overflow-hidden rounded-xl border shadow-lg ${style.bg} animate-slide-in`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${style.bar} animate-shrink`} />
      <div className="flex items-start gap-3 p-4 pt-5">
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${style.label}`}>
          {style.icon}
        </span>
        <p className="text-sm text-gray-800 flex-1">{toast.message}</p>
        <button
          onClick={() => onRemove(toast.id)}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0 text-lg leading-none"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
