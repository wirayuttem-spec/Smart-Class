import React, { useState, useEffect } from 'react';
import { 
  getStoredRooms, 
  authenticateUser, 
  registerNewUser,
  updateUserAvatar
} from '../data/mockData';
import AvatarPickerModal from './AvatarPickerModal';

export default function AuthModal({ 
  currentUser, 
  onClose, 
  onLoginSuccess, 
  onLogout,
  onUpdateUser
}) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [loginRole, setLoginRole] = useState('student'); // 'student' | 'admin'
  const [studentId, setStudentId] = useState(currentUser?.studentId || '');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [selectedRoomId, setSelectedRoomId] = useState(currentUser?.roomId || 'CS-201');
  const [registerRole, setRegisterRole] = useState('student');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

  useEffect(() => {
    setAvailableRooms(getStoredRooms());
  }, []);

  const handleSaveAvatar = (newAvatar) => {
    if (!currentUser?.studentId) return;
    const res = updateUserAvatar(currentUser.studentId, newAvatar);
    if (res.success && res.user) {
      if (onUpdateUser) {
        onUpdateUser(res.user);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!studentId.trim()) {
      setErrorMsg(loginRole === 'admin' ? 'กรุณากรอกรหัสประจำตัวแอดมิน (Admin ID)' : 'กรุณากรอกเลขบัตรนักศึกษา');
      return;
    }

    if (!password.trim()) {
      setErrorMsg('กรุณากรอกรหัสผ่าน');
      return;
    }

    if (isLoginTab) {
      // 1. LOGIN AUTHENTICATION
      const authResult = authenticateUser(studentId, password);
      if (!authResult.success) {
        setErrorMsg(authResult.message);
        return;
      }

      // Check role matching for Admin login
      if (loginRole === 'admin' && authResult.user.role !== 'admin') {
        setErrorMsg('บัญชีนี้ไม่มีสิทธิ์ระดับผู้ดูแลระบบ (Admin)! กรุณาเลือกเข้าสู่ระบบในฐานะ "นักศึกษา"');
        return;
      }

      setSuccessMsg(`ยินดีต้อนรับคุณ ${authResult.user.fullName} (${authResult.user.role === 'admin' ? 'แอดมิน' : 'นักศึกษา'})`);
      setTimeout(() => {
        onLoginSuccess({
          ...authResult.user,
          isLoggedIn: true,
        });
        onClose();
      }, 500);
    } else {
      // 2. REGISTRATION
      if (!fullName.trim()) {
        setErrorMsg('กรุณากรอกชื่อ-นามสกุลสำหรับสมัครสมาชิก');
        return;
      }

      if (password.trim().length < 4) {
        setErrorMsg('รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
        return;
      }

      const regResult = registerNewUser({
        studentId,
        password,
        fullName,
        roomId: selectedRoomId,
        role: registerRole,
      });

      if (!regResult.success) {
        setErrorMsg(regResult.message);
        return;
      }

      setSuccessMsg(regResult.message);
      setTimeout(() => {
        onLoginSuccess({
          ...regResult.user,
          isLoggedIn: true,
        });
        onClose();
      }, 700);
    }
  };

  const handleFillDemo = (id, pass, role) => {
    setStudentId(id);
    setPassword(pass);
    setLoginRole(role);
    setIsLoginTab(true);
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card auth-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-top-bar">
          <div className="auth-brand-logo">
            <span className="material-symbols-outlined auth-icon">
              {currentUser?.isLoggedIn ? 'account_circle' : isLoginTab && loginRole === 'admin' ? 'admin_panel_settings' : 'school'}
            </span>
            <div>
              <h2 className="auth-title">
                {currentUser?.isLoggedIn 
                  ? 'ข้อมูลบัญชีผู้ใช้งาน' 
                  : isLoginTab 
                  ? `เข้าสู่ระบบ (${loginRole === 'admin' ? 'ผู้ดูแลระบบ Admin' : 'นักศึกษา'})` 
                  : 'สมัครสมาชิกใหม่ (Register)'}
              </h2>
              <span className="auth-sub">Smart Class Schedule System</span>
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

        {/* If user is currently logged in, show Profile Card with prominent Logout */}
        {currentUser?.isLoggedIn ? (
          <div className="logged-in-profile-box">
            <div 
              className={`profile-avatar-circle ${currentUser.role === 'admin' ? 'admin' : ''}`}
              onClick={() => setIsAvatarPickerOpen(true)}
              role="button"
              tabIndex={0}
              title="คลิกเพื่อเปลี่ยนรูปโปรไฟล์"
            >
              {currentUser.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.fullName} 
                  className="profile-circle-img" 
                />
              ) : (
                <span className="material-symbols-outlined">
                  {currentUser.role === 'admin' ? 'shield_person' : 'person'}
                </span>
              )}
              <div className="profile-avatar-edit-badge" title="เปลี่ยนรูปโปรไฟล์">
                <span className="material-symbols-outlined">photo_camera</span>
              </div>
            </div>

            <button 
              type="button" 
              className={`btn-change-avatar-pill ${currentUser.role === 'admin' ? 'admin' : ''}`}
              onClick={() => setIsAvatarPickerOpen(true)}
            >
              <span className="material-symbols-outlined">photo_camera</span>
              เปลี่ยนรูปโปรไฟล์ ({currentUser.role === 'admin' ? 'แอดมิน' : 'นักศึกษา'})
            </button>

            <h3 className="profile-name">{currentUser.fullName}</h3>
            <p className="profile-id">เลขประจำตัว: {currentUser.studentId}</p>
            <div className="profile-badge-row">
              <span className="profile-tag room">ห้องเรียน: {currentUser.roomId}</span>
              <span className={`profile-tag role ${currentUser.role}`}>
                {currentUser.role === 'admin' ? '🛡️ ผู้ดูแลระบบ (Admin)' : '👨‍🎓 นักศึกษา (Student)'}
              </span>
            </div>

            <div className="profile-actions-row">
              <button 
                type="button" 
                className="btn-logout"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              >
                <span className="material-symbols-outlined">logout</span>
                ออกจากระบบ (Logout)
              </button>
              <button 
                type="button" 
                className="btn-modal-primary"
                onClick={onClose}
              >
                กลับสู่หน้าตารางเรียน
              </button>
            </div>
          </div>
        ) : (
          /* Login / Register Interface */
          <div>
            {/* Tab switch: Login vs Register */}
            <div className="auth-tab-switch" role="tablist">
              <button 
                type="button" 
                role="tab"
                aria-selected={isLoginTab}
                className={`auth-tab-btn ${isLoginTab ? 'active' : ''}`}
                onClick={() => {
                  setIsLoginTab(true);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
              >
                <span className="material-symbols-outlined">login</span>
                เข้าสู่ระบบ (Login)
              </button>
              <button 
                type="button" 
                role="tab"
                aria-selected={!isLoginTab}
                className={`auth-tab-btn ${!isLoginTab ? 'active' : ''}`}
                onClick={() => {
                  setIsLoginTab(false);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
              >
                <span className="material-symbols-outlined">person_add</span>
                สมัครสมาชิก (Register)
              </button>
            </div>

            {/* SEPARATE LOGIN BY ROLE: Admin vs Student (แยกให้เลือกเข้าสู่ระบบระหว่าง แอดมิน และ นักศึกษา) */}
            {isLoginTab && (
              <div className="login-role-selector">
                <span className="login-role-label">เลือกประเภทผู้เข้าสู่ระบบ:</span>
                <div className="login-role-toggle-group">
                  <button 
                    type="button"
                    className={`btn-role-tab ${loginRole === 'student' ? 'active' : ''}`}
                    onClick={() => {
                      setLoginRole('student');
                      setErrorMsg('');
                    }}
                  >
                    <span className="material-symbols-outlined">school</span>
                    <span>นักศึกษา (Student)</span>
                  </button>
                  <button 
                    type="button"
                    className={`btn-role-tab admin ${loginRole === 'admin' ? 'active' : ''}`}
                    onClick={() => {
                      setLoginRole('admin');
                      setErrorMsg('');
                    }}
                  >
                    <span className="material-symbols-outlined">admin_panel_settings</span>
                    <span>ผู้ดูแลระบบ (Admin)</span>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form-body">
              {/* Full Name field for registration */}
              {!isLoginTab && (
                <div className="form-group">
                  <label className="form-label">ชื่อ - นามสกุล *</label>
                  <div className="input-with-icon">
                    <span className="material-symbols-outlined">badge</span>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="เช่น ธนภัทร สุขสมบูรณ์"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLoginTab}
                    />
                  </div>
                </div>
              )}

              {/* ID Input */}
              <div className="form-group">
                <label className="form-label">
                  {isLoginTab && loginRole === 'admin' 
                    ? 'รหัสผู้ดูแลระบบ (Admin ID) *' 
                    : 'เลขบัตรนักศึกษา (Student ID) *'}
                </label>
                <div className="input-with-icon">
                  <span className="material-symbols-outlined">numbers</span>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder={isLoginTab && loginRole === 'admin' ? 'เช่น ADMIN001' : 'เช่น 65070123'}
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label">รหัสผ่าน (Password) *</label>
                <div className="input-with-icon">
                  <span className="material-symbols-outlined">lock</span>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="กรอกรหัสผ่านของคุณ"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Classroom Section Selection (For Registration) */}
              {!isLoginTab && (
                <>
                  <div className="form-group">
                    <label className="form-label">ห้องเรียนประจำชั้น (Classroom)</label>
                    <div className="input-with-icon">
                      <span className="material-symbols-outlined">meeting_room</span>
                      <select 
                        className="form-select with-icon-pad"
                        value={selectedRoomId}
                        onChange={(e) => setSelectedRoomId(e.target.value)}
                      >
                        {availableRooms.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Role selector for registration */}
                  <div className="form-group">
                    <label className="form-label">ประเภทบัญชีผู้ใช้</label>
                    <div className="role-choice-grid">
                      <button 
                        type="button" 
                        className={`role-option-box ${registerRole === 'student' ? 'active' : ''}`}
                        onClick={() => setRegisterRole('student')}
                      >
                        <span className="material-symbols-outlined">school</span>
                        <span className="role-title">นักศึกษา</span>
                        <span className="role-sub">ดูตารางและลงชื่อเรียน</span>
                      </button>

                      <button 
                        type="button" 
                        className={`role-option-box ${registerRole === 'admin' ? 'active' : ''}`}
                        onClick={() => setRegisterRole('admin')}
                      >
                        <span className="material-symbols-outlined">admin_panel_settings</span>
                        <span className="role-title">ผู้ดูแลห้อง (Admin)</span>
                        <span className="role-sub">จัดการตาราง & สมาชิก</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {errorMsg && (
                <div className="form-error-banner" role="alert">
                  <span className="material-symbols-outlined">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="form-success-banner" role="alert">
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>{successMsg}</span>
                </div>
              )}

              <button type="submit" className={`btn-modal-primary full-width ${isLoginTab && loginRole === 'admin' ? 'btn-admin-theme' : ''}`}>
                <span className="material-symbols-outlined">
                  {isLoginTab ? (loginRole === 'admin' ? 'shield' : 'login') : 'how_to_reg'}
                </span>
                {isLoginTab 
                  ? (loginRole === 'admin' ? 'เข้าสู่ระบบในฐานะ แอดมิน (Admin)' : 'เข้าสู่ระบบในฐานะ นักศึกษา') 
                  : 'ยืนยันสมัครสมาชิก'}
              </button>
            </form>

            {/* Quick Demo Accounts Hint */}
            <div className="demo-login-box">
              <span className="demo-hint-title">
                💡 บัญชีทดสอบในระบบ (คลิกเพื่อกรอกอัตโนมัติ):
              </span>
              <div className="demo-btns-row">
                <button 
                  type="button" 
                  className="btn-demo-chip"
                  onClick={() => handleFillDemo('65070123', '1234', 'student')}
                >
                  <span className="material-symbols-outlined">school</span>
                  เข้าเป็นนักศึกษา: 65070123 (รหัสผ่าน: 1234)
                </button>
                <button 
                  type="button" 
                  className="btn-demo-chip admin"
                  onClick={() => handleFillDemo('ADMIN001', 'admin123', 'admin')}
                >
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                  เข้าเป็นแอดมิน: ADMIN001 (รหัสผ่าน: admin123)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Avatar Picker for User and Admin */}
        {isAvatarPickerOpen && currentUser?.isLoggedIn && (
          <AvatarPickerModal 
            isOpen={isAvatarPickerOpen}
            targetUser={currentUser}
            onClose={() => setIsAvatarPickerOpen(false)}
            onSave={handleSaveAvatar}
          />
        )}
      </div>
    </div>
  );
}
