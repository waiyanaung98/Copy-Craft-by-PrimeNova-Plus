import { Framework, Language, Tone, ContentPillar, TranslationResource, BrandProfile } from './types';
import { 
  Megaphone, 
  AlertCircle, 
  ArrowRight, 
  Gift, 
  HelpCircle, 
  PenTool,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const FRAMEWORK_DETAILS = {
  [Framework.AIDA]: {
    title: 'AIDA Model',
    description: 'Attention, Interest, Desire, Action. The classic copywriting formula.',
    icon: Megaphone
  },
  [Framework.PAS]: {
    title: 'PAS Formula',
    description: 'Problem, Agitation, Solution. Perfect for addressing pain points.',
    icon: AlertCircle
  },
  [Framework.BAB]: {
    title: 'Before-After-Bridge',
    description: 'Show the current pain, the future benefit, and how to get there.',
    icon: ArrowRight
  },
  [Framework.FAB]: {
    title: 'Feature-Advantage-Benefit',
    description: 'Turn technical features into desirable benefits.',
    icon: Gift
  },
  [Framework.QUEST]: {
    title: 'QUEST',
    description: 'Qualify, Understand, Educate, Stimulate, Transition.',
    icon: HelpCircle
  },
  [Framework.FOUR_P]: {
    title: 'The 4 Ps',
    description: 'Promise, Picture, Proof, Push. Persuasive and visual.',
    icon: BookOpen
  },
  [Framework.PASTOR]: {
    title: 'PASTOR',
    description: 'Problem, Amplify, Story, Transformation, Offer, Response.',
    icon: BookOpen
  },
  [Framework.FREESTYLE]: {
    title: 'Freestyle / Social',
    description: 'Creative, engaging posts for social media without a strict structure.',
    icon: Sparkles
  }
};

export const TONE_LABELS: TranslationResource = {
  [Tone.PROFESSIONAL]: { [Language.EN]: 'Professional', [Language.MY]: 'ပရော်ဖက်ရှင်နယ်', [Language.TH]: 'มืออาชีพ' },
  [Tone.FRIENDLY]: { [Language.EN]: 'Friendly', [Language.MY]: 'ရင်းနှီးသော', [Language.TH]: 'เป็นกันเอง' },
  [Tone.URGENT]: { [Language.EN]: 'Urgent', [Language.MY]: 'အရေးကြီးသော', [Language.TH]: 'เร่งด่วน' },
  [Tone.WITTY]: { [Language.EN]: 'Witty', [Language.MY]: 'ဟာသဉာဏ်ရှိသော', [Language.TH]: 'ชาญฉลาด' },
  [Tone.EMOTIONAL]: { [Language.EN]: 'Emotional', [Language.MY]: 'ခံစားချက်ပါသော', [Language.TH]: 'มีอารมณ์ร่วม' },
  [Tone.LUXURY]: { [Language.EN]: 'Luxury', [Language.MY]: 'ခန့်ညားထည်ဝါသော', [Language.TH]: 'หรูหรา' }
};

export const PILLAR_LABELS: TranslationResource = {
  [ContentPillar.EDUCATIONAL]: { [Language.EN]: 'Educational', [Language.MY]: 'ပညာပေး', [Language.TH]: 'การศึกษา' },
  [ContentPillar.PROMOTIONAL]: { [Language.EN]: 'Promotional', [Language.MY]: 'ကြော်ငြာ', [Language.TH]: 'โปรโมชั่น' },
  [ContentPillar.INSPIRATIONAL]: { [Language.EN]: 'Inspirational', [Language.MY]: 'စိတ်ဓာတ်ခွန်အား', [Language.TH]: 'สร้างแรงบันดาลใจ' },
  [ContentPillar.ENTERTAINMENT]: { [Language.EN]: 'Entertainment', [Language.MY]: 'ဖျော်ဖြေရေး', [Language.TH]: 'บันเทิง' },
  [ContentPillar.BEHIND_SCENES]: { [Language.EN]: 'Behind the Scenes', [Language.MY]: 'နောက်ကွယ်', [Language.TH]: 'เบื้องหลัง' },
  [ContentPillar.COMMUNITY]: { [Language.EN]: 'Community/Reviews', [Language.MY]: 'သုံးသပ်ချက်များ', [Language.TH]: 'ชุมชน/รีวิว' }
};

export const TRANSLATIONS = {
  appTitle: {
    [Language.EN]: 'CopyCraft AI',
    [Language.MY]: 'CopyCraft AI',
    [Language.TH]: 'CopyCraft AI'
  },
  appSubtitle: {
    [Language.EN]: 'Professional Content Generator',
    [Language.MY]: 'အဆင့်မြင့် စာရေးလက်ထောက်',
    [Language.TH]: 'ผู้ช่วยเขียนคอนเทนต์มืออาชีพ'
  },
  selectFramework: {
    [Language.EN]: 'Select Framework',
    [Language.MY]: 'Framework ရွေးချယ်ပါ',
    [Language.TH]: 'เลือกโครงสร้าง'
  },
  productTopic: {
    [Language.EN]: 'What are you writing about?',
    [Language.MY]: 'အကြောင်းအရာခေါင်းစဉ်',
    [Language.TH]: 'หัวข้อคอนเทนต์'
  },
  productDesc: {
    [Language.EN]: 'Product Details / Context',
    [Language.MY]: 'အကြောင်းအရာအသေးစိတ်',
    [Language.TH]: 'รายละเอียด'
  },
  tone: {
    [Language.EN]: 'Tone of Voice',
    [Language.MY]: 'လေသံ (Tone)',
    [Language.TH]: 'น้ำเสียง'
  },
  targetAudience: {
    [Language.EN]: 'Target Audience',
    [Language.MY]: 'ဦးတည်ပရိသတ်',
    [Language.TH]: 'กลุ่มเป้าหมาย'
  },
  outputLanguage: {
    [Language.EN]: 'Output Language',
    [Language.MY]: 'ဘာသာစကားရွေးရန်',
    [Language.TH]: 'ภาษาผลลัพธ์'
  },
  generateBtn: {
    [Language.EN]: 'Generate Content',
    [Language.MY]: 'စာရေးပါ',
    [Language.TH]: 'สร้างคอนเทนต์'
  },
  generating: {
    [Language.EN]: 'Writing magic...',
    [Language.MY]: 'ရေးသားနေပါသည်...',
    [Language.TH]: 'กำลังเขียน...'
  },
  resultTitle: {
    [Language.EN]: 'Generated Content',
    [Language.MY]: 'ရလဒ်',
    [Language.TH]: 'คอนเทนต์ที่ได้'
  },
  copyBtn: {
    [Language.EN]: 'Copy',
    [Language.MY]: 'ကူးယူမည်',
    [Language.TH]: 'คัดลอก'
  },
  copied: {
    [Language.EN]: 'Copied!',
    [Language.MY]: 'ကူးယူပြီး',
    [Language.TH]: 'คัดลอกแล้ว!'
  },
  clearBtn: {
    [Language.EN]: 'Clear',
    [Language.MY]: 'ရှင်းမည်',
    [Language.TH]: 'ล้าง'
  },
  pillar: {
    [Language.EN]: 'Content Pillar',
    [Language.MY]: 'Content အမျိုးအစား',
    [Language.TH]: 'ประเภทคอนเทนต์'
  },
  brandSection: {
    [Language.EN]: 'Brand Identity',
    [Language.MY]: 'Brand အချက်အလက်',
    [Language.TH]: 'ข้อมูลแบรนด์'
  },
  addNewBrand: {
    [Language.EN]: '+ Add New',
    [Language.MY]: '+ အသစ်ထည့်မည်',
    [Language.TH]: '+ เพิ่มใหม่'
  },
  selectBrand: {
    [Language.EN]: 'Select a Brand Profile (Optional)',
    [Language.MY]: 'Brand Profile ရွေးပါ (မရွေးလဲရသည်)',
    [Language.TH]: 'เลือกโปรไฟล์แบรนด์ (ไม่บังคับ)'
  },
  apiKeyTitle: {
    [Language.EN]: 'Enter Gemini API Key',
    [Language.MY]: 'Gemini API Key ထည့်ပါ',
    [Language.TH]: 'ใส่ Gemini API Key'
  },
  apiKeyDesc: {
    [Language.EN]: 'To use this app, you need your own Google Gemini API Key. It is stored locally on your device.',
    [Language.MY]: 'ဤ App ကိုအသုံးပြုရန် သင်၏ Gemini API Key လိုအပ်ပါသည်။',
    [Language.TH]: 'คุณต้องใช้ Gemini API Key ของคุณเองเพื่อใช้งาน'
  },
  saveKey: {
    [Language.EN]: 'Save API Key',
    [Language.MY]: 'သိမ်းဆည်းမည်',
    [Language.TH]: 'บันทึก'
  },
  getKeyLink: {
    [Language.EN]: 'Get a free API Key here',
    [Language.MY]: 'API Key အခမဲ့ရယူရန်',
    [Language.TH]: 'รับ API Key ฟรีที่นี่'
  },
  removeKey: {
    [Language.EN]: 'Remove Key',
    [Language.MY]: 'Key ဖျက်မည်',
    [Language.TH]: 'ลบ Key'
  },
  loginDesc: {
    [Language.EN]: 'Please sign in with your authorized Google account to access CopyCraft.',
    [Language.MY]: 'CopyCraft ကိုအသုံးပြုရန် ခွင့်ပြုထားသော Google အကောင့်ဖြင့် ဝင်ရောက်ပါ။',
    [Language.TH]: 'กรุณาเข้าสู่ระบบด้วยบัญชี Google'
  },
  signInGoogle: {
    [Language.EN]: 'Sign in with Google',
    [Language.MY]: 'Google ဖြင့် ဝင်မည်',
    [Language.TH]: 'เข้าสู่ระบบด้วย Google'
  },
  accessDeniedTitle: {
    [Language.EN]: 'Subscription Required',
    [Language.MY]: 'အသုံးပြုခွင့်ဝယ်ယူရန် လိုအပ်သည်',
    [Language.TH]: 'ต้องสมัครสมาชิก'
  },
  accessDeniedDesc: {
    [Language.EN]: 'To access this tool, please purchase a license. Contact us via Viber:',
    [Language.MY]: 'ဤ Tool ကိုအသုံးပြုရန်အတွက် Viber မှတစ်ဆင့် ဆက်သွယ်ဝယ်ယူနိုင်ပါသည်။',
    [Language.TH]: 'หากต้องการใช้งานเครื่องมือนี้ โปรดติดต่อเราทาง Viber:'
  },
  pendingTitle: {
    [Language.EN]: 'Account Pending Approval',
    [Language.MY]: 'ခွင့်ပြုချက်စောင့်ဆိုင်းနေသည်',
    [Language.TH]: 'รอการอนุมัติบัญชี'
  },
  pendingDesc: {
    [Language.EN]: 'Your request has been sent. Please wait for an administrator to activate your account.',
    [Language.MY]: 'သင့်အကောင့်ဖွင့်ရန်တောင်းဆိုမှု ပေးပို့ပြီးပါပြီ။ Admin ခွင့်ပြုချက်ရသည်အထိ စောင့်ဆိုင်းပေးပါ။',
    [Language.TH]: 'ส่งคำขอแล้ว กรุณารอผู้ดูแลระบบอนุมัติบัญชีของคุณ'
  },
  signOut: {
    [Language.EN]: 'Sign Out',
    [Language.MY]: 'အကောင့်ထွက်မည်',
    [Language.TH]: 'ออกจากระบบ'
  }
};

export const DEFAULT_BRANDS: BrandProfile[] = [
  {
    id: 'demo-1',
    name: 'TechNova',
    industry: 'Consumer Electronics',
    description: 'Innovative gadgets for the modern lifestyle. High-tech meets minimal design.',
    defaultTone: Tone.WITTY,
    defaultAudience: 'Tech enthusiasts, Early adopters, Ages 18-35'
  },
  {
    id: 'demo-2',
    name: 'GreenLeaf Organics',
    industry: 'Health & Wellness',
    description: '100% organic supplements and superfoods sourced sustainably.',
    defaultTone: Tone.FRIENDLY,
    defaultAudience: 'Health-conscious individuals, Eco-friendly consumers'
  }
];