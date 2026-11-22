import React from 'react';
import { calculateRealtimeCourseStatus } from '../data/mockData';

export default function TodaySummary({ selectedDayInfo, scheduleItems = [] }) {
  const actualCourses = scheduleItems.filter(item => !item.isLunchBreak);
  const classCount = actualCourses.length;

  const dayId = selectedDayInfo?.id || 'wed';
  const isPast = Boolean(selectedDayInfo?.isPast);
  const isToday = Boolean(selectedDayInfo?.isToday);
  const isFuture = Boolean(selectedDayInfo?.isFuture);

  // Calculate real-time status for each course on this day
  const coursesWithRt = actualCourses.map(item => ({
    ...item,
    rt: calculateRealtimeCourseStatus(item, dayId)
  }));

  const ongoingClass = coursesWithRt.find(item => item.rt.status === 'ongoing' && !item.isCancelled);
  const upcomingClass = coursesWithRt.find(item => (item.rt.status === 'upcoming' || item.rt.status === 'online') && !item.isCancelled);
  const allFinished = classCount > 0 && coursesWithRt.every(item => item.rt.status === 'finished' || item.isCancelled);

  let statusTitle = 'สถานะวัน';
  let statusDetail = 'ไม่มีคาบเรียนที่กำลังดำเนินอยู่';

  if (isPast) {
    statusTitle = 'วันในอดีต (เรียนแล้ว)';
    statusDetail = `วันที่ผ่านมาแล้ว • ทุกวิชาได้รับการบันทึกสถานะว่า "เรียนแล้ว" เรียบร้อย`;
  } else if (isToday) {
    if (ongoingClass) {
      statusTitle = 'สถานะขณะนี้ (Ongoing Class)';
      statusDetail = `${ongoingClass.courseName} • ${ongoingClass.rt.timeLeft}`;
    } else if (upcomingClass) {
      statusTitle = 'วิชาถัดไปวันนี้ (Next Class)';
      statusDetail = `${upcomingClass.courseName} (${upcomingClass.startTime} - ${upcomingClass.endTime} น.) • ${upcomingClass.rt.timeLeft}`;
    } else if (allFinished) {
      statusTitle = 'จบการเรียนการสอนวันนี้แล้ว';
      statusDetail = 'คุณได้เรียนครบทุกวิชาตามตารางของวันนี้แล้ว (เรียนแล้วทั้งหมด)';
    } else {
      statusTitle = 'วันนี้';
      statusDetail = 'ไม่มีคาบเรียนที่กำลังดำเนินอยู่';
    }
  } else if (isFuture) {
    statusTitle = 'วันข้างหน้า (รอเริ่มเรียน)';
    statusDetail = upcomingClass 
      ? `วิชาแรกของวัน: ${upcomingClass.courseName} (${upcomingClass.startTime} น.)`
      : 'ยังไม่ถึงกำหนดวันเรียน';
  }

  return (
    <section className="today-summary-card" aria-label="สรุปตารางเรียนวันนี้">
      <div className="summary-header-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 className="summary-date-text">
            {selectedDayInfo?.fullDate || 'ตารางเรียน'}
          </h2>
          {isToday && (
            <span className="summary-today-chip" style={{
              background: '#2563eb',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px'
            }}>
              วันนี้
            </span>
          )}
          {isPast && (
            <span className="summary-past-chip" style={{
              background: '#94a3b8',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '999px'
            }}>
              ผ่านมาแล้ว
            </span>
          )}
        </div>
        <span className="summary-count-badge">
          {classCount} วิชา
        </span>
      </div>

      <div className="summary-status-box">
        <span className={`summary-pulse-icon ${isPast ? 'past-dot' : ongoingClass ? 'pulse-ongoing' : ''}`}></span>
        <div className="summary-status-content">
          <span className="summary-status-title">
            {statusTitle}
          </span>
          <span className="summary-status-detail">
            {statusDetail}
          </span>
        </div>
      </div>
    </section>
  );
}
