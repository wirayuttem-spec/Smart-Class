import React from 'react';
import { 
  getCourseStudentCount, 
  isStudentEnrolledInCourse,
  calculateRealtimeCourseStatus 
} from '../data/mockData';

export default function CourseCard({ 
  course, 
  onCardClick, 
  onToggleReminder,
  onTestNotification,
  currentUser,
  selectedDayId = 'wed'
}) {
  const {
    id,
    startTime,
    endTime,
    courseCode,
    courseName,
    building,
    floor,
    room,
    instructor,
    studentsCount,
    avatarUrl,
    assignment,
    isReminderOn = true,
    isCancelled = false,
    isOnline = false,
  } = course;

  // Real-time dynamic course status calculation!
  const rt = calculateRealtimeCourseStatus(course, selectedDayId);
  const status = rt.status;
  const displayStatus = rt.statusText;
  const progress = rt.progress;
  const timeLeft = rt.timeLeft;
  const accentClass = rt.accentClass;

  const isOngoing = status === 'ongoing';
  const isFinished = status === 'finished';
  const isUpcoming = status === 'upcoming';

  const handleReminderClick = (e) => {
    e.stopPropagation();
    if (onToggleReminder) {
      onToggleReminder(id);
    }
  };

  const courseStudentsTotal = getCourseStudentCount(id, studentsCount || 35);
  const isUserEnrolled = isStudentEnrolledInCourse(id, currentUser?.studentId);

  return (
    <div 
      className={`course-row ${isCancelled ? 'is-cancelled-card' : isFinished ? 'is-finished-solid' : isOngoing ? 'is-ongoing' : 'is-upcoming-glow'}`}
      onClick={() => onCardClick && onCardClick({ ...course, rtStatus: rt, dayId: selectedDayId })}
      role="button"
      tabIndex={0}
      title="คลิกเพื่อดูรายละเอียด ตึก ชั้น ห้องเรียน อาจารย์ จำนวนผู้เรียน และการแจ้งเตือน 15 นาที"
    >
      {/* Time Indicator Line for Ongoing Class */}
      {isOngoing && !isCancelled && (
        <div className="ongoing-indicator-line" aria-hidden="true">
          <div className="indicator-dot"></div>
        </div>
      )}

      {/* Time Column */}
      <div className="course-time-col">
        <span className={`course-start-time ${isOngoing ? 'highlight-blue' : isCancelled ? 'text-cancelled' : isFinished ? 'text-dimmed' : ''}`}>
          {startTime}
        </span>
        <span className="course-end-time">
          {endTime}
        </span>
      </div>

      {/* Card Body */}
      <div className="course-card-body">
        {/* Left vertical accent bar */}
        <div className={`card-accent-bar ${accentClass}`}></div>

        {/* Card Header: Tag & 15-min reminder button */}
        <div className="card-header-row">
          <div className="status-badge-container">
            <span className={`status-tag ${status} ${isCancelled ? 'cancelled-tag' : isOnline ? 'online-tag' : ''}`}>
              {displayStatus}
            </span>
            {courseCode && (
              <span className="course-code-tag">{courseCode}</span>
            )}
          </div>

          <div className="card-header-actions" onClick={(e) => e.stopPropagation()}>
            {/* 15-Minute Reminder Toggle Button (Only if not cancelled) */}
            {!isCancelled && (
              <button
                type="button"
                className={`btn-card-reminder ${isReminderOn ? 'active' : ''}`}
                onClick={handleReminderClick}
                aria-label={isReminderOn ? 'ปิดการแจ้งเตือน 15 นาที' : 'เปิดการแจ้งเตือน 15 นาที'}
                title={isReminderOn ? 'เปิดแจ้งเตือนล่วงหน้า 15 นาทีแล้ว (คลิกเพื่อปิด)' : 'คลิกเพื่อเปิดแจ้งเตือนล่วงหน้า 15 นาที'}
              >
                <span className={`material-symbols-outlined ${isReminderOn ? 'filled' : ''}`}>
                  {isReminderOn ? 'notifications_active' : 'notifications_off'}
                </span>
                <span className="reminder-btn-text">15 นาที</span>
              </button>
            )}

            {isOngoing && !isCancelled && (
              <div className="avatar-stack">
                <img 
                  className="avatar-stack-item" 
                  src={avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"} 
                  alt="Student classmate" 
                />
                <span className="avatar-stack-count">+{courseStudentsTotal}</span>
              </div>
            )}
          </div>
        </div>

        {/* Course Title */}
        <h3 className={`course-title ${isCancelled ? 'title-strikethrough' : ''}`}>
          {courseName}
        </h3>

        {/* Building & Floor & Room info, Instructor info, and Student count in course */}
        <div className="course-info-list">
          <div className="course-info-item">
            <span className="material-symbols-outlined course-info-icon">
              {isOnline ? 'laptop_chromebook' : 'location_on'}
            </span>
            <span className="course-info-text">
              {isOnline ? (
                <strong className="text-online-highlight">เรียนออนไลน์</strong>
              ) : isCancelled ? (
                <strong className="text-cancelled">คลาสถูกยกเลิก (ไม่ต้องเข้าห้องเรียน)</strong>
              ) : (
                <>
                  <strong>{room ? `${room} ` : ''}</strong>
                  {floor ? `(${floor}) ` : ''}
                  {building}
                </>
              )}
            </span>
          </div>

          <div className="course-info-item">
            <span className="material-symbols-outlined course-info-icon">person</span>
            <span className="course-info-text">
              {instructor}
            </span>
          </div>

          {/* Student count in this course */}
          <div className="course-info-item course-students-item">
            <span className="material-symbols-outlined course-info-icon">groups</span>
            <span className="course-info-text">
              ผู้เรียนในรายวิชานี้: <strong className="highlight-count">{courseStudentsTotal} คน</strong>
              {isUserEnrolled && (
                <span className="enrolled-badge-mini" title="คุณได้ลงชื่ออยู่ในรายวิชานี้แล้ว">
                  ✓ คุณลงวิชานี้
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Progress Bar for Ongoing Class */}
        {isOngoing && !isCancelled && (
          <div className="course-progress-wrapper">
            <div className="course-progress-track">
              <div 
                className="course-progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="course-time-left">
              <span>{timeLeft}</span>
            </div>
          </div>
        )}

        {/* Cancellation Notice & Assignment Banner */}
        {isCancelled && assignment && (
          <div className="cancelled-assignment-box">
            <div className="cancelled-assignment-header">
              <span className="material-symbols-outlined">assignment_turned_in</span>
              <span>งานที่มอบหมายแทนการเข้าเรียน:</span>
            </div>
            <p className="cancelled-assignment-text">{assignment}</p>
          </div>
        )}

        {/* Assignment Chip for regular course if present */}
        {!isCancelled && assignment && (
          <div className="assignment-chip">
            <span className="material-symbols-outlined assignment-chip-icon">assignment</span>
            <span>{assignment}</span>
          </div>
        )}

        {/* Bottom card footer hint */}
        <div className="card-click-hint">
          <span>แตะเพื่อดูรายละเอียดและผู้เรียนในวิชานี้</span>
          <span className="material-symbols-outlined hint-arrow">chevron_right</span>
        </div>
      </div>
    </div>
  );
}
