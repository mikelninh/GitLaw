/**
 * Mehrsprachiges Intake-Form für Mandant:innen.
 *
 * Why: Berliner Kanzleien haben oft Mandant:innen, die Deutsch nicht
 * fließend sprechen. Beispiel Patrick Rubin → türkischsprachige Mieter.
 * Beispiel Thai Bao Nguyen (ra-nguyen.de) → vietnamesische Community.
 *
 * Aktivierung via URL: ?lang=vi (Vietnamesisch), ?lang=tr (Türkisch),
 * ?lang=ar (Arabisch), ?lang=en (Englisch). Default: Deutsch.
 *
 * Die Anwält:in sieht die Antwort IMMER auf Deutsch in der Akte —
 * d.h. Mandant:in füllt vi/tr/ar aus, Übersetzung der LABELS hilft beim
 * Verstehen, eingegebene Texte bleiben in der Originalsprache (sind
 * dann eh Eigenname/Sachverhalt).
 */

export type IntakeLang = 'de' | 'vi' | 'tr' | 'ar' | 'en'

export const INTAKE_LANGS: { code: IntakeLang; label: string; flag: string }[] = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
]

interface IntakeStrings {
  headerTitle: (kanzlei: string) => string
  headerSubtitle: string
  caseRefPrefix: string
  fieldName: string
  fieldEmail: string
  fieldPhone: string
  fieldPhoneHint: string
  fieldConcern: string
  fieldConcernHint: string
  fieldOutcome: string
  consent: string
  submit: string
  thankYouTitle: string
  thankYouMessage: (kanzlei: string) => string
  emailButtonLabel: string
  emailButtonSending: string
  kioskNote: string
  required: string
  footer: string
  consentRequired: string
}

const STRINGS: Record<IntakeLang, IntakeStrings> = {
  de: {
    headerTitle: k => `Erstanfrage an ${k}`,
    headerSubtitle: 'Bitte füllen Sie die nachfolgenden Felder aus.',
    caseRefPrefix: 'Bezug',
    fieldName: 'Ihr Name',
    fieldEmail: 'E-Mail',
    fieldPhone: 'Telefon (für Rückruf)',
    fieldPhoneHint: '',
    fieldConcern: 'Worum geht es?',
    fieldConcernHint: 'Bitte schildern Sie Ihr Anliegen in eigenen Worten. 2-5 Sätze reichen.',
    fieldOutcome: 'Was möchten Sie konkret erreichen? (optional)',
    consent: 'Ich willige ein, dass meine Angaben an die Kanzlei übermittelt und zur Bearbeitung meines Anliegens gespeichert werden dürfen. Eine Einwilligung zur Mandatierung ist damit nicht verbunden.',
    submit: 'Angaben übermitteln',
    thankYouTitle: 'Vielen Dank für Ihre Angaben',
    thankYouMessage: k => k
      ? `Ihre Angaben wurden an ${k} übermittelt. Sie erhalten innerhalb der nächsten Werktage eine Rückmeldung.`
      : 'Ihre Angaben wurden übermittelt. Sie erhalten innerhalb der nächsten Werktage eine Rückmeldung.',
    emailButtonLabel: 'Per E-Mail an die Kanzlei senden',
    emailButtonSending: 'Öffne E-Mail-Programm…',
    kioskNote: 'Wenn Sie dieses Formular am Tablet/Computer Ihrer Anwält:in ausgefüllt haben, ist die Übermittlung bereits direkt erfolgt. Der E-Mail-Versand ist optional als Kopie.',
    required: 'erforderlich',
    footer: 'Formular bereitgestellt durch GitLaw Pro. Die Kanzlei ist für Inhalt und Datenverarbeitung verantwortlich.',
    consentRequired: 'Bitte bestätigen Sie die Datenschutz-Information, um fortzufahren.',
  },
  vi: {
    headerTitle: k => `Yêu cầu tư vấn ban đầu gửi đến ${k}`,
    headerSubtitle: 'Vui lòng điền các thông tin sau.',
    caseRefPrefix: 'Hồ sơ',
    fieldName: 'Họ và tên',
    fieldEmail: 'Email',
    fieldPhone: 'Số điện thoại (để gọi lại)',
    fieldPhoneHint: '',
    fieldConcern: 'Bạn cần tư vấn về vấn đề gì?',
    fieldConcernHint: 'Vui lòng mô tả vấn đề của bạn bằng lời của mình. 2-5 câu là đủ.',
    fieldOutcome: 'Bạn mong muốn đạt được điều gì cụ thể? (không bắt buộc)',
    consent: 'Tôi đồng ý rằng thông tin của tôi được gửi đến văn phòng luật sư và được lưu trữ để xử lý yêu cầu của tôi. Việc này chưa cấu thành ủy quyền chính thức.',
    submit: 'Gửi thông tin',
    thankYouTitle: 'Cảm ơn bạn đã cung cấp thông tin',
    thankYouMessage: k => k
      ? `Thông tin của bạn đã được gửi đến ${k}. Bạn sẽ nhận được phản hồi trong vài ngày làm việc tới.`
      : 'Thông tin của bạn đã được gửi. Bạn sẽ nhận được phản hồi trong vài ngày làm việc tới.',
    emailButtonLabel: 'Gửi email đến văn phòng luật sư',
    emailButtonSending: 'Đang mở chương trình email…',
    kioskNote: 'Nếu bạn đã điền biểu mẫu này trên máy tính bảng/máy tính của luật sư, dữ liệu đã được gửi trực tiếp. Việc gửi email là tùy chọn (bản sao).',
    required: 'bắt buộc',
    footer: 'Biểu mẫu được cung cấp bởi GitLaw Pro. Văn phòng luật sư chịu trách nhiệm về nội dung và xử lý dữ liệu.',
    consentRequired: 'Vui lòng xác nhận thông tin về bảo vệ dữ liệu để tiếp tục.',
  },
  tr: {
    headerTitle: k => `${k} avukatlık bürosuna ilk başvuru`,
    headerSubtitle: 'Lütfen aşağıdaki alanları doldurunuz.',
    caseRefPrefix: 'Dosya',
    fieldName: 'Adınız',
    fieldEmail: 'E-posta',
    fieldPhone: 'Telefon (geri arama için)',
    fieldPhoneHint: '',
    fieldConcern: 'Konunuz nedir?',
    fieldConcernHint: 'Lütfen sorununuzu kendi sözcüklerinizle anlatın. 2-5 cümle yeterlidir.',
    fieldOutcome: 'Somut olarak neyi başarmak istiyorsunuz? (isteğe bağlı)',
    consent: 'Bilgilerimin avukatlık bürosuna iletilmesine ve talebimin işlenmesi için saklanmasına izin veriyorum. Bu, vekalet vermek anlamına gelmez.',
    submit: 'Bilgileri gönder',
    thankYouTitle: 'Bilgileriniz için teşekkürler',
    thankYouMessage: k => k
      ? `Bilgileriniz ${k} avukatlık bürosuna iletildi. Önümüzdeki iş günleri içinde geri dönüş alacaksınız.`
      : 'Bilgileriniz iletildi. Önümüzdeki iş günleri içinde geri dönüş alacaksınız.',
    emailButtonLabel: 'Avukatlık bürosuna e-posta gönder',
    emailButtonSending: 'E-posta programı açılıyor…',
    kioskNote: 'Bu formu avukatınızın tabletinde/bilgisayarında doldurduysanız, veriler doğrudan iletilmiştir. E-posta gönderimi isteğe bağlı bir kopya olarak hizmet eder.',
    required: 'zorunlu',
    footer: 'Form GitLaw Pro tarafından sunulmaktadır. İçerik ve veri işlemeden avukatlık bürosu sorumludur.',
    consentRequired: 'Devam etmek için lütfen veri koruma bilgisini onaylayın.',
  },
  ar: {
    headerTitle: k => `طلب استشارة أولي مقدم إلى ${k}`,
    headerSubtitle: 'يرجى ملء الحقول التالية.',
    caseRefPrefix: 'الملف',
    fieldName: 'اسمك',
    fieldEmail: 'البريد الإلكتروني',
    fieldPhone: 'الهاتف (لإعادة الاتصال)',
    fieldPhoneHint: '',
    fieldConcern: 'ما هو موضوعك؟',
    fieldConcernHint: 'يرجى وصف القضية بكلماتك الخاصة. 2-5 جمل تكفي.',
    fieldOutcome: 'ما الذي تريد تحقيقه بشكل ملموس؟ (اختياري)',
    consent: 'أوافق على إرسال بياناتي إلى مكتب المحاماة وتخزينها لمعالجة طلبي. هذا لا يشكل توكيلاً قانونياً.',
    submit: 'إرسال البيانات',
    thankYouTitle: 'شكراً لتقديم بياناتك',
    thankYouMessage: k => k
      ? `تم إرسال بياناتك إلى ${k}. سوف تتلقى رداً خلال أيام العمل القادمة.`
      : 'تم إرسال بياناتك. سوف تتلقى رداً خلال أيام العمل القادمة.',
    emailButtonLabel: 'إرسال بريد إلكتروني إلى المكتب',
    emailButtonSending: 'فتح برنامج البريد الإلكتروني…',
    kioskNote: 'إذا قمت بملء هذا النموذج على جهاز محاميك اللوحي/الكمبيوتر، فقد تم إرسال البيانات بالفعل مباشرة. إرسال البريد الإلكتروني هو خيار كنسخة.',
    required: 'مطلوب',
    footer: 'تم توفير النموذج بواسطة GitLaw Pro. مكتب المحاماة مسؤول عن المحتوى ومعالجة البيانات.',
    consentRequired: 'يرجى تأكيد معلومات حماية البيانات للمتابعة.',
  },
  en: {
    headerTitle: k => `Initial inquiry to ${k}`,
    headerSubtitle: 'Please fill out the following fields.',
    caseRefPrefix: 'Reference',
    fieldName: 'Your name',
    fieldEmail: 'Email',
    fieldPhone: 'Phone (for callback)',
    fieldPhoneHint: '',
    fieldConcern: 'What is your matter about?',
    fieldConcernHint: 'Please describe your matter in your own words. 2-5 sentences are enough.',
    fieldOutcome: 'What specifically would you like to achieve? (optional)',
    consent: 'I consent that my data will be transmitted to the law firm and stored for processing my request. This does not constitute a formal mandate.',
    submit: 'Submit',
    thankYouTitle: 'Thank you for your information',
    thankYouMessage: k => k
      ? `Your information has been sent to ${k}. You will receive a response within the next business days.`
      : 'Your information has been sent. You will receive a response within the next business days.',
    emailButtonLabel: 'Send by email to the law firm',
    emailButtonSending: 'Opening email client…',
    kioskNote: 'If you filled out this form on your lawyer\'s tablet/computer, the data has already been transmitted directly. Email sending is optional as a copy.',
    required: 'required',
    footer: 'Form provided by GitLaw Pro. The law firm is responsible for content and data processing.',
    consentRequired: 'Please confirm the data protection information to continue.',
  },
}

export function getIntakeStrings(lang: IntakeLang): IntakeStrings {
  return STRINGS[lang] || STRINGS.de
}

export function detectIntakeLang(searchParam: string | null): IntakeLang {
  if (!searchParam) return 'de'
  const normalized = searchParam.toLowerCase()
  if (['de', 'vi', 'tr', 'ar', 'en'].includes(normalized)) return normalized as IntakeLang
  return 'de'
}

export function isRtl(lang: IntakeLang): boolean {
  return lang === 'ar'
}
