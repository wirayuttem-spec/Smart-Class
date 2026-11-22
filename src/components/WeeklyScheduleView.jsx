import React from 'react';
import { calculateRealtimeCourseStatus } from '../data/mockData';

export default function WeeklyScheduleView({ 
  weekDays = [], 
  scheduleByDay = {}, 
  onSelectCourse, 
  onSelectDay 
}) {
  return (
    <section className="weekly-schedule-container" aria-label="ตารางเรียนรายสัปดาห์">
      <div className="weekly-view-header">
        <div>
          <h3 className="weekly-title">ตารางเรียนรายสัปดาห์ (Weekly Timetable)</h3>
          <p className="weekly-subtitle">ภาพรวมตารางการเรียนการสอนทุกวันในสัปดาห์นี้</p>
        </div>
      </div>

      <div className="weekly-days-grid">
        {weekDays.map((day) => {
          const dayItems = scheduleByDay[day.id] || [];
          const actualCourses = dayItems.filter((item) => !item.isLunchBreak);

          return (
            <article key={day.id} className={`weekly-day-column ${day.isToday ? 'is-today-col' : day.isPast ? 'is-past-col' : ''}`}>
              {/* Day Header */}
              <div 
                className={`weekly-day-header ${day.isToday ? 'header-today' : ''}`}
                onClick={() => onSelectDay && onSelectDay(day.id)}
                title="คลิกเพื่อไปที่มุมมองรายวันของวันนี้"
              >
                <div className="weekly-day-title-wrap">
                  <span className="weekly-day-th">วัน{day.dayTh || day.name}</span>
                  <span className={`weekly-day-badge ${day.isToday ? 'badge-today' : ''}`}>{day.date}</span>
                  {day.isToday && <span className="weekly-today-tag">วันนี้</span>}
                  {day.isPast && <span className="weekly-past-tag">ผ่านมาแล้ว</span>}
                </div>
                <span className="weekly-course-count">
                  {actualCourses.length} วิชา
                </span>
              </div>

              {/* Day Courses List */}
              <div className="weekly-course-list">
                {actualCourses.length === 0 ? (
                  <div className="weekly-empty-day">
                    <span>ไม่มีคาบเรียน</span>
                  </div>
                ) : (
                  dayItems.map((item) => {
                    if (item.isLunchBreak) {
                      return (
                        <div key={item.id} className="weekly-lunch-break">
                          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>restaurant</span>
                          <span>พักเที่ยง ({item.startTime} - {item.endTime})</span>
                        </div>
                      );
                    }

                    const rt = calculateRealtimeCourseStatus(item, day.id);
                    const isFinished = rt.status === 'finished';
                    const isOngoing = rt.status === 'ongoing';
                    const isCancelled = item.isCancelled;
                    const isOnline = item.isOnline;

                    return (
                      <div
                        key={item.id}
                        className={`weekly-course-card ${isCancelled ? 'is-cancelled-card' : isFinished ? 'is-finished-solid' : isOngoing ? 'is-ongoing-card' : 'is-upcoming-card'}`}
                        onClick={() => onSelectCourse && onSelectCourse({ ...item, rtStatus: rt, dayId: day.id })}
                        role="button"
                        tabIndex={0}
                        title={`คลิกเพื่อดูรายละเอียดวิชา: ${item.courseName}`}
                      >
                        <div className="weekly-card-time-row">
                          <span className={`weekly-card-time ${isCancelled ? 'text-cancelled' : ''}`}>
                            {item.startTime} - {item.endTime}
                          </span>
                          <span className={`weekly-card-status-pill ${rt.status} ${isCancelled ? 'cancelled-tag' : isOnline ? 'online-tag' : ''}`}>
                            {rt.statusText}
                          </span>
                        </div>

                        <h4 className={`weekly-card-title ${isCancelled ? 'title-strikethrough' : ''}`}>
                          {item.courseName}
                        </h4>
                        <div className="weekly-card-code">{item.courseCode}</div>

                        {isCancelled && item.assignment && (
                          <div className="cancelled-assignment-box" style={{ padding: '6px 8px', margin: '4px 0' }}>
                            <span style={{ fontSize: '11px', color: '#be123c', fontWeight: 'bold' }}>งาน: {item.assignment}</span>
                          </div>
                        )}

                        <div className="weekly-card-footer">
                          <span className="weekly-card-location">
                            <span className="material-symbols-outlined">
                              {isOnline ? 'laptop_chromebook' : 'location_on'}
                            </span>
                            {isOnline ? 'ออนไลน์' : isCancelled ? 'ยกคลาส' : `${item.room || ''} ${item.floor ? `(${item.floor})` : ''}`}
                          </span>
                          {item.isReminderOn && !isCancelled && (
                            <span 
                              className="weekly-reminder-badge" 
                              title="เปิดแจ้งเตือนล่วงหน้า 15 นาทีแล้ว"
                            >
                              <span className="material-symbols-outlined filled">alarm</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
