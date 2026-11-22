import React, { useState, useEffect } from 'react';
import {
  getStoredRooms,
  addNewRoom,
  deleteRoom,
  getRegisteredUsers,
  deleteRegisteredUser,
  getRoomRegisteredStudentsCount,
  calculateRealtimeCourseStatus,
  updateUserAvatar
} from '../data/mockData';
import AvatarPickerModal from './AvatarPickerModal';

export default function AdminPanelModal({
  rooms = [],
  currentRoomId = 'CS-201',
  initialTab = 'schedule',
  onClose,
  onSaveSchedule,
  schedulesByDay = {},
  onSelectRoom,
  onRoomsUpdated,
  currentUser,
  onUpdateCurrentUser
}) {
  // Authentication State: Admin 1 คนต่อ 1 ห้อง โดยต้องใส่รหัสห้อง
  const [allRooms, setAllRooms] = useState(rooms);
  const [selectedRoomId, setSelectedRoomId] = useState(currentRoomId);
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authError, setAuthError] = useState('');

  // Admin Section Navigation: 'schedule' | 'users' | 'add-room'
  const [adminTab, setAdminTab] = useState(initialTab || 'schedule');

  // Room Deletion Confirmation State (มีถามยืนยันอีกรอบว่าจะลบไหม)
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [quickDeleteTargetId, setQuickDeleteTargetId] = useState('');

  // Schedule editing state
  const [activeDay, setActiveDay] = useState('wed');
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form inputs for Course (REMOVED manual status & assignment per requirements!)
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    startTime: '09:00',
    endTime: '10:30',
    building: '',
    floor: '',
    room: '',
    instructor: '',
    instructorEmail: '',
    credits: '3 (3-0-6)',
  });

  // Dedicated Modal for Class Cancellation & Work/Assignment
  const [statusModalCourse, setStatusModalCourse] = useState(null);
  const [classStateOption, setClassStateOption] = useState('normal'); // 'normal' | 'cancelled' | 'online'
  const [classAssignmentInput, setClassAssignmentInput] = useState('');

  // Users Database State
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [avatarModalUser, setAvatarModalUser] = useState(null);

  // Add Classroom Form State
  const [newRoomForm, setNewRoomForm] = useState({
    id: '',
    name: '',
    adminCode: '',
    department: 'คณะเทคโนโลยีสารสนเทศ',
    advisor: '',
    studentCount: 35,
  });
  const [addRoomStatus, setAddRoomStatus] = useState({ error: '', success: '' });

  useEffect(() => {
    const loaded = getStoredRooms();
    setAllRooms(loaded);
    setUsersList(getRegisteredUsers());
  }, []);

  const selectedRoomObj = allRooms.find((r) => r.id === selectedRoomId) || allRooms[0] || {
    id: 'CS-201',
    name: 'CS-201',
    adminCode: 'CS201',
    studentCount: 38
  };

  // Handle Passcode Unlock
  const handleUnlockRoom = (e) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setAuthError('กรุณากรอกรหัสประจำห้องเรียน');
      return;
    }

    if (passcode.trim().toUpperCase() === selectedRoomObj.adminCode.toUpperCase()) {
      setIsUnlocked(true);
      setAuthError('');
      if (onSelectRoom) {
        onSelectRoom(selectedRoomId);
      }
    } else {
      setAuthError(`รหัสผ่านห้องไม่ถูกต้อง! (รหัสผ่านของห้อง ${selectedRoomObj.id} คือ "${selectedRoomObj.adminCode}")`);
    }
  };

  const currentDayCourses = schedulesByDay[activeDay] || [];

  const handleOpenAddCourse = () => {
    setFormData({
      courseCode: '',
      courseName: '',
      startTime: '09:00',
      endTime: '11:00',
      building: 'ตึก 5 คณะเทคโนโลยีสารสนเทศ',
      floor: 'ชั้น 6',
      room: 'ห้อง 601',
      instructor: '',
      instructorEmail: '',
      credits: '3 (3-0-6)',
    });
    setEditingItem(null);
    setIsAddingNew(true);
  };

  const handleOpenEditCourse = (course) => {
    setFormData({
      courseCode: course.courseCode || '',
      courseName: course.courseName || '',
      startTime: course.startTime || '09:00',
      endTime: course.endTime || '11:00',
      building: course.building || '',
      floor: course.floor || '',
      room: course.room || '',
      instructor: course.instructor || '',
      instructorEmail: course.instructorEmail || '',
      credits: course.credits || '3 (3-0-6)',
    });
    setEditingItem(course);
    setIsAddingNew(false);
  };

  // Submit Course (Real-time dynamic status handles the status automatically!)
  const handleCourseFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.courseName || !formData.courseCode) {
      alert('กรุณากรอกรหัสวิชาและชื่อวิชา');
      return;
    }

    const updatedDayList = [...currentDayCourses];

    if (isAddingNew) {
      const newCourse = {
        ...formData,
        id: `course-${Date.now()}`,
        isReminderOn: true,
      };
      updatedDayList.push(newCourse);
    } else if (editingItem) {
      const idx = updatedDayList.findIndex((item) => item.id === editingItem.id);
      if (idx !== -1) {
        updatedDayList[idx] = {
          ...updatedDayList[idx],
          ...formData,
        };
      }
    }

    const newScheduleByDay = {
      ...schedulesByDay,
      [activeDay]: updatedDayList,
    };

    onSaveSchedule(selectedRoomId, newScheduleByDay);
    setEditingItem(null);
    setIsAddingNew(false);
  };

  const handleDeleteCourse = (courseId) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบคาบเรียนนี้ออกจากตาราง?')) {
      const updatedDayList = currentDayCourses.filter((item) => item.id !== courseId);
      const newScheduleByDay = {
        ...schedulesByDay,
        [activeDay]: updatedDayList,
      };
      onSaveSchedule(selectedRoomId, newScheduleByDay);
      if (editingItem && editingItem.id === courseId) {
        setEditingItem(null);
      }
    }
  };

  // Open Cancellation / Assignment Modal
  const handleOpenClassStatusModal = (course) => {
    setStatusModalCourse(course);
    if (course.isCancelled) {
      setClassStateOption('cancelled');
    } else if (course.isOnline) {
      setClassStateOption('online');
    } else {
      setClassStateOption('normal');
    }
    setClassAssignmentInput(course.assignment || '');
  };

  // Save Cancellation / Assignment
  const handleSaveClassStatus = (e) => {
    e.preventDefault();
    if (!statusModalCourse) return;

    const isCancelled = classStateOption === 'cancelled';
    const isOnline = classStateOption === 'online';

    const updatedDayList = currentDayCourses.map((item) => {
      if (item.id === statusModalCourse.id) {
        return {
          ...item,
          isCancelled,
          isOnline,
          assignment: classAssignmentInput.trim(),
        };
      }
      return item;
    });

    const newScheduleByDay = {
      ...schedulesByDay,
      [activeDay]: updatedDayList,
    };

    onSaveSchedule(selectedRoomId, newScheduleByDay);
    setStatusModalCourse(null);
  };

  // Add Classroom Submit
  const handleAddNewRoomSubmit = (e) => {
    e.preventDefault();
    setAddRoomStatus({ error: '', success: '' });

    if (!newRoomForm.id.trim()) {
      setAddRoomStatus({ error: 'กรุณาระบุรหัสห้องเรียน เช่น CS-202', success: '' });
      return;
    }

    const res = addNewRoom({
      id: newRoomForm.id,
      name: newRoomForm.name || `${newRoomForm.id} : ห้องเรียนใหม่`,
      adminCode: newRoomForm.adminCode || newRoomForm.id,
      department: newRoomForm.department,
      advisor: newRoomForm.advisor,
      studentCount: newRoomForm.studentCount,
    });

    if (!res.success) {
      setAddRoomStatus({ error: res.message, success: '' });
      return;
    }

    setAllRooms(res.rooms);
    if (onRoomsUpdated) {
      onRoomsUpdated(res.rooms);
    }

    setAddRoomStatus({
      error: '',
      success: `สร้างห้องเรียน "${res.room.id}" สำเร็จเรียบร้อย! สามารถเริ่มจัดตารางเรียนได้ทันที`
    });

    setNewRoomForm({
      id: '',
      name: '',
      adminCode: '',
      department: 'คณะเทคโนโลยีสารสนเทศ',
      advisor: '',
      studentCount: 35,
    });
  };

  // Request Delete Classroom (Open confirmation modal)
  const handleRequestDeleteRoom = (room) => {
    if (!room) return;
    if (allRooms.length <= 1) {
      setAddRoomStatus({
        error: 'ไม่สามารถลบห้องเรียนได้ เนื่องจากต้องมีห้องเรียนคงเหลืออย่างน้อย 1 ห้องในระบบ',
        success: ''
      });
      return;
    }

    const regCount = getRoomRegisteredStudentsCount(room.id);
    setRoomToDelete({
      id: room.id,
      name: room.name || room.id,
      adminCode: room.adminCode,
      department: room.department,
      advisor: room.advisor,
      studentCount: room.studentCount || 35,
      regCount: regCount
    });
  };

  // Confirm Delete Classroom Action (ลบจริงหลังจากผู้ใช้กดยืนยันในกล่องข้อความเตือน)
  const handleConfirmDeleteRoom = () => {
    if (!roomToDelete) return;
    const roomId = roomToDelete.id;

    if (allRooms.length <= 1) {
      setAddRoomStatus({
        error: 'ไม่สามารถลบห้องเรียนได้ ต้องมีห้องเรียนคงเหลืออย่างน้อย 1 ห้องในระบบ',
        success: ''
      });
      setRoomToDelete(null);
      return;
    }

    const res = deleteRoom(roomId);
    if (!res.success) {
      setAddRoomStatus({ error: res.message, success: '' });
      setRoomToDelete(null);
      return;
    }

    setAllRooms(res.rooms);
    if (onRoomsUpdated) {
      onRoomsUpdated(res.rooms);
    }

    // If the currently selected room in admin or main was the deleted room, switch to fallback
    if (selectedRoomId.toUpperCase() === roomId.toUpperCase()) {
      const fallback = res.fallbackRoomId || res.rooms[0].id;
      setSelectedRoomId(fallback);
      setPasscode('');
      setIsUnlocked(false);
      if (onSelectRoom) {
        onSelectRoom(fallback);
      }
    }

    setAddRoomStatus({
      error: '',
      success: `ลบห้องเรียน "${roomId}" ออกจากระบบสำเร็จเรียบร้อยแล้ว`,
    });
    setRoomToDelete(null);
    setQuickDeleteTargetId('');
  };

  // Delete User from Database
  const handleDeleteUser = (studentId) => {
    if (confirm(`คุณต้องการลบผู้ใช้รหัส "${studentId}" ออกจากฐานข้อมูลใช่หรือไม่?`)) {
      const updated = deleteRegisteredUser(studentId);
      setUsersList(updated);
    }
  };

  // Change User Avatar from Admin Panel (Self Only)
  const handleSaveUserAvatarFromAdmin = (newAvatar) => {
    if (!avatarModalUser || !currentUser) return;
    if (avatarModalUser.studentId !== currentUser.studentId) {
      alert('คุณสามารถแก้ไขรูปโปรไฟล์ของตนเองได้เท่านั้น');
      setAvatarModalUser(null);
      return;
    }
    const res = updateUserAvatar(currentUser.studentId, newAvatar);
    if (res.success) {
      setUsersList(getRegisteredUsers());
      if (onUpdateCurrentUser) {
        onUpdateCurrentUser(res.user);
      }
    } else if (res.message) {
      alert(res.message);
    }
    setAvatarModalUser(null);
  };

  const roomRegisteredCount = getRoomRegisteredStudentsCount(selectedRoomObj.id);
  const totalRoomMembers = (selectedRoomObj.studentCount || 35) + roomRegisteredCount;

  // Filter users
  const filteredUsers = usersList.filter((u) => {
    const term = userSearch.toLowerCase();
    return (
      u.studentId.toLowerCase().includes(term) ||
      u.fullName.toLowerCase().includes(term) ||
      u.roomId.toLowerCase().includes(term)
    );
  });

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card admin-panel-modal" onClick={(e) => e.stopPropagation()}>
        {/* Admin Header */}
        <div className="modal-top-bar">
          <div className="admin-header-title-box">
            <span className="material-symbols-outlined admin-shield-icon">admin_panel_settings</span>
            <div>
              <h2 className="admin-modal-title">ส่วนผู้ดูแลระบบ (Admin Control Center)</h2>
              <span className="admin-modal-sub">
                {adminTab === 'add-room'
                  ? `จัดการและเพิ่ม/ลบห้องเรียนทั้งหมด (${allRooms.length} ห้อง)`
                  : adminTab === 'users'
                    ? `ฐานข้อมูลสมาชิกที่ลงทะเบียน (${usersList.length} คน)`
                    : isUnlocked
                      ? `จัดการตารางเรียน: ${selectedRoomObj.name}`
                      : 'ยืนยันรหัสห้องเรียนเพื่อเข้าสู่โหมดแก้ไข'}
              </span>
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

        {/* Admin Navigation Tabs: Always accessible to switch to Add/Delete Classroom */}
        <div className="admin-main-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={adminTab === 'schedule'}
            className={`admin-main-tab-btn ${adminTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setAdminTab('schedule')}
          >
            <span className="material-symbols-outlined">calendar_today</span>
            <span>ตารางเรียนห้อง {selectedRoomObj.id}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={adminTab === 'users'}
            className={`admin-main-tab-btn ${adminTab === 'users' ? 'active' : ''}`}
            onClick={() => {
              setAdminTab('users');
              setUsersList(getRegisteredUsers());
            }}
          >
            <span className="material-symbols-outlined">people</span>
            <span>ฐานข้อมูลสมาชิก ({usersList.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={adminTab === 'add-room'}
            className={`admin-main-tab-btn ${adminTab === 'add-room' ? 'active' : ''}`}
            onClick={() => setAdminTab('add-room')}
          >
            <span className="material-symbols-outlined">add_business</span>
            <span>➕ เพิ่ม & ลบห้องเรียน ({allRooms.length})</span>
          </button>
        </div>

        {/* CONTENT SECTION: If schedule tab is selected and not unlocked, show unlock card */}
        {(!isUnlocked && adminTab === 'schedule') ? (
          <div className="admin-unlock-card">
            <div className="admin-lock-illustration">
              <span className="material-symbols-outlined lock-icon">lock</span>
            </div>

            <h3 className="unlock-headline">เข้าสู่ระบบผู้ดูแลประจำห้องเรียน</h3>
            <p className="unlock-desc">
              ระบบกำหนดให้ <strong>Admin 1 คนต่อ 1 ห้อง</strong> โดยต้องใส่รหัสความปลอดภัยประจำห้อง เพื่อความถูกต้องของตารางเรียนแต่ละห้อง
            </p>

            <form onSubmit={handleUnlockRoom} className="admin-unlock-form">
              <div className="form-group">
                <label className="form-label">เลือกห้องเรียนที่ต้องการจัดการ</label>
                <select
                  className="form-select"
                  value={selectedRoomId}
                  onChange={(e) => {
                    setSelectedRoomId(e.target.value);
                    setPasscode('');
                    setAuthError('');
                  }}
                >
                  {allRooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">รหัสผ่านประจำห้อง (Room Security Passcode)</label>
                <div className="input-with-icon">
                  <span className="material-symbols-outlined">key</span>
                  <input
                    type="password"
                    className="form-input"
                    placeholder={`กรอกรหัสของห้อง ${selectedRoomObj.id} (เช่น ${selectedRoomObj.adminCode})`}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                  />
                </div>
                <div className="quick-code-hint">
                  <span>💡 รหัสผ่านตัวอย่างของห้องนี้: </span>
                  <button
                    type="button"
                    className="btn-quick-fill"
                    onClick={() => setPasscode(selectedRoomObj.adminCode)}
                  >
                    ใช้รหัส "{selectedRoomObj.adminCode}"
                  </button>
                </div>
              </div>

              {authError && (
                <div className="form-error-banner" role="alert">
                  <span className="material-symbols-outlined">error</span>
                  <span>{authError}</span>
                </div>
              )}

              <div className="unlock-btn-row">
                <button type="submit" className="btn-modal-primary full-width">
                  <span className="material-symbols-outlined">lock_open</span>
                  ปลดล็อกและจัดการห้อง {selectedRoomObj.id}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* STEP 2: FULL ADMIN WORKSPACE WITH TABS */
          <div className="admin-content-scroll">
            {/* Logged-in Admin Profile Quickbar */}
            {currentUser && (
              <div className="admin-profile-quickbar">
                <div
                  className="admin-quickbar-avatar-wrap"
                  onClick={() => setAvatarModalUser(currentUser)}
                  title="คลิกเพื่อเปลี่ยนรูปโปรไฟล์แอดมิน"
                  role="button"
                  tabIndex={0}
                >
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.fullName} className="admin-quickbar-avatar-img" />
                  ) : (
                    <span className="material-symbols-outlined">shield_person</span>
                  )}
                  <span className="admin-quickbar-cam-badge">
                    <span className="material-symbols-outlined">photo_camera</span>
                  </span>
                </div>
                <div className="admin-quickbar-info">
                  <div className="admin-quickbar-name">{currentUser.fullName}</div>
                  <div className="admin-quickbar-sub">
                    <span className="admin-quickbar-badge">ผู้ดูแลระบบห้องเรียน</span>
                    <span>รหัส: {currentUser.studentId}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-admin-change-avatar"
                  onClick={() => setAvatarModalUser(currentUser)}
                  title="เปลี่ยนรูปโปรไฟล์แอดมิน"
                >
                  <span className="material-symbols-outlined">photo_camera</span>
                  เปลี่ยนรูปโปรไฟล์แอดมิน
                </button>
              </div>
            )}

            {/* TAB 1: SCHEDULE MANAGEMENT */}
            {adminTab === 'schedule' && (
              <div>
                {/* Top Room Banner with Student Counts */}
                <div className="admin-room-status-bar">
                  <div className="room-status-info">
                    <span className="room-active-pill">
                      <span className="pulse-dot"></span>
                      ห้อง: {selectedRoomObj.name}
                    </span>
                    <div className="room-stats-chips">
                      <span className="chip-stat total-students" title="จำนวนสมาชิกทั้งหมดในห้องเรียนนี้">
                        <span className="material-symbols-outlined">groups</span>
                        สมาชิกในห้องนี้: <strong>{totalRoomMembers} คน</strong> ({roomRegisteredCount} สมัครใหม่)
                      </span>
                      <span className="chip-stat advisor-stat">
                        <span className="material-symbols-outlined">person</span>
                        ที่ปรึกษา: {selectedRoomObj.advisor || 'คณาจารย์ประจำห้อง'}
                      </span>
                    </div>
                  </div>

                  <button
                    className="btn-change-room"
                    onClick={() => {
                      setIsUnlocked(false);
                      setPasscode('');
                    }}
                  >
                    <span className="material-symbols-outlined">swap_horiz</span>
                    สลับห้อง
                  </button>
                </div>

                {/* Day Selector */}
                <div className="admin-day-tabs">
                  {[
                    { id: 'mon', label: 'วันจันทร์' },
                    { id: 'tue', label: 'วันอังคาร' },
                    { id: 'wed', label: 'วันพุธ' },
                    { id: 'thu', label: 'วันพฤหัสบดี' },
                    { id: 'fri', label: 'วันศุกร์' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      className={`admin-day-btn ${activeDay === d.id ? 'active' : ''}`}
                      onClick={() => {
                        setActiveDay(d.id);
                        setEditingItem(null);
                        setIsAddingNew(false);
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>

                {/* Action Bar */}
                <div className="admin-action-bar">
                  <h3 className="admin-section-heading">
                    วิชาในวัน{activeDay === 'mon' ? 'จันทร์' : activeDay === 'tue' ? 'อังคาร' : activeDay === 'wed' ? 'พุธ' : activeDay === 'thu' ? 'พฤหัสบดี' : 'ศุกร์'} ({currentDayCourses.filter(c => !c.isLunchBreak).length} วิชา)
                  </h3>
                  <button
                    type="button"
                    className="btn-add-course"
                    onClick={handleOpenAddCourse}
                  >
                    <span className="material-symbols-outlined">add</span>
                    เพิ่มคาบเรียนใหม่
                  </button>
                </div>

                {/* Course Form if adding/editing (NO manual status, NO assignment - clean and focused) */}
                {(isAddingNew || editingItem) && (
                  <form onSubmit={handleCourseFormSubmit} className="admin-course-form">
                    <div className="form-header-badge">
                      <span className="material-symbols-outlined">
                        {isAddingNew ? 'add_circle' : 'edit'}
                      </span>
                      <span>{isAddingNew ? 'เพิ่มคาบเรียนใหม่' : `แก้ไขวิชา: ${editingItem?.courseCode}`}</span>
                      <span className="auto-status-hint">⚡ สถานะจะคำนวณตามเวลาจริงแบบเรียลไทม์อัตโนมัติ</span>
                    </div>

                    <div className="form-row two-col">
                      <div className="form-group">
                        <label className="form-label">รหัสวิชา *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="เช่น CS210"
                          value={formData.courseCode}
                          onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">ชื่อวิชา *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="เช่น การเขียนโปรแกรมเชิงวัตถุ"
                          value={formData.courseName}
                          onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row two-col">
                      <div className="form-group">
                        <label className="form-label">เวลาเริ่มเรียน (เริ่มคำนวณเวลาจริง)</label>
                        <input
                          type="time"
                          className="form-input"
                          value={formData.startTime}
                          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">เวลาเลิกเรียน</label>
                        <input
                          type="time"
                          className="form-input"
                          value={formData.endTime}
                          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row three-col">
                      <div className="form-group">
                        <label className="form-label">ตึก / อาคาร</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="เช่น ตึก 5 คณะ IT"
                          value={formData.building}
                          onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">ชั้น</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="เช่น ชั้น 7"
                          value={formData.floor}
                          onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">ห้องเรียน</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="เช่น ห้อง 705"
                          value={formData.room}
                          onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-row two-col">
                      <div className="form-group">
                        <label className="form-label">อาจารย์ผู้สอน</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="เช่น ผศ.ดร. นภาพร จิตมั่นคง"
                          value={formData.instructor}
                          onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">อีเมลอาจารย์</label>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="เช่น instructor@university.ac.th"
                          value={formData.instructorEmail}
                          onChange={(e) => setFormData({ ...formData, instructorEmail: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-btn-actions">
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => {
                          setEditingItem(null);
                          setIsAddingNew(false);
                        }}
                      >
                        ยกเลิก
                      </button>
                      <button type="submit" className="btn-modal-primary">
                        <span className="material-symbols-outlined">save</span>
                        บันทึกคาบเรียน
                      </button>
                    </div>
                  </form>
                )}

                {/* Courses list with Realtime Status Badge & Cancellation/Assignment Button */}
                <div className="admin-course-table-wrap">
                  {currentDayCourses.length === 0 ? (
                    <div className="admin-empty-table">
                      <span className="material-symbols-outlined">event_busy</span>
                      <p>ยังไม่มีคาบเรียนในวันนี้สำหรับห้อง {selectedRoomObj.id}</p>
                      <button type="button" className="btn-quick-add" onClick={handleOpenAddCourse}>
                        + เพิ่มคาบแรกของวันนี้
                      </button>
                    </div>
                  ) : (
                    <div className="admin-items-list">
                      {currentDayCourses.map((c) => {
                        if (c.isLunchBreak) {
                          return (
                            <div key={c.id} className="admin-lunch-row">
                              <span className="material-symbols-outlined">restaurant</span>
                              <span>{c.label || 'Lunch Break'} ({c.startTime} - {c.endTime})</span>
                            </div>
                          );
                        }

                        // Calculate real-time status
                        const rtStatus = calculateRealtimeCourseStatus(c, activeDay);

                        return (
                          <div key={c.id} className={`admin-course-row-item ${c.isCancelled ? 'item-is-cancelled' : ''}`}>
                            <div className="admin-item-time">
                              <span className="time-range">{c.startTime} - {c.endTime}</span>
                              <span className={`status-chip ${rtStatus.status}`}>
                                {rtStatus.statusText}
                              </span>
                            </div>

                            <div className="admin-item-info">
                              <div className="item-title-row">
                                <h4 className="item-name">{c.courseName}</h4>
                                {c.isCancelled && <span className="cancelled-pill">🚫 ยกคลาส</span>}
                                {c.isOnline && <span className="online-pill">🌐 ออนไลน์</span>}
                              </div>
                              <div className="item-meta">
                                <span className="item-code">{c.courseCode}</span>
                                <span className="item-loc">
                                  <span className="material-symbols-outlined">apartment</span>
                                  {c.room} {c.floor ? `(${c.floor})` : ''} {c.building}
                                </span>
                                <span className="item-prof">
                                  <span className="material-symbols-outlined">person</span>
                                  {c.instructor}
                                </span>
                              </div>
                              {c.assignment && (
                                <div className="admin-item-assignment-preview">
                                  <span className="material-symbols-outlined">assignment</span>
                                  <span>งาน: {c.assignment}</span>
                                </div>
                              )}
                            </div>

                            <div className="admin-item-actions">
                              {/* Dedicated Button for Cancelling Class / Online / Assigning Work */}
                              <button
                                type="button"
                                className={`btn-status-action ${c.isCancelled ? 'cancelled-active' : c.isOnline ? 'online-active' : ''}`}
                                onClick={() => handleOpenClassStatusModal(c)}
                                title="ปุ่มกดยกคลาส / เรียนออนไลน์ และใส่ข้อมูลงาน"
                              >
                                <span className="material-symbols-outlined">
                                  {c.isCancelled ? 'event_busy' : c.isOnline ? 'laptop_chromebook' : 'pending_actions'}
                                </span>
                                <span>{c.isCancelled ? 'ยกคลาสแล้ว' : c.isOnline ? 'ออนไลน์' : 'ยกคลาส/สั่งงาน'}</span>
                              </button>

                              <button
                                type="button"
                                className="btn-action edit"
                                onClick={() => handleOpenEditCourse(c)}
                                title="แก้ไขข้อมูลวิชานี้"
                              >
                                <span className="material-symbols-outlined">edit</span>
                              </button>
                              <button
                                type="button"
                                className="btn-action delete"
                                onClick={() => handleDeleteCourse(c.id)}
                                title="ลบวิชานี้"
                              >
                                <span className="material-symbols-outlined">delete</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: REGISTERED USERS DATABASE */}
            {adminTab === 'users' && (
              <div className="admin-users-db-section">
                <div className="users-db-header">
                  <div>
                    <h3 className="admin-section-heading">
                      ฐานข้อมูลสมาชิกที่สมัครในระบบ ({usersList.length} รายชื่อ)
                    </h3>
                    <p className="admin-section-sub">
                      ข้อมูลของทุกคนที่สมัครสมาชิกจะถูกจัดเก็บและแสดงผลที่นี่ เพื่อให้ผู้ดูแลระบบตรวจสอบได้
                    </p>
                  </div>
                  <div className="user-search-box">
                    <span className="material-symbols-outlined">search</span>
                    <input
                      type="text"
                      placeholder="ค้นหาตามเลขบัตร หรือชื่อ..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="search-input"
                    />
                  </div>
                </div>

                <div className="users-table-container">
                  {filteredUsers.length === 0 ? (
                    <div className="empty-users-state">
                      <span className="material-symbols-outlined">person_off</span>
                      <p>ไม่พบข้อมูลสมาชิกตามที่ค้นหา</p>
                    </div>
                  ) : (
                    <table className="admin-users-table">
                      <thead>
                        <tr>
                          <th style={{ width: '56px' }}>รูป</th>
                          <th>เลขประจำตัว</th>
                          <th>ชื่อ - นามสกุล</th>
                          <th>ห้องเรียน</th>
                          <th>บทบาท</th>
                          <th>วันที่สมัคร</th>
                          <th>จัดการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => {
                          const isSelf = user.studentId === currentUser?.studentId;
                          return (
                            <tr key={user.studentId} className={user.roomId === selectedRoomObj.id ? 'highlight-current-room' : ''}>
                              <td>
                                <div
                                  className={`user-table-avatar-cell ${isSelf ? 'clickable is-self' : 'readonly'}`}
                                  onClick={isSelf ? () => setAvatarModalUser(currentUser) : undefined}
                                  title={isSelf ? 'รูปโปรไฟล์ของคุณ (คลิกเพื่อแก้ไข)' : `รูปโปรไฟล์ของ ${user.fullName}`}
                                  role={isSelf ? 'button' : undefined}
                                  tabIndex={isSelf ? 0 : undefined}
                                >
                                  {user.avatar ? (
                                    <img src={user.avatar} alt={user.fullName} className="user-table-avatar-img" />
                                  ) : (
                                    <span className={`user-table-avatar-fallback ${user.role}`}>
                                      {user.fullName ? user.fullName.substring(0, 2) : 'ผช'}
                                    </span>
                                  )}
                                  {isSelf && (
                                    <span className="user-table-avatar-hover-icon" title="เปลี่ยนรูปของคุณ">
                                      <span className="material-symbols-outlined">photo_camera</span>
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <span className="user-id-badge">{user.studentId}</span>
                              </td>
                              <td>
                                <strong>{user.fullName}</strong>
                                {isSelf && <span className="user-self-pill">คุณ</span>}
                              </td>
                              <td>
                                <span className="user-room-chip">ห้อง {user.roomId}</span>
                              </td>
                              <td>
                                <span className={`user-role-badge ${user.role}`}>
                                  {user.role === 'admin' ? 'แอดมินห้อง' : 'นักศึกษา'}
                                </span>
                              </td>
                              <td className="user-date-col">
                                {user.registeredAt || 'เริ่มต้นระบบ'}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn-user-delete"
                                  onClick={() => handleDeleteUser(user.studentId)}
                                  title="ลบผู้ใช้นี้ออกจากระบบ"
                                >
                                  <span className="material-symbols-outlined">delete</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: ADD NEW CLASSROOM */}
            {adminTab === 'add-room' && (
              <div className="admin-add-room-section">
                <div className="add-room-banner">
                  <span className="material-symbols-outlined banner-icon">meeting_room</span>
                  <div>
                    <h3 className="admin-section-heading">เพิ่มและลบห้องเรียน (จัดการห้องเรียนทั้งหมดในระบบ)</h3>
                    <p className="admin-section-sub">
                      ผู้ดูแลสามารถเปิดห้องเรียนใหม่ หรือเลือกลบห้องเรียนที่ไม่ต้องการใช้งานออกจากระบบได้ พร้อมระบบถามยืนยันความปลอดภัยก่อนลบ
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAddNewRoomSubmit} className="add-room-form-card">
                  {addRoomStatus.error && (
                    <div className="form-error-banner" role="alert">
                      <span className="material-symbols-outlined">error</span>
                      <span>{addRoomStatus.error}</span>
                    </div>
                  )}

                  {addRoomStatus.success && (
                    <div className="form-success-banner" role="alert">
                      <span className="material-symbols-outlined">check_circle</span>
                      <span>{addRoomStatus.success}</span>
                    </div>
                  )}

                  <div className="form-row two-col">
                    <div className="form-group">
                      <label className="form-label">รหัสห้องเรียน (Room Code / ID) *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="เช่น CS-202 หรือ IT-102"
                        value={newRoomForm.id}
                        onChange={(e) => setNewRoomForm({ ...newRoomForm, id: e.target.value })}
                        required
                      />
                      <span className="form-hint">รหัสสั้นสำหรับอ้างอิง เช่น CS-202</span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">ชื่อห้องเรียนแบบเต็ม *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="เช่น CS-202 : วิทยาการคอมพิวเตอร์ ปี 2 ห้อง 2"
                        value={newRoomForm.name}
                        onChange={(e) => setNewRoomForm({ ...newRoomForm, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row two-col">
                    <div className="form-group">
                      <label className="form-label">รหัสผ่านความปลอดภัยของ Admin ประจำห้อง *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="เช่น CS202 หรือรหัสลับ"
                        value={newRoomForm.adminCode}
                        onChange={(e) => setNewRoomForm({ ...newRoomForm, adminCode: e.target.value })}
                        required
                      />
                      <span className="form-hint">รหัสนี้ใช้สำหรับให้ Admin ห้องนี้ปลดล็อกจัดการตาราง</span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">จำนวนนักศึกษาในห้อง (ความจุ)</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="เช่น 40"
                        value={newRoomForm.studentCount}
                        onChange={(e) => setNewRoomForm({ ...newRoomForm, studentCount: e.target.value })}
                        min="1"
                        max="200"
                      />
                    </div>
                  </div>

                  <div className="form-row two-col">
                    <div className="form-group">
                      <label className="form-label">คณะ / ภาควิชา</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="เช่น คณะเทคโนโลยีสารสนเทศ"
                        value={newRoomForm.department}
                        onChange={(e) => setNewRoomForm({ ...newRoomForm, department: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">อาจารย์ที่ปรึกษาประจำห้อง</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="เช่น ดร. สมชาย มั่นคง"
                        value={newRoomForm.advisor}
                        onChange={(e) => setNewRoomForm({ ...newRoomForm, advisor: e.target.value })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-modal-primary">
                    <span className="material-symbols-outlined">add_circle</span>
                    ยืนยันการเพิ่มห้องเรียนใหม่
                  </button>
                </form>

                {/* List of Existing Classrooms */}
                <div className="existing-rooms-list">
                  <div className="existing-rooms-header">
                    <div className="existing-rooms-title-group">
                      <h4 className="existing-rooms-title">
                        <span className="material-symbols-outlined">domain</span>
                        ห้องเรียนทั้งหมดในระบบ ({allRooms.length} ห้อง):
                      </h4>
                      <p className="existing-rooms-subtitle">
                        กดปุ่ม <strong>"ลบห้องเรียนนี้"</strong> ที่การ์ดห้องเรียนด้านล่าง หรือเลือกห้องจากเมนูด้านขวาเพื่อลบ (ระบบจะแสดงหน้าต่างถามยืนยันความปลอดภัยก่อนลบเสมอ)
                      </p>
                    </div>

                    {/* Quick Delete Dropdown Selector */}
                    <div className="quick-delete-bar">
                      <span className="quick-delete-label">
                        <span className="material-symbols-outlined">delete_sweep</span>
                        เลือกลบห้องเรียนด่วน:
                      </span>
                      <div className="quick-delete-controls">
                        <select
                          className="form-select quick-delete-select"
                          value={quickDeleteTargetId}
                          onChange={(e) => setQuickDeleteTargetId(e.target.value)}
                          aria-label="เลือกห้องเรียนเพื่อลบ"
                        >
                          <option value="">-- เลือกห้องเรียนเพื่อลบ --</option>
                          {allRooms.map((rm) => (
                            <option key={rm.id} value={rm.id}>
                              ห้อง {rm.id} ({rm.name})
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="btn-quick-delete"
                          disabled={!quickDeleteTargetId || allRooms.length <= 1}
                          onClick={() => {
                            const target = allRooms.find((rm) => rm.id === quickDeleteTargetId);
                            if (target) {
                              handleRequestDeleteRoom(target);
                            }
                          }}
                          title={allRooms.length <= 1 ? "ไม่สามารถลบห้องสุดท้ายได้" : "กดยืนยันการลบห้องที่เลือก"}
                        >
                          <span className="material-symbols-outlined">delete</span>
                          <span>ลบห้องที่เลือก</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="rooms-cards-grid">
                    {allRooms.map((r) => {
                      const regCount = getRoomRegisteredStudentsCount(r.id);
                      const isCurrent = r.id === selectedRoomId;
                      return (
                        <div key={r.id} className={`room-card-preview ${isCurrent ? 'active-room-card' : ''}`}>
                          <div className="preview-top">
                            <div className="preview-left-badge">
                              <span className="preview-room-id">{r.id}</span>
                              {isCurrent && <span className="preview-current-tag">ห้องปัจจุบัน</span>}
                            </div>
                            <span className="preview-admin-code">รหัส: {r.adminCode}</span>
                          </div>
                          <h5 className="preview-room-name">{r.name}</h5>
                          <div className="preview-meta">
                            <span>👥 {(r.studentCount || 35) + regCount} คน ({regCount} สมัคร)</span>
                            <span>• {r.department}</span>
                          </div>
                          {r.advisor && (
                            <div className="preview-advisor-row">
                              <span className="material-symbols-outlined">school</span>
                              <span>ที่ปรึกษา: {r.advisor}</span>
                            </div>
                          )}
                          <div className="preview-footer-action">
                            <button
                              type="button"
                              className="btn-delete-room"
                              onClick={() => handleRequestDeleteRoom(r)}
                              title={allRooms.length <= 1 ? "ไม่สามารถลบห้องสุดท้ายได้ (ต้องมีอย่างน้อย 1 ห้อง)" : `ลบห้องเรียน ${r.id}`}
                              disabled={allRooms.length <= 1}
                              aria-label={`ลบห้องเรียน ${r.id}`}
                            >
                              <span className="material-symbols-outlined">delete</span>
                              <span>ลบห้องเรียนนี้</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUB-MODAL: CANCEL CLASS / ONLINE CLASS & ASSIGNMENT INPUT (Requirement 4) */}
        {statusModalCourse && (
          <div className="submodal-overlay" onClick={() => setStatusModalCourse(null)}>
            <div className="submodal-card" onClick={(e) => e.stopPropagation()}>
              <div className="submodal-header">
                <div className="submodal-title-box">
                  <span className="material-symbols-outlined submodal-icon">notification_important</span>
                  <h4>จัดการสถานะคาบเรียน & มอบหมายงาน</h4>
                </div>
                <button
                  type="button"
                  className="modal-close-icon-btn"
                  onClick={() => setStatusModalCourse(null)}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSaveClassStatus} className="submodal-body">
                <div className="submodal-course-target">
                  <strong>{statusModalCourse.courseName}</strong> ({statusModalCourse.courseCode})
                  <span className="submodal-time">{statusModalCourse.startTime} - {statusModalCourse.endTime} น.</span>
                </div>

                <div className="form-group">
                  <label className="form-label">เลือกสถานะการเรียนการสอนสำหรับคลาสนี้</label>
                  <div className="class-status-choice-group">
                    <button
                      type="button"
                      className={`btn-choice-status normal ${classStateOption === 'normal' ? 'active' : ''}`}
                      onClick={() => setClassStateOption('normal')}
                    >
                      <span className="material-symbols-outlined">check_circle</span>
                      <span>เรียนตามปกติ (On-site)</span>
                    </button>

                    <button
                      type="button"
                      className={`btn-choice-status cancel ${classStateOption === 'cancelled' ? 'active' : ''}`}
                      onClick={() => setClassStateOption('cancelled')}
                    >
                      <span className="material-symbols-outlined">cancel</span>
                      <span>🚫 ขอยกคลาส (Class Cancelled)</span>
                    </button>

                    <button
                      type="button"
                      className={`btn-choice-status online ${classStateOption === 'online' ? 'active' : ''}`}
                      onClick={() => setClassStateOption('online')}
                    >
                      <span className="material-symbols-outlined">laptop_chromebook</span>
                      <span>🌐 เรียนออนไลน์ (Online)</span>
                    </button>
                  </div>
                </div>

                {/* Assignment & Notes input */}
                <div className="form-group">
                  <label className="form-label">
                    {classStateOption === 'cancelled'
                      ? 'งานที่มอบหมายแทนการเรียน / หมายเหตุการยกคลาส *'
                      : classStateOption === 'online'
                        ? 'ลิงก์ห้องเรียนออนไลน์ (Zoom/Teams/Meet) หรือรายละเอียด *'
                        : 'งานที่มอบหมาย / การบ้านเพิ่มเติม'}
                  </label>
                  <textarea
                    className="form-input form-textarea"
                    rows="3"
                    placeholder={
                      classStateOption === 'cancelled'
                        ? 'เช่น อาจารย์ติดภารกิจ ขอยกคลาสวันนี้ ให้นักศึกษาทำแบบฝึกหัดบทที่ 4 ส่งในระบบแทน'
                        : classStateOption === 'online'
                          ? 'เช่น เรียนผ่าน Google Meet: https://meet.google.com/xxx-xxxx-xxx'
                          : 'เช่น การบ้านบทที่ 2 ส่งสัปดาห์หน้า'
                    }
                    value={classAssignmentInput}
                    onChange={(e) => setClassAssignmentInput(e.target.value)}
                  />
                  <span className="form-hint">
                    ข้อมูลนี้จะปรากฏให้นักศึกษาทุกคนเห็นบนการ์ดวิชาและหน้ารายละเอียดทันที
                  </span>
                </div>

                <div className="submodal-actions">
                  <button
                    type="button"
                    className="btn-modal-secondary"
                    onClick={() => setStatusModalCourse(null)}
                  >
                    ยกเลิก
                  </button>
                  <button type="submit" className="btn-modal-primary">
                    <span className="material-symbols-outlined">save</span>
                    บันทึกและแจ้งนักศึกษา
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


        {/* SUBMODAL: CONFIRM DELETE CLASSROOM (มีถามยืนยันอีกรอบว่าจะลบไหม) */}
        {roomToDelete && (
          <div className="submodal-overlay delete-confirm-overlay" onClick={() => setRoomToDelete(null)}>
            <div className="submodal-card delete-confirm-card" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
              <div className="delete-confirm-header">
                <div className="delete-confirm-icon-circle">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <div className="delete-confirm-title-wrap">
                  <h4 className="delete-confirm-title">ยืนยันการลบห้องเรียนหรือไม่?</h4>
                  <span className="delete-confirm-sub">กรุณาตรวจสอบข้อมูลก่อนทำการลบออกจากระบบ</span>
                </div>
                <button
                  type="button"
                  className="modal-close-icon-btn"
                  onClick={() => setRoomToDelete(null)}
                  aria-label="ยกเลิก"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="delete-confirm-body">
                <div className="delete-room-target-box">
                  <div className="target-badge-col">
                    <span className="target-room-badge">{roomToDelete.id}</span>
                  </div>
                  <div className="target-info-col">
                    <strong className="target-room-name">{roomToDelete.name}</strong>
                    <div className="target-room-meta">
                      <span>👥 สมาชิกในห้อง: {(roomToDelete.studentCount || 35) + (roomToDelete.regCount || 0)} คน</span>
                      {roomToDelete.department && <span>• {roomToDelete.department}</span>}
                      {roomToDelete.advisor && <span>• อ.ที่ปรึกษา: {roomToDelete.advisor}</span>}
                    </div>
                  </div>
                </div>

                <div className="delete-danger-warning-box">
                  <span className="material-symbols-outlined danger-icon">error</span>
                  <div className="danger-text-content">
                    <strong className="danger-headline">⚠️ คำเตือนสำคัญ: การกระทำนี้ไม่สามารถย้อนกลับได้!</strong>
                    <ul className="danger-bullet-list">
                      <li>ข้อมูลตารางเรียน รายวิชาทุกวันของห้อง <strong>{roomToDelete.id}</strong> จะถูกลบถาวร ไม่สามารถกู้คืนได้</li>
                      {roomToDelete.regCount > 0 ? (
                        <li className="warning-reassign">
                          มีสมาชิกที่ลงทะเบียนในห้องนี้ <strong>{roomToDelete.regCount} คน</strong> (ระบบจะย้ายนักศึกษาไปยังห้องเรียนอื่นให้อัตโนมัติ เพื่อไม่ให้บัญชีสูญหาย)
                        </li>
                      ) : (
                        <li>ห้องเรียนนี้จะถูกนำออกจากตัวเลือกในระบบทั้งหมด</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="delete-confirmation-prompt">
                  คุณแน่ใจหรือไม่ว่าต้องการลบห้องเรียน <strong>"{roomToDelete.name || roomToDelete.id}"</strong> ({roomToDelete.id}) หรือไม่?
                </div>

                <div className="delete-confirm-actions">
                  <button
                    type="button"
                    className="btn-modal-secondary btn-delete-cancel"
                    onClick={() => setRoomToDelete(null)}
                  >
                    <span className="material-symbols-outlined">close</span>
                    <span>ยกเลิก (ไม่ลบ)</span>
                  </button>
                  <button
                    type="button"
                    className="btn-danger-confirm-delete"
                    onClick={handleConfirmDeleteRoom}
                  >
                    <span className="material-symbols-outlined">delete_forever</span>
                    <span>ยืนยัน ลบห้องเรียนนี้ทันที</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Bottom Footer */}
        <div className="modal-footer-actions">
          <button className="btn-modal-secondary" onClick={onClose}>
            ปิดหน้าต่าง
          </button>
        </div>

        {/* Dedicated Avatar Picker for Admin Panel (change own or user avatar) */}
        {avatarModalUser && (
          <AvatarPickerModal
            isOpen={Boolean(avatarModalUser)}
            targetUser={avatarModalUser}
            onClose={() => setAvatarModalUser(null)}
            onSave={handleSaveUserAvatarFromAdmin}
          />
        )}
      </div>
    </div>
  );
}
