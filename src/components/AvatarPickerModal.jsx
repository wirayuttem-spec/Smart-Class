import React, { useState, useRef, useEffect } from 'react';
import { PRESET_AVATARS, resizeImageFile } from '../data/mockData';

export default function AvatarPickerModal({ 
  isOpen, 
  targetUser, 
  onClose, 
  onSave 
}) {
  const [activeTab, setActiveTab] = useState('presets'); // 'presets' | 'upload' | 'url'
  const [categoryFilter, setCategoryFilter] = useState(targetUser?.role === 'admin' ? 'admin' : 'all');
  const [selectedAvatar, setSelectedAvatar] = useState(targetUser?.avatar || '');
  const [customUrl, setCustomUrl] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !targetUser) return;
    setSelectedAvatar(targetUser?.avatar || '');
    setCustomUrl('');
    setUploadError('');
    setSuccessToast('');
    if (targetUser?.role === 'admin') {
      setCategoryFilter('admin');
    } else {
      setCategoryFilter('student');
    }
  }, [targetUser, isOpen]);

  if (!isOpen || !targetUser) return null;

  const filteredPresets = PRESET_AVATARS.filter((p) => {
    if (categoryFilter === 'all') return true;
    return p.category === categoryFilter;
  });

  const handleSelectPreset = (url) => {
    setSelectedAvatar(url);
    setUploadError('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setUploadError('');

    try {
      const resizedBase64 = await resizeImageFile(file, 260, 260, 0.85);
      setSelectedAvatar(resizedBase64);
      setSuccessToast('อัปโหลดและปรับขนาดรูปภาพเรียบร้อย!');
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      setUploadError(err.message || 'ไม่สามารถประมวลผลไฟล์ได้');
    } finally {
      setIsProcessingFile(false);
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApplyUrl = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) {
      setUploadError('กรุณากรอกลิงก์รูปภาพ');
      return;
    }
    setSelectedAvatar(customUrl.trim());
    setUploadError('');
    setSuccessToast('เลือกรูปภาพจากลิงก์แล้ว');
    setTimeout(() => setSuccessToast(''), 2500);
  };

  const handleRemoveAvatar = () => {
    setSelectedAvatar('');
    setUploadError('');
    setSuccessToast('รีเซ็ตเป็นรูปโปรไฟล์เริ่มต้น');
    setTimeout(() => setSuccessToast(''), 2500);
  };

  const handleConfirmSave = () => {
    if (onSave) {
      onSave(selectedAvatar);
    }
    if (onClose) {
      onClose();
    }
  };

  const isAdmin = targetUser?.role === 'admin';

  return (
    <div className="modal-overlay avatar-picker-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card avatar-picker-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="modal-top-bar">
          <div className="avatar-picker-title-group">
            <span className="material-symbols-outlined avatar-picker-icon">
              {isAdmin ? 'shield_person' : 'account_circle'}
            </span>
            <div>
              <h2 className="avatar-picker-modal-title">
                {isAdmin ? 'เปลี่ยนรูปโปรไฟล์ของคุณ (แอดมิน)' : 'เปลี่ยนรูปโปรไฟล์ของคุณ'}
              </h2>
              <span className="avatar-picker-subtitle">
                {targetUser.fullName} • {isAdmin ? '🛡️ ผู้ดูแลระบบ' : `👨‍🎓 ห้อง ${targetUser.roomId || 'CS-201'}`}
              </span>
            </div>
          </div>
          <button 
            type="button"
            className="modal-close-icon-btn" 
            onClick={onClose} 
            aria-label="ปิดหน้าต่าง"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Security badge: Self edit only */}
        <div className="avatar-self-badge-pill">
          <span className="material-symbols-outlined">verified_user</span>
          <span>แก้ไขได้เฉพาะเจ้าของบัญชีเท่านั้น • ข้อมูลได้รับการปกป้อง</span>
        </div>

        {/* Live Preview Bar */}
        <div className={`avatar-live-preview-box ${isAdmin ? 'admin-theme' : 'student-theme'}`}>
          <div className="avatar-preview-wrapper">
            {selectedAvatar ? (
              <img 
                src={selectedAvatar} 
                alt="ตัวอย่างรูปโปรไฟล์" 
                className="avatar-preview-img"
                onError={() => {
                  setUploadError('ไม่สามารถโหลดภาพจาก URL นี้ได้ กรุณาตรวจสอบลิงก์');
                }}
              />
            ) : (
              <div className="avatar-preview-fallback">
                <span className="material-symbols-outlined">
                  {isAdmin ? 'shield_person' : 'person'}
                </span>
              </div>
            )}
            <span className={`avatar-role-badge ${isAdmin ? 'admin' : 'student'}`}>
              <span className="material-symbols-outlined">
                {isAdmin ? 'verified' : 'school'}
              </span>
            </span>
          </div>

          <div className="avatar-preview-details">
            <span className="avatar-preview-label">ภาพที่จะแสดงในระบบ:</span>
            <span className="avatar-preview-name">{targetUser.fullName}</span>
            <div className="avatar-preview-actions">
              {selectedAvatar && (
                <button 
                  type="button" 
                  className="btn-remove-avatar-link"
                  onClick={handleRemoveAvatar}
                  title="ลบรูปและใช้ไอคอนเริ่มต้น"
                >
                  <span className="material-symbols-outlined">delete</span>
                  ลบรูปนี้ / ใช้ค่าเริ่มต้น
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Feedback message */}
        {uploadError && (
          <div className="avatar-picker-alert error">
            <span className="material-symbols-outlined">error</span>
            <span>{uploadError}</span>
          </div>
        )}
        {successToast && (
          <div className="avatar-picker-alert success">
            <span className="material-symbols-outlined">check_circle</span>
            <span>{successToast}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="avatar-method-tabs" role="tablist">
          <button 
            type="button"
            role="tab"
            aria-selected={activeTab === 'presets'}
            className={`avatar-tab-btn ${activeTab === 'presets' ? 'active' : ''}`}
            onClick={() => { setActiveTab('presets'); setUploadError(''); }}
          >
            <span className="material-symbols-outlined">photo_library</span>
            รูปสำเร็จรูป
          </button>
          <button 
            type="button"
            role="tab"
            aria-selected={activeTab === 'upload'}
            className={`avatar-tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => { setActiveTab('upload'); setUploadError(''); }}
          >
            <span className="material-symbols-outlined">upload_file</span>
            อัปโหลดจากเครื่อง
          </button>
          <button 
            type="button"
            role="tab"
            aria-selected={activeTab === 'url'}
            className={`avatar-tab-btn ${activeTab === 'url' ? 'active' : ''}`}
            onClick={() => { setActiveTab('url'); setUploadError(''); }}
          >
            <span className="material-symbols-outlined">link</span>
            ใส่ลิงก์รูปภาพ
          </button>
        </div>

        {/* Tab 1: Preset Avatars */}
        {activeTab === 'presets' && (
          <div className="avatar-tab-content">
            {/* Filter chips */}
            <div className="avatar-category-filters">
              <button 
                type="button"
                className={`filter-chip ${categoryFilter === 'all' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('all')}
              >
                ทั้งหมด ({PRESET_AVATARS.length})
              </button>
              <button 
                type="button"
                className={`filter-chip ${categoryFilter === 'student' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('student')}
              >
                👨‍🎓 นักศึกษา
              </button>
              <button 
                type="button"
                className={`filter-chip ${categoryFilter === 'admin' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('admin')}
              >
                🛡️ อาจารย์ & แอดมิน
              </button>
            </div>

            {/* Avatars Grid */}
            <div className="avatar-preset-grid">
              {filteredPresets.map((preset) => {
                const isSelected = selectedAvatar === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    className={`preset-avatar-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectPreset(preset.url)}
                    title={preset.name}
                  >
                    <img 
                      src={preset.url} 
                      alt={preset.name} 
                      className="preset-avatar-thumb" 
                      loading="lazy"
                    />
                    <span className="preset-avatar-title">{preset.name}</span>
                    {isSelected && (
                      <span className="preset-selected-check">
                        <span className="material-symbols-outlined">check</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Upload from Device */}
        {activeTab === 'upload' && (
          <div className="avatar-tab-content upload-tab-pane">
            <div 
              className={`avatar-dropzone ${isProcessingFile ? 'processing' : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden-file-input"
                onChange={handleFileUpload}
              />
              <div className="dropzone-icon-circle">
                <span className="material-symbols-outlined">
                  {isProcessingFile ? 'sync' : 'add_photo_alternate'}
                </span>
              </div>
              <h4 className="dropzone-prompt">
                {isProcessingFile ? 'กำลังปรับขนาดรูปภาพ...' : 'คลิกเพื่อเลือกรูปภาพจากเครื่อง'}
              </h4>
              <p className="dropzone-hint">
                รองรับไฟล์ภาพ JPG, PNG, WEBP จากโทรศัพท์มือถือหรือคอมพิวเตอร์
              </p>
              <span className="btn-browse-file">
                <span className="material-symbols-outlined">folder_open</span>
                เลือกไฟล์ภาพ
              </span>
            </div>
            <p className="upload-notice">
              💡 ระบบจะบีบอัดและปรับขนาดรูปให้เหมาะสมกับการแสดงผลโดยอัตโนมัติ เพื่อให้โหลดรวดเร็วและไม่เปลืองพื้นที่
            </p>
          </div>
        )}

        {/* Tab 3: Custom URL */}
        {activeTab === 'url' && (
          <div className="avatar-tab-content url-tab-pane">
            <form onSubmit={handleApplyUrl} className="avatar-url-form">
              <label className="avatar-input-label">วาง URL ของรูปภาพจากอินเทอร์เน็ต:</label>
              <div className="avatar-url-input-group">
                <span className="material-symbols-outlined url-prefix-icon">http</span>
                <input 
                  type="url"
                  className="avatar-url-input"
                  placeholder="https://example.com/photo.jpg"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                />
                <button type="submit" className="btn-apply-url">
                  ใช้รูปนี้
                </button>
              </div>
              <p className="avatar-input-hint">
                สามารถคัดลอก Image Address จากเว็บใดก็ได้มาวางเพื่อใช้งานทันที
              </p>
            </form>
          </div>
        )}

        {/* Modal Bottom Buttons */}
        <div className="modal-bottom-actions">
          <button 
            type="button" 
            className="btn-modal-cancel" 
            onClick={onClose}
          >
            ยกเลิก
          </button>
          <button 
            type="button" 
            className={`btn-modal-confirm-save ${isAdmin ? 'admin-save' : ''}`}
            onClick={handleConfirmSave}
          >
            <span className="material-symbols-outlined">save</span>
            บันทึกรูปโปรไฟล์
          </button>
        </div>
      </div>
    </div>
  );
}

