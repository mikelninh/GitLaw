# Sprint 1 — Migration MVP Core

**Zeitrahmen:** 3 Wochen (ca. 2026-05-06 bis 2026-05-27)
**Voraussetzung:** Sprint 0 abgeschlossen (commit `faee6db` — 11 Mandatsart-Checklisten + Type-Schema)
**Ziel-Erfolgskriterium:** Bao kann eine Akte in ≤8 Klicks von "neu" bis "Antrag eingereicht" durchführen, mit DE+VI Antwort-Drafts und automatischer "fehlende Unterlagen"-Liste.

---

## Vier Module — jedes ein eigener Track

### Modul A · Mandatsart-Checklisten in der UI *(Woche 1)*

Foundation existiert (Sprint 0). Jetzt: in den Akten-Detail-View einbauen, dass Bao bei jedem Mandat sieht: was wird erwartet, was ist da, was fehlt.

**Tasks:**
- A.1 Akten-Datenmodell um `mandatsartId` erweitern (FK zu Checklist)
- A.2 Akten-Detail-View: neuer Tab/Section "Unterlagen-Checkliste"
  - Lädt `getChecklistById(case.mandatsartId)`
  - Zeigt jedes ChecklistItem mit Status: ✓ erhalten · ⏳ ausstehend · ⚠ Problem
  - Status pro Item togglebar (Refa/Anwalt)
- A.3 "Fehlende Unterlagen"-Computed-View: Filter aller `level: 'required'` Items mit Status ≠ erhalten
- A.4 Mandatsart-Selector beim Akten-Erstellen (Dropdown mit den 11 Mandatsarten)
- A.5 Default für bestehende Akten: Mandatsart='nicht zugeordnet', UI-Hinweis "Mandatsart wählen für Checkliste"

**Erfolgskriterium:** Akte mit Mandatsart "Aufenthaltstitel-Verlängerung" zeigt 10 Items, davon X mit "fehlend" markiert. Refa kann mit einem Klick "fehlend → erhalten" toggeln.

**Dateien (geplant):**
- `viewer/src/pro/types.ts` — `MandatsartCase` ergänzen um `mandatsartId`, `checklistStates`
- `viewer/src/pro/ProCases.tsx` — Mandatsart-Dropdown bei Erstellung
- `viewer/src/pro/CaseChecklist.tsx` — neue Komponente
- `viewer/src/pro/ProCaseDetail.tsx` (oder wie die Detail-View heißt) — Section einbauen

---

### Modul B · 8-Stati-Status-Modell + Sachstands-Generator *(Woche 2)*

**Tasks:**
- B.1 Status-Enum als TypeScript-Type:
  ```typescript
  export type CaseStatus =
    | 'unterlagen_fehlen'
    | 'unterlagen_in_pruefung'
    | 'antrag_in_vorbereitung'
    | 'antrag_eingereicht'
    | 'behoerdliche_rueckmeldung_ausstehend'
    | 'behoerde_nachforderung'
    | 'termin_steht_aus'
    | 'verfahren_abgeschlossen'
  ```
- B.2 Übergangs-Regeln implementieren (siehe Anhang A der BAO-ANTWORT.md) — Validierung in `setStatus()`
- B.3 Status-Dropdown im Akten-Detail-View
- B.4 Sachstands-Template-Definitions: pro Status ein DE+VI Antwort-Template mit Platzhaltern
- B.5 Sachstands-Generator-Funktion: `generateStatusReply(case, language: 'de'|'vi')` → fertiger Antwort-Text mit eingesetzten Akten-Daten
- B.6 Button "Sachstand-Antwort generieren" → öffnet Drawer mit Draft DE und VI parallel, copy-to-clipboard

**Erfolgskriterium:** Bao klickt "Sachstand DE+VI" auf einer Akte mit Status "behoerdliche_rueckmeldung_ausstehend" → bekommt zwei copy-paste-fertige Texte ("Sehr geehrte/r Herr/Frau X, der Antrag wurde am dd.mm.yyyy bei der Behörde eingereicht. Eine Rückmeldung steht noch aus..." + VI-Version).

**Dateien:**
- `viewer/src/pro/case-status.ts` — Enum, Templates, Generator
- `viewer/src/pro/StatusDropdown.tsx` — Komponente
- `viewer/src/pro/SachstandsGenerator.tsx` — Drawer-Komponente

---

### Modul C · Vietnamesische KI-Antworten *(Woche 2 parallel)*

Heute: Citizen-Q&A antwortet nur DE. Bao's Mandantschaft braucht VI.

**Tasks:**
- C.1 System-Prompt-Erweiterung in `api/ask.ts`: bei `lang: 'vi'` antwortet GPT auf Vietnamesisch, behält aber DE-Paragraphen-Zitate (so dass §-Verweise mit unserer Citation-Verifikation kompatibel bleiben)
- C.2 Sprach-Toggle im Pro-Recherche-UI (DE / VI)
- C.3 Voice-Polish-Round: Bao reviewt 5 Sample-Antworten auf VI, korrigiert Stil, wir backen die Stilvorgaben in den Prompt
- C.4 VI-Sicherheits-Disclaimer als Standard-Footer: "Đây không phải là tư vấn pháp lý..."

**Erfolgskriterium:** Bao stellt eine Recherche-Frage auf DE, wählt "Antwort auf Vietnamesisch" → bekommt korrekte VI-Antwort mit DE-Paragraphen-Zitaten + VI-Disclaimer.

**Dateien:**
- `api/ask.ts` — Prompt-Update
- `api/ask-pro.ts` — Pro-Variante mit denselben Sprach-Optionen
- `viewer/src/pro/ProResearch.tsx` — Sprach-Toggle

**Risiko:** GPT-4o-mini auf VI kann gelegentlich in DE rutschen oder Vietnamese-Slang produzieren. Der Voice-Polish mit Bao ist kritisch.

---

### Modul D · Interne Aufgaben pro Akte *(Woche 3)*

**Tasks:**
- D.1 Task-Datenmodell:
  ```typescript
  interface CaseTask {
    id: string
    caseId: string
    title: string  // "Mandant erinnern", "Antrag vorbereiten"...
    type: 'unterlagen_pruefen' | 'mandant_erinnern' | 'antrag_vorbereiten' | 'behoerde_nachfassen' | 'nachforderung_pruefen' | 'frist_kontrollieren' | 'anwaltliche_pruefung' | 'sonstiges'
    assignedTo?: string  // role or person
    dueDate?: string
    status: 'open' | 'done' | 'cancelled'
    createdAt: string
    completedAt?: string
  }
  ```
- D.2 Tasks-Section im Akten-Detail-View: Liste aller offenen Tasks mit Quick-Actions (✓ Erledigt / ⏰ Verschieben / ✗ Cancel)
- D.3 Auto-Task-Generation: bei bestimmten Status-Wechseln werden Tasks automatisch erzeugt:
  - Status → "antrag_in_vorbereitung" → Task "Antrag vorbereiten"
  - Status → "behoerde_nachforderung" → Task "Nachforderung prüfen"
  - 14 Tage nach "antrag_eingereicht" → Task "Behörde nachfassen"
- D.4 Globale Tasks-Übersicht im Pro-Dashboard: alle offenen Tasks aller Akten, sortiert nach Fälligkeit

**Erfolgskriterium:** Refa öffnet morgens das Pro-Dashboard, sieht "12 offene Aufgaben", arbeitet sie der Reihe nach ab.

**Dateien:**
- `viewer/src/pro/types.ts` — `CaseTask`
- `viewer/src/pro/case-tasks.ts` — Auto-Task-Logik
- `viewer/src/pro/CaseTasks.tsx` — Komponente
- `viewer/src/pro/ProDashboard.tsx` — Tasks-Widget

---

## Reihenfolge der Sprint-1-Module

```
Woche 1: Modul A (Checklisten-UI)  ━━━━━━━━━━━━━━━━━━━━━━┓
                                                        ┃
Woche 2: Modul B (8-Stati + Sachstand) ━━━━━━━━━━━━━━━━━┫
         Modul C (Vietnamesische KI) ━━━━━━━━━━━━━━━━━━━┫
                                                        ┃
Woche 3: Modul D (Tasks)  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
         + Bao-Review + Voice-Polish + Demo
```

A muss vor B+C+D fertig sein (alle bauen darauf auf). B+C laufen parallel weil unabhängig. D braucht B (Status-Wechsel triggern Tasks).

---

## Was Bao am Ende von Sprint 1 sieht

1. **Akten-Detail-View** mit Mandatsart-Dropdown (11 Optionen) → Auto-geladene Checkliste mit Status pro Item
2. **Status-Dropdown** mit 8 klar definierten Stati + Sachstands-Generator-Button
3. **Klick → DE+VI-Sachstands-Antwort** zum Copy-Paste in seine bestehenden E-Mail-Tools
4. **Pro-Recherche** mit Sprach-Toggle DE/VI
5. **Tasks-Liste** pro Akte und Pro-Dashboard-Widget mit allen offenen Aufgaben

**Was bewusst nicht in Sprint 1:**
- Auto-Versand (Sprint 2 — braucht E-Mail-Backend)
- OCR-Klassifikation (Sprint 3)
- Mittelspersonen (Sprint 4)
- Mandanten-Portal (Phase 4)

---

## Risiken & Eskalations-Pfade

| Risiko | Wahrscheinlich­keit | Impact | Plan B |
|---|:-:|:-:|---|
| Bao reviewt VI-Übersetzungen erst spät → Modul C verschiebt sich | mittel | mittel | Modul A+B+D liefern, Modul C als Sprint-1.5-Schwanz |
| Status-Übergangs-Regeln zu strikt → Refas blockiert | niedrig | hoch | initial alle Übergänge erlaubt, Validierung erst nach Pilot-Daten |
| Tasks-Datenmodell zu schwer → fühlt sich wie Jira an | niedrig | mittel | initial nur 3-4 Task-Typen, Erweiterung bei Bedarf |
| Akten-Datenmodell-Migration breakt bestehende Bao-Daten | niedrig | hoch | Migration-Script, alle Bestands-Akten bekommen `mandatsartId='nicht_zugeordnet'`, kein Daten-Verlust |

---

## Bao-Touchpoints während Sprint 1

- **Tag 1 (morgen):** Kickoff-Meeting (Coverage-Audit + Klärungsfragen)
- **Tag 4-5:** Modul-A-Demo (Checklisten-UI live)
- **Tag 10-11:** Modul-B-Demo (8-Stati + Sachstand-Generator)
- **Tag 14:** VI-Voice-Polish-Session mit Bao (45 Min, gemeinsam 10 Sample-Antworten reviewen)
- **Tag 21:** Sprint-1-Demo + Sprint-2-Kickoff

Frequenz: 1× pro Woche kurzes Sync-Call (15 Min) + 2 Demo-Sessions (30 Min).

---

## Kanzlei-KPIs ab Sprint 1

Wir tracken (für Sprint-1-Erfolgsmessung + spätere ROI-Story):

- Anzahl Akten mit Mandatsart-Zuordnung (Wachstum über Zeit)
- Durchschnittliche Anzahl "fehlende Unterlagen" pro Akte zu Beginn vs. nach 1 Woche
- Anzahl Sachstands-Antworten generiert (DE/VI getrennt)
- Refa-Self-Report: "spart mir Zeit" / "neutral" / "kostet Zeit" — Wochen-Befragung

---

## Was als nächstes zu tun ist (Tag-1-Aktion)

**Heute Abend / morgen früh:**
1. Modul A.1 anfangen — Akten-Datenmodell um `mandatsartId` erweitern
2. Modul A.2 — `<CaseChecklist>` Komponente bauen, lädt `getChecklistById()`
3. Smoke-test im Pro-View

**Nach dem Bao-Meeting morgen:**
- Top-3-Mandatsarten bestätigt → Reihenfolge der Module finalisieren
- VI-Übersetzungs-Anker (Bao's Beispiel-E-Mails) → Voice-Polish-Material für Modul C vorbereiten
- Klärungsfragen-Antworten → Anpassungen am Plan
