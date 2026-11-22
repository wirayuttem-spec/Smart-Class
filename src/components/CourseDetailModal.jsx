import React, { useState } from 'react';
import { 
  getCourseStudentCount, 
  isStudentEnrolledInCourse, 
  toggleCourseEnrollment,
  calculateRealtimeCourseStatus 
} from '../data/mockData';

export default function CourseDetailModal({ 
  course, 
  onClose, 
  onToggleReminder, 
  onTestNotification,
  currentUser,
  roomTotalStudents = 38,
  roomName = 'CS-201',
  selectedDayId = 'wed'
}) {
  if (!course) return null;

  const [isEnrolled, setIsEnrolled] = useState(
    isStudentEnrolledInCourse(course.id, currentUser?.studentId)
  );
  const [courseStudentsTotal, setCourseStudentsTotal] = useState(
    getCourseStudentCount(course.id, course.studentsCount || 35)
  );
  const [enrollFeedback, setEnrollFeedback] = useState('');

  const effectiveDay = course.dayId || selectedDayId;
  const rt = calculateRealtimeCourseStatus(course, effectiveDay);
  const isCancelled = course.isCancelled;
  const isOnline = course.isOnline;

  const handleToggleEnrollment = () => {
    if (!currentUser?.isLoggedIn) {
      alert('กรุณาเข้าสู่ระบบก่อนเพื่อลงชื่อหรือเช็คชื่อเข้าเรียนในรายวิชานี้');
      return;
    }

    const res = toggleCourseEnrollment(course.id, currentUser.studentId);
    if (res.success) {
      setIsEnrolled(res.isEnrolled);
      setCourseStudentsTotal(getCourseStudentCount(course.id, course.studentsCount || 35));
      setEnrollFeedback(res.isEnrolled ? '✓ ลงชื่อเข้าเรียนในรายวิชานี้แล้ว' : 'ยกเลิกการลงชื่อในรายวิชานี้แล้ว');
      setTimeout(() => setEnrollFeedback(''), 3000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card course-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header */}
        <div className="modal-top-bar">
          <div className="modal-category-tag">
            <span className={`status-badge-pill ${rt.status} ${isCancelled ? 'cancelled-pill' : isOnline ? 'online-pill' : ''}`}>
              {rt.statusText}
            </span>
            <span className="course-code-badge">{course.courseCode}</span>
          </div>
          <button 
            className="modal-close-icon-btn" 
            onClick={onClose} 
            aria-label="ปิดหน้าต่าง"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Course Header */}
        <div className="modal-course-title-section">
          <h2 className={`modal-course-name ${isCancelled ? 'title-strikethrough' : ''}`}>
            {course.courseName}
          </h2>
          <div className="modal-course-time-row">
            <span className="material-symbols-outlined">schedule</span>
            <span>{course.startTime} - {course.endTime} น. ({rt.timeLeft})</span>
            {course.credits && (
              <span className="credits-badge">หน่วยกิต: {course.credits}</span>
            )}
          </div>
        </div>

        {/* Cancellation Notice Banner (ถ้าอาจารย์ยกคลาส) */}
        {isCancelled && (
          <div className="modal-cancellation-banner">
            <div className="banner-top-title">
              <span className="material-symbols-outlined">event_busy</span>
              <h4>แจ้งยกคลาสโดยอาจารย์ผู้สอน</h4>
            </div>
            <p className="cancellation-desc">
              คาบเรียนนี้ได้รับการแจ้งยกคลาส นักศึกษาไม่ต้องเดินทางมาเข้าห้องเรียนตามเวลาดังกล่าว
            </p>
            {course.assignment && (
              <div className="cancellation-work-box">
                <span className="work-label">
                  <span className="material-symbols-outlined">assignment</span>
                  งานที่มอบหมาย / สิ่งที่ต้องทำ:
                </span>
                <p className="work-content">{course.assignment}</p>
              </div>
            )}
          </div>
        )}

        {/* Online Class Notice Banner (ถ้าเรียนออนไลน์) */}
        {isOnline && (
          <div className="modal-online-banner">
            <div className="banner-top-title">
              <span className="material-symbols-outlined">laptop_chromebook</span>
              <h4>เรียนผ่านระบบออนไลน์ (Online Class)</h4>
            </div>
            <p className="online-desc">
              คาบเรียนนี้จัดการเรียนการสอนแบบออนไลน์ กรุณาตรวจสอบลิงก์ห้องเรียนด้านล่าง
            </p>
            {course.assignment && (
              <div className="online-link-box">
                <span className="work-label">
                  <span className="material-symbols-outlined">link</span>
                  ลิงก์ห้องเรียน / รายละเอียด:
                </span>
                <p className="work-content">{course.assignment}</p>
              </div>
            )}
          </div>
        )}

        {/* Classroom & Course Student Counts Banner (ระบบบอกจำนวนคนในห้องและในวิชา) */}
        <div className="student-stats-card">
          <div className="stats-box">
            <div className="stats-icon-wrap room-icon">
              <span className="material-symbols-outlined">meeting_room</span>
            </div>
            <div className="stats-info">
              <span className="stats-label">จำนวนคนในห้องเรียน ({roomName})</span>
              <strong className="stats-number">{roomTotalStudents} คน</strong>
            </div>
          </div>

          <div className="stats-divider"></div>

          <div className="stats-box">
            <div className="stats-icon-wrap course-icon">
              <span className="material-symbols-outlined">groups</span>
            </div>
            <div className="stats-info">
              <span className="stats-label">ผู้ใช้ที่อยู่ในรายวิชานี้</span>
              <strong className="stats-number">{courseStudentsTotal} คน</strong>
            </div>
          </div>
        </div>

        {/* Enrollment / Check-in Action Bar */}
        <div className="enroll-action-bar">
          <button 
            type="button" 
            className={`btn-enroll-toggle ${isEnrolled ? 'is-enrolled' : ''}`}
            onClick={handleToggleEnrollment}
          >
            <span className="material-symbols-outlined">
              {isEnrolled ? 'how_to_reg' : 'person_add'}
            </span>
            <span>{isEnrolled ? '✓ คุณได้ลงชื่อในรายวิชานี้แล้ว (คลิกเพื่อยกเลิก)' : 'ลงชื่อ / เช็คชื่อเข้าเรียนในวิชานี้'}</span>
          </button>
          {enrollFeedback && (
            <span className="enroll-feedback-text">{enrollFeedback}</span>
          )}
        </div>

        {/* 15-Minute Reminder Action Card (Only if not cancelled) */}
        {!isCancelled && (
          <>
            <div className="reminder-setting-card">
              <div className="reminder-setting-info">
                <div className="reminder-icon-circle">
                  <span className="material-symbols-outlined filled">alarm_on</span>
                </div>
                <div>
                  <p className="reminder-setting-title">แจ้งเตือนก่อนเริ่มเรียน 15 นาที</p>
                  <p className="reminder-setting-desc">
                    {course.isReminderOn 
                      ? 'ระบบจะส่งสัญญาณเตือน 15 นาทีก่อนถึงเวลาคาบเรียน' 
                      : 'ปิดการแจ้งเตือนวิชานี้อยู่'}
                  </p>
                </div>
              </div>

              <div className="reminder-action-group">
                <label className="switch-toggle" aria-label="สวิตช์เปิดปิดการแจ้งเตือน 15 นาที">
                  <input 
                    type="checkbox" 
                    checked={Boolean(course.isReminderOn)} 
                    onChange={() => onToggleReminder && onToggleReminder(course.id)}
                  />
                  <span className="slider-round"></span>
                </label>
              </div>
            </div>

            <div className="quick-test-reminder-row">
              <button 
                type="button" 
                className="btn-test-chime"
                onClick={() => onTestNotification && onTestNotification(course)}
              >
                <span className="material-symbols-outlined">play_circle</span>
                ทดสอบการแจ้งเตือน 15 นาทีของวิชานี้
              </button>
            </div>
          </>
        )}

        {/* Course Location & Instructor Details */}
        <div className="modal-info-grid">
          {/* Building */}
          <div className="info-grid-box">
            <div className="info-box-icon primary">
              <span className="material-symbols-outlined">apartment</span>
            </div>
            <div className="info-box-content">
              <span className="info-box-label">อาคาร / ตึก</span>
              <span className="info-box-value">{course.building || 'ไม่ระบุ'}</span>
            </div>
          </div>

          {/* Floor */}
          <div className="info-grid-box">
            <div className="info-box-icon secondary">
              <span className="material-symbols-outlined">stairs</span>
            </div>
            <div className="info-box-content">
              <span className="info-box-label">ชั้น</span>
              <span className="info-box-value">{course.floor || 'ไม่ระบุ'}</span>
            </div>
          </div>

          {/* Room */}
          <div className="info-grid-box">
            <div className="info-box-icon accent">
              <span className="material-symbols-outlined">meeting_room</span>
            </div>
            <div className="info-box-content">
              <span className="info-box-label">ห้องเรียน</span>
              <span className="info-box-value">{course.room || 'ไม่ระบุ'}</span>
            </div>
          </div>

          {/* Instructor */}
          <div className="info-grid-box full-width">
            <div className="info-box-icon neutral">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div className="info-box-content">
              <span className="info-box-label">อาจารย์ผู้สอน</span>
              <span className="info-box-value bold">{course.instructor || 'ไม่ระบุอาจารย์'}</span>
              {course.instructorEmail && (
                <span className="info-box-sub">
                  <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>mail</span>
                  {course.instructorEmail}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Regular Assignment box if not cancelled and present */}
        {!isCancelled && course.assignment && (
          <div className="modal-assignment-box">
            <div className="modal-assignment-header">
              <span className="material-symbols-outlined">assignment</span>
              <span>งานหรือการบ้านที่ต้องส่ง / กิจกรรม</span>
            </div>
            <p className="modal-assignment-text">{course.assignment}</p>
          </div>
        )}

        {/* Modal Footer */}
        <div className="modal-footer-actions">
          <button className="btn-modal-primary" onClick={onClose}>
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
