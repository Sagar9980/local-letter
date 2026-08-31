export interface LocaleSample {
  code: string
  label: string
  flag: string
  subject: string
  greeting: string
  body: string
  cta: string
  footer: string
  status: 'published' | 'draft'
}

/** The same template key, authored once and translated per locale. */
export const localeSamples: LocaleSample[] = [
  {
    code: 'en',
    label: 'English',
    flag: '🇬🇧',
    subject: 'Welcome to Acme, {{first_name}}',
    greeting: 'Hi {{first_name}},',
    body: 'Your workspace is ready. Invite your team and send your first campaign in under five minutes.',
    cta: 'Open workspace',
    footer: 'Sent by Acme · You can unsubscribe at any time',
    status: 'published',
  },
  {
    code: 'fr',
    label: 'Français',
    flag: '🇫🇷',
    subject: 'Bienvenue chez Acme, {{first_name}}',
    greeting: 'Bonjour {{first_name}},',
    body: "Votre espace de travail est prêt. Invitez votre équipe et lancez votre première campagne en moins de cinq minutes.",
    cta: "Ouvrir l'espace",
    footer: 'Envoyé par Acme · Désinscription possible à tout moment',
    status: 'published',
  },
  {
    code: 'de',
    label: 'Deutsch',
    flag: '🇩🇪',
    subject: 'Willkommen bei Acme, {{first_name}}',
    greeting: 'Hallo {{first_name}},',
    body: 'Ihr Workspace ist bereit. Laden Sie Ihr Team ein und starten Sie Ihre erste Kampagne in unter fünf Minuten.',
    cta: 'Workspace öffnen',
    footer: 'Gesendet von Acme · Jederzeit abbestellbar',
    status: 'published',
  },
  {
    code: 'ja',
    label: '日本語',
    flag: '🇯🇵',
    subject: '{{first_name}} さん、Acme へようこそ',
    greeting: '{{first_name}} さん',
    body: 'ワークスペースの準備が整いました。チームを招待して、5 分以内に最初のキャンペーンを送信しましょう。',
    cta: 'ワークスペースを開く',
    footer: 'Acme より送信 · いつでも配信停止できます',
    status: 'published',
  },
  {
    code: 'pt',
    label: 'Português',
    flag: '🇧🇷',
    subject: 'Bem-vindo à Acme, {{first_name}}',
    greeting: 'Olá {{first_name}},',
    body: 'Seu workspace está pronto. Convide o time e envie sua primeira campanha em menos de cinco minutos.',
    cta: 'Abrir workspace',
    footer: 'Enviado pela Acme · Cancele a inscrição quando quiser',
    status: 'draft',
  },
]

/** Rendered variables, so previews show real copy instead of raw tokens. */
export const sampleVariables: Record<string, string> = {
  first_name: 'Sarah',
}

export function interpolate(input: string, variables = sampleVariables) {
  return input.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, key: string) => variables[key] ?? match)
}
