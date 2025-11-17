import { AlertCircle, X } from 'lucide-react'

interface ErrorNotificationProps {
  message: string
  onClose: () => void
}

export default function ErrorNotification({ message, onClose }: ErrorNotificationProps) {
  return (
    <div className="fixed top-4 right-4 bg-red-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-md z-50">
      <AlertCircle size={24} />
      <p className="flex-1">{message}</p>
      <button onClick={onClose} className="hover:bg-red-600 p-1 rounded">
        <X size={20} />
      </button>
    </div>
  )
}
