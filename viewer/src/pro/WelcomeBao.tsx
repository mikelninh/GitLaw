/**
 * Persönliche Landing-Page für Thai Bao Nguyen — Mikels bester Freund
 * und 4. Beta-Tester der Pro-App.
 *
 * Erreichbar über zwei URLs (beide funktionieren):
 *   /#/bao
 *   /#/willkommen/bao
 *
 * Was hier anders ist als die generische ProAuth-Page:
 * - Persönliche Anrede von Mikel
 * - Tipp: Migrationsrecht-Pack-Hinweis (12 Templates für seine Vietnamesische
 *   Community)
 * - Live-Vorschau des Vietnamese Intake-Forms via QR
 * - Ein-Klick „App starten" lädt automatisch BETA-NGUYEN + Nguyen-Preset
 *
 * Inspiration: Apple Welcome-Card-Stil — eine klare CTA, viel Whitespace,
 * persönlicher Ton.
 */

import { Link } from 'react-router-dom'
import { Scale, Sparkles, ArrowRight, Globe, FileText } from 'lucide-react'
import QrCard from './QrCard'

const PRO_LINK = '/#/pro?invite=BETA-NGUYEN&preset=nguyen'

export default function WelcomeBao() {
  const intakeUrl = `${window.location.origin}${window.location.pathname}#/intake/demo-bao?lang=vi`

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-gold-light)] via-[var(--color-bg)] to-[var(--color-bg)]">
      {/* Top Bar */}
      <header className="border-b border-[var(--color-border)] bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Scale className="w-5 h-5 text-[var(--color-gold)]" />
            GitLaw <span className="text-[var(--color-gold)]">Pro</span>
            <span className="ml-2 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
              für dich, persönlich
            </span>
          </div>
          <Link to="/preise" className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
            Preise
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="inline-block mb-6">
          <span className="text-5xl">🇻🇳</span>
        </div>
        <h1
          className="text-4xl md:text-5xl font-semibold mb-4 leading-tight"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Hallo Bao,
          <br />
          das hier ist für dich.
        </h1>
        <p className="text-lg text-[var(--color-ink-soft)] max-w-xl mx-auto leading-relaxed">
          Ich habe ein Werkzeug gebaut, das deutsche Anwält:innen den Schreibtisch frei räumt.
          Bei dir habe ich an etwas Konkretes gedacht: ein <strong>vietnamesisch-sprachiges
          Mandant:innen-Formular</strong> und <strong>12 Migrationsrecht-Vorlagen</strong> —
          falls deine Mandantschaft das öfter braucht, als deine Website verrät 😉
        </p>
        <p className="text-sm text-[var(--color-ink-muted)] mt-4 italic">
          — Mikel
        </p>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <a
          href={PRO_LINK}
          className="block bg-[var(--color-ink)] text-white rounded-2xl p-6 hover:opacity-90 transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-gold)] mb-1">
                <Sparkles className="w-4 h-4" /> 1 Klick — eingerichtet
              </div>
              <h2 className="text-2xl font-semibold">App starten</h2>
              <p className="text-sm text-white/70 mt-1">
                Login auto, dein Branding-Platzhalter geladen, 3 Demo-Akten passend zu deiner Praxis (Migration · Strafrecht · Familiennachzug)
              </p>
            </div>
            <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform shrink-0" />
          </div>
        </a>
      </section>

      {/* What's special */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-center text-sm uppercase tracking-wider text-[var(--color-ink-muted)] mb-8">
          Speziell für deine Praxis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
            <Globe className="w-6 h-6 text-[var(--color-gold)] mb-3" />
            <h3 className="font-semibold mb-2">🇻🇳 Mandant:innen-Formular auf Vietnamesisch</h3>
            <p className="text-sm text-[var(--color-ink-soft)] mb-4">
              Deine Mandant:innen scannen den QR mit dem Handy, füllen <strong>Tiếng Việt</strong>{' '}
              aus, du liest das Ergebnis auf Deutsch. Spart dir die ersten 30 Min jeder Erstberatung.
            </p>
            <div className="flex justify-center pt-2">
              <QrCard
                url={intakeUrl}
                size={140}
                caption="Demo-Formular auf Vietnamesisch"
              />
            </div>
            <p className="text-xs text-[var(--color-ink-muted)] mt-3 text-center">
              Klick → Vollbild für Termin
            </p>
          </div>

          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
            <FileText className="w-6 h-6 text-[var(--color-gold)] mb-3" />
            <h3 className="font-semibold mb-2">📋 12 Migrationsrecht-Vorlagen</h3>
            <p className="text-sm text-[var(--color-ink-soft)] mb-3">
              Kein anderes deutsches Tool hat das in dieser Tiefe. Beispiele:
            </p>
            <ul className="text-sm space-y-1.5 text-[var(--color-ink-soft)]">
              <li>• Aufenthaltstitel-Verlängerung (§ 8 AufenthG)</li>
              <li>• Familiennachzug Ehegatt:in (§§ 27-30 AufenthG)</li>
              <li>• Einbürgerungsantrag (§§ 8-10 StAG)</li>
              <li>• Eilantrag gegen Abschiebung (§ 80 V VwGO)</li>
              <li>• Fiktionsbescheinigung (§ 81 IV AufenthG)</li>
              <li>• … plus 7 weitere</li>
            </ul>
            <p className="text-xs text-[var(--color-ink-muted)] mt-4 italic">
              Du nimmst eine Vorlage, füllst 6 Felder, exportierst PDF auf deinem Briefkopf. 5 Min.
            </p>
          </div>
        </div>
      </section>

      {/* Personal note */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="bg-white/60 backdrop-blur-sm border border-[var(--color-border)] rounded-2xl p-6 text-center space-y-3">
          <p className="text-sm text-[var(--color-ink-soft)] italic leading-relaxed">
            „Bao, du bist mein bester Freund und einer der wenigen Anwält:innen, denen ich
            eine vietnamesisch-sprachige Mandantschaft anvertrauen würde. Wenn du das Tool
            4 Wochen testest und mir sagst was kaputt ist — gewinnen wir beide.
            Wenn nicht, kein Cent."
          </p>
          <p className="text-xs text-[var(--color-ink-muted)]">— Mikel</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-6 text-center text-xs text-[var(--color-ink-muted)]">
        <p>
          Ein persönlicher Beta-Zugang.{' '}
          <a href={PRO_LINK} className="underline hover:text-[var(--color-ink)]">
            App starten
          </a>{' '}
          ·{' '}
          <Link to="/preise" className="underline hover:text-[var(--color-ink)]">
            Preise
          </Link>
        </p>
      </footer>
    </div>
  )
}
