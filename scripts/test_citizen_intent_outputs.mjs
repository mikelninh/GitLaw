import { citizenIntents, detectCitizenIntent, renderCitizenIntentAnswer } from '../viewer/src/citizen-intents.ts'

const tests = [
  'Mein Vermieter will Eigenbedarf anmelden - was kann ich tun?',
  'Mein Chef will mich kündigen - was kann ich tun?',
  'Was ist nach dem Tierschutzgesetz verboten und wie melde ich Tierquälerei?',
  'Ich kann mir meine Medikamente nicht leisten — gibt es Hilfe?',
  'Meine Heizung ist kaputt - darf ich die Miete kürzen?',
  'Das Jobcenter kürzt mein Bürgergeld. Was kann ich tun?',
  'Wie viel Wohngeld bekomme ich?',
  'Ich werde online beleidigt. Welche Rechte habe ich?',
  'Der Vater zahlt keinen Unterhalt - was kann ich tun?',
  'Wie viel Kindergeld steht mir zu?',
  'Wie lange habe ich Elternzeit und wie viel Elterngeld bekomme ich?',
  'Ich werde wegen meiner Herkunft benachteiligt. Was kann ich tun?',
  'Ich bin krankgeschrieben. Was muss ich meinem Arbeitgeber sagen?',
  'Mein Chef hat mir eine Abmahnung gegeben. Was jetzt?',
  'Meine Nebenkostenabrechnung ist viel zu hoch. Was kann ich tun?',
  'Wann bekomme ich meine Kaution zurück?',
]

let pass = 0
let fail = 0

for (const question of tests) {
  const intent = detectCitizenIntent(question)
  if (!intent) {
    fail += 1
    console.log(`[FAIL] ${question}\n  no intent detected`)
    continue
  }

  const answer = renderCitizenIntentAnswer(intent)
  const ok =
    answer.includes('Kurz gesagt:') &&
    answer.includes('Worauf es ankommt:') &&
    answer.includes('Was du jetzt tun kannst:') &&
    intent.sources.length > 0

  if (ok) pass += 1
  else fail += 1

  console.log(
    `[${ok ? 'PASS' : 'FAIL'}] ${intent.id}\n` +
    `  question=${question}\n` +
    `  chars=${answer.length} sources=${intent.sources.length}`
  )
}

console.log('\nRegistry')
console.log(JSON.stringify({ intents: citizenIntents.length }, null, 2))

console.log('\nSummary')
console.log(JSON.stringify({ PASS: pass, FAIL: fail, total: tests.length }, null, 2))
