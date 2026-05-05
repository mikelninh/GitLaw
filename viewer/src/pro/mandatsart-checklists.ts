/**
 * Modul A — Mandatsart-Checklisten (Sprint 0, Bao pilot)
 *
 * Seed data for 11 Migration-Mandatsarten with DE + VI document labels.
 * Designed for Bao Nguyen's Vietnamese-German immigration law practice.
 *
 * Defensive default: items are 'required' unless clearly optional.
 * Bao can downgrade required → optional in tomorrow's meeting.
 *
 * VI labels: marked `// TODO: VI-review by native speaker` where confidence
 * is lower than ~80 %. A Vietnamesisch-Muttersprachler should review all VI
 * labels before going live with Mandant-facing UI.
 *
 * Legal basis sources: AufenthG, StAG, FreizügigG/EU, AsylG, VwGO.
 */

import type { MandatsartChecklist, MandatsartCategory } from './types'

export type { MandatsartChecklist, MandatsartCategory }

// ---------------------------------------------------------------------------
// 1. Aufenthaltstitel verlängern
// ---------------------------------------------------------------------------

const aufenthaltstitelVerlaengerung: MandatsartChecklist = {
  id: 'aufenthaltstitel-verlaengerung',
  title: 'Aufenthaltstitel verlängern',
  titleVi: 'Gia hạn giấy phép cư trú', // TODO: VI-review by native speaker
  category: 'migration',
  description:
    'Verlängerung eines bestehenden Aufenthaltstitels (Aufenthaltserlaubnis, Niederlassungserlaubnis ausgenommen) vor Ablauf der Gültigkeitsdauer. Betrifft Drittstaatsangehörige mit bestehendem Aufenthaltsrecht in Deutschland.',
  legalBasis: ['§ 8 AufenthG', '§ 81 AufenthG', '§ 5 AufenthG', '§ 26 AufenthG'],
  typicalDuration: '6–12 Wochen',
  requiredDocuments: [
    {
      id: 'reisepass',
      label: 'Reisepass (Original + Kopie aller Stempelseiten, ≥ 6 Monate gültig über Antragsdatum)',
      labelVi: 'Hộ chiếu (bản gốc + bản sao tất cả các trang có đóng dấu, còn hạn ≥ 6 tháng)', // TODO: VI-review by native speaker
      description: 'Die Ausländerbehörde prüft Einreisestempel und frühere Visa. Alle bestempelten Seiten müssen kopiert werden.',
      level: 'required',
      category: 'identitaet',
      acceptedFormats: ['pdf', 'jpg', 'png'],
      typicalIssues: [
        'Ablichtung muss farbig sein',
        'Reisepass mit weniger als 6 Monaten Restlaufzeit wird oft abgelehnt',
        'Alle Seiten inkl. leerer Seiten mit Stempel',
      ],
    },
    {
      id: 'aktueller-aufenthaltstitel',
      label: 'Aktueller Aufenthaltstitel (Original + Kopie Vorder- und Rückseite)',
      labelVi: 'Giấy phép cư trú hiện tại (bản gốc + bản sao cả hai mặt)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'aufenthalt',
      typicalIssues: ['Gültigkeitsdatum prüfen — Verlängerungsantrag muss vor Ablauf gestellt werden'],
    },
    {
      id: 'meldebescheinigung',
      label: 'Aktuelle Meldebescheinigung (≤ 3 Monate alt)',
      labelVi: 'Giấy chứng nhận đăng ký hộ khẩu (không quá 3 tháng)', // TODO: VI-review by native speaker
      description: 'Amtliche Bestätigung der Wohnadresse vom Einwohnermeldeamt.',
      level: 'required',
      category: 'wohnen',
    },
    {
      id: 'mietvertrag',
      label: 'Mietvertrag (aktuelle Version) oder Wohnungsgeberbestätigung (§ 19 BMG)',
      labelVi: 'Hợp đồng thuê nhà hoặc xác nhận của chủ nhà (§ 19 BMG)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'wohnen',
    },
    {
      id: 'einkommensnachweis',
      label: 'Einkommensnachweis: letzte 3 Lohnabrechnungen oder Rentenbescheid',
      labelVi: 'Bằng chứng thu nhập: 3 tháng lương gần nhất hoặc thông báo lương hưu', // TODO: VI-review by native speaker
      description: 'Sicherung des Lebensunterhalts gem. § 5 Abs. 1 Nr. 1 AufenthG.',
      level: 'required',
      category: 'einkommen',
      typicalIssues: ['Minijob reicht oft nicht für Lebensunterhaltssicherung'],
    },
    {
      id: 'krankenversicherungsnachweis',
      label: 'Nachweis Krankenversicherung (Versicherungskarte oder Bescheinigung)',
      labelVi: 'Bằng chứng bảo hiểm y tế (thẻ hoặc giấy chứng nhận)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'gesundheit',
    },
    {
      id: 'biometrisches-lichtbild',
      label: 'Biometrisches Lichtbild (35 × 45 mm, ≤ 6 Monate alt, weißer Hintergrund)',
      labelVi: 'Ảnh sinh trắc học (35 × 45 mm, không quá 6 tháng, nền trắng)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'biometrie',
      typicalIssues: ['Druck muss auf Fotopapier sein', 'Kein Ausdruck auf Normalpapier'],
    },
    {
      id: 'anwaltsvollmacht',
      label: 'Anwaltsvollmacht (Original, unterschrieben)',
      labelVi: 'Giấy ủy quyền luật sư (bản gốc, có chữ ký)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
    },
    {
      id: 'sprachzeugnis',
      label: 'Sprachzertifikat (mind. B1 Deutsch, z. B. Goethe, telc, TestDaF)',
      labelVi: 'Chứng chỉ tiếng Đức (tối thiểu B1, ví dụ Goethe, telc, TestDaF)', // TODO: VI-review by native speaker
      level: 'conditional',
      conditionalNote: 'Nur wenn der aktuelle Aufenthaltstitel oder der angestrebte Titel einen Sprachnachweis voraussetzt (z. B. Aufenthaltserlaubnis zur Beschäftigung nach § 18 AufenthG oder für Familiennachzug)',
      category: 'sprache',
    },
    {
      id: 'arbeitsvertrag',
      label: 'Arbeitsvertrag oder Arbeitgeberbescheinigung',
      labelVi: 'Hợp đồng lao động hoặc giấy xác nhận của người sử dụng lao động', // TODO: VI-review by native speaker
      level: 'conditional',
      conditionalNote: 'Nur bei aufenthaltstiteln, die an eine Beschäftigung geknüpft sind (§ 18 ff. AufenthG)',
      category: 'einkommen',
    },
  ],
}

// ---------------------------------------------------------------------------
// 2. Familiennachzug Ehegatt:in
// ---------------------------------------------------------------------------

const familiennachzugEhegatte: MandatsartChecklist = {
  id: 'familiennachzug-ehegatte',
  title: 'Familiennachzug Ehegatt:in',
  titleVi: 'Đoàn tụ gia đình – vợ/chồng', // TODO: VI-review by native speaker
  category: 'migration',
  description:
    'Nachzug eines/einer Ehegatt:in zu einem/einer in Deutschland lebenden Drittstaatsangehörigen oder Deutschen. Gilt für Antragsteller:innen, die aus dem Ausland nachziehen.',
  legalBasis: ['§ 27 AufenthG', '§ 28 AufenthG', '§ 30 AufenthG', '§ 5 AufenthG'],
  typicalDuration: '3–6 Monate (Visumverfahren + Aufenthaltserlaubnis)',
  requiredDocuments: [
    {
      id: 'reisepass-antragsteller',
      label: 'Reisepass nachziehende Person (Original + Kopie aller Stempelseiten, ≥ 6 Monate gültig)',
      labelVi: 'Hộ chiếu người theo (bản gốc + bản sao tất cả trang đóng dấu, còn hạn ≥ 6 tháng)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'identitaet',
    },
    {
      id: 'reisepass-stammberechtigter',
      label: 'Reisepass oder Personalausweis Stammberechtigte:r (in Deutschland lebend)',
      labelVi: 'Hộ chiếu hoặc CMND của người bảo lãnh (đang sống ở Đức)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'identitaet',
    },
    {
      id: 'aufenthaltstitel-stammberechtigter',
      label: 'Aufenthaltstitel der stammberechtigten Person (Original + Kopie)',
      labelVi: 'Giấy phép cư trú của người bảo lãnh (bản gốc + bản sao)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'aufenthalt',
      typicalIssues: ['Bei deutschen Stammberechtigten entfällt dieser Nachweis'],
    },
    {
      id: 'heiratsurkunde',
      label: 'Heiratsurkunde mit Apostille oder Legalisation + beglaubigte Übersetzung ins Deutsche',
      labelVi: 'Giấy đăng ký kết hôn kèm con dấu Apostille hoặc hợp pháp hóa + bản dịch công chứng tiếng Đức', // TODO: VI-review by native speaker
      description: 'Ausländische Urkunden benötigen Apostille (Haager Abkommen) oder Legalisation durch die Deutsche Botschaft.',
      level: 'required',
      category: 'familie',
      typicalIssues: [
        'Vietnamesische Urkunden benötigen in der Regel Legalisation (kein Apostille-Mitglied)',
        'Übersetzung muss von einem vereidigten Übersetzer stammen',
        'Originalurkunde muss vorgelegt werden, keine Fotokopie',
      ],
    },
    {
      id: 'meldebescheinigung-stammberechtigter',
      label: 'Meldebescheinigung Stammberechtigte:r (≤ 3 Monate alt)',
      labelVi: 'Giấy đăng ký hộ khẩu của người bảo lãnh (không quá 3 tháng)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'wohnen',
    },
    {
      id: 'wohnraumnachweis',
      label: 'Wohnraumnachweis: Mietvertrag + Nachweis ausreichender Wohnfläche (mind. 12 m² pro Person)',
      labelVi: 'Bằng chứng nhà ở: hợp đồng thuê + diện tích đủ (ít nhất 12 m² mỗi người)', // TODO: VI-review by native speaker
      description: 'Behörden prüfen Wohnfläche pro Person. Faustregel: mind. 12 m² pro Person neben Gemeinschaftsflächen.',
      level: 'required',
      category: 'wohnen',
    },
    {
      id: 'einkommensnachweis-stammberechtigter',
      label: 'Einkommensnachweis Stammberechtigte:r: letzte 3 Lohnabrechnungen + Arbeitsvertrag',
      labelVi: 'Bằng chứng thu nhập người bảo lãnh: 3 phiếu lương gần nhất + hợp đồng lao động', // TODO: VI-review by native speaker
      level: 'required',
      category: 'einkommen',
    },
    {
      id: 'krankenversicherung-antragsteller',
      label: 'Nachweis Krankenversicherung nachziehende Person (ggf. Reiseversicherung für Einreise)',
      labelVi: 'Bằng chứng bảo hiểm y tế người theo (có thể là bảo hiểm du lịch khi nhập cảnh)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'gesundheit',
    },
    {
      id: 'sprachzeugnis-a1',
      label: 'Sprachzertifikat A1 Deutsch (nachziehende Person) — z. B. Goethe-Institut "Start Deutsch 1"',
      labelVi: 'Chứng chỉ tiếng Đức A1 (người theo) — ví dụ Goethe-Institut "Start Deutsch 1"', // TODO: VI-review by native speaker
      description: 'Gem. § 30 Abs. 1 Nr. 2 AufenthG Grundvoraussetzung, sofern kein Ausnahmegrund vorliegt.',
      level: 'required',
      category: 'sprache',
      typicalIssues: [
        'Ausnahmen: Nicht-lateinisches Schriftsystem aus gesundheitlichen Gründen, Alter 67+, erkennbar keine Integration möglich',
        'Kursort muss im Ausland sein (Prüfung vor Visum)',
      ],
    },
    {
      id: 'biometrisches-lichtbild-antragsteller',
      label: 'Biometrisches Lichtbild (35 × 45 mm, ≤ 6 Monate alt)',
      labelVi: 'Ảnh sinh trắc học (35 × 45 mm, không quá 6 tháng)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'biometrie',
    },
    {
      id: 'anwaltsvollmacht',
      label: 'Anwaltsvollmacht (Original, unterschrieben)',
      labelVi: 'Giấy ủy quyền luật sư (bản gốc, có chữ ký)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
    },
    {
      id: 'geburtsurkunden-kinder',
      label: 'Geburtsurkunden gemeinsamer Kinder (falls vorhanden) + beglaubigte Übersetzung',
      labelVi: 'Giấy khai sinh của các con chung (nếu có) + bản dịch công chứng', // TODO: VI-review by native speaker
      level: 'conditional',
      conditionalNote: 'Nur wenn gemeinsame minderjährige Kinder existieren, die im Antrag berücksichtigt werden sollen',
      category: 'familie',
    },
  ],
}

// ---------------------------------------------------------------------------
// 3. Familiennachzug Kind
// ---------------------------------------------------------------------------

const familiennachzugKind: MandatsartChecklist = {
  id: 'familiennachzug-kind',
  title: 'Familiennachzug Kind',
  titleVi: 'Đoàn tụ gia đình – con cái', // TODO: VI-review by native speaker
  category: 'migration',
  description:
    'Nachzug eines minderjährigen Kindes zu einem oder beiden in Deutschland lebenden Elternteilen. Grundlage: § 32 AufenthG (Drittstaatsangehörige) oder § 28 AufenthG (ein Elternteil deutsch).',
  legalBasis: ['§ 32 AufenthG', '§ 28 AufenthG', '§ 29 AufenthG', '§ 5 AufenthG'],
  typicalDuration: '3–8 Monate',
  requiredDocuments: [
    {
      id: 'reisepass-kind',
      label: 'Reisepass des Kindes (Original + Kopie aller Stempelseiten, ≥ 6 Monate gültig)',
      labelVi: 'Hộ chiếu của trẻ (bản gốc + bản sao tất cả trang đóng dấu, còn hạn ≥ 6 tháng)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'identitaet',
    },
    {
      id: 'geburtsurkunde-kind',
      label: 'Geburtsurkunde des Kindes mit Apostille/Legalisation + beglaubigte Übersetzung',
      labelVi: 'Giấy khai sinh của trẻ kèm Apostille/hợp pháp hóa + bản dịch công chứng', // TODO: VI-review by native speaker
      description: 'Ausländische Geburtsurkunden bedürfen der Apostille oder Legalisation.',
      level: 'required',
      category: 'familie',
      typicalIssues: [
        'Vietnamesische Urkunden: Legalisation statt Apostille (kein Haag-Mitglied)',
        'Übersetzung muss vereidigter Übersetzer erstellen',
      ],
    },
    {
      id: 'reisepasse-eltern',
      label: 'Reisepässe / Personalausweise beider Elternteile (Kopie)',
      labelVi: 'Hộ chiếu / CMND của cả hai cha mẹ (bản sao)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'identitaet',
    },
    {
      id: 'aufenthaltstitel-elternteil',
      label: 'Aufenthaltstitel des/der in Deutschland lebenden Elternteils (Original + Kopie)',
      labelVi: 'Giấy phép cư trú của cha/mẹ đang sống ở Đức (bản gốc + bản sao)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'aufenthalt',
    },
    {
      id: 'sorgerechtserklarung',
      label: 'Sorgerechtserklärung oder Nachweis gemeinsames Sorgerecht (z. B. notarielle Erklärung)',
      labelVi: 'Xác nhận quyền giám hộ hoặc bằng chứng quyền nuôi con chung (ví dụ công chứng)', // TODO: VI-review by native speaker
      description: 'Wenn nur ein Elternteil in Deutschland lebt, muss das Sorgerecht und ggf. Zustimmung des anderen Elternteils nachgewiesen werden.',
      level: 'required',
      category: 'familie',
      typicalIssues: ['Zustimmung des ausländischen Elternteils ggf. notariell beglaubigt erforderlich'],
    },
    {
      id: 'einkommensnachweis-elternteil',
      label: 'Einkommensnachweis des in Deutschland lebenden Elternteils (letzte 3 Monate)',
      labelVi: 'Bằng chứng thu nhập của cha/mẹ ở Đức (3 tháng gần nhất)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'einkommen',
    },
    {
      id: 'wohnraumnachweis',
      label: 'Wohnraumnachweis (Mietvertrag, ausreichende Wohnfläche für Kind)',
      labelVi: 'Bằng chứng nhà ở (hợp đồng thuê, diện tích đủ cho trẻ)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'wohnen',
    },
    {
      id: 'krankenversicherung-kind',
      label: 'Krankenversicherungsnachweis für das Kind',
      labelVi: 'Bằng chứng bảo hiểm y tế cho trẻ', // TODO: VI-review by native speaker
      level: 'required',
      category: 'gesundheit',
    },
    {
      id: 'biometrisches-lichtbild-kind',
      label: 'Biometrisches Lichtbild des Kindes (35 × 45 mm, ≤ 6 Monate alt)',
      labelVi: 'Ảnh sinh trắc học của trẻ (35 × 45 mm, không quá 6 tháng)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'biometrie',
    },
    {
      id: 'anwaltsvollmacht',
      label: 'Anwaltsvollmacht (unterschrieben von sorgeberechtigtem Elternteil)',
      labelVi: 'Giấy ủy quyền luật sư (ký bởi người giám hộ hợp pháp)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
    },
    {
      id: 'schulbescheinigung',
      label: 'Schulbescheinigung oder Nachweis Schulpflicht-Erfüllung (falls Kind schulpflichtig)',
      labelVi: 'Giấy xác nhận học sinh hoặc bằng chứng thực hiện nghĩa vụ học (nếu trẻ trong độ tuổi)', // TODO: VI-review by native speaker
      level: 'conditional',
      conditionalNote: 'Nur wenn das Kind bereits schulpflichtig ist (≥ 6 Jahre)',
      category: 'sonstiges',
    },
  ],
}

// ---------------------------------------------------------------------------
// 4. Nationales Visum (für längere Aufenthalte aus Drittstaaten)
// ---------------------------------------------------------------------------

const visumsverfahrenNational: MandatsartChecklist = {
  id: 'visumsverfahren-national',
  title: 'Nationales Visum (Visum D — für Aufenthalte > 90 Tage)',
  titleVi: 'Thị thực quốc gia (Visa D — lưu trú trên 90 ngày)', // TODO: VI-review by native speaker
  category: 'migration',
  description:
    'Nationales Visum (Typ D) für Aufenthalte über 90 Tage aus Drittstaaten, z. B. zur Beschäftigung, zum Studium oder zum Familiennachzug. Antragstellung bei der Deutschen Botschaft im Herkunftsland.',
  legalBasis: ['§ 6 AufenthG', '§ 4 AufenthG', 'Art. 18 Visakodex', '§ 81 AufenthG'],
  typicalDuration: '4–12 Wochen (abhängig von Botschaft und Visumsart)',
  requiredDocuments: [
    {
      id: 'reisepass',
      label: 'Reisepass (Original, ≥ 12 Monate gültig über gewünschtes Einreisedatum, mind. 2 freie Seiten)',
      labelVi: 'Hộ chiếu (bản gốc, còn hạn ≥ 12 tháng sau ngày nhập cảnh, ít nhất 2 trang trống)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'identitaet',
    },
    {
      id: 'antragsformular',
      label: 'Ausgefülltes Visumantragsformular (online über Terminbuchungsportal der Botschaft)',
      labelVi: 'Mẫu đơn xin visa đã điền đầy đủ (trực tuyến qua cổng đặt lịch của Đại sứ quán)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
    },
    {
      id: 'biometrisches-lichtbild',
      label: 'Biometrisches Lichtbild (35 × 45 mm, ≤ 6 Monate alt, weißer Hintergrund)',
      labelVi: 'Ảnh sinh trắc học (35 × 45 mm, không quá 6 tháng, nền trắng)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'biometrie',
    },
    {
      id: 'einladungsschreiben-arbeitgeber',
      label: 'Einladungsschreiben oder Zusage des deutschen Arbeitgebers (bei Visum zur Beschäftigung)',
      labelVi: 'Thư mời hoặc cam kết của nhà tuyển dụng Đức (với visa lao động)', // TODO: VI-review by native speaker
      level: 'conditional',
      conditionalNote: 'Nur bei Visum zur Beschäftigung (§ 18 AufenthG)',
      category: 'einkommen',
    },
    {
      id: 'arbeitsvertrag',
      label: 'Unterschriebener Arbeitsvertrag (bei Visum zur Beschäftigung)',
      labelVi: 'Hợp đồng lao động đã ký (với visa lao động)', // TODO: VI-review by native speaker
      level: 'conditional',
      conditionalNote: 'Nur bei Visum zur Beschäftigung',
      category: 'einkommen',
    },
    {
      id: 'zulassungsbescheid-hochschule',
      label: 'Zulassungsbescheid der deutschen Hochschule (bei Studentenvisum)',
      labelVi: 'Thư chấp nhận của trường đại học Đức (với visa sinh viên)', // TODO: VI-review by native speaker
      level: 'conditional',
      conditionalNote: 'Nur bei Studentenvisum (§ 16 AufenthG)',
      category: 'sonstiges',
    },
    {
      id: 'finanzierungsnachweis',
      label: 'Nachweis Lebensunterhaltssicherung: Kontoauszüge (letzter 3 Monate) oder Sperrkonto-Bescheinigung',
      labelVi: 'Bằng chứng đảm bảo sinh hoạt phí: sao kê ngân hàng (3 tháng gần nhất) hoặc giấy xác nhận tài khoản ký quỹ', // TODO: VI-review by native speaker
      level: 'required',
      category: 'einkommen',
    },
    {
      id: 'krankenversicherung',
      label: 'Krankenversicherungsnachweis (Auslandsreisekrankenversicherung bis zur Anmeldung in DE)',
      labelVi: 'Bằng chứng bảo hiểm y tế (bảo hiểm du lịch đến khi đăng ký ở Đức)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'gesundheit',
    },
    {
      id: 'anwaltsvollmacht',
      label: 'Anwaltsvollmacht (Original, unterschrieben)',
      labelVi: 'Giấy ủy quyền luật sư (bản gốc, có chữ ký)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
    },
    {
      id: 'heiratsurkunde-familiennachzug',
      label: 'Heiratsurkunde mit Apostille/Legalisation + beglaubigte Übersetzung (bei Familiennachzug)',
      labelVi: 'Giấy đăng ký kết hôn kèm Apostille/hợp pháp hóa + bản dịch công chứng (đoàn tụ gia đình)', // TODO: VI-review by native speaker
      level: 'conditional',
      conditionalNote: 'Nur bei Familiennachzugs-Visum',
      category: 'familie',
    },
  ],
}

// ---------------------------------------------------------------------------
// 5. Einbürgerung
// ---------------------------------------------------------------------------

const einbuergerung: MandatsartChecklist = {
  id: 'einbuergerung',
  title: 'Einbürgerung (§§ 8–10 StAG)',
  titleVi: 'Nhập tịch Đức (§§ 8–10 StAG)', // TODO: VI-review by native speaker
  category: 'migration',
  description:
    'Erwerb der deutschen Staatsangehörigkeit nach § 10 StAG (Anspruchseinbürgerung nach 5 Jahren rechtmäßigem Aufenthalt) oder § 8 StAG (Ermessenseinbürgerung nach 8 Jahren). Seit 2024: Mehrstaatigkeit grundsätzlich zulässig.',
  legalBasis: ['§ 8 StAG', '§ 10 StAG', '§ 11 StAG', '§ 12 StAG'],
  typicalDuration: '12–24 Monate (abhängig von Einbürgerungsbehörde)',
  requiredDocuments: [
    {
      id: 'reisepass',
      label: 'Reisepass (Original + alle Kopien seit Einreise nach Deutschland)',
      labelVi: 'Hộ chiếu (bản gốc + tất cả bản sao từ khi nhập cảnh vào Đức)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'identitaet',
      typicalIssues: ['Alle abgelaufenen Reisepässe einreichen — Lücken werden kritisch geprüft'],
    },
    {
      id: 'aktueller-aufenthaltstitel',
      label: 'Aktueller Aufenthaltstitel (Original + Kopie)',
      labelVi: 'Giấy phép cư trú hiện tại (bản gốc + bản sao)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'aufenthalt',
    },
    {
      id: 'meldebescheinigung',
      label: 'Aktuelle Meldebescheinigung mit Einzugsdatum (≤ 3 Monate alt)',
      labelVi: 'Giấy đăng ký hộ khẩu hiện tại kèm ngày chuyển đến (không quá 3 tháng)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'wohnen',
    },
    {
      id: 'geburtsurkunde',
      label: 'Geburtsurkunde (Original + beglaubigte Übersetzung, ggf. Apostille/Legalisation)',
      labelVi: 'Giấy khai sinh (bản gốc + bản dịch công chứng, nếu cần Apostille/hợp pháp hóa)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'identitaet',
    },
    {
      id: 'einkommensnachweis',
      label: 'Einkommensnachweis: letzte 12 Monate Lohnabrechnungen oder Bescheid über Rentenhöhe',
      labelVi: 'Bằng chứng thu nhập: phiếu lương 12 tháng gần nhất hoặc thông báo mức lương hưu', // TODO: VI-review by native speaker
      description: 'Lebensunterhaltssicherung ohne Inanspruchnahme von Sozialleistungen ist Grundvoraussetzung.',
      level: 'required',
      category: 'einkommen',
    },
    {
      id: 'sprachnachweis-b1',
      label: 'Sprachzertifikat mind. B1 Deutsch (z. B. Goethe, telc, DTZ, oder Schulabschluss in DE)',
      labelVi: 'Chứng chỉ tiếng Đức tối thiểu B1 (Goethe, telc, DTZ, hoặc bằng tốt nghiệp ở Đức)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sprache',
    },
    {
      id: 'einbuergerungstest',
      label: 'Einbürgerungstest-Zertifikat (300 Fragen, Mindestpunktzahl 17/33, BAMF-autorisiert)',
      labelVi: 'Chứng chỉ kiểm tra nhập tịch (300 câu hỏi, điểm tối thiểu 17/33, được BAMF ủy quyền)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
      typicalIssues: ['Ausnahmen für Hochschulabsolventen möglich (§ 10 Abs. 7 StAG)'],
    },
    {
      id: 'strafregisterauszug',
      label: 'Führungszeugnis (Bundeszentralregister, Belegart O) — ≤ 3 Monate alt',
      labelVi: 'Lý lịch tư pháp (Bundeszentralregister, loại O) — không quá 3 tháng', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
    },
    {
      id: 'bekenntnis-verfassungsordnung',
      label: 'Unterschriebenes Bekenntnis zur freiheitlichen demokratischen Grundordnung',
      labelVi: 'Cam kết đã ký về trật tự dân chủ tự do cơ bản', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
    },
    {
      id: 'aufgabe-bisherige-staatsangehoerigkeit',
      label: 'Nachweis Aufgabe / Entlassung aus bisheriger Staatsangehörigkeit (falls keine Mehrstaatigkeit zulässig)',
      labelVi: 'Bằng chứng từ bỏ / thôi quốc tịch cũ (nếu không được phép đa quốc tịch)', // TODO: VI-review by native speaker
      level: 'conditional',
      conditionalNote: 'Nur wenn Herkunftsstaat keine Mehrstaatigkeit akzeptiert UND kein Ausnahmetatbestand gem. § 12 StAG vorliegt. Seit der StAG-Reform 2024 ist Mehrstaatigkeit für die meisten Fälle zulässig.',
      category: 'identitaet',
    },
    {
      id: 'heiratsurkunde',
      label: 'Heiratsurkunde (bei Verheirateten, Original + beglaubigte Übersetzung)',
      labelVi: 'Giấy đăng ký kết hôn (đối với người đã kết hôn, bản gốc + bản dịch công chứng)', // TODO: VI-review by native speaker
      level: 'conditional',
      conditionalNote: 'Nur wenn verheiratet',
      category: 'familie',
    },
    {
      id: 'anwaltsvollmacht',
      label: 'Anwaltsvollmacht (Original, unterschrieben)',
      labelVi: 'Giấy ủy quyền luật sư (bản gốc, có chữ ký)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
    },
  ],
}

// ---------------------------------------------------------------------------
// 6. Niederlassungserlaubnis (§ 9 AufenthG)
// ---------------------------------------------------------------------------

const niederlassungserlaubnis: MandatsartChecklist = {
  id: 'niederlassungserlaubnis',
  title: 'Niederlassungserlaubnis (§ 9 AufenthG)',
  titleVi: 'Giấy phép cư trú vĩnh viễn (§ 9 AufenthG)', // TODO: VI-review by native speaker
  category: 'migration',
  description:
    'Unbefristeter Aufenthaltstitel nach mind. 5 Jahren rechtmäßigem Aufenthalt mit Aufenthaltserlaubnis. Voraussetzungen: gesicherter Lebensunterhalt, Rentenversicherungsbeiträge, Sprachkenntnisse B1, Wohnraum, keine erheblichen Vorstrafen.',
  legalBasis: ['§ 9 AufenthG', '§ 9a AufenthG', '§ 5 AufenthG', '§ 26 AufenthG'],
  typicalDuration: '4–8 Wochen',
  requiredDocuments: [
    {
      id: 'reisepass',
      label: 'Reisepass (Original + Kopie aller Stempelseiten, ≥ 6 Monate gültig)',
      labelVi: 'Hộ chiếu (bản gốc + bản sao tất cả trang đóng dấu, còn hạn ≥ 6 tháng)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'identitaet',
    },
    {
      id: 'aktueller-aufenthaltstitel',
      label: 'Aktueller Aufenthaltstitel (Original + Kopie) — mind. 5 Jahre Aufenthalt nachweisbar',
      labelVi: 'Giấy phép cư trú hiện tại (bản gốc + bản sao) — chứng minh ≥ 5 năm cư trú', // TODO: VI-review by native speaker
      level: 'required',
      category: 'aufenthalt',
    },
    {
      id: 'meldebescheinigung',
      label: 'Aktuelle Meldebescheinigung (≤ 3 Monate alt)',
      labelVi: 'Giấy đăng ký hộ khẩu hiện tại (không quá 3 tháng)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'wohnen',
    },
    {
      id: 'rentenversicherungsbescheid',
      label: 'Nachweis 60 Monate Pflichtbeiträge zur Rentenversicherung (Rentenauskunft der DRV)',
      labelVi: 'Bằng chứng đóng 60 tháng bảo hiểm hưu trí bắt buộc (xác nhận của DRV)', // TODO: VI-review by native speaker
      description: 'Pflichtbeitrags-Nachweis gem. § 9 Abs. 2 Nr. 3 AufenthG. Online abrufbar über www.deutsche-rentenversicherung.de.',
      level: 'required',
      category: 'einkommen',
      typicalIssues: ['Rentenauskunft dauert 2-3 Wochen — rechtzeitig beantragen'],
    },
    {
      id: 'einkommensnachweis',
      label: 'Einkommensnachweis: letzte 3 Lohnabrechnungen + Arbeitsvertrag (unbefristet bevorzugt)',
      labelVi: 'Bằng chứng thu nhập: 3 phiếu lương gần nhất + hợp đồng lao động (không kỳ hạn được ưu tiên)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'einkommen',
    },
    {
      id: 'sprachzeugnis-b1',
      label: 'Sprachzertifikat mind. B1 Deutsch (Goethe, telc, DTZ, oder Schulabschluss in DE)',
      labelVi: 'Chứng chỉ tiếng Đức tối thiểu B1 (Goethe, telc, DTZ, hoặc bằng tốt nghiệp ở Đức)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sprache',
    },
    {
      id: 'wohnraumnachweis',
      label: 'Wohnraumnachweis: Mietvertrag + ausreichende Fläche für alle Haushaltsmitglieder',
      labelVi: 'Bằng chứng nhà ở: hợp đồng thuê + diện tích đủ cho tất cả thành viên hộ gia đình', // TODO: VI-review by native speaker
      level: 'required',
      category: 'wohnen',
    },
    {
      id: 'krankenversicherungsnachweis',
      label: 'Nachweis Krankenversicherung (gesetzlich oder privat)',
      labelVi: 'Bằng chứng bảo hiểm y tế (bảo hiểm pháp định hoặc tư nhân)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'gesundheit',
    },
    {
      id: 'biometrisches-lichtbild',
      label: 'Biometrisches Lichtbild (35 × 45 mm, ≤ 6 Monate alt)',
      labelVi: 'Ảnh sinh trắc học (35 × 45 mm, không quá 6 tháng)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'biometrie',
    },
    {
      id: 'anwaltsvollmacht',
      label: 'Anwaltsvollmacht (Original, unterschrieben)',
      labelVi: 'Giấy ủy quyền luật sư (bản gốc, có chữ ký)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
    },
    {
      id: 'strafregisterauszug',
      label: 'Führungszeugnis (≤ 3 Monate alt) — bei Vorstrafen gesonderte Prüfung',
      labelVi: 'Lý lịch tư pháp (không quá 3 tháng) — nếu có tiền án sẽ được xem xét riêng', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
    },
  ],
}

// ---------------------------------------------------------------------------
// 7. Chancenkarte (§ 20a AufenthG)
// ---------------------------------------------------------------------------

const chancenkarte: MandatsartChecklist = {
  id: 'chancenkarte',
  title: 'Chancenkarte zur Arbeitssuche (§ 20a AufenthG)',
  titleVi: 'Thẻ cơ hội tìm kiếm việc làm (§ 20a AufenthG)', // TODO: VI-review by native speaker
  category: 'migration',
  description:
    'Visum/Aufenthaltserlaubnis zur Arbeitssuche auf Basis eines Punktesystems (ab 2024). Voraussetzungen: Berufsqualifikation anerkannt oder vergleichbar mit deutschem Abschluss, Sprachkenntnisse A1/B2, mind. 1 Jahr Berufserfahrung.',
  legalBasis: ['§ 20a AufenthG', '§ 18 AufenthG', '§ 4 BeschV'],
  typicalDuration: '3–6 Wochen (Visum) + 1 Jahr Aufenthalt zur Suche',
  requiredDocuments: [
    {
      id: 'reisepass',
      label: 'Reisepass (Original, ≥ 12 Monate gültig über gewünschtes Einreisedatum)',
      labelVi: 'Hộ chiếu (bản gốc, còn hạn ≥ 12 tháng sau ngày nhập cảnh dự kiến)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'identitaet',
    },
    {
      id: 'qualifikationsnachweis',
      label: 'Nachweis Berufsqualifikation: Hochschulabschluss oder anerkannte Berufsausbildung (Original + begl. Übersetzung)',
      labelVi: 'Bằng chứng trình độ chuyên môn: bằng đại học hoặc đào tạo nghề được công nhận (bản gốc + bản dịch công chứng)', // TODO: VI-review by native speaker
      description: 'Alternativ: Punkt-Nachweis für vergleichbare Qualifikation ohne formale Anerkennung.',
      level: 'required',
      category: 'sonstiges',
      typicalIssues: [
        'Anerkennung durch anabin.kmk.org oder ANABIN-Datenbank prüfen lassen',
        'Beglaubigte Übersetzung durch vereidigten Übersetzer erforderlich',
      ],
    },
    {
      id: 'berufserfahrungsnachweis',
      label: 'Nachweis Berufserfahrung: Arbeitszeugnisse, Referenzschreiben oder Rentenkontoauszug (mind. 1 Jahr)',
      labelVi: 'Bằng chứng kinh nghiệm làm việc: thư tham chiếu hoặc sao kê bảo hiểm hưu trí (tối thiểu 1 năm)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'einkommen',
    },
    {
      id: 'sprachzeugnis',
      label: 'Sprachzertifikat Deutsch (mind. A1, B2 bringt Bonuspunkte) oder Englisch (mind. B2)',
      labelVi: 'Chứng chỉ ngôn ngữ: tiếng Đức tối thiểu A1, B2 được điểm thưởng; hoặc tiếng Anh tối thiểu B2', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sprache',
      typicalIssues: ['Ohne Sprachnachweis ist Antrag abzulehnen'],
    },
    {
      id: 'finanzierungsnachweis',
      label: 'Sperrkonto oder Nachweis Lebensunterhaltssicherung für mind. 12 Monate (ca. 1.027 €/Monat)',
      labelVi: 'Tài khoản ký quỹ hoặc bằng chứng đảm bảo sinh hoạt phí ít nhất 12 tháng (khoảng 1.027 €/tháng)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'einkommen',
    },
    {
      id: 'krankenversicherung',
      label: 'Reisekrankenversicherung für Einreise + Nachweis geplanter gesetzlicher KV',
      labelVi: 'Bảo hiểm y tế du lịch khi nhập cảnh + bằng chứng kế hoạch tham gia bảo hiểm y tế pháp định', // TODO: VI-review by native speaker
      level: 'required',
      category: 'gesundheit',
    },
    {
      id: 'biometrisches-lichtbild',
      label: 'Biometrisches Lichtbild (35 × 45 mm, ≤ 6 Monate alt)',
      labelVi: 'Ảnh sinh trắc học (35 × 45 mm, không quá 6 tháng)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'biometrie',
    },
    {
      id: 'anwaltsvollmacht',
      label: 'Anwaltsvollmacht (Original, unterschrieben)',
      labelVi: 'Giấy ủy quyền luật sư (bản gốc, có chữ ký)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
    },
    {
      id: 'deutschlandbezug-bonuspunkt',
      label: 'Nachweis Deutschland-Bezug für Bonuspunkt: frühere Aufenthalte, DE-Verwandte, Bildungsaufenthalte',
      labelVi: 'Bằng chứng mối liên hệ với Đức để tính điểm thưởng: lưu trú trước đây, người thân ở Đức, học tập', // TODO: VI-review by native speaker
      level: 'optional',
      category: 'sonstiges',
    },
  ],
}

// ---------------------------------------------------------------------------
// 8. Beschäftigungserlaubnis
// ---------------------------------------------------------------------------

const beschaeftigungserlaubnis: MandatsartChecklist = {
  id: 'beschaeftigungserlaubnis',
  title: 'Beschäftigungserlaubnis (§§ 18 ff. AufenthG)',
  titleVi: 'Giấy phép làm việc (§§ 18 ff. AufenthG)', // TODO: VI-review by native speaker
  category: 'migration',
  description:
    'Erteilung oder Nebenbestimmungs-Erweiterung der Arbeitsgenehmigung für Drittstaatsangehörige. Betrifft sowohl Erstanträge als auch Erweiterungen auf einen anderen Arbeitgeber oder eine andere Tätigkeit.',
  legalBasis: ['§ 18 AufenthG', '§ 18a AufenthG', '§ 18b AufenthG', '§ 39 AufenthG'],
  typicalDuration: '4–8 Wochen (mit BA-Zustimmung ggf. länger)',
  requiredDocuments: [
    {
      id: 'reisepass',
      label: 'Reisepass (Original + Kopie aller Stempelseiten)',
      labelVi: 'Hộ chiếu (bản gốc + bản sao tất cả trang đóng dấu)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'identitaet',
    },
    {
      id: 'aktueller-aufenthaltstitel',
      label: 'Aktueller Aufenthaltstitel (Original + Kopie)',
      labelVi: 'Giấy phép cư trú hiện tại (bản gốc + bản sao)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'aufenthalt',
    },
    {
      id: 'arbeitsvertrag',
      label: 'Unterschriebener Arbeitsvertrag (oder konkretes Stellenangebot mit Vergütungsangabe)',
      labelVi: 'Hợp đồng lao động đã ký (hoặc đề nghị việc làm cụ thể có mức lương)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'einkommen',
      typicalIssues: ['Vergütung muss Mindestlohn gem. Entgeltregelungen der BA erreichen'],
    },
    {
      id: 'qualifikationsnachweis',
      label: 'Anerkannter Berufsabschluss oder Hochschulzeugnis (Original + beglaubigte Übersetzung)',
      labelVi: 'Bằng nghề được công nhận hoặc bằng đại học (bản gốc + bản dịch công chứng)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
    },
    {
      id: 'anerkennungsbescheid',
      label: 'Anerkennungsbescheid der zuständigen Stelle (IHK, HWK, Bezirksregierung)',
      labelVi: 'Quyết định công nhận của cơ quan có thẩm quyền (IHK, HWK, Bezirksregierung)', // TODO: VI-review by native speaker
      level: 'conditional',
      conditionalNote: 'Nur bei reglementierten Berufen (Ärzte, Pflege, Handwerksmeister) — unbedingt prüfen lassen',
      category: 'sonstiges',
    },
    {
      id: 'meldebescheinigung',
      label: 'Aktuelle Meldebescheinigung (≤ 3 Monate alt)',
      labelVi: 'Giấy đăng ký hộ khẩu hiện tại (không quá 3 tháng)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'wohnen',
    },
    {
      id: 'biometrisches-lichtbild',
      label: 'Biometrisches Lichtbild (35 × 45 mm, ≤ 6 Monate alt)',
      labelVi: 'Ảnh sinh trắc học (35 × 45 mm, không quá 6 tháng)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'biometrie',
    },
    {
      id: 'anwaltsvollmacht',
      label: 'Anwaltsvollmacht (Original, unterschrieben)',
      labelVi: 'Giấy ủy quyền luật sư (bản gốc, có chữ ký)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
    },
    {
      id: 'sprachzeugnis',
      label: 'Sprachzeugnis (Niveau abhängig vom Beruf — mind. B1 für viele Positionen)',
      labelVi: 'Chứng chỉ ngôn ngữ (cấp độ phụ thuộc vào nghề — tối thiểu B1 với nhiều vị trí)', // TODO: VI-review by native speaker
      level: 'conditional',
      conditionalNote: 'Abhängig vom Berufsfeld — bei Gesundheitsberufen und Erzieher:innen zwingend',
      category: 'sprache',
    },
  ],
}

// ---------------------------------------------------------------------------
// 9. Eilantrag gegen Abschiebung (§ 80 V VwGO)
// ---------------------------------------------------------------------------

const eilantragAbschiebung: MandatsartChecklist = {
  id: 'eilantrag-abschiebung',
  title: 'Eilantrag gegen Abschiebung (§ 80 Abs. 5 VwGO)',
  titleVi: 'Đơn khẩn cấp chống trục xuất (§ 80 Abs. 5 VwGO)', // TODO: VI-review by native speaker
  category: 'migration',
  description:
    'Gerichtlicher Eilantrag beim Verwaltungsgericht zur vorläufigen Aussetzung einer angeordneten Abschiebung. Extrem zeitkritisch — i.d.R. 24-48 Stunden Reaktionszeit nach Abschiebungsanordnung.',
  legalBasis: ['§ 80 Abs. 5 VwGO', '§ 59 AufenthG', '§ 60a AufenthG', '§ 34 AsylG'],
  typicalDuration: '24–72 Stunden für Entscheidung des VG im Eilverfahren',
  requiredDocuments: [
    {
      id: 'abschiebungsandrohung',
      label: 'Abschiebungsandrohung oder -anordnung (Original oder Kopie) — mit Zustellungsdatum',
      labelVi: 'Thông báo trục xuất hoặc lệnh trục xuất (bản gốc hoặc bản sao) — kèm ngày tống đạt', // TODO: VI-review by native speaker
      description: 'Das genaue Zustelldatum ist entscheidend für die Fristberechnung gem. §§ 187/188 BGB.',
      level: 'required',
      category: 'aufenthalt',
      typicalIssues: [
        'Zustellungsdatum muss exakt dokumentiert werden',
        'Frist oft 7 Tage ab Zustellung — sofort handeln',
      ],
    },
    {
      id: 'asyl-oder-aufenthaltsbescheid',
      label: 'Alle relevanten Bescheide (Asylbescheid, Aufenthalts-Ablehnungs-Bescheid) — chronologisch geordnet',
      labelVi: 'Tất cả các quyết định liên quan (quyết định tị nạn, quyết định từ chối cư trú) — theo thứ tự thời gian', // TODO: VI-review by native speaker
      level: 'required',
      category: 'aufenthalt',
    },
    {
      id: 'reisepass',
      label: 'Reisepass oder Passersatzdokument (falls vorhanden)',
      labelVi: 'Hộ chiếu hoặc tài liệu thay thế hộ chiếu (nếu có)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'identitaet',
    },
    {
      id: 'aufenthaltsgestattung-duldung',
      label: 'Aufenthaltsgestattung oder Duldung (aktuelle + alle vergangenen)',
      labelVi: 'Giấy phép tạm trú hoặc giấy khoan hồng (hiện tại + tất cả trước đây)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'aufenthalt',
    },
    {
      id: 'vollmacht-unterzeichnet',
      label: 'Anwaltsvollmacht (sofort unterschrieben — Eilantrag kann erst nach Vollmacht gestellt werden)',
      labelVi: 'Giấy ủy quyền luật sư (ký ngay — đơn khẩn chỉ nộp được sau khi có ủy quyền)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
    },
    {
      id: 'abschiebungshindernis-belege',
      label: 'Belege für Abschiebungshindernisse: Gesundheitszeugnisse, familiäre Bindungen, Integration, Schutzbedarf',
      labelVi: 'Bằng chứng về trở ngại trục xuất: giấy y tế, quan hệ gia đình, hội nhập, nhu cầu bảo vệ', // TODO: VI-review by native speaker
      description: 'Je spezifischer die Belege, desto höher die Erfolgschance im Eilverfahren.',
      level: 'required',
      category: 'sonstiges',
      typicalIssues: [
        'Arztbriefe müssen aktuell sein (≤ 3 Monate)',
        'Schul- oder Ausbildungsnachweise der Kinder wirken als Integrationsnachweis',
      ],
    },
    {
      id: 'gefahrenlage-herkunftsland',
      label: 'Herkunftsland-Lageberichte oder Individualbelege (UNHCR, Auswärtiges Amt, Menschenrechtsorg.)',
      labelVi: 'Báo cáo tình hình nước gốc hoặc bằng chứng cá nhân (UNHCR, Bộ Ngoại giao Đức, tổ chức nhân quyền)', // TODO: VI-review by native speaker
      level: 'conditional',
      conditionalNote: 'Nur wenn Schutzgründe nach § 60 AufenthG oder AsylG geltend gemacht werden',
      category: 'sonstiges',
    },
  ],
}

// ---------------------------------------------------------------------------
// 10. Untätigkeitsklage (§ 75 VwGO)
// ---------------------------------------------------------------------------

const untaetigkeitsklage: MandatsartChecklist = {
  id: 'untaetigkeitsklage',
  title: 'Untätigkeitsklage (§ 75 VwGO)',
  titleVi: 'Khiếu kiện vì không hành động (§ 75 VwGO)', // TODO: VI-review by native speaker
  category: 'migration',
  description:
    'Verwaltungsklage, wenn Behörde über Antrag oder Widerspruch nicht binnen angemessener Frist (i.d.R. 3 Monate) entschieden hat. Zwingt Behörde zur Bescheidung.',
  legalBasis: ['§ 75 VwGO', '§ 42 VwGO', '§ 68 VwGO', '§ 74 VwGO'],
  typicalDuration: '6–18 Monate (Verwaltungsgericht)',
  requiredDocuments: [
    {
      id: 'urspruenglicher-antrag',
      label: 'Kopie des ursprünglichen Antrags an die Behörde (mit Eingangsbestätigung oder Posteingangsstempel)',
      labelVi: 'Bản sao đơn xin ban đầu gửi cơ quan (kèm xác nhận nhận đơn hoặc dấu nhận văn thư)', // TODO: VI-review by native speaker
      description: 'Belegt, dass ein Antrag gestellt wurde, über den die Behörde nicht entschieden hat.',
      level: 'required',
      category: 'sonstiges',
      typicalIssues: ['Ohne Eingangsbestätigung ist Eingang oft streitig — immer Einschreiben nutzen'],
    },
    {
      id: 'widerspruchseinlegung',
      label: 'Widerspruchsschreiben (falls bereits Widerspruch eingelegt, mit Eingangsbestätigung)',
      labelVi: 'Văn bản khiếu nại (nếu đã khiếu nại, kèm xác nhận nhận)', // TODO: VI-review by native speaker
      level: 'conditional',
      conditionalNote: 'Nur wenn bereits Widerspruch eingelegt wurde und darüber nicht entschieden wurde',
      category: 'sonstiges',
    },
    {
      id: 'behoerdliche-korrespondenz',
      label: 'Gesamte Korrespondenz mit der Behörde (alle Schreiben chronologisch)',
      labelVi: 'Toàn bộ thư từ với cơ quan (tất cả thư theo thứ tự thời gian)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
    },
    {
      id: 'reisepass',
      label: 'Reisepass oder Personalausweis (Kopie)',
      labelVi: 'Hộ chiếu hoặc CMND (bản sao)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'identitaet',
    },
    {
      id: 'aktueller-aufenthaltstitel',
      label: 'Aktueller Aufenthaltstitel oder Fiktionsbescheinigung (Kopie)',
      labelVi: 'Giấy phép cư trú hiện tại hoặc giấy xác nhận theo quy định (bản sao)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'aufenthalt',
    },
    {
      id: 'antragsdatum-frist',
      label: 'Nachweis Antragsdatum und Berechnung der 3-Monatsfrist (Kalenderblatt oder Timeline)',
      labelVi: 'Bằng chứng ngày nộp đơn và tính thời hạn 3 tháng (lịch hoặc dòng thời gian)', // TODO: VI-review by native speaker
      description: 'Klage erst zulässig, wenn 3 Monate verstrichen UND zureichender Grund fehlt (§ 75 VwGO).',
      level: 'required',
      category: 'sonstiges',
    },
    {
      id: 'anwaltsvollmacht',
      label: 'Anwaltsvollmacht (Original, unterschrieben)',
      labelVi: 'Giấy ủy quyền luật sư (bản gốc, có chữ ký)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
    },
    {
      id: 'sachverhaltsdarstellung',
      label: 'Schriftliche Sachverhaltsdarstellung durch Mandant:in (eigene Schilderung des Ablaufs)',
      labelVi: 'Trình bày tình huống bằng văn bản của thân chủ (mô tả diễn biến theo lời thân chủ)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
    },
  ],
}

// ---------------------------------------------------------------------------
// 11. Härtefallantrag (§ 23a AufenthG)
// ---------------------------------------------------------------------------

const haertefall: MandatsartChecklist = {
  id: 'haertefall',
  title: 'Härtefallantrag (§ 23a AufenthG)',
  titleVi: 'Đơn xin xem xét trường hợp đặc biệt (§ 23a AufenthG)', // TODO: VI-review by native speaker
  category: 'migration',
  description:
    'Antrag an die Härtefallkommission des Bundeslandes, eine Aufenthaltserlaubnis in atypischen, besonders gelagerten Einzelfällen zu erteilen, obwohl die gesetzlichen Voraussetzungen nicht erfüllt sind. Auslese-Verfahren mit hohem Ermessensspielraum.',
  legalBasis: ['§ 23a AufenthG', '§ 60a AufenthG', 'Landesgesetze über Härtefallkommissionen'],
  typicalDuration: '3–12 Monate (Härtefallkommission + Ausländerbehörde)',
  requiredDocuments: [
    {
      id: 'reisepass',
      label: 'Reisepass oder Passersatzdokument (Original + Kopie)',
      labelVi: 'Hộ chiếu hoặc tài liệu thay thế hộ chiếu (bản gốc + bản sao)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'identitaet',
    },
    {
      id: 'aufenthalts-und-duldungshistorie',
      label: 'Vollständige Aufenthalts- und Duldungshistorie (chronologisch, alle Bescheide)',
      labelVi: 'Lịch sử cư trú và khoan hồng đầy đủ (theo thứ tự thời gian, tất cả các quyết định)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'aufenthalt',
      typicalIssues: ['Lücken in der Aufenthaltshistorie wirken negativ — vollständige Dokumentation entscheidend'],
    },
    {
      id: 'haertegrundschilderung',
      label: 'Ausführliche persönliche Schilderung der Härtegründe (DE, rechtlich ausformuliert durch Anwält:in)',
      labelVi: 'Mô tả chi tiết cá nhân về các lý do hoàn cảnh khó khăn (tiếng Đức, được luật sư diễn đạt pháp lý)', // TODO: VI-review by native speaker
      description: 'Das Herzstück des Antrags. Die Anwält:in arbeitet den Sachverhalt nach § 23a AufenthG-Kriterien aus.',
      level: 'required',
      category: 'sonstiges',
    },
    {
      id: 'integrationsbelege',
      label: 'Integrationsbelege: Schul- / Ausbildungs-Zeugnisse, Sprachzertifikate, Vereinsmitgliedschaften, Arbeit',
      labelVi: 'Bằng chứng hội nhập: bảng điểm trường/đào tạo nghề, chứng chỉ ngôn ngữ, câu lạc bộ, việc làm', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
    },
    {
      id: 'soziale-einbindung',
      label: 'Nachweise sozialer Einbindung: Referenzschreiben (Arbeitgeber, Verein, Kirchengemeinde, Nachbarn)',
      labelVi: 'Bằng chứng gắn kết xã hội: thư giới thiệu (chủ lao động, hội đoàn, giáo xứ, hàng xóm)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
    },
    {
      id: 'kindergeschichte',
      label: 'Unterlagen über in Deutschland geborene oder aufgewachsene Kinder (Geburtsurkunden, Schul-/Kita-Belege)',
      labelVi: 'Tài liệu về trẻ sinh ra hoặc lớn lên ở Đức (giấy khai sinh, chứng nhận trường/nhà trẻ)', // TODO: VI-review by native speaker
      level: 'conditional',
      conditionalNote: 'Nur wenn Kinder in Deutschland geboren wurden oder hier aufgewachsen sind — starkes Härtefall-Kriterium',
      category: 'familie',
    },
    {
      id: 'gesundheitliche-haertegrundschilderung',
      label: 'Ärztliche Atteste / Gutachten bei gesundheitlichen Härtegründen (Original + ggf. Fachgutachten)',
      labelVi: 'Giấy khám hoặc giám định y tế với lý do sức khỏe (bản gốc + giám định chuyên khoa nếu cần)', // TODO: VI-review by native speaker
      level: 'conditional',
      conditionalNote: 'Nur wenn gesundheitliche Härtegründe geltend gemacht werden',
      category: 'gesundheit',
    },
    {
      id: 'voranfrage-haertefallkommission',
      label: 'Voranfrage-Schreiben an Härtefallkommission (durch Anwält:in formuliert)',
      labelVi: 'Thư hỏi trước gửi Ủy ban hoàn cảnh khó khăn (do luật sư soạn thảo)', // TODO: VI-review by native speaker
      description: 'Manche Landeskommissionen erwarten eine informelle Voranfrage vor offiziellem Antrag.',
      level: 'conditional',
      conditionalNote: 'Abhängig von Bundesland — bei Bayern, NRW, Baden-Württemberg üblich',
      category: 'sonstiges',
    },
    {
      id: 'anwaltsvollmacht',
      label: 'Anwaltsvollmacht (Original, unterschrieben)',
      labelVi: 'Giấy ủy quyền luật sư (bản gốc, có chữ ký)', // TODO: VI-review by native speaker
      level: 'required',
      category: 'sonstiges',
    },
  ],
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export const MANDATSART_CHECKLISTS: MandatsartChecklist[] = [
  aufenthaltstitelVerlaengerung,     // 1
  familiennachzugEhegatte,           // 2
  familiennachzugKind,               // 3
  visumsverfahrenNational,           // 4
  einbuergerung,                     // 5
  niederlassungserlaubnis,           // 6
  chancenkarte,                      // 7
  beschaeftigungserlaubnis,          // 8
  eilantragAbschiebung,              // 9
  untaetigkeitsklage,                // 10
  haertefall,                        // 11
]

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Lookup a single MandatsartChecklist by its stable slug ID.
 * Returns `undefined` if not found — callers should handle the missing case.
 */
export function getChecklistById(id: string): MandatsartChecklist | undefined {
  return MANDATSART_CHECKLISTS.find((c) => c.id === id)
}

/**
 * Filter checklists by top-level category (e.g. 'migration', 'familie').
 */
export function getChecklistsByCategory(cat: MandatsartCategory): MandatsartChecklist[] {
  return MANDATSART_CHECKLISTS.filter((c) => c.category === cat)
}

/**
 * Count only the 'required' documents in a checklist.
 * 'conditional' and 'optional' items are intentionally excluded —
 * this number represents the hard minimum Bao's team needs.
 */
export function getRequiredDocsCount(checklist: MandatsartChecklist): number {
  return checklist.requiredDocuments.filter((d) => d.level === 'required').length
}
