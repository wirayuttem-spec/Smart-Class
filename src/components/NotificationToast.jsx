import React from 'react';

export default function NotificationToast({ notification, onClose }) {
  if (!notification) return null;

  return (
    <aside 
      className="reminder-toast-container" 
      role="alert" 
      aria-live="assertive"
    >
      <div className="reminder-toast-card">
        <div className="reminder-toast-icon-wrap">
          <span className="material-symbols-outlined reminder-toast-bell filled">notifications_active</span>
        </div>
        <div className="reminder-toast-content">
          <div className="reminder-toast-header">
            <span className="reminder-badge-pill">ใกล้ถึงเวลาเรียนใน 15 นาที</span>
            <span className="reminder-time-tag">{notification.time || '15 นาที'}</span>
          </div>
          <h4 className="reminder-course-title">{notification.courseName} ({notification.courseCode})</h4>
          <p className="reminder-location-text">
            <span className="material-symbols-outlined">location_on</span>
            {notification.room} {notification.building} {notification.floor ? `(${notification.floor})` : ''}
          </p>
          <p className="reminder-instructor-text">
            <span className="material-symbols-outlined">person</span>
            ผู้สอน: {notification.instructor}
          </p>
        </div>
        <button 
          className="reminder-close-btn" 
          onClick={onClose} 
          aria-label="ปิดการแจ้งเตือน"
          title="ปิดการแจ้งเตือน"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </aside>
  );
}
