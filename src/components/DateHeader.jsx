import React from 'react';

export default function DateHeader({ 
  weekDays = [], 
  selectedDayId = 'wed', 
  onSelectDay,
  currentMonth = 'กันยายน',
  currentYear = '2026',
  viewMode = 'daily', // 'daily' | 'weekly'
  onViewModeChange
}) {
  return (
    <section className="date-header-section" aria-label="แถบเลือกวันและมุมมองตารางเรียน">
      {/* Month, Year and View Mode Switcher */}
      <div className="month-nav-row">
        <div className="month-year-badge">
          <span className="month-label">{currentMonth}</span>
          <span className="month-sublabel">{currentYear}</span>
        </div>

        {/* View Mode Toggle: Daily vs Weekly */}
        <div className="view-mode-toggle-group" role="group" aria-label="เลือกรูปแบบการแสดงผลตารางเรียน">
          <button 
            type="button"
            className={`view-toggle-btn ${viewMode === 'daily' ? 'active' : ''}`}
            onClick={() => onViewModeChange && onViewModeChange('daily')}
          >
            <span className="material-symbols-outlined">view_day</span>
            <span>รายวัน</span>
          </button>
          <button 
            type="button"
            className={`view-toggle-btn ${viewMode === 'weekly' ? 'active' : ''}`}
            onClick={() => onViewModeChange && onViewModeChange('weekly')}
          >
            <span className="material-symbols-outlined">calendar_view_week</span>
            <span>รายสัปดาห์</span>
          </button>
        </div>
      </div>

      {/* Week Day Pills Carousel (Shown primarily in daily mode or as quick jumpers) */}
      <div className="week-carousel hide-scrollbar" role="tablist" aria-label="เลือกวันในสัปดาห์">
        {weekDays.map((day) => {
          const isActive = day.id === selectedDayId;
          const isToday = Boolean(day.isToday);
          const isPast = Boolean(day.isPast);

          return (
            <button
              key={day.id}
              role="tab"
              aria-selected={isActive}
              className={`day-pill-btn ${isActive ? 'active' : ''} ${isToday ? 'is-today-pill' : ''} ${isPast ? 'is-past-pill' : ''}`}
              onClick={() => onSelectDay(day.id)}
              title={`${day.fullDate || ''}${isToday ? ' (วันนี้)' : isPast ? ' (ผ่านมาแล้ว)' : ''}`}
            >
              {isToday && <span className="today-pill-tag">วันนี้</span>}
              <span className="day-name">{day.dayTh || day.name}</span>
              <span className="day-number">{day.date}</span>
              {day.hasIndicator && <span className="day-indicator-dot" title="มีงานที่ต้องส่ง"></span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
