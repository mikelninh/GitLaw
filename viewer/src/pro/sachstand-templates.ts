/**
 * Modul B — Sachstands-Templates DE + VI
 *
 * Pro Status: mandant_de, mandant_vi, mittelsperson_de, mittelsperson_vi.
 * Platzhalter: {mandant_anrede}, {mandant_name}, {aktenzeichen}, {mandatsart},
 *              {behoerde}, {antrag_datum}, {fehlende_unterlagen},
 *              {naechster_schritt}, {kanzlei_unterschrift}
 *
 * Voice: respektvoll-warm, klare Trennung Kanzlei vs. Behörde,
 * keine Erfolgsversprechen, keine Frist-Zusagen, 4–8 Sätze.
 * VI-Templates: TODO-Marker — vor Pilot mit Bao (nativem Sprecher) prüfen.
 */

import type { CaseStatus } from './case-status'

export interface SachstandsTemplate {
  status: CaseStatus
  mandant_de: string
  mandant_vi: string
  mittelsperson_de?: string
  mittelsperson_vi?: string
}

export const SACHSTANDS_TEMPLATES: SachstandsTemplate[] = [
  // -------------------------------------------------------------------------
  // 1 — unterlagen_fehlen
  // -------------------------------------------------------------------------
  {
    status: 'unterlagen_fehlen',
    mandant_de: `{mandant_anrede}

vielen Dank für Ihre Anfrage zum Sachstand Ihres Verfahrens (Aktenzeichen {aktenzeichen}).

Damit wir den Antrag bei {behoerde} einreichen können, fehlen uns derzeit noch folgende Unterlagen:

{fehlende_unterlagen}

Bitte reichen Sie diese so bald wie möglich nach. Ohne diese Unterlagen kann der Antrag nicht weitergeleitet werden, was das Verfahren verzögert.

Wenn Sie beim Beschaffen einzelner Dokumente Hilfe benötigen oder Fragen haben, melden Sie sich gerne direkt bei uns.

{kanzlei_unterschrift}`,

    // TODO: VI-review by native speaker
    mandant_vi: `{mandant_anrede}

Cảm ơn quý vị đã hỏi thăm về tiến trình hồ sơ (Số hiệu: {aktenzeichen}).

Để chúng tôi có thể nộp đơn tới {behoerde}, chúng tôi hiện vẫn cần các giấy tờ sau:

{fehlende_unterlagen}

Kính mong quý vị bổ sung sớm nhất có thể. Nếu thiếu các giấy tờ này, đơn chưa thể được gửi đi và hồ sơ sẽ bị chậm trễ.

Nếu quý vị cần hỗ trợ trong việc thu thập tài liệu hoặc có câu hỏi, xin vui lòng liên hệ trực tiếp với chúng tôi.

{kanzlei_unterschrift}`,

    mittelsperson_de: `{mandant_anrede}

wir wenden uns an Sie als Kontaktperson für {mandant_name} (Aktenzeichen {aktenzeichen}).

Für die Einreichung des Antrags bei {behoerde} fehlen uns noch folgende Unterlagen:

{fehlende_unterlagen}

Bitte geben Sie diese Information an {mandant_name} weiter und bitten Sie darum, die Unterlagen möglichst bald einzureichen. Gerne können Sie uns die Dokumente auch direkt zukommen lassen.

{kanzlei_unterschrift}`,

    // TODO: VI-review by native speaker
    mittelsperson_vi: `{mandant_anrede}

Chúng tôi liên hệ với quý vị với tư cách là người đại diện liên lạc cho {mandant_name} (Số hiệu: {aktenzeichen}).

Để nộp đơn tới {behoerde}, chúng tôi vẫn còn thiếu các giấy tờ sau:

{fehlende_unterlagen}

Kính mong quý vị chuyển thông tin này đến {mandant_name} và đề nghị bổ sung tài liệu sớm nhất có thể. Quý vị cũng có thể gửi tài liệu trực tiếp cho chúng tôi.

{kanzlei_unterschrift}`,
  },

  // -------------------------------------------------------------------------
  // 2 — unterlagen_in_pruefung
  // -------------------------------------------------------------------------
  {
    status: 'unterlagen_in_pruefung',
    mandant_de: `{mandant_anrede}

wir haben die eingereichten Unterlagen zu Ihrem Verfahren (Aktenzeichen {aktenzeichen}) vollständig erhalten und prüfen diese derzeit intern.

Sobald die Prüfung abgeschlossen ist, informieren wir Sie über den nächsten Schritt. Sollten dabei noch Unklarheiten oder Lücken auftauchen, melden wir uns umgehend bei Ihnen.

Aktuell ist Ihrerseits keine weitere Aktion erforderlich.

{kanzlei_unterschrift}`,

    // TODO: VI-review by native speaker
    mandant_vi: `{mandant_anrede}

Chúng tôi đã nhận đầy đủ các tài liệu quý vị nộp cho hồ sơ {aktenzeichen} và hiện đang tiến hành kiểm tra nội bộ.

Ngay khi quá trình kiểm tra hoàn tất, chúng tôi sẽ thông báo cho quý vị về bước tiếp theo. Nếu trong quá trình kiểm tra phát sinh vấn đề hoặc thiếu sót, chúng tôi sẽ liên hệ ngay.

Hiện tại quý vị không cần thực hiện thêm bất kỳ hành động nào.

{kanzlei_unterschrift}`,

    mittelsperson_de: `{mandant_anrede}

zur Information: Die Unterlagen für {mandant_name} (Aktenzeichen {aktenzeichen}) liegen uns vollständig vor und werden gerade geprüft. Sobald die Prüfung abgeschlossen ist, geben wir Bescheid.

{kanzlei_unterschrift}`,

    // TODO: VI-review by native speaker
    mittelsperson_vi: `{mandant_anrede}

Thông báo để quý vị biết: Chúng tôi đã nhận đủ hồ sơ của {mandant_name} (Số hiệu: {aktenzeichen}) và đang tiến hành kiểm tra. Chúng tôi sẽ thông báo ngay khi hoàn tất.

{kanzlei_unterschrift}`,
  },

  // -------------------------------------------------------------------------
  // 3 — antrag_in_vorbereitung
  // -------------------------------------------------------------------------
  {
    status: 'antrag_in_vorbereitung',
    mandant_de: `{mandant_anrede}

die Prüfung Ihrer Unterlagen ist abgeschlossen. Alle notwendigen Dokumente für Ihr Verfahren (Aktenzeichen {aktenzeichen}) liegen vor.

Wir bereiten den Antrag ({mandatsart}) derzeit für die Einreichung bei {behoerde} vor. Dieser Schritt liegt vollständig in unserer Verantwortung und erfordert von Ihrer Seite keine weiteren Aktivitäten.

Sobald der Antrag eingereicht ist, informieren wir Sie mit dem Einreichungsdatum.

{kanzlei_unterschrift}`,

    // TODO: VI-review by native speaker
    mandant_vi: `{mandant_anrede}

Việc kiểm tra hồ sơ của quý vị đã hoàn tất. Tất cả các giấy tờ cần thiết cho hồ sơ {aktenzeichen} đã đầy đủ.

Chúng tôi đang chuẩn bị đơn ({mandatsart}) để nộp lên {behoerde}. Bước này hoàn toàn thuộc trách nhiệm của chúng tôi và quý vị không cần thực hiện thêm gì.

Ngay khi đơn được nộp, chúng tôi sẽ thông báo cho quý vị ngày nộp.

{kanzlei_unterschrift}`,

    mittelsperson_de: `{mandant_anrede}

kurze Rückmeldung zum Stand des Verfahrens von {mandant_name} (Aktenzeichen {aktenzeichen}): Der Antrag wird derzeit von uns vorbereitet und in Kürze eingereicht. Von Ihrer Seite ist nichts zu veranlassen.

{kanzlei_unterschrift}`,

    // TODO: VI-review by native speaker
    mittelsperson_vi: `{mandant_anrede}

Cập nhật ngắn về hồ sơ của {mandant_name} (Số hiệu: {aktenzeichen}): Đơn đang được chúng tôi chuẩn bị và sẽ sớm được nộp. Quý vị không cần làm gì thêm.

{kanzlei_unterschrift}`,
  },

  // -------------------------------------------------------------------------
  // 4 — antrag_eingereicht
  // -------------------------------------------------------------------------
  {
    status: 'antrag_eingereicht',
    mandant_de: `{mandant_anrede}

wir freuen uns, Ihnen mitteilen zu können, dass der Antrag ({mandatsart}) für Ihr Verfahren (Aktenzeichen {aktenzeichen}) am {antrag_datum} bei {behoerde} eingereicht wurde.

Die weitere Bearbeitung liegt jetzt bei der Behörde. Erfahrungsgemäß dauert die Bearbeitung mehrere Wochen — ein genauer Zeitrahmen lässt sich leider nicht vorhersagen. Bitte sehen Sie bis dahin von Nachfragen direkt bei der Behörde ab, da dies die Bearbeitung erfahrungsgemäß nicht beschleunigt.

Wir beobachten den Vorgang und informieren Sie, sobald eine Rückmeldung eingeht.

{kanzlei_unterschrift}`,

    // TODO: VI-review by native speaker
    mandant_vi: `{mandant_anrede}

Chúng tôi vui mừng thông báo rằng đơn ({mandatsart}) cho hồ sơ {aktenzeichen} đã được nộp lên {behoerde} vào ngày {antrag_datum}.

Việc xử lý tiếp theo thuộc về cơ quan. Theo kinh nghiệm, thời gian xử lý thường mất vài tuần — rất tiếc chúng tôi không thể dự đoán thời gian chính xác. Kính mong quý vị chưa liên hệ trực tiếp với cơ quan để hỏi thêm, vì điều này thường không giúp đẩy nhanh quá trình.

Chúng tôi theo dõi hồ sơ và sẽ thông báo ngay khi nhận được phản hồi.

{kanzlei_unterschrift}`,

    mittelsperson_de: `{mandant_anrede}

zur Information: Der Antrag für {mandant_name} (Aktenzeichen {aktenzeichen}) wurde am {antrag_datum} bei {behoerde} eingereicht. Wir warten nun auf die behördliche Rückmeldung und informieren, sobald etwas Neues vorliegt.

{kanzlei_unterschrift}`,

    // TODO: VI-review by native speaker
    mittelsperson_vi: `{mandant_anrede}

Thông báo: Đơn cho {mandant_name} (Số hiệu: {aktenzeichen}) đã được nộp lên {behoerde} vào ngày {antrag_datum}. Chúng tôi đang chờ phản hồi từ cơ quan và sẽ thông báo ngay khi có tin mới.

{kanzlei_unterschrift}`,
  },

  // -------------------------------------------------------------------------
  // 5 — behoerdliche_rueckmeldung_ausstehend
  // -------------------------------------------------------------------------
  {
    status: 'behoerdliche_rueckmeldung_ausstehend',
    mandant_de: `{mandant_anrede}

der Antrag ({mandatsart}) liegt seit dem {antrag_datum} bei {behoerde} zur Bearbeitung. Erfahrungsgemäß dauert die behördliche Bearbeitung mehrere Wochen, in manchen Fällen auch länger — dies liegt außerhalb unseres Einflussbereichs.

Wir haben bisher keine Rückmeldung erhalten. Sobald ein Bescheid, eine Nachforderung oder ein Terminvorschlag eingeht, melden wir uns umgehend bei Ihnen.

Bis dahin bitten wir um Geduld. Für Rückfragen stehen wir Ihnen gerne zur Verfügung.

{kanzlei_unterschrift}`,

    // TODO: VI-review by native speaker
    mandant_vi: `{mandant_anrede}

Đơn ({mandatsart}) đã được nộp lên {behoerde} từ ngày {antrag_datum}. Theo kinh nghiệm, quá trình xử lý của cơ quan thường kéo dài vài tuần, đôi khi lâu hơn — điều này nằm ngoài khả năng kiểm soát của chúng tôi.

Đến nay chúng tôi chưa nhận được phản hồi nào. Ngay khi nhận được quyết định, yêu cầu bổ sung, hoặc thông báo lịch hẹn, chúng tôi sẽ liên hệ ngay với quý vị.

Kính mong quý vị thông cảm chờ đợi. Mọi thắc mắc xin vui lòng liên hệ chúng tôi.

{kanzlei_unterschrift}`,

    mittelsperson_de: `{mandant_anrede}

aktueller Stand zum Verfahren von {mandant_name} (Aktenzeichen {aktenzeichen}): Der Antrag wurde am {antrag_datum} bei {behoerde} eingereicht. Eine Rückmeldung steht noch aus. Sobald etwas Konkretes vorliegt, geben wir Bescheid.

{kanzlei_unterschrift}`,

    // TODO: VI-review by native speaker
    mittelsperson_vi: `{mandant_anrede}

Tình trạng hiện tại của hồ sơ {mandant_name} (Số hiệu: {aktenzeichen}): Đơn đã nộp ngày {antrag_datum} lên {behoerde}. Chưa có phản hồi. Chúng tôi sẽ thông báo ngay khi có thông tin cụ thể.

{kanzlei_unterschrift}`,
  },

  // -------------------------------------------------------------------------
  // 6 — behoerde_nachforderung
  // -------------------------------------------------------------------------
  {
    status: 'behoerde_nachforderung',
    mandant_de: `{mandant_anrede}

{behoerde} hat im Rahmen Ihres Verfahrens (Aktenzeichen {aktenzeichen}) weitere Unterlagen angefordert. Das ist ein normaler Schritt, der häufig vorkommt, und kein Hinweis auf eine negative Entscheidung.

Wir prüfen derzeit, welche Dokumente genau benötigt werden und werden Sie mit einer klaren Liste kontaktieren. Bitte halten Sie mögliche Nachweise (z. B. aktuelle Meldebescheinigung, neue Einkommensnachweise) bereit.

Bis zur Klärung bitten wir um einen Moment Geduld.

{kanzlei_unterschrift}`,

    // TODO: VI-review by native speaker
    mandant_vi: `{mandant_anrede}

{behoerde} đã yêu cầu bổ sung thêm tài liệu trong quá trình xử lý hồ sơ {aktenzeichen}. Đây là bước thông thường, thường xảy ra và không phải dấu hiệu của quyết định tiêu cực.

Chúng tôi đang xem xét chính xác những giấy tờ nào được yêu cầu và sẽ liên hệ quý vị với danh sách rõ ràng. Kính mong quý vị chuẩn bị sẵn các giấy tờ có thể cần (ví dụ: xác nhận hộ khẩu mới, bảng lương gần đây).

Kính mong quý vị chờ đợi trong giây lát để chúng tôi làm rõ.

{kanzlei_unterschrift}`,

    mittelsperson_de: `{mandant_anrede}

{behoerde} hat Nachunterlagen zum Verfahren von {mandant_name} (Aktenzeichen {aktenzeichen}) angefordert. Wir klären gerade die Details und melden uns mit einer genauen Liste. Bitte geben Sie diese Information an {mandant_name} weiter.

{kanzlei_unterschrift}`,

    // TODO: VI-review by native speaker
    mittelsperson_vi: `{mandant_anrede}

{behoerde} yêu cầu bổ sung tài liệu cho hồ sơ của {mandant_name} (Số hiệu: {aktenzeichen}). Chúng tôi đang làm rõ chi tiết và sẽ cung cấp danh sách cụ thể. Kính mong quý vị chuyển thông tin này đến {mandant_name}.

{kanzlei_unterschrift}`,
  },

  // -------------------------------------------------------------------------
  // 7 — termin_steht_aus
  // -------------------------------------------------------------------------
  {
    status: 'termin_steht_aus',
    mandant_de: `{mandant_anrede}

{behoerde} hat in Ihrem Verfahren (Aktenzeichen {aktenzeichen}) einen Termin oder eine Entscheidung angekündigt. Wir warten derzeit auf die genauen Details dazu.

Sobald Datum, Ort oder weitere Informationen vorliegen, informieren wir Sie sofort. Für den Termin selbst werden wir Sie rechtzeitig vorbereiten und begleiten.

Bitte achten Sie in den nächsten Tagen auf eine Nachricht von uns.

{kanzlei_unterschrift}`,

    // TODO: VI-review by native speaker
    mandant_vi: `{mandant_anrede}

{behoerde} đã thông báo về lịch hẹn hoặc quyết định trong hồ sơ {aktenzeichen}. Chúng tôi hiện đang chờ thông tin chi tiết.

Ngay khi có ngày, địa điểm hoặc thông tin khác, chúng tôi sẽ thông báo ngay cho quý vị. Chúng tôi sẽ chuẩn bị và đồng hành cùng quý vị cho buổi hẹn này.

Kính mong quý vị sẵn sàng để phản hồi trong thời gian ngắn.

{kanzlei_unterschrift}`,

    mittelsperson_de: `{mandant_anrede}

{behoerde} hat für {mandant_name} (Aktenzeichen {aktenzeichen}) einen Termin oder eine Entscheidung angekündigt. Wir warten auf die genauen Details und melden uns, sobald alles klar ist. Bitte geben Sie {mandant_name} Bescheid, erreichbar zu sein.

{kanzlei_unterschrift}`,

    // TODO: VI-review by native speaker
    mittelsperson_vi: `{mandant_anrede}

{behoerde} đã thông báo lịch hẹn hoặc quyết định cho {mandant_name} (Số hiệu: {aktenzeichen}). Chúng tôi đang chờ chi tiết và sẽ liên hệ ngay khi rõ ràng. Kính nhờ quý vị nhắc {mandant_name} luôn sẵn sàng liên lạc.

{kanzlei_unterschrift}`,
  },

  // -------------------------------------------------------------------------
  // 8 — verfahren_abgeschlossen
  // -------------------------------------------------------------------------
  {
    status: 'verfahren_abgeschlossen',
    mandant_de: `{mandant_anrede}

Ihr Verfahren zur {mandatsart} (Aktenzeichen {aktenzeichen}) ist abgeschlossen. Der entsprechende Bescheid liegt uns vor und wurde Ihnen zugeleitet.

Die Akte wird auf unserer Seite ordnungsgemäß dokumentiert und archiviert. Alle relevanten Unterlagen stehen Ihnen auf Anfrage jederzeit zur Verfügung.

Sollten sich künftig Folgefragen oder neue Verfahren ergeben, kommen Sie gerne auf uns zu.

{kanzlei_unterschrift}`,

    // TODO: VI-review by native speaker
    mandant_vi: `{mandant_anrede}

Hồ sơ của quý vị (Số hiệu: {aktenzeichen}, loại: {mandatsart}) đã được hoàn tất. Quyết định liên quan đã có và đã được chuyển đến quý vị.

Hồ sơ sẽ được chúng tôi lưu trữ đầy đủ theo quy định. Tất cả tài liệu liên quan luôn có sẵn theo yêu cầu của quý vị.

Nếu có câu hỏi tiếp theo hoặc thủ tục mới trong tương lai, xin vui lòng liên hệ chúng tôi.

{kanzlei_unterschrift}`,

    mittelsperson_de: `{mandant_anrede}

das Verfahren von {mandant_name} (Aktenzeichen {aktenzeichen}) ist abgeschlossen. Der Bescheid liegt vor und wurde weitergeleitet. Bitte geben Sie {mandant_name} entsprechend Bescheid. Bei Rückfragen stehen wir zur Verfügung.

{kanzlei_unterschrift}`,

    // TODO: VI-review by native speaker
    mittelsperson_vi: `{mandant_anrede}

Hồ sơ của {mandant_name} (Số hiệu: {aktenzeichen}) đã hoàn tất. Quyết định đã có và đã được chuyển đi. Kính nhờ quý vị thông báo cho {mandant_name}. Mọi thắc mắc xin liên hệ chúng tôi.

{kanzlei_unterschrift}`,
  },
]

export function getTemplateForStatus(status: CaseStatus): SachstandsTemplate | undefined {
  return SACHSTANDS_TEMPLATES.find(t => t.status === status)
}
