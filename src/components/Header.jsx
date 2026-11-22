import React, { useState, useEffect } from 'react';
import { getRoomRegisteredStudentsCount } from '../data/mockData';

export default function Header({ 
  title = 'ตารางกำหนดการ', 
  appName = 'Smart Class',
  currentRoomId = 'CS-201',
  rooms = [],
  onSelectRoom,
  onOpenNotifications,
  onOpenAuth,
  onOpenAdmin,
  onLogout,
  currentUser,
  reminderCount = 1
}) {
  const currentRoomObj = rooms.find(r => r.id === currentRoomId) || rooms[0];
  const registeredInRoom = getRoomRegisteredStudentsCount(currentRoomId);
  const totalInRoom = (currentRoomObj?.studentCount || 35) + registeredInRoom;

  // Real-time Digital Clock (อัปเดตทุกวินาทีตามเวลาจริง)
  const [clockTime, setClockTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setClockTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(clockTime.getHours()).padStart(2, '0');
  const minutes = String(clockTime.getMinutes()).padStart(2, '0');
  const seconds = String(clockTime.getSeconds()).padStart(2, '0');

  const isLoggedIn = Boolean(currentUser?.isLoggedIn);
  const isAdminLoggedIn = Boolean(isLoggedIn && currentUser?.role === 'admin');

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="header-brand-icon">
          <span className="material-symbols-outlined filled">schedule</span>
        </div>
        <div className="header-title-box">
          <div className="header-brand-subrow">
            <span className="header-app-name">{appName}</span>
            {/* Show Room Selector ONLY if logged in */}
            {isLoggedIn && (
              <div className="room-selector-chip" title={`ห้อง ${currentRoomId} มีสมาชิกทั้งหมด ${totalInRoom} คน`}>
                <span className="material-symbols-outlined room-pin-icon">meeting_room</span>
                <select 
                  className="room-dropdown-select"
                  value={currentRoomId}
                  onChange={(e) => onSelectRoom && onSelectRoom(e.target.value)}
                  aria-label="เลือกห้องเรียน"
                  title="สลับห้องเรียนเพื่อดูตารางของห้องอื่น"
                >
                  {rooms.map((r) => {
                    const reg = getRoomRegisteredStudentsCount(r.id);
                    const tot = (r.studentCount || 35) + reg;
                    return (
                      <option key={r.id} value={r.id}>
                        ห้อง {r.id} ({tot} คน)
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>
          <div className="header-title-with-count">
            <h1 className="header-title">
              {isLoggedIn ? title : 'ระบบตารางเรียนอัจฉริยะ'}
            </h1>
            {isLoggedIn && (
              <span className="header-room-count-badge" title="จำนวนสมาชิกในห้องเรียนนี้">
                <span className="material-symbols-outlined">groups</span>
                <span>{totalInRoom} คน</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="header-actions">
        {/* Real-Time Digital Clock in Top Right */}
        <div className="digital-clock-chip" title="เวลาปัจจุบันตามเวลาจริง (Real-time Clock)">
          <span className="material-symbols-outlined clock-live-dot">timer</span>
          <span className="digital-clock-digits">
            {hours}<span className="clock-colon">:</span>{minutes}<span className="clock-colon-sec">:</span><span className="clock-seconds">{seconds}</span>
          </span>
          <span className="digital-clock-unit">น.</span>
        </div>

        {/* Admin Quick Action Button: SHOW ONLY WHEN LOGGED IN AS ADMIN! */}
        {isAdminLoggedIn && (
          <button 
            className="header-admin-btn"
            onClick={onOpenAdmin}
            title="ส่วนผู้ดูแล (Admin) แก้ไขตารางเรียน & เพิ่มห้อง"
            aria-label="จัดการตารางเรียน (Admin)"
          >
            <span className="material-symbols-outlined">admin_panel_settings</span>
            <span className="admin-btn-label">Admin</span>
          </button>
        )}

        {/* 15-Minute Reminder Notification Bell (Only if Logged In) */}
        {isLoggedIn && (
          <button 
            className="header-icon-btn" 
            aria-label="การแจ้งเตือนเตือนก่อนเรียน 15 นาที" 
            title="การแจ้งเตือนใกล้เวลาเรียน 15 นาที"
            onClick={onOpenNotifications}
          >
            <span className="material-symbols-outlined filled">notifications</span>
            {reminderCount > 0 && <span className="notification-dot"></span>}
          </button>
        )}

        {/* User Profile / Auth Avatar */}
        <div 
          className={`header-avatar ${isLoggedIn ? 'logged-in' : ''} ${currentUser?.role === 'admin' ? 'is-admin' : ''}`}
          title={isLoggedIn ? `${currentUser.fullName} (${currentUser.role === 'admin' ? 'ผู้ดูแล Admin' : 'นักศึกษา'}) - คลิกเพื่อเปลี่ยนรูปหรือจัดการโปรไฟล์` : 'เข้าสู่ระบบ (Login)'}
          onClick={onOpenAuth}
          role="button"
          tabIndex={0}
        >
          {isLoggedIn ? (
            currentUser?.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.fullName} 
                className="header-avatar-img"
              />
            ) : (
              <span>{currentUser.fullName ? currentUser.fullName.substring(0, 2) : 'ผช'}</span>
            )
          ) : (
            <span className="material-symbols-outlined login-avatar-icon">login</span>
          )}
        </div>

        {/* Logout Quick Button if Logged In */}
        {isLoggedIn && (
          <button 
            type="button" 
            className="header-logout-btn"
            onClick={onLogout}
            title="ออกจากระบบ (Logout)"
            aria-label="ออกจากระบบ"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        )}
      </div>
    </header>
  );
}
