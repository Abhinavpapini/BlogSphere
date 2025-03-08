"use client"

import { useState, useEffect } from "react"
import Toast from "./Toast"

const ToastContainer = () => {
  const [toasts, setToasts] = useState([])

  // Listen for custom toast events
  useEffect(() => {
    const handleToast = (event) => {
      const { message, type, duration } = event.detail
      addToast(message, type, duration)
    }

    window.addEventListener("toast", handleToast)

    return () => {
      window.removeEventListener("toast", handleToast)
    }
  }, [])

  const addToast = (message, type = "info", duration = 3000) => {
    const id = Date.now()
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }])
  }

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

// Helper function to show toasts from anywhere in the app
export const showToast = (message, type = "info", duration = 3000) => {
  window.dispatchEvent(
    new CustomEvent("toast", {
      detail: { message, type, duration },
    }),
  )
}

export default ToastContainer

