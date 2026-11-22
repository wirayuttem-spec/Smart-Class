// Default Rooms Configuration
export const defaultRooms = [
  {
    id: 'CS-201',
    name: 'CS-201 : วิทยาการคอมพิวเตอร์ ปี 2',
    adminCode: 'CS201',
    department: 'คณะเทคโนโลยีสารสนเทศและวิทยาศาสตร์ข้อมูล',
    advisor: 'รศ.ดร. สุรชัย วัฒนกุล',
    studentCount: 38,
  },
  {
    id: 'IT-101',
    name: 'IT-101 : เทคโนโลยีสารสนเทศ ปี 1',
    adminCode: 'IT101',
    department: 'คณะเทคโนโลยีสารสนเทศ',
    advisor: 'ดร. กิตติศักดิ์ พรหมมินทร์',
    studentCount: 42,
  },
  {
    id: 'SE-301',
    name: 'SE-301 : วิศวกรรมซอฟต์แวร์ ปี 3',
    adminCode: 'SE301',
    department: 'คณะวิศวกรรมศาสตร์และเทคโนโลยี',
    advisor: 'ผศ.ดร. พิชญ์ อัศวเดชากุล',
    studentCount: 35,
  },
];

export const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

// Dynamic Real-time Week Calendar Generator
export function getCurrentWeekDays(customDate = new Date()) {
  const now = new Date(customDate);
  const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)

  // Find Monday of the current academic week
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const todayDateStr = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const weekConfigs = [
    { id: 'mon', name: 'Mon', dayTh: 'จันทร์', offset: 0 },
    { id: 'tue', name: 'Tue', dayTh: 'อังคาร', offset: 1 },
    { id: 'wed', name: 'Wed', dayTh: 'พุธ', offset: 2 },
    { id: 'thu', name: 'Thu', dayTh: 'พฤหัสบดี', offset: 3 },
    { id: 'fri', name: 'Fri', dayTh: 'ศุกร์', offset: 4 },
  ];

  return weekConfigs.map((cfg) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + cfg.offset);
    d.setHours(0, 0, 0, 0);

    const dTime = d.getTime();
    const isToday = dTime === todayDateStr;
    const isPast = dTime < todayDateStr;
    const isFuture = dTime > todayDateStr;

    const dateNum = d.getDate();
    const monthTh = THAI_MONTHS[d.getMonth()];
    const yearCE = d.getFullYear();
    const yearBE = yearCE + 543;

    return {
      id: cfg.id,
      name: cfg.name,
      dayTh: cfg.dayTh,
      date: dateNum,
      monthTh: monthTh,
      yearCE: yearCE,
      yearBE: yearBE,
      fullDate: `วัน${cfg.dayTh}ที่ ${dateNum} ${monthTh} ${yearCE}`,
      hasIndicator: cfg.id === 'wed' || cfg.id === 'thu',
      isToday,
      isPast,
      isFuture,
      rawDate: d,
    };
  });
}

export function getTodayDayId(customDate = new Date()) {
  const day = customDate.getDay();
  const map = {
    1: 'mon',
    2: 'tue',
    3: 'wed',
    4: 'thu',
    5: 'fri',
  };
  return map[day] || 'mon';
}

export function getCurrentThaiMonthAndYear(customDate = new Date()) {
  const month = THAI_MONTHS[customDate.getMonth()];
  const yearCE = customDate.getFullYear();
  const yearBE = yearCE + 543;
  return {
    monthTh: month,
    yearCE: String(yearCE),
    yearBE: String(yearBE),
    displayYear: `${yearCE}`,
  };
}

export const mockWeekDays = getCurrentWeekDays();

export const initialScheduleByRoom = {
  'CS-201': {
    mon: [
      {
        id: 'cs201-m1',
        startTime: '09:00',
        endTime: '11:00',
        courseCode: 'CS202',
        courseName: 'โครงสร้างข้อมูลและขั้นตอนวิธี (Data Structures)',
        building: 'ตึก 5 คณะเทคโนโลยีสารสนเทศ',
        floor: 'ชั้น 5',
        room: 'ห้อง 502',
        instructor: 'รศ.ดร. สุรชัย วัฒนกุล',
        instructorEmail: 'surachai.w@university.ac.th',
        credits: '3 (3-0-6)',
        status: 'finished',
        statusText: 'เรียนแล้ว',
        colorType: 'gray',
        isReminderOn: true,
      },
      {
        id: 'break-cs-mon',
        isLunchBreak: true,
        label: 'Lunch Break (พักกลางวัน)',
        startTime: '12:00',
        endTime: '13:00',
      },
      {
        id: 'cs201-m2',
        startTime: '13:00',
        endTime: '16:00',
        courseCode: 'CS202-L',
        courseName: 'ปฏิบัติการโครงสร้างข้อมูล (Data Structures Lab)',
        building: 'ตึก 5 คณะเทคโนโลยีสารสนเทศ',
        floor: 'ชั้น 8',
        room: 'ห้อง Lab 802',
        instructor: 'อ. นลินี ศรีสวัสดิ์',
        instructorEmail: 'nalinee.s@university.ac.th',
        credits: '1 (0-3-2)',
        status: 'finished',
        statusText: 'เรียนแล้ว',
        colorType: 'gray',
        assignment: 'ส่งโค้ด Binary Search Tree ในระบบ',
        isReminderOn: true,
      },
    ],
    tue: [
      {
        id: 'cs201-t1',
        startTime: '10:00',
        endTime: '12:00',
        courseCode: 'CS204',
        courseName: 'ระบบฐานข้อมูลเบื้องต้น (Database Systems)',
        building: 'ตึก 3 วิศวกรรมคอมพิวเตอร์',
        floor: 'ชั้น 4',
        room: 'ห้อง 405',
        instructor: 'ดร. กิตติศักดิ์ พรหมมินทร์',
        instructorEmail: 'kittisak.p@university.ac.th',
        credits: '3 (3-0-6)',
        status: 'finished',
        statusText: 'เรียนแล้ว',
        colorType: 'gray',
        isReminderOn: true,
      },
      {
        id: 'break-cs-tue',
        isLunchBreak: true,
        label: 'Lunch Break (พักกลางวัน)',
        startTime: '12:00',
        endTime: '13:30',
      },
      {
        id: 'cs201-t2',
        startTime: '13:30',
        endTime: '15:30',
        courseCode: 'GEN201',
        courseName: 'การสื่อสารภาษาอังกฤษเชิงวิชาชีพ (English for Careers)',
        building: 'ตึก 1 อาคารเรียนรวม',
        floor: 'ชั้น 3',
        room: 'ห้อง 302',
        instructor: 'Aj. Sarah Jenkins',
        instructorEmail: 'sarah.j@university.ac.th',
        credits: '2 (2-0-4)',
        status: 'finished',
        statusText: 'เรียนแล้ว',
        colorType: 'gray',
        isReminderOn: false,
      },
    ],
    wed: [
      {
        id: 'cs201-w1',
        startTime: '09:00',
        endTime: '10:30',
        courseCode: 'MATH201',
        courseName: 'สถิติและความน่าจะเป็นสำหรับวิทยาการข้อมูล',
        building: 'ตึกวิทยาศาสตร์ 1',
        floor: 'ชั้น 4',
        room: 'ห้อง Rm 402',
        instructor: 'Dr. Aris Thorne',
        instructorEmail: 'aris.t@university.ac.th',
        credits: '3 (3-0-6)',
        status: 'finished',
        statusText: 'เรียนแล้ว',
        colorType: 'gray',
        isReminderOn: true,
      },
      {
        id: 'cs201-w2',
        startTime: '11:00',
        endTime: '12:30',
        courseCode: 'CS210',
        courseName: 'การเขียนโปรแกรมเชิงวัตถุ (OOP Theory)',
        building: 'ตึก 5 คณะเทคโนโลยีสารสนเทศ',
        floor: 'ชั้น 7',
        room: 'ห้อง 705',
        instructor: 'ผศ.ดร. นภาพร จิตมั่นคง',
        instructorEmail: 'napaporn.c@university.ac.th',
        credits: '3 (2-2-5)',
        status: 'ongoing',
        statusText: 'กำลังเรียน',
        colorType: 'blue',
        progress: 60,
        timeLeft: 'อีก 35 นาทีหมดคาบ',
        studentsCount: 3,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        isReminderOn: true,
      },
      {
        id: 'break-cs-wed',
        isLunchBreak: true,
        label: 'Lunch Break (พักกลางวัน)',
        startTime: '12:30',
        endTime: '14:00',
      },
      {
        id: 'cs201-w3',
        startTime: '14:00',
        endTime: '16:00',
        courseCode: 'CS210-L',
        courseName: 'ปฏิบัติการโปรแกรมเชิงวัตถุ (OOP Lab)',
        building: 'ตึก 5 คณะเทคโนโลยีสารสนเทศ',
        floor: 'ชั้น 9',
        room: 'ห้อง Lab 903',
        instructor: 'อาจารย์ ธนาวัฒน์ สิริคุณ',
        instructorEmail: 'thanawat.s@university.ac.th',
        credits: '1 (0-3-2)',
        status: 'upcoming',
        statusText: 'คาบถัดไป',
        colorType: 'green',
        assignment: 'เตรียมแล็ปหัวข้อ Inheritance & Polymorphism',
        isReminderOn: true,
      },
    ],
    thu: [
      {
        id: 'cs201-th1',
        startTime: '09:00',
        endTime: '11:30',
        courseCode: 'DES212',
        courseName: 'การออกแบบส่วนต่อประสานผู้ใช้ (UI/UX Design)',
        building: 'ตึก 2 คณะสถาปัตยกรรมและสื่อดิจิทัล',
        floor: 'ชั้น 6',
        room: 'Studio 601',
        instructor: 'อ. นลินี ศรีสวัสดิ์',
        instructorEmail: 'nalinee.s@university.ac.th',
        credits: '3 (2-2-5)',
        status: 'upcoming',
        statusText: 'รอเริ่มเรียน',
        colorType: 'blue',
        assignment: 'ส่งแบบจำลอง Figma Hi-Fi Prototype',
        isReminderOn: true,
      },
      {
        id: 'break-cs-thu',
        isLunchBreak: true,
        label: 'Lunch Break (พักกลางวัน)',
        startTime: '11:30',
        endTime: '13:00',
      },
      {
        id: 'cs201-th2',
        startTime: '13:00',
        endTime: '15:00',
        courseCode: 'CS315',
        courseName: 'วิศวกรรมซอฟต์แวร์ (Software Engineering)',
        building: 'ตึก 5 คณะเทคโนโลยีสารสนเทศ',
        floor: 'ชั้น 7',
        room: 'ห้อง 708',
        instructor: 'ผศ.ดร. พิชญ์ อัศวเดชากุล',
        instructorEmail: 'pitch.a@university.ac.th',
        credits: '3 (3-0-6)',
        status: 'upcoming',
        statusText: 'รอเริ่มเรียน',
        colorType: 'green',
        isReminderOn: true,
      },
    ],
    fri: [
      {
        id: 'cs201-f1',
        startTime: '10:00',
        endTime: '12:00',
        courseCode: 'BUS101',
        courseName: 'ผู้ประกอบการดิจิทัลและสตาร์ทอัพ (Digital Entrepreneurship)',
        building: 'ตึก 4 อาคารบริหารธุรกิจ',
        floor: 'ชั้น 2',
        room: 'Auditorium 2',
        instructor: 'ดร. ปิยะบุตร แสนสุข',
        instructorEmail: 'piyabutr.s@university.ac.th',
        credits: '2 (2-0-4)',
        status: 'upcoming',
        statusText: 'รอเริ่มเรียน',
        colorType: 'green',
        isReminderOn: false,
      },
    ],
  },
  'IT-101': {
    mon: [
      {
        id: 'it101-m1',
        startTime: '09:00',
        endTime: '11:00',
        courseCode: 'IT101',
        courseName: 'เทคโนโลยีสารสนเทศเบื้องต้น (Introduction to IT)',
        building: 'ตึก 5 คณะเทคโนโลยีสารสนเทศ',
        floor: 'ชั้น 3',
        room: 'ห้อง 301',
        instructor: 'ดร. กิตติศักดิ์ พรหมมินทร์',
        instructorEmail: 'kittisak.p@university.ac.th',
        credits: '3 (3-0-6)',
        status: 'finished',
        statusText: 'เรียนแล้ว',
        colorType: 'gray',
        isReminderOn: true,
      },
    ],
    tue: [
      {
        id: 'it101-t1',
        startTime: '13:00',
        endTime: '16:00',
        courseCode: 'IT102-L',
        courseName: 'ปฏิบัติการพัฒนาเว็บไซต์เบื้องต้น (Web Development Lab)',
        building: 'ตึก 5 คณะเทคโนโลยีสารสนเทศ',
        floor: 'ชั้น 4',
        room: 'ห้อง Lab 402',
        instructor: 'อาจารย์ ธีรภัทร ชาญวิทย์',
        instructorEmail: 'theeraphat.c@university.ac.th',
        credits: '3 (2-2-5)',
        status: 'finished',
        statusText: 'เรียนแล้ว',
        colorType: 'gray',
        isReminderOn: true,
      },
    ],
    wed: [
      {
        id: 'it101-w1',
        startTime: '09:30',
        endTime: '12:00',
        courseCode: 'ENG101',
        courseName: 'ภาษาอังกฤษเพื่อการสื่อสาร 1 (English Communication I)',
        building: 'ตึก 1 อาคารเรียนรวม',
        floor: 'ชั้น 2',
        room: 'ห้อง 205',
        instructor: 'Aj. David Miller',
        instructorEmail: 'david.m@university.ac.th',
        credits: '3 (3-0-6)',
        status: 'ongoing',
        statusText: 'กำลังเรียน',
        colorType: 'blue',
        isReminderOn: true,
      },
    ],
    thu: [
      {
        id: 'it101-th1',
        startTime: '10:00',
        endTime: '12:00',
        courseCode: 'MATH105',
        courseName: 'คณิตศาสตร์พื้นฐานสำหรับเทคโนโลยีสารสนเทศ',
        building: 'ตึกวิทยาศาสตร์ 1',
        floor: 'ชั้น 3',
        room: 'ห้อง 305',
        instructor: 'Dr. Aris Thorne',
        instructorEmail: 'aris.t@university.ac.th',
        credits: '3 (3-0-6)',
        status: 'upcoming',
        statusText: 'รอเริ่มเรียน',
        colorType: 'green',
        isReminderOn: true,
      },
    ],
    fri: [
      {
        id: 'it101-f1',
        startTime: '09:00',
        endTime: '11:00',
        courseCode: 'GEN103',
        courseName: 'ทักษะชีวิตในศตวรรษที่ 21 (Life Skills in 21st Century)',
        building: 'ตึก 2 ชั้น 3',
        floor: 'ชั้น 3',
        room: 'ห้อง 301',
        instructor: 'ผศ.ดร. มาลี เจริญผล',
        instructorEmail: 'malee.c@university.ac.th',
        credits: '2 (2-0-4)',
        status: 'upcoming',
        statusText: 'รอเริ่มเรียน',
        colorType: 'green',
        isReminderOn: true,
      },
    ],
  },
  'SE-301': {
    mon: [
      {
        id: 'se301-m1',
        startTime: '09:00',
        endTime: '12:00',
        courseCode: 'SE310',
        courseName: 'สถาปัตยกรรมซอฟต์แวร์และการออกแบบ (Software Architecture)',
        building: 'ตึก 3 วิศวกรรมคอมพิวเตอร์',
        floor: 'ชั้น 5',
        room: 'ห้อง 501',
        instructor: 'ผศ.ดร. พิชญ์ อัศวเดชากุล',
        instructorEmail: 'pitch.a@university.ac.th',
        credits: '3 (3-0-6)',
        status: 'finished',
        statusText: 'เรียนแล้ว',
        colorType: 'gray',
        isReminderOn: true,
      },
    ],
    tue: [
      {
        id: 'se301-t1',
        startTime: '13:00',
        endTime: '16:00',
        courseCode: 'SE312-L',
        courseName: 'การทดสอบและการประกันคุณภาพซอฟต์แวร์ (Software QA & Testing Lab)',
        building: 'ตึก 5 คณะเทคโนโลยีสารสนเทศ',
        floor: 'ชั้น 8',
        room: 'ห้อง Lab 804',
        instructor: 'อาจารย์ ธนาวัฒน์ สิริคุณ',
        instructorEmail: 'thanawat.s@university.ac.th',
        credits: '3 (2-2-5)',
        status: 'finished',
        statusText: 'เรียนแล้ว',
        colorType: 'gray',
        isReminderOn: true,
      },
    ],
    wed: [
      {
        id: 'se301-w1',
        startTime: '10:00',
        endTime: '12:00',
        courseCode: 'SE320',
        courseName: 'การบริหารโครงการซอฟต์แวร์แบบอไจล์ (Agile Software Project Management)',
        building: 'ตึก 3 วิศวกรรมคอมพิวเตอร์',
        floor: 'ชั้น 6',
        room: 'ห้อง 602',
        instructor: 'รศ.ดร. สุรชัย วัฒนกุล',
        instructorEmail: 'surachai.w@university.ac.th',
        credits: '3 (3-0-6)',
        status: 'ongoing',
        statusText: 'กำลังเรียน',
        colorType: 'blue',
        isReminderOn: true,
      },
    ],
    thu: [
      {
        id: 'se301-th1',
        startTime: '13:00',
        endTime: '16:00',
        courseCode: 'SE330-L',
        courseName: 'คลาวด์เนทีฟและการนำส่งซอฟต์แวร์ (Cloud-Native & DevOps Lab)',
        building: 'ตึก 5 คณะเทคโนโลยีสารสนเทศ',
        floor: 'ชั้น 9',
        room: 'ห้อง Lab 901',
        instructor: 'อ. ธีรภัทร ชาญวิทย์',
        instructorEmail: 'theeraphat.c@university.ac.th',
        credits: '3 (2-2-5)',
        status: 'upcoming',
        statusText: 'รอเริ่มเรียน',
        colorType: 'green',
        isReminderOn: true,
      },
    ],
    fri: [
      {
        id: 'se301-f1',
        startTime: '09:30',
        endTime: '12:30',
        courseCode: 'SE399',
        courseName: 'เตรียมโครงงานวิศวกรรมซอฟต์แวร์ (Pre-Senior Project)',
        building: 'ตึก 3 วิศวกรรมคอมพิวเตอร์',
        floor: 'ชั้น 4',
        room: 'ห้องประชุมภาควิชา 401',
        instructor: 'คณาจารย์ภาควิชาวิศวกรรมซอฟต์แวร์',
        instructorEmail: 'se-faculty@university.ac.th',
        credits: '1 (0-3-2)',
        status: 'upcoming',
        statusText: 'รอเริ่มเรียน',
        colorType: 'blue',
        isReminderOn: true,
      },
    ],
  },
};

// LocalStorage Persistence Helpers
const STORAGE_SCHEDULES_KEY = 'smart_class_schedules_v1';
const STORAGE_ROOMS_KEY = 'smart_class_rooms_v1';
const STORAGE_USER_KEY = 'smart_class_user_v1';
const STORAGE_USERS_DB_KEY = 'smart_class_users_db_v1';
const STORAGE_REMINDER_SETTINGS_KEY = 'smart_class_reminder_settings_v1';
const STORAGE_COURSE_ENROLLMENTS_KEY = 'smart_class_course_enrollments_v1';

// Default Registered Users in Database
export const defaultRegisteredUsers = [
  {
    studentId: '65070123',
    password: '1234',
    fullName: 'ชนกันต์ สุขเกษม',
    role: 'student',
    roomId: 'CS-201',
    registeredAt: '2026-09-01 09:30',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  },
  {
    studentId: '65070188',
    password: '1234',
    fullName: 'กัญญาณัฐ วรเกียรติ',
    role: 'student',
    roomId: 'CS-201',
    registeredAt: '2026-09-02 11:15',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  },
  {
    studentId: '66080011',
    password: '1234',
    fullName: 'ธนวัฒน์ ปัญญาวงศ์',
    role: 'student',
    roomId: 'IT-101',
    registeredAt: '2026-09-03 14:00',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
  },
  {
    studentId: '64090255',
    password: '1234',
    fullName: 'พงศ์พิชิต ฤทธิรงค์',
    role: 'student',
    roomId: 'SE-301',
    registeredAt: '2026-09-05 10:20',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    studentId: 'ADMIN001',
    password: 'admin123',
    fullName: 'อาจารย์ ชัยวัฒน์ (ผู้ดูแลห้อง CS-201)',
    role: 'admin',
    roomId: 'CS-201',
    registeredAt: '2026-08-20 08:00',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
  },
];

// Curated Preset Avatars for Students and Admins
export const PRESET_AVATARS = [
  // นักศึกษา (Students)
  {
    id: 'student-male-1',
    name: 'นักศึกษาชาย 1',
    category: 'student',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'student-female-1',
    name: 'นักศึกษาหญิง 1',
    category: 'student',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'student-male-2',
    name: 'นักศึกษาชาย 2 (ไอที)',
    category: 'student',
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'student-female-2',
    name: 'นักศึกษาหญิง 2 (สดใส)',
    category: 'student',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'student-male-3',
    name: 'นักศึกษาชาย 3 (แคชชวล)',
    category: 'student',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'student-female-3',
    name: 'นักศึกษาหญิง 3 (ยิ้มแย้ม)',
    category: 'student',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'student-coder',
    name: 'นักศึกษา Developer',
    category: 'student',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'student-creative',
    name: 'นักศึกษา ดีไซเนอร์',
    category: 'student',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  },

  // อาจารย์ & แอดมิน (Admins & Professors)
  {
    id: 'admin-male-1',
    name: 'อาจารย์ / แอดมินชาย 1',
    category: 'admin',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'admin-female-1',
    name: 'อาจารย์ / แอดมินหญิง 1',
    category: 'admin',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'admin-tech',
    name: 'ผู้เชี่ยวชาญ Tech Admin',
    category: 'admin',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'admin-female-2',
    name: 'อาจารย์ / ผู้บริหารหญิง',
    category: 'admin',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'admin-male-2',
    name: 'อาจารย์ / แอดมินชาย 2',
    category: 'admin',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'admin-smart',
    name: 'ผู้ดูแลระบบอัจฉริยะ',
    category: 'admin',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  },
];

export function getStoredRooms() {
  try {
    const data = localStorage.getItem(STORAGE_ROOMS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading rooms from storage', e);
  }
  return defaultRooms;
}

export function saveStoredRooms(rooms) {
  try {
    localStorage.setItem(STORAGE_ROOMS_KEY, JSON.stringify(rooms));
  } catch (e) {
    console.error('Error saving rooms to storage', e);
  }
}

// Add New Classroom (Admin Functionality)
export function addNewRoom({ id, name, adminCode, department, advisor, studentCount }) {
  const rooms = getStoredRooms();
  const normalizedId = id.trim().toUpperCase();

  const exists = rooms.some((r) => r.id.toUpperCase() === normalizedId);
  if (exists) {
    return { success: false, message: `รหัสห้องเรียน "${normalizedId}" มีอยู่ในระบบแล้ว` };
  }

  const newRoom = {
    id: normalizedId,
    name: name.trim() || `${normalizedId} : ห้องเรียนใหม่`,
    adminCode: (adminCode || normalizedId).trim(),
    department: department?.trim() || 'ภาควิชาทั่วไป',
    advisor: advisor?.trim() || 'อาจารย์ที่ปรึกษาประจำห้อง',
    studentCount: Number(studentCount) || 30,
  };

  const updatedRooms = [...rooms, newRoom];
  saveStoredRooms(updatedRooms);

  // Initialize schedule template for this room
  const emptyWeekSchedule = {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
  };
  saveStoredScheduleForRoom(normalizedId, emptyWeekSchedule);

  return { success: true, room: newRoom, rooms: updatedRooms };
}

// Delete Classroom (Admin Functionality)
export function deleteRoom(roomId) {
  const rooms = getStoredRooms();
  const normalizedId = roomId.trim().toUpperCase();

  if (rooms.length <= 1) {
    return { 
      success: false, 
      message: 'ไม่สามารถลบห้องเรียนได้ ต้องมีห้องเรียนอย่างน้อย 1 ห้องในระบบ' 
    };
  }

  const targetRoomIndex = rooms.findIndex((r) => r.id.toUpperCase() === normalizedId);
  if (targetRoomIndex === -1) {
    return { 
      success: false, 
      message: `ไม่พบห้องเรียน "${normalizedId}" ในระบบ` 
    };
  }

  const updatedRooms = rooms.filter((r) => r.id.toUpperCase() !== normalizedId);
  saveStoredRooms(updatedRooms);

  const fallbackRoomId = updatedRooms[0].id;

  // Clean up schedule from STORAGE_SCHEDULES_KEY
  try {
    const existing = localStorage.getItem(STORAGE_SCHEDULES_KEY);
    if (existing) {
      const allSchedules = JSON.parse(existing);
      delete allSchedules[normalizedId];
      localStorage.setItem(STORAGE_SCHEDULES_KEY, JSON.stringify(allSchedules));
    }
  } catch (e) {
    console.error('Error removing schedule for deleted room', e);
  }

  // Reassign any users registered in this room to the fallback room
  try {
    const users = getRegisteredUsers();
    let usersUpdated = false;
    const remappedUsers = users.map((u) => {
      if (u.roomId && u.roomId.toUpperCase() === normalizedId) {
        usersUpdated = true;
        return { ...u, roomId: fallbackRoomId };
      }
      return u;
    });
    if (usersUpdated) {
      saveRegisteredUsers(remappedUsers);
    }
  } catch (e) {
    console.error('Error remapping users of deleted room', e);
  }

  return { 
    success: true, 
    rooms: updatedRooms, 
    deletedRoomId: normalizedId,
    fallbackRoomId 
  };
}

export function getStoredSchedules(roomId) {
  try {
    const data = localStorage.getItem(STORAGE_SCHEDULES_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed[roomId]) return parsed[roomId];
    }
  } catch (e) {
    console.error('Error loading schedules from storage', e);
  }
  return initialScheduleByRoom[roomId] || { mon: [], tue: [], wed: [], thu: [], fri: [] };
}

export function saveStoredScheduleForRoom(roomId, newSchedule) {
  try {
    let allSchedules = {};
    const existing = localStorage.getItem(STORAGE_SCHEDULES_KEY);
    if (existing) {
      allSchedules = JSON.parse(existing);
    } else {
      allSchedules = { ...initialScheduleByRoom };
    }
    allSchedules[roomId] = newSchedule;
    localStorage.setItem(STORAGE_SCHEDULES_KEY, JSON.stringify(allSchedules));
  } catch (e) {
    console.error('Error saving schedule for room', e);
  }
}

// ==========================================
// USER DATABASE & AUTHENTICATION MANAGEMENT
// ==========================================
export function getRegisteredUsers() {
  try {
    const data = localStorage.getItem(STORAGE_USERS_DB_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure all users have an avatar field populated
      let hasChanges = false;
      const verified = parsed.map((u) => {
        if (!u.avatar) {
          const matchDefault = defaultRegisteredUsers.find(
            (d) => d.studentId.toLowerCase() === (u.studentId || '').toLowerCase()
          );
          hasChanges = true;
          return {
            ...u,
            avatar: matchDefault?.avatar || (u.role === 'admin'
              ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'
              : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'),
          };
        }
        return u;
      });
      if (hasChanges) {
        saveRegisteredUsers(verified);
      }
      return verified;
    }
  } catch (e) {
    console.error('Error loading users DB', e);
  }
  // Store default users on first load
  saveRegisteredUsers(defaultRegisteredUsers);
  return defaultRegisteredUsers;
}

export function saveRegisteredUsers(users) {
  try {
    localStorage.setItem(STORAGE_USERS_DB_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users DB', e);
  }
}

export function registerNewUser({ studentId, password, fullName, roomId, role, avatar }) {
  const users = getRegisteredUsers();
  const trimmedId = studentId.trim();

  // Check if student ID already registered
  const exists = users.find((u) => u.studentId.toLowerCase() === trimmedId.toLowerCase());
  if (exists) {
    return {
      success: false,
      message: `เลขบัตรนักศึกษา "${trimmedId}" นี้ได้ลงทะเบียนไว้แล้วในระบบ! กรุณาเข้าสู่ระบบด้วยรหัสผ่านของคุณ`,
    };
  }

  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const defaultAvatar = (role === 'admin')
    ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';

  const newUser = {
    studentId: trimmedId,
    password: password.trim(),
    fullName: fullName.trim(),
    roomId: roomId || 'CS-201',
    role: role || 'student',
    registeredAt: formattedDate,
    avatar: avatar || defaultAvatar,
  };

  const updatedUsers = [newUser, ...users];
  saveRegisteredUsers(updatedUsers);

  return {
    success: true,
    user: newUser,
    message: 'สมัครสมาชิกสำเร็จเรียบร้อย! ข้อมูลของคุณได้รับการบันทึกเข้าสู่ฐานข้อมูลระบบแล้ว',
  };
}

// Strict Authentication: Must match registered database!
export function authenticateUser(studentId, password) {
  const users = getRegisteredUsers();
  const trimmedId = (studentId || '').trim().toLowerCase();
  const trimmedPass = (password || '').trim();

  const user = users.find((u) => u.studentId.toLowerCase() === trimmedId);

  if (!user) {
    return {
      success: false,
      message: `ไม่พบข้อมูลเลขบัตรนักศึกษา "${studentId}" ในระบบ! กรุณาตรวจสอบหรือไปที่แท็บ "สมัครสมาชิก" เพื่อลงทะเบียนก่อน`,
    };
  }

  if (user.password !== trimmedPass) {
    return {
      success: false,
      message: 'รหัสผ่านไม่ถูกต้อง! กรุณาลองใหม่อีกครั้ง',
    };
  }

  return {
    success: true,
    user: user,
    message: 'เข้าสู่ระบบสำเร็จ',
  };
}

export function deleteRegisteredUser(studentId) {
  const users = getRegisteredUsers();
  const filtered = users.filter((u) => u.studentId !== studentId);
  saveRegisteredUsers(filtered);
  return filtered;
}

// Update avatar for user or admin (ONLY oneself can update their own avatar)
export function updateUserAvatar(studentId, newAvatar) {
  const current = getStoredUser();
  const trimmedTargetId = (studentId || '').trim().toLowerCase();
  const currentUserId = (current?.studentId || '').trim().toLowerCase();

  // Strict Rule: Only oneself can edit their own profile avatar!
  if (!current?.isLoggedIn || !currentUserId || currentUserId !== trimmedTargetId) {
    console.warn('Unauthorized: You can only edit your own profile picture!');
    return {
      success: false,
      message: 'คุณสามารถแก้ไขรูปโปรไฟล์ของตนเองได้เท่านั้น',
    };
  }

  const users = getRegisteredUsers();
  let updatedTarget = null;

  const updatedUsers = users.map((u) => {
    if (u.studentId.toLowerCase() === trimmedTargetId) {
      updatedTarget = { ...u, avatar: newAvatar };
      return updatedTarget;
    }
    return u;
  });

  saveRegisteredUsers(updatedUsers);

  // Update current session user storage
  const updatedCurrent = { ...current, avatar: newAvatar };
  saveStoredUser(updatedCurrent);

  return { success: true, user: updatedCurrent };
}

// Client-side image resizing and compression helper (fits nicely in localStorage)
export function resizeImageFile(file, maxWidth = 260, maxHeight = 260, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('กรุณาเลือกไฟล์รูปภาพที่ถูกต้อง (JPEG, PNG, WEBP)'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('ไม่สามารถประมวลผลไฟล์รูปภาพได้'));
      img.src = readerEvent.target.result;
    };
    reader.onerror = () => reject(new Error('เกิดข้อผิดพลาดในการอ่านไฟล์'));
    reader.readAsDataURL(file);
  });
}

// Current Session User
export function getStoredUser() {
  try {
    const data = localStorage.getItem(STORAGE_USER_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.isLoggedIn && !parsed.avatar) {
        // sync avatar from DB
        const users = getRegisteredUsers();
        const found = users.find(u => u.studentId?.toLowerCase() === parsed.studentId?.toLowerCase());
        if (found?.avatar) {
          parsed.avatar = found.avatar;
          saveStoredUser(parsed);
        }
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error loading user from storage', e);
  }
  return {
    studentId: '',
    fullName: '',
    role: 'student',
    roomId: 'CS-201',
    isLoggedIn: false,
    avatar: '',
  };
}

export function saveStoredUser(user) {
  try {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Error saving user to storage', e);
  }
}

// ==========================================
// CLASSROOM & COURSE STUDENT COUNT SYSTEM
// ==========================================
export function getStoredCourseEnrollments() {
  try {
    const data = localStorage.getItem(STORAGE_COURSE_ENROLLMENTS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading course enrollments', e);
  }
  return {
    'cs201-w2': ['65070123', '65070188'],
    'cs201-w3': ['65070123'],
    'cs201-th1': ['65070123', '65070188'],
  };
}

export function saveStoredCourseEnrollments(enrollments) {
  try {
    localStorage.setItem(STORAGE_COURSE_ENROLLMENTS_KEY, JSON.stringify(enrollments));
  } catch (e) {
    console.error('Error saving course enrollments', e);
  }
}

// Calculate total registered students in a classroom
export function getRoomRegisteredStudentsCount(roomId) {
  const users = getRegisteredUsers();
  const roomUsers = users.filter((u) => u.roomId === roomId && u.role === 'student');
  return roomUsers.length;
}

// Calculate course enrolled student count (Base course capacity + registered students in that course)
export function getCourseStudentCount(courseId, baseStudents = 35) {
  const enrollments = getStoredCourseEnrollments();
  const enrolledList = enrollments[courseId] || [];
  return baseStudents + enrolledList.length;
}

// Toggle enrolled state for a logged-in student in a course
export function toggleCourseEnrollment(courseId, studentId) {
  if (!studentId) return { success: false, message: 'กรุณาเข้าสู่ระบบก่อนเช็คชื่อ/ลงเรียนวิชานี้' };
  const enrollments = getStoredCourseEnrollments();
  const currentList = enrollments[courseId] || [];

  let updatedList;
  let isEnrolled;
  if (currentList.includes(studentId)) {
    updatedList = currentList.filter((id) => id !== studentId);
    isEnrolled = false;
  } else {
    updatedList = [...currentList, studentId];
    isEnrolled = true;
  }

  enrollments[courseId] = updatedList;
  saveStoredCourseEnrollments(enrollments);

  return { success: true, isEnrolled, enrolledCount: updatedList.length };
}

export function isStudentEnrolledInCourse(courseId, studentId) {
  if (!studentId) return false;
  const enrollments = getStoredCourseEnrollments();
  const list = enrollments[courseId] || [];
  return list.includes(studentId);
}

export function getReminderSettings() {
  try {
    const data = localStorage.getItem(STORAGE_REMINDER_SETTINGS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading reminder settings', e);
  }
  return {
    enable15MinReminder: true,
    soundEnabled: true,
    browserNotification: false,
  };
}

export function saveReminderSettings(settings) {
  try {
    localStorage.setItem(STORAGE_REMINDER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving reminder settings', e);
  }
}

// ==========================================
// REAL-TIME DYNAMIC COURSE STATUS CALCULATOR
// ==========================================
export function calculateRealtimeCourseStatus(course, selectedDayId) {
  if (!course) return {};

  const effectiveDayId = selectedDayId || getTodayDayId();

  // 1. If instructor explicitly cancelled the class (highest priority)
  if (course.isCancelled) {
    return {
      status: 'cancelled',
      statusText: '🚫 ยกคลาส',
      progress: 0,
      timeLeft: 'อาจารย์แจ้งยกคลาส',
      isCancelled: true,
      accentClass: 'accent-cancelled',
    };
  }

  // 2. Real-time calendar day comparison (ตรวจเทียบกับปฏิทินจริงแบบเรียลไทม์)
  const weekDays = getCurrentWeekDays();
  const targetDay = weekDays.find((d) => d.id === effectiveDayId);

  const isPastDay = targetDay ? targetDay.isPast : false;
  const isFutureDay = targetDay ? targetDay.isFuture : false;
  const isToday = targetDay ? targetDay.isToday : (effectiveDayId === getTodayDayId());

  // 2.1 วันที่ผ่านมาแล้วในสัปดาห์ -> ขึ้นสถานะ "เรียนแล้ว" (สีทึบ) ทันทีแบบเรียลไทม์
  if (isPastDay) {
    return {
      status: 'finished',
      statusText: 'เรียนแล้ว',
      progress: 100,
      timeLeft: 'เรียนผ่านไปแล้ว',
      accentClass: 'accent-finished',
      isPastDay: true,
      isOnline: Boolean(course.isOnline),
    };
  }

  // 2.2 วันในอนาคตที่ยังมาไม่ถึง
  if (isFutureDay) {
    if (course.isOnline) {
      return {
        status: 'online',
        statusText: '🌐 เรียนออนไลน์',
        progress: 0,
        timeLeft: 'เรียนผ่านระบบออนไลน์',
        isOnline: true,
        accentClass: 'accent-online',
        isFutureDay: true,
      };
    }
    return {
      status: 'upcoming',
      statusText: 'รอเริ่มเรียน',
      progress: 0,
      timeLeft: 'ยังไม่ถึงวันเรียน',
      accentClass: 'accent-upcoming',
      isFutureDay: true,
    };
  }

  // 2.3 หากเป็น "วันนี้" (Today) -> ตรวจสอบตามนาฬิกาดิจิทัลจริงแบบเรียลไทม์ (นาทีต่อนาที)
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = (course.startTime || '09:00').split(':').map(Number);
  const [endH, endM] = (course.endTime || '10:30').split(':').map(Number);

  const startMinutes = (startH || 0) * 60 + (startM || 0);
  const endMinutes = (endH || 0) * 60 + (endM || 0);

  if (currentMinutes < startMinutes) {
    const diff = startMinutes - currentMinutes;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    const timeLeft = hours > 0 ? `อีก ${hours} ชม. ${mins} นาทีเริ่ม` : `อีก ${mins} นาทีเริ่ม`;
    const isVerySoon = diff <= 60;

    if (course.isOnline) {
      return {
        status: 'online',
        statusText: '🌐 เรียนออนไลน์',
        progress: 0,
        timeLeft: timeLeft,
        accentClass: 'accent-online',
        isOnline: true,
      };
    }

    return {
      status: 'upcoming',
      statusText: isVerySoon ? 'คาบถัดไป' : 'รอเริ่มเรียน',
      progress: 0,
      timeLeft: timeLeft,
      accentClass: 'accent-upcoming',
    };
  } else if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
    const total = Math.max(1, endMinutes - startMinutes);
    const elapsed = currentMinutes - startMinutes;
    const percent = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
    const remaining = endMinutes - currentMinutes;

    return {
      status: 'ongoing',
      statusText: course.isOnline ? 'กำลังเรียน (ออนไลน์)' : 'กำลังเรียน',
      progress: percent,
      timeLeft: `อีก ${remaining} นาทีหมดคาบ`,
      accentClass: 'accent-ongoing',
      isOnline: Boolean(course.isOnline),
    };
  } else {
    // เวลาปัจจุบันเลยเวลาเลิกคลาสในวันนี้แล้ว -> สถานะเป็น "เรียนแล้ว" (สีทึบ)
    return {
      status: 'finished',
      statusText: 'เรียนแล้ว',
      progress: 100,
      timeLeft: 'จบคลาสแล้ววันนี้',
      accentClass: 'accent-finished',
      isOnline: Boolean(course.isOnline),
    };
  }
}


