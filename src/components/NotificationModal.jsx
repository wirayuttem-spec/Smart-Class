import React from 'react';

export default function NotificationModal({ 
  onClose, 
  scheduleItems = [], 
  onTestNotification,
  reminderSettings,
  onUpdateSettings 
}) {
  const activeReminders = scheduleItems.filter(item => !item.isLunchBreak && item.isReminderOn);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card notification-center-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top-bar">
          <div className="notif-center-title-box">
            <span className="material-symbols-outlined filled notif-main-icon">notifications_active</span>
            <div>
              <h2 className="modal-course-name">ศูนย์แจ้งเตือนเวลาเรียน</h2>
              <span className="notif-subtext">ระบบแจ้งเตือนอัตโนมัติล่วงหน้า 15 นาที</span>
            </div>
          </div>
          <button 
            className="modal-close-icon-btn" 
            onClick={onClose} 
            aria-label="ปิดหน้าต่าง"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Global 15-min reminder status banner */}
        <div className="reminder-highlight-banner">
          <div className="banner-icon-area">
            <span className="material-symbols-outlined">alarm</span>
          </div>
          <div className="banner-text-area">
            <h4 className="banner-title">ระบบแจ้งเตือนก่อนเรียน 15 นาที พร้อมทำงาน</h4>
            <p className="banner-desc">
              ช่วยให้คุณไม่พลาดทุกคาบเรียน โดยจะแจ้งเตือนข้อมูลตึก ชั้น และห้องเรียนล่วงหน้า 15 นาทีก่อนเริ่มคาบ
            </p>
          </div>
        </div>

        {/* Test Trigger Button */}
        <div className="test-alert-section">
          <button 
            type="button" 
            className="btn-trigger-test"
            onClick={() => {
              const sampleCourse = scheduleItems.find(c => !c.isLunchBreak) || {
                courseCode: 'CS210',
                courseName: 'การเขียนโปรแกรมเชิงวัตถุ',
                building: 'ตึก 5 คณะเทคโนโลยีสารสนเทศ',
                floor: 'ชั้น 7',
                room: 'ห้อง 705',
                instructor: 'ผศ.ดร. นภาพร จิตมั่นคง',
                startTime: '11:00',
              };
              onTestNotification(sampleCourse);
            }}
          >
            <span className="material-symbols-outlined">notifications</span>
            <span>กดทดสอบการแจ้งเตือนทันที (จำลองเมื่อเหลือ 15 นาที)</span>
          </button>
        </div>

        {/* Upcoming Courses with 15-min Reminder */}
        <div className="active-reminder-list-section">
          <h3 className="section-label-bold">
            วิชาที่มีการตั้งค่าแจ้งเตือนในวันนี้ ({activeReminders.length} วิชา)
          </h3>

          {activeReminders.length === 0 ? (
            <div className="empty-notif-box">
              <span className="material-symbols-outlined">notifications_paused</span>
              <p>ไม่มีวิชาที่เปิดแจ้งเตือนในวันนี้</p>
            </div>
          ) : (
            <div className="notif-courses-scroll">
              {activeReminders.map(course => (
                <div key={course.id} className="notif-course-item">
                  <div className="notif-item-time">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#2563eb' }}>timer</span>
                    <span>เริ่ม {course.startTime} น.</span>
                  </div>
                  <div className="notif-item-body">
                    <strong>{course.courseName}</strong> ({course.courseCode})
                    <div className="notif-item-sub">
                      <span>ตึก: {course.building} • {course.floor} • ห้อง: {course.room}</span>
                    </div>
                  </div>
                  <span className="badge-15m">เตือน 15 นาที</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer-actions">
          <button className="btn-modal-primary" onClick={onClose}>
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
}
