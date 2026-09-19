/**
 * سيرفر ترخيص Squeeze Template — نسختك الخاصة
 * انشره على Google Apps Script (script.google.com) → New Project → الصق الكود
 * ثم Deploy → New deployment → Type: Web app
 *   Execute as: Me
 *   Who has access: Anyone
 * بعد النشر خُد رابط /exec وحطّه مكان
 * https://script.google.com/macros/s/DEPLOY_YOUR_OWN_LICENSE_SERVER_ID_HERE/exec
 * داخل ملف sq.licensed.min.js (موجود مرة واحدة فقط).
 *
 * استعلام التفعيل الذي يرسله القالب:
 *   ?blogId=<id>&key=<base64>&release=v2&callback=checkLicense
 * والرد المطلوب: checkLicense({"valid":true})
 */

// (اختياري) ضع هنا أرقام المدونات المصرح بها. اتركه فارغًا للسماح لأي مفتاح صيغته صحيحة.
var WHITELIST = [
  // '18097496327',
  // '42337838753'
];

function doGet(e) {
  var p = (e && e.parameter) || {};
  var cb = String(p.callback || 'checkLicense');
  var blogId = String(p.blogId || '');
  var key = String(p.key || '');

  var valid = validate(blogId, key);

  var payload = JSON.stringify({ valid: valid, blogId: blogId });
  return ContentService
    .createTextOutput(cb + '(' + payload + ')')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function validate(blogId, key) {
  try {
    if (!blogId || !key) return false;
    var decoded;
    try {
      decoded = Utilities.newBlob(Utilities.base64Decode(key)).getDataAsString();
    } catch (e1) {
      decoded = Utilities.newBlob(Utilities.base64DecodeWebSafe(key.replace(/-/g, '+').replace(/_/g, '/'))).getDataAsString();
    }
    // الصيغة: Squeeze<blogId>_Activation<رقم>
    var m = /^Squeeze(\d+)_Activation(\d+)$/.exec(decoded);
    if (!m) return false;
    if (m[1] !== blogId) return false;              // المفتاح لا يطابق رقم المدونة
    if (WHITELIST.length && WHITELIST.indexOf(blogId) === -1) return false;
    return true;
  } catch (err) {
    return false;
  }
}

/** توليد مفتاح جديد — نفّذها من محرر Apps Script أو استخدم صفحة التفعيل HTML */
function makeKey(blogId) {
  var raw = 'Squeeze' + blogId + '_Activation' + new Date().getTime();
  return Utilities.base64EncodeWebSafe(raw);
}
