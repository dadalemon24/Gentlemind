import { Mood, MoodConfig } from './types';

export const MOODS: MoodConfig[] = [
  { 
    id: Mood.AMAZING, 
    label: { th: 'ยอดเยี่ยม', en: 'Amazing' },
    emoji: '🤩', 
    color: 'text-amber-700', 
    bgColor: 'bg-amber-200',
    description: { th: 'วันนี้เป็นวันที่ดีที่สุด', en: 'Feeling on top of the world' }
  },
  { 
    id: Mood.HAPPY, 
    label: { th: 'มีความสุข', en: 'Happy' },
    emoji: '😊', 
    color: 'text-emerald-700', 
    bgColor: 'bg-emerald-200',
    description: { th: 'ยิ้มแย้มแจ่มใส', en: 'Smiling and joyful' }
  },
  { 
    id: Mood.NORMAL, 
    label: { th: 'เฉยๆ', en: 'Normal' },
    emoji: '😐', 
    color: 'text-stone-700', 
    bgColor: 'bg-stone-200',
    description: { th: 'เรียบง่าย สบายๆ', en: 'Just a regular day' }
  },
  { 
    id: Mood.EXHAUSTED, 
    label: { th: 'เหนื่อยล้า', en: 'Exhausted' },
    emoji: '😮‍💨', 
    color: 'text-orange-700', 
    bgColor: 'bg-orange-200',
    description: { th: 'หมดแรง ต้องการพักผ่อน', en: 'Drained and need rest' }
  },
  { 
    id: Mood.DEPRESSED, 
    label: { th: 'เศร้า/หดหู่', en: 'Sad' },
    emoji: '😢', 
    color: 'text-violet-700', 
    bgColor: 'bg-violet-200',
    description: { th: 'รู้สึกดาวน์ ไม่สดใส', en: 'Feeling down or blue' }
  },
  { 
    id: Mood.ANGRY, 
    label: { th: 'หงุดหงิด/โกรธ', en: 'Angry' },
    emoji: '😠', 
    color: 'text-rose-700', 
    bgColor: 'bg-rose-200',
    description: { th: 'อารมณ์ร้อน ขุ่นมัว', en: 'Frustrated or heated' }
  },
];

// Presets in seconds: 1min, 5min, 15min, 30min, 45min
export const DURATION_PRESETS = [60, 300, 900, 1800, 2700];

export const FALLBACK_QUOTES = {
  th: {
    default: "จงหายใจเข้าลึกๆ และรู้ว่าช่วงเวลานี้คือชีวิตของคุณ",
    [Mood.EXHAUSTED]: "การพักผ่อนไม่ใช่ความเกียจคร้าน แต่เป็นการชาร์จพลังให้จิตวิญญาณ",
    [Mood.ANGRY]: "ความโกรธก็เหมือนพายุที่พัดผ่าน เดี๋ยวท้องฟ้าก็จะกลับมาสดใส",
    [Mood.DEPRESSED]: "วันแย่ๆ ไม่ได้แปลว่าชีวิตแย่ พรุ่งนี้ยังมีดวงอาทิตย์ขึ้นเสมอ"
  },
  en: {
    default: "Breathe deeply, and know that this moment is your life.",
    [Mood.EXHAUSTED]: "Rest is not idleness, it's recharging your soul.",
    [Mood.ANGRY]: "Anger is like a storm; it passes, and the sky becomes clear again.",
    [Mood.DEPRESSED]: "A bad day doesn't mean a bad life. The sun always rises tomorrow."
  }
};

export const POST_SESSION_MESSAGES = {
    th: "ขอบคุณที่คุณมอบความรักให้แก่ใจของตัวเองในวันนี้ ขอให้ความสงบอยู่กับคุณตลอดทั้งวัน",
    en: "Thank you for showing love to your mind today. May peace be with you throughout the day."
};

export const TRANSLATIONS = {
  th: {
    welcome: "วันนี้คุณเป็นอย่างไรบ้าง?",
    selectMood: "เลือกสีที่ตรงกับความรู้สึกของคุณที่สุด",
    statsBtn: "ดูบันทึกอารมณ์ & สถิติ",
    startMeditation: "มาผ่อนคลายจิตใจกันเถอะ",
    backHome: "กลับหน้าหลัก",
    back: "ย้อนกลับ",
    setupTitle: "มาเริ่มฝึกจิต นั่งสมาธิกัน",
    durationLabel: "กำหนดเวลา (นาที : วินาที)",
    customDurationPlaceholder: "กำหนดเอง",
    soundLabel: "เสียงธรรมชาติ",
    startBtn: "มาเริ่มพักใจกัน",
    exit: "ออก",
    soundRain: "เสียงฝน",
    soundForest: "ป่าไม้",
    soundWaves: "คลื่นทะเล",
    soundNone: "เงียบสงบ",
    prepare: "เตรียมพร้อม...",
    greatJob: "ยอดเยี่ยมมาก!",
    compliment: "เก่งมากที่คุณสละเวลาเพื่อตัวเอง",
    healingMsgTitle: "ข้อความถึงคุณ",
    timeSpent: (min: number) => `คุณได้ใช้เวลา ${min.toFixed(1)} นาที อยู่กับตัวเอง`,
    moodBefore: "ความรู้สึกก่อนเริ่ม",
    viewProgress: "ดูบันทึกเวลาสมาธิ",
    footer: "© 2024 Gentle Mind - พื้นที่พักใจของคุณ",
    statsTitle: "บันทึกอารมณ์ & ช่วงสมาธิ",
    totalTime: "เวลารวม",
    totalSessions: "จำนวนครั้ง",
    mins: "นาที",
    secs: "วินาที",
    times: "ครั้ง",
    last7Days: "สถิติ 7 วันย้อนหลัง",
    loading: "กำลังประมวลผล...",
    error: "เกิดข้อผิดพลาด",
    days: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
    months: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
    breathing: {
        inhale: "หายใจเข้า...",
        exhale: "หายใจออก...",
        ready: "เตรียมพร้อม...",
        rest: "พัก"
    }
  },
  en: {
    welcome: "How are you today?",
    selectMood: "Select the color that best matches your mood.",
    statsBtn: "View Mood Tracker & Stats",
    startMeditation: "Let's relax your mind",
    backHome: "Back to Home",
    back: "Back",
    setupTitle: "Let's start practicing mindfulness",
    durationLabel: "Set Duration (Min : Sec)",
    customDurationPlaceholder: "Custom",
    soundLabel: "Nature Sounds",
    startBtn: "Start Session",
    exit: "Exit",
    soundRain: "Rain",
    soundForest: "Forest",
    soundWaves: "Waves",
    soundNone: "Silent",
    prepare: "Get Ready...",
    greatJob: "Great Job!",
    compliment: "Well done taking time for yourself.",
    healingMsgTitle: "A Message for You",
    timeSpent: (min: number) => `You spent ${min.toFixed(1)} minutes with yourself.`,
    moodBefore: "Mood Before",
    viewProgress: "View Meditation Log",
    footer: "© 2024 Gentle Mind - Your space for mindfulness",
    statsTitle: "Mood Tracker & Log",
    totalTime: "Total Time",
    totalSessions: "Total Sessions",
    mins: "mins",
    secs: "sec",
    times: "times",
    last7Days: "Last 7 Days",
    loading: "Processing...",
    error: "Error",
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    breathing: {
        inhale: "Inhale...",
        exhale: "Exhale...",
        ready: "Get Ready...",
        rest: "Rest"
    }
  }
};