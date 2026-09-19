# استضافة سيرفر تفعيل Squeeze Template بنفسك

## الفكرة
سيرفر ترخيص البائع (Apps Script على Rhino) توقف نهائيًا من جوجل، فالقالب لا يستطيع
التحقق من أي مفتاح. الحل: نسخة معدّلة من سكربت القالب تشير إلى سيرفر ترخيص خاص بك
بنفس واجهة JSONP (`checkLicense({valid:true})`).

## الملفات
- `sq.licensed.min.js` — سكربت القالب الأصلي 2.3.1 مع استبدال رابط سيرفر الترخيص
  فقط (السلايدر والمنطق كله كما هو). مكان الرابط:
  `https://script.google.com/macros/s/(منشور بالفعل — راجع sq.licensed.min.js)/exec`
- `license-server/Code.gs` — سيرفر الترخيص (Google Apps Script، وقت تشغيل V8).
- `activation-page.html` — صفحة محلية تولّد مفاتيح تفعيل (تعمل بدون إنترنت).

## خطوات التشغيل

### 1) انشر سيرفر الترخيص
1. ادخل https://script.google.com → New project.
2. الصق محتوى `Code.gs`.
3. (اختياري) املأ `WHITELIST` بأرقام مدوناتك لتقنين التفعيل بها فقط.
4. Deploy → New deployment → Web app → Execute as: Me / Who has access: Anyone → Deploy.
5. انسخ رابط النشر (ينتهي بـ `/exec`).

### 2) حدّث السكربت المعدّل
افتح `sq.licensed.min.js` واستبدل النص:
```
(منشور بالفعل — راجع sq.licensed.min.js)
```
برابط النشر من الخطوة 1 (استبدال واحد فقط).

### 3) ارفع السكربت على استضافة ثابتة
الأسهل: مستودع GitHub خاص بك → Settings → Pages → ضع الملف باسم مثل
`scripts@2.3.1.licensed.min.js` وستصبح روحه:
`[https://ahmed-hamed-216.github.io/sq.licensed/scripts@2.3.1.licensed.min.js](https://ahmed-hamed-216.github.io/sq.licensed/sq.licensed.min.js)`

### 4) عدّل القالب
في ملف القالب (Squeeze 2.3.1.txt) استبدل:
```
https://squeezetemplate.github.io/assets/scripts@2.3.1.min.js?sqV=1
```
برابط ملفك من الخطوة 3، ثم ارفع القالب لمدونتك.

### 5) فعّل مدونتك
- افتح `activation-page.html` في المتصفح، أدخل Blog ID، انسخ LicenseKey.
- ضعه في إعدادات القالب كما كنت تفعل (متغير `LicenseKey`).

## ملاحظات مهمة
- مفاتيحك القديمة صالحة على سيرفرك: مفتاح `...MzI3...` يعود للمدونة `18097496327`
  (وليس `13366800006514606`)، ومفتاح `...NzUz...` يعود للمدونة `42337838753`.
- لو السيرفر بقي ناشبًا (صيانة)، JSONP يفشل بصمت — القالب يستمر بالعمل ولا يُفعَّل
  عقاب البائع (V9) إلا بصدور `valid:false` صريح.
- فحص الفوتر/اللوجو كل ثانية ما زال موجودًا في السكربت: لا تحذف أو تخفي
  رابط `squeeze-template.blogspot.com` ولا أيقونة `#SqIcon` وإلا ستُستبدل الصفحة
  بشاشة Credits. الملف المعدّل لم يغيّر هذا السلوك.
- القالب يخزّن السكربت في sessionStorage عند تفعيل SpeedFirst: بعد تبديل الرابط
  امسح الكاش أو افتح مدونتك في نافذة خاصة للاختبار.
