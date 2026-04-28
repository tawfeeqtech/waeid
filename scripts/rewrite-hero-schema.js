const fs = require('fs');
const path = require('path');
const tPath = path.resolve(__dirname, '..', 'twilight.json');
const t = JSON.parse(fs.readFileSync(tPath, 'utf8'));
const i = t.components.findIndex(c => c.path === 'home.hero');
if (i < 0) { console.error('hero not found'); process.exit(1); }

t.components[i].title = { en: 'Hero (Dynamic)', ar: 'الهيرو الديناميكي' };
t.components[i].icon = 'sicon-layout-grid';

const dropdown = (id, label, options, defaultKey, icon = 'sicon-layout-grid') => ({
  id, type: 'items', format: 'dropdown-list', label,
  icon, source: 'Manual', required: false,
  selected: [ options.find(o => o.value === defaultKey) ],
  options
});

t.components[i].fields = [
  {
    type: 'static', format: 'description', id: 'hero-v2-desc',
    value: "<div style='background:linear-gradient(135deg,#0f2027,#203a43,#2c5364);border-radius:12px;padding:14px;text-align:center;color:#fff'><h6 style='margin:0 0 4px;font-weight:bold'>Dynamic Hero v2</h6><p style='margin:0;color:#a0c4cc;font-size:12px'>2000+ combinations from 5 axes — without code duplication</p></div>"
  },

  dropdown('layout_mode', 'نمط التخطيط (Layout)', [
    { label: 'مكدس - Stacked',           value: 'stacked',      key: 'lm-stacked' },
    { label: 'منقسم - Split',            value: 'split',        key: 'lm-split' },
    { label: 'بطاقة فوق صورة - Overlay', value: 'overlay-card', key: 'lm-overlay' },
    { label: 'مينيمال - Minimal',         value: 'minimal',      key: 'lm-minimal' },
    { label: 'شريطي - Banded',            value: 'banded',       key: 'lm-banded' },
    { label: 'كامل العرض - Full Bleed',   value: 'full-bleed',   key: 'lm-fullbleed' }
  ], 'stacked'),

  dropdown('media_type', 'نوع الوسائط (Media)', [
    { label: 'صورة',         value: 'image',    key: 'mt-image' },
    { label: 'فيديو يوتيوب', value: 'video',    key: 'mt-video' },
    { label: 'تدرج لوني',     value: 'gradient', key: 'mt-gradient' },
    { label: 'نقش',           value: 'pattern',  key: 'mt-pattern' },
    { label: 'بدون',          value: 'none',     key: 'mt-none' }
  ], 'image', 'sicon-image'),

  dropdown('alignment', 'محاذاة المحتوى (Alignment)', [
    { label: 'البداية (يمين بالعربي)',  value: 'start',  key: 'al-start' },
    { label: 'المنتصف',                  value: 'center', key: 'al-center' },
    { label: 'النهاية (يسار بالعربي)',  value: 'end',    key: 'al-end' }
  ], 'center', 'sicon-format-text-alt'),

  dropdown('emphasis', 'التركيز البصري (Emphasis)', [
    { label: 'متوازن',          value: 'balanced', key: 'em-balanced' },
    { label: 'يبرز النص',       value: 'text',     key: 'em-text' },
    { label: 'تبرز الوسائط',    value: 'media',    key: 'em-media' },
    { label: 'تبرز الإحصائيات', value: 'stats',    key: 'em-stats' }
  ], 'balanced', 'sicon-typography'),

  dropdown('cta_style', 'نمط الأزرار (CTA Style)', [
    { label: 'صلب',           value: 'solid',     key: 'cta-solid' },
    { label: 'محدد',           value: 'outline',   key: 'cta-outline' },
    { label: 'شفاف خفيف',      value: 'ghost',     key: 'cta-ghost' },
    { label: 'حبة دواء',        value: 'pill',      key: 'cta-pill' },
    { label: 'مربع',            value: 'square',    key: 'cta-square' },
    { label: 'زران متباينان',  value: 'dual-pill', key: 'cta-dual' }
  ], 'solid', 'sicon-link'),

  dropdown('min_height', 'الارتفاع الأدنى', [
    { label: 'تلقائي',           value: 'auto',   key: 'mh-auto' },
    { label: 'صغير (420px)',     value: 'small',  key: 'mh-small' },
    { label: 'متوسط (560px)',    value: 'medium', key: 'mh-medium' },
    { label: 'كبير (720px)',     value: 'large',  key: 'mh-large' },
    { label: 'ملء الشاشة',        value: 'screen', key: 'mh-screen' }
  ], 'large'),

  dropdown('container_width', 'عرض الحاوية', [
    { label: 'ضيق (720px)',     value: 'narrow',    key: 'cw-narrow' },
    { label: 'محتوى (1200px)',   value: 'contained', key: 'cw-contained' },
    { label: 'واسع (1440px)',    value: 'wide',      key: 'cw-wide' },
    { label: 'كامل العرض',        value: 'full',      key: 'cw-full' }
  ], 'contained'),

  { id: 'text_color',      type: 'string',  format: 'color',   label: 'لون النص (اختياري)',     icon: 'sicon-typography', required: false },
  { id: 'bg_color',        type: 'string',  format: 'color',   label: 'لون الخلفية (اختياري)',  icon: 'sicon-color-fill', required: false },
  { id: 'overlay_color',   type: 'string',  format: 'color',   label: 'لون التراكب',             icon: 'sicon-color-fill', required: false, value: '#000000' },
  { id: 'overlay_opacity', type: 'number',  format: 'integer', label: 'شفافية التراكب (0-100)', icon: 'sicon-toggle-off', required: false, value: 40, minLength: 0, maxLength: 100 },

  { id: 'badge_text',  type: 'string', format: 'text',     label: 'نص الشارة',          icon: 'sicon-format-text-alt', multilanguage: true, required: false, placeholder: 'مدرب معتمد', value: { ar: 'مدرب معتمد', en: 'Certified Coach' } },
  { id: 'title',       type: 'string', format: 'text',     label: 'العنوان الرئيسي',     icon: 'sicon-typography',      multilanguage: true, required: true,  value: { ar: 'حول حياتك في 90 يوما', en: 'Transform Your Life in 90 Days' } },
  { id: 'subtitle',    type: 'string', format: 'textarea', label: 'النص الداعم',          icon: 'sicon-format-text-alt', multilanguage: true, required: false, value: { ar: 'برنامج تدريبي متكامل يضمن لك نتائج حقيقية', en: 'A complete training program that guarantees real results' } },
  { id: 'cta_text',    type: 'string', format: 'text',     label: 'نص زر CTA الرئيسي',    icon: 'sicon-link', multilanguage: true, required: false, value: { ar: 'احجز مكانك الآن', en: 'Book Your Spot Now' } },
  { id: 'cta_url',     type: 'string', format: 'text',     label: 'رابط CTA الرئيسي',     icon: 'sicon-link', required: false },
  { id: 'sec_cta_text',type: 'string', format: 'text',     label: 'نص الزر الثانوي',      icon: 'sicon-link', multilanguage: true, required: false },
  { id: 'sec_cta_url', type: 'string', format: 'text',     label: 'رابط الزر الثانوي',    icon: 'sicon-link', required: false },

  { id: 'image',    type: 'string', format: 'image', label: 'صورة الخلفية / الجانب', icon: 'sicon-image', required: false },
  { id: 'video_id', type: 'string', format: 'text',  label: 'معرف فيديو يوتيوب',      icon: 'sicon-video',  required: false, placeholder: 'dQw4w9WgXcQ' },

  { id: 'show_stats', type: 'boolean', format: 'switch', label: 'اظهار الاحصائيات', icon: 'sicon-bar-chart', required: false, value: false },
  {
    id: 'stats', type: 'array', label: 'الاحصائيات', icon: 'sicon-bar-chart', required: false,
    fields: [
      { id: 'stat_number', type: 'string', format: 'text', label: 'الرقم',  multilanguage: true, value: { ar: '+1000', en: '+1000' } },
      { id: 'stat_label',  type: 'string', format: 'text', label: 'الوصف', multilanguage: true, value: { ar: 'متدرب',  en: 'Trainees' } }
    ]
  }
];

fs.writeFileSync(tPath, JSON.stringify(t, null, 4) + '\n');
console.log('hero schema replaced. fields:', t.components[i].fields.length);
