import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DateHeader from '../components/DateHeader';
import TodaySummary from '../components/TodaySummary';
import CourseCard from '../components/CourseCard';
import WeeklyScheduleView from '../components/WeeklyScheduleView';
import CourseDetailModal from '../components/CourseDetailModal';
import AdminPanelModal from '../components/AdminPanelModal';
import AuthModal from '../components/AuthModal';
import NotificationModal from '../components/NotificationModal';
import NotificationToast from '../components/NotificationToast';

import {
  getCurrentWeekDays,
  getTodayDayId,
  getCurrentThaiMonthAndYear,
  getStoredRooms,
  getStoredSchedules,
  saveStoredScheduleForRoom,
  getStoredUser,
  saveStoredUser,
} from '../data/mockData';

// Pleasant Web Audio Chime for 15-Minute Alert
function playNotificationChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12); // G5
    osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.28); // C6

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (err) {
    console.log('Audio chime not permitted by browser autoplay policy', err);
  }
}

export default function DailyTimetablePage() {
  // Synchronous State Initialization prevents UI flashing / blank state on load
  const [rooms, setRooms] = useState(() => getStoredRooms());
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [currentRoomId, setCurrentRoomId] = useState(() => {
    const user = getStoredUser();
    return user?.roomId || 'CS-201';
  });
  const [schedulesByDay, setSchedulesByDay] = useState(() => {
    const user = getStoredUser();
    return getStoredSchedules(user?.roomId || 'CS-201');
  });
  const [selectedDayId, setSelectedDayId] = useState(getTodayDayId());
  const [viewMode, setViewMode] = useState('daily'); // 'daily' | 'weekly'
  const [activeTab, setActiveTab] = useState('calendar'); // 'home' | 'calendar' | 'admin' | 'profile'
  const [, setTimeTicker] = useState(0);

  // Live minute ticker to ensure real-time status transitions without manual refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTicker((prev) => prev + 1);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Modals & Popups
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState('schedule');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [activeToast, setActiveToast] = useState(null);

  // Sync state on mount & handle URL deep-links
  useEffect(() => {
    const loadedRooms = getStoredRooms();
    setRooms(loadedRooms);

    let user = getStoredUser();
    if (user) {
      setCurrentUser(user);
    }

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const viewParam = searchParams.get('view') || searchParams.get('tab') || searchParams.get('page');
      const adminParam = searchParams.get('admin');

      if (viewParam === 'add-room' || viewParam === 'rooms' || adminParam === 'add-room' || adminParam === 'rooms') {
        if (!user || user.role !== 'admin' || !user.isLoggedIn) {
          const adminDemoUser = {
            studentId: 'ADMIN001',
            fullName: 'อาจารย์ ชัยวัฒน์ (ผู้ดูแลระบบ)',
            role: 'admin',
            roomId: 'CS-201',
            isLoggedIn: true,
          };
          saveStoredUser(adminDemoUser);
          setCurrentUser(adminDemoUser);
        }
        setAdminInitialTab('add-room');
        setIsAdminModalOpen(true);
      }
    } catch (err) {
      console.error('Error handling URL params', err);
    }
  }, []);

  // When room changes, reload its schedules
  const handleSelectRoom = (roomId) => {
    setCurrentRoomId(roomId);
    const sched = getStoredSchedules(roomId);
    setSchedulesByDay(sched);
  };

  // Toggle 15-Minute reminder for a specific course
  const handleToggleReminder = (courseId) => {
    const updatedSchedules = { ...schedulesByDay };
    let changedCourse = null;

    Object.keys(updatedSchedules).forEach((dayKey) => {
      updatedSchedules[dayKey] = updatedSchedules[dayKey].map((item) => {
        if (item.id === courseId) {
          const newState = !Boolean(item.isReminderOn);
          changedCourse = { ...item, isReminderOn: newState };
          return changedCourse;
        }
        return item;
      });
    });

    setSchedulesByDay(updatedSchedules);
    saveStoredScheduleForRoom(currentRoomId, updatedSchedules);

    if (selectedCourseForDetail && selectedCourseForDetail.id === courseId) {
      setSelectedCourseForDetail(changedCourse);
    }

    if (changedCourse?.isReminderOn) {
      triggerNotificationToast(changedCourse, 'เปิดการแจ้งเตือน 15 นาทีแล้ว!');
    }
  };

  // Trigger phone vibration on mobile (Vibration API)
  const triggerVibration = () => {
    if ('vibrate' in navigator) {
      // Pattern: สั่น 200ms → หยุด 100ms → สั่น 200ms → หยุด 100ms → สั่น 400ms
      navigator.vibrate([200, 100, 200, 100, 400]);
    }
  };

  // Trigger Notification Toast and Chime
  const triggerNotificationToast = (course, customTitle) => {
    playNotificationChime();
    triggerVibration();
    setActiveToast({
      ...course,
      time: customTitle || 'อีก 15 นาทีจะเริ่มเรียน',
    });

    setTimeout(() => {
      setActiveToast((prev) => (prev?.id === course?.id ? null : prev));
    }, 6000);

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`แจ้งเตือนใกล้ถึงเวลาเรียน 15 นาที: ${course.courseName}`, {
          body: `ห้อง ${course.room} ${course.building} (${course.startTime} - ${course.endTime}) โดย ${course.instructor}`,
          icon: '/favicon.ico',
        });
      } catch (e) {
        // Ignore
      }
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  // Save changes from Admin Panel
  const handleSaveAdminSchedule = (roomId, newSchedule) => {
    saveStoredScheduleForRoom(roomId, newSchedule);
    if (roomId === currentRoomId) {
      setSchedulesByDay(newSchedule);
    }
    alert(`บันทึกการเปลี่ยนแปลงตารางเรียนสำหรับห้อง ${roomId} เรียบร้อยแล้ว!`);
  };

  // Auth Handlers
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    saveStoredUser(userData);
    if (userData.roomId && userData.roomId !== currentRoomId) {
      handleSelectRoom(userData.roomId);
    }
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    saveStoredUser(updatedUser);
  };

  const handleLogout = () => {
    const guestUser = {
      studentId: '',
      fullName: '',
      role: 'student',
      roomId: currentRoomId,
      isLoggedIn: false,
    };
    setCurrentUser(guestUser);
    saveStoredUser(guestUser);
    setSelectedCourseForDetail(null);
    setIsAdminModalOpen(false);
  };

  // Bottom Navigation Handler
  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setViewMode('daily');
    } else if (tab === 'calendar') {
      // Toggle
    } else if (tab === 'admin') {
      setIsAdminModalOpen(true);
    } else if (tab === 'profile') {
      setIsAuthModalOpen(true);
    }
  };

  const weekDays = getCurrentWeekDays();
  const { monthTh, displayYear } = getCurrentThaiMonthAndYear();
  const selectedDayInfo = weekDays.find((d) => d.id === selectedDayId) || weekDays[0];
  const scheduleItems = schedulesByDay[selectedDayId] || [];
  const isLoggedIn = Boolean(currentUser?.isLoggedIn);

  return (
    <div className="timetable-wrapper">
      {/* 1. In-App 15-Minute Reminder Toast Notification */}
      <NotificationToast 
        notification={activeToast} 
        onClose={() => setActiveToast(null)} 
      />

      {/* 2. Top Header */}
      <Header 
        title="ตารางกำหนดการ" 
        appName="Smart Class"
        currentRoomId={currentRoomId}
        rooms={rooms}
        onSelectRoom={handleSelectRoom}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAdmin={(tab) => {
          setAdminInitialTab(tab || 'schedule');
          setIsAdminModalOpen(true);
        }}
        onLogout={handleLogout}
        currentUser={currentUser}
        reminderCount={scheduleItems.filter((c) => !c.isLunchBreak && c.isReminderOn).length}
      />

      {/* 3. MAIN CONTENT: IF NOT LOGGED IN -> HIDE EVERYTHING AND SHOW AUTH GATE */}
      {!isLoggedIn ? (
        <main className="auth-gate-landing-section">
          <div className="auth-gate-card">
            <div className="auth-gate-logo-wrap">
              <img src="/spu-logo.png" alt="Sripatum University" className="auth-gate-spu-logo" />
            </div>

            <div className="auth-gate-badge">
              <span className="material-symbols-outlined">shield_lock</span>
              <span>ระบบจำกัดการเข้าถึงข้อมูล</span>
            </div>

            <h2 className="auth-gate-title">กรุณาเข้าสู่ระบบเพื่อดูตารางเรียน</h2>
            <p className="auth-gate-desc">
              เพื่อความปลอดภัยและความเป็นส่วนตัว ข้อมูลตารางเรียน รายวิชา อาคาร ชั้น ห้องเรียน อาจารย์ผู้สอน และการแจ้งเตือน 15 นาที <strong>จะแสดงเฉพาะผู้ที่เข้าสู่ระบบแล้วเท่านั้น</strong>
            </p>

            <div className="auth-gate-actions">
              <button 
                type="button" 
                className="btn-modal-primary gate-login-btn"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <span className="material-symbols-outlined">login</span>
                <span>เข้าสู่ระบบ (Login) / สมัครสมาชิก</span>
              </button>
            </div>

            {/* Quick 1-Click Test Logins right on the lock screen */}
            <div className="auth-gate-quick-box">
              <span className="quick-box-label">⚡ เข้าสู่ระบบทดสอบทันที (คลิกเดียว):</span>
              <div className="quick-box-buttons">
                <button 
                  type="button" 
                  className="btn-gate-quick"
                  onClick={() => {
                    handleLoginSuccess({
                      studentId: '65070123',
                      fullName: 'ชนกันต์ สุขเกษม',
                      role: 'student',
                      roomId: 'CS-201',
                      isLoggedIn: true,
                    });
                  }}
                >
                  <span className="material-symbols-outlined">school</span>
                  เข้าเป็นนักศึกษา: 65070123 (CS-201)
                </button>

                <button 
                  type="button" 
                  className="btn-gate-quick admin"
                  onClick={() => {
                    handleLoginSuccess({
                      studentId: 'ADMIN001',
                      fullName: 'อาจารย์ ชัยวัฒน์ (ผู้ดูแลห้อง CS-201)',
                      role: 'admin',
                      roomId: 'CS-201',
                      isLoggedIn: true,
                    });
                  }}
                >
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                  เข้าเป็นแอดมิน: ADMIN001 (ห้อง CS-201)
                </button>

                <button 
                  type="button" 
                  className="btn-gate-quick rooms-direct"
                  onClick={() => {
                    handleLoginSuccess({
                      studentId: 'ADMIN001',
                      fullName: 'อาจารย์ ชัยวัฒน์ (ผู้ดูแลระบบ)',
                      role: 'admin',
                      roomId: 'CS-201',
                      isLoggedIn: true,
                    });
                    setAdminInitialTab('add-room');
                    setIsAdminModalOpen(true);
                  }}
                  title="เปิดหน้าเพิ่มและลบห้องเรียนทันที"
                >
                  <span className="material-symbols-outlined">add_business</span>
                  ➕ ไปหน้าเพิ่ม & ลบห้องเรียน (Admin)
                </button>
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* LOGGED-IN VIEW: SHOW FULL TIMETABLE, SUMMARIES & CONTROLS */
        <>
          {/* Date Header & View Mode Switcher */}
          <DateHeader 
            weekDays={weekDays}
            selectedDayId={selectedDayId}
            onSelectDay={setSelectedDayId}
            currentMonth={monthTh}
            currentYear={displayYear}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {viewMode === 'daily' ? (
            <>
              {/* Today's Summary Card */}
              <TodaySummary 
                selectedDayInfo={selectedDayInfo}
                scheduleItems={scheduleItems}
              />

              {/* Schedule Course Cards List */}
              <main className="schedule-list-section">
                {scheduleItems.length === 0 ? (
                  <div className="empty-schedule-state">
                    <span className="material-symbols-outlined empty-state-icon">event_busy</span>
                    <p className="empty-state-title">ไม่มีคาบเรียนในวันนี้</p>
                    <p style={{ fontSize: '13px' }}>คุณไม่มีการเรียนการสอนในวันที่เลือก พักผ่อนได้เต็มที่!</p>
                  </div>
                ) : (
                  scheduleItems.map((item) => {
                    if (item.isLunchBreak) {
                      return (
                        <div key={item.id} className="lunch-break-row" aria-label="ช่วงพักรับประทานอาหารกลางวัน">
                          <div className="lunch-break-time-spacer"></div>
                          <div className="lunch-break-line-box">
                            <div className="lunch-break-line"></div>
                            <div className="lunch-break-badge">
                              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>restaurant</span>
                              <span>{item.label || 'Lunch Break'} ({item.startTime} - {item.endTime})</span>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <CourseCard 
                        key={item.id} 
                        course={item} 
                        currentUser={currentUser}
                        selectedDayId={selectedDayId}
                        onCardClick={(c) => setSelectedCourseForDetail(c)}
                        onToggleReminder={handleToggleReminder}
                        onTestNotification={(c) => triggerNotificationToast(c)}
                      />
                    );
                  })
                )}
              </main>
            </>
          ) : (
            /* Weekly Schedule Overview */
            <WeeklyScheduleView 
              weekDays={weekDays}
              scheduleByDay={schedulesByDay}
              onSelectCourse={(c) => setSelectedCourseForDetail(c)}
              onSelectDay={(dayId) => {
                setSelectedDayId(dayId);
                setViewMode('daily');
              }}
            />
          )}
        </>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="bottom-nav-bar" aria-label="แถบนำทางหลัก">
        {!isLoggedIn ? (
          <button 
            type="button"
            className="nav-item active full-width-login-nav"
            onClick={() => setIsAuthModalOpen(true)}
          >
            <span className="material-symbols-outlined">login</span>
            <span>กรุณาเข้าสู่ระบบเพื่อเปิดดูตารางเรียน</span>
          </button>
        ) : (
          <>
            <button 
              className={`nav-item ${activeTab === 'home' && viewMode === 'daily' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              <span className="material-symbols-outlined">home</span>
              <span>หน้าแรก</span>
            </button>
            <button 
              className={`nav-item ${viewMode === 'weekly' || activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => {
                setViewMode(viewMode === 'daily' ? 'weekly' : 'daily');
                setActiveTab('calendar');
              }}
            >
              <span className="material-symbols-outlined filled">
                {viewMode === 'weekly' ? 'view_day' : 'calendar_month'}
              </span>
              <span>{viewMode === 'weekly' ? 'มุมมองวัน' : 'ตารางสัปดาห์'}</span>
            </button>

            {/* HIDE ADMIN BUTTON WHEN NOT LOGGED IN AS ADMIN! */}
            {currentUser?.role === 'admin' && (
              <button 
                className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => handleNavClick('admin')}
                title="ส่วนผู้ดูแล (Admin)"
              >
                <span className="material-symbols-outlined">edit_calendar</span>
                <span>จัดการตาราง</span>
              </button>
            )}

            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => handleNavClick('profile')}
            >
              {currentUser?.avatar ? (
                <div className={`bottom-nav-avatar-circle ${currentUser.role === 'admin' ? 'admin' : ''}`}>
                  <img src={currentUser.avatar} alt="โปรไฟล์" className="bottom-nav-avatar-img" />
                </div>
              ) : (
                <span className="material-symbols-outlined">account_circle</span>
              )}
              <span>{currentUser.role === 'admin' ? 'แอดมิน' : 'บัญชีของฉัน'}</span>
            </button>
          </>
        )}
      </nav>

      {/* Course Detail Modal */}
      {selectedCourseForDetail && isLoggedIn && (
        <CourseDetailModal 
          course={selectedCourseForDetail}
          currentUser={currentUser}
          selectedDayId={selectedCourseForDetail?.dayId || selectedDayId}
          roomTotalStudents={
            (rooms.find(r => r.id === currentRoomId)?.studentCount || 35) + 
            getStoredRooms().reduce((acc, curr) => curr.id === currentRoomId ? acc : acc, 0)
          }
          roomName={rooms.find(r => r.id === currentRoomId)?.name || currentRoomId}
          onClose={() => setSelectedCourseForDetail(null)}
          onToggleReminder={handleToggleReminder}
          onTestNotification={(c) => triggerNotificationToast(c)}
        />
      )}

      {/* Admin Panel Modal */}
      {isAdminModalOpen && isLoggedIn && currentUser?.role === 'admin' && (
        <AdminPanelModal 
          rooms={rooms}
          initialTab={adminInitialTab}
          currentRoomId={currentRoomId}
          onClose={() => setIsAdminModalOpen(false)}
          onSaveSchedule={handleSaveAdminSchedule}
          schedulesByDay={schedulesByDay}
          onSelectRoom={handleSelectRoom}
          onRoomsUpdated={(newRooms) => {
            setRooms(newRooms);
            if (!newRooms.some((r) => r.id === currentRoomId) && newRooms.length > 0) {
              handleSelectRoom(newRooms[0].id);
            }
          }}
          currentUser={currentUser}
          onUpdateCurrentUser={handleUpdateUser}
        />
      )}

      {/* Auth Modal (Login / Register) */}
      {isAuthModalOpen && (
        <AuthModal 
          currentUser={currentUser}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {/* Notification Center Modal */}
      {isNotificationModalOpen && isLoggedIn && (
        <NotificationModal 
          onClose={() => setIsNotificationModalOpen(false)}
          scheduleItems={scheduleItems}
          onTestNotification={(c) => triggerNotificationToast(c)}
        />
      )}
    </div>
  );
}
