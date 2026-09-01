export type LocaleCode = 'en' | 'fr' | 'de' | 'ja' | 'pt' | 'es'

export interface LocaleMeta {
  code: LocaleCode
  label: string
  flag: string
}

export const localeMeta: Record<LocaleCode, LocaleMeta> = {
  en: { code: 'en', label: 'English', flag: '🇬🇧' },
  fr: { code: 'fr', label: 'Français', flag: '🇫🇷' },
  de: { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  ja: { code: 'ja', label: '日本語', flag: '🇯🇵' },
  pt: { code: 'pt', label: 'Português', flag: '🇧🇷' },
  es: { code: 'es', label: 'Español', flag: '🇪🇸' },
}

export interface LocaleVariant {
  code: LocaleCode
  status: 'published' | 'draft'
  subject: string
  preheader: string
  greeting: string
  body: string
  cta: string
  footer: string
  /** Optional key/value rows rendered as a receipt-style block. */
  details?: { label: string; value: string }[]
}

export interface TemplateVariable {
  name: string
  type: 'string' | 'url' | 'number' | 'date' | 'money'
  required: boolean
}

export interface Template {
  key: string
  /** Sender identity, so each template reads like it comes from a real system. */
  from: string
  to: string
  defaultLocale: LocaleCode
  fallbackChain: LocaleCode[]
  variables: TemplateVariable[]
  variants: LocaleVariant[]
}

export const templates: Template[] = [
  {
    key: 'welcome-email',
    from: 'Acme <hello@acme.com>',
    to: 'sarah@example.com',
    defaultLocale: 'en',
    fallbackChain: ['en'],
    variables: [
      { name: 'first_name', type: 'string', required: true },
      { name: 'workspace_url', type: 'url', required: true },
      { name: 'trial_days', type: 'number', required: false },
    ],
    variants: [
      {
        code: 'en',
        status: 'published',
        subject: 'Welcome to Acme, {{first_name}}',
        preheader: 'Your workspace is ready',
        greeting: 'Hi {{first_name}},',
        body: 'Your workspace is ready. Invite your team and send your first campaign in under five minutes.',
        cta: 'Open workspace',
        footer: 'Sent by Acme · You can unsubscribe at any time',
      },
      {
        code: 'fr',
        status: 'published',
        subject: 'Bienvenue chez Acme, {{first_name}}',
        preheader: 'Votre espace de travail est prêt',
        greeting: 'Bonjour {{first_name}},',
        body: "Votre espace de travail est prêt. Invitez votre équipe et lancez votre première campagne en moins de cinq minutes.",
        cta: "Ouvrir l'espace",
        footer: 'Envoyé par Acme · Désinscription possible à tout moment',
      },
      {
        code: 'de',
        status: 'published',
        subject: 'Willkommen bei Acme, {{first_name}}',
        preheader: 'Ihr Workspace ist bereit',
        greeting: 'Hallo {{first_name}},',
        body: 'Ihr Workspace ist bereit. Laden Sie Ihr Team ein und starten Sie Ihre erste Kampagne in unter fünf Minuten.',
        cta: 'Workspace öffnen',
        footer: 'Gesendet von Acme · Jederzeit abbestellbar',
      },
      {
        code: 'ja',
        status: 'published',
        subject: '{{first_name}} さん、Acme へようこそ',
        preheader: 'ワークスペースの準備が整いました',
        greeting: '{{first_name}} さん',
        body: 'ワークスペースの準備が整いました。チームを招待して、5 分以内に最初のキャンペーンを送信しましょう。',
        cta: 'ワークスペースを開く',
        footer: 'Acme より送信 · いつでも配信停止できます',
      },
      {
        code: 'pt',
        status: 'draft',
        subject: 'Bem-vindo à Acme, {{first_name}}',
        preheader: 'Seu workspace está pronto',
        greeting: 'Olá {{first_name}},',
        body: 'Seu workspace está pronto. Convide o time e envie sua primeira campanha em menos de cinco minutos.',
        cta: 'Abrir workspace',
        footer: 'Enviado pela Acme · Cancele a inscrição quando quiser',
      },
    ],
  },
  {
    key: 'password-reset',
    from: 'Acme Security <security@acme.com>',
    to: 'sarah@example.com',
    defaultLocale: 'en',
    fallbackChain: ['en'],
    variables: [
      { name: 'first_name', type: 'string', required: true },
      { name: 'reset_url', type: 'url', required: true },
      { name: 'expires_in', type: 'number', required: true },
    ],
    variants: [
      {
        code: 'en',
        status: 'published',
        subject: 'Reset your Acme password',
        preheader: 'This link expires in 30 minutes',
        greeting: 'Hi {{first_name}},',
        body: 'Someone asked to reset the password on your Acme account. This link expires in 30 minutes. If it was not you, no action is needed.',
        cta: 'Choose a new password',
        footer: 'Sent by Acme Security · We will never ask for your password',
      },
      {
        code: 'fr',
        status: 'published',
        subject: 'Réinitialisez votre mot de passe Acme',
        preheader: 'Ce lien expire dans 30 minutes',
        greeting: 'Bonjour {{first_name}},',
        body: "Une réinitialisation du mot de passe de votre compte Acme a été demandée. Ce lien expire dans 30 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.",
        cta: 'Choisir un nouveau mot de passe',
        footer: 'Envoyé par Acme Security · Nous ne vous demanderons jamais votre mot de passe',
      },
      {
        code: 'de',
        status: 'published',
        subject: 'Acme-Passwort zurücksetzen',
        preheader: 'Dieser Link läuft in 30 Minuten ab',
        greeting: 'Hallo {{first_name}},',
        body: 'Es wurde angefragt, das Passwort Ihres Acme-Kontos zurückzusetzen. Dieser Link läuft in 30 Minuten ab. Waren Sie das nicht, ist nichts zu tun.',
        cta: 'Neues Passwort wählen',
        footer: 'Gesendet von Acme Security · Wir fragen niemals nach Ihrem Passwort',
      },
      {
        code: 'ja',
        status: 'published',
        subject: 'Acme のパスワードを再設定してください',
        preheader: 'このリンクは 30 分で失効します',
        greeting: '{{first_name}} さん',
        body: 'Acme アカウントのパスワード再設定がリクエストされました。このリンクは 30 分で失効します。心当たりがない場合は、操作は不要です。',
        cta: '新しいパスワードを設定',
        footer: 'Acme Security より送信 · パスワードをお尋ねすることはありません',
      },
      {
        code: 'es',
        status: 'published',
        subject: 'Restablece tu contraseña de Acme',
        preheader: 'Este enlace caduca en 30 minutos',
        greeting: 'Hola {{first_name}}:',
        body: 'Alguien solicitó restablecer la contraseña de tu cuenta de Acme. Este enlace caduca en 30 minutos. Si no fuiste tú, no tienes que hacer nada.',
        cta: 'Elegir una contraseña nueva',
        footer: 'Enviado por Acme Security · Nunca te pediremos tu contraseña',
      },
    ],
  },
  {
    key: 'invoice-receipt',
    from: 'Acme Billing <billing@acme.com>',
    to: 'sarah@example.com',
    defaultLocale: 'en',
    fallbackChain: ['en'],
    variables: [
      { name: 'first_name', type: 'string', required: true },
      { name: 'invoice_number', type: 'string', required: true },
      { name: 'amount_due', type: 'money', required: true },
      { name: 'invoice_url', type: 'url', required: true },
    ],
    variants: [
      {
        code: 'en',
        status: 'published',
        subject: 'Your Acme receipt · {{invoice_number}}',
        preheader: 'Payment received — thank you',
        greeting: 'Hi {{first_name}},',
        body: 'Thanks — we received your payment. Here is the receipt for your records.',
        cta: 'Download invoice',
        footer: 'Sent by Acme Billing · Questions? Just reply to this email',
        details: [
          { label: 'Invoice', value: '{{invoice_number}}' },
          { label: 'Plan', value: 'Team · Monthly' },
          { label: 'Amount paid', value: '€49.00' },
        ],
      },
      {
        code: 'fr',
        status: 'published',
        subject: 'Votre reçu Acme · {{invoice_number}}',
        preheader: 'Paiement reçu — merci',
        greeting: 'Bonjour {{first_name}},',
        body: 'Merci — nous avons bien reçu votre paiement. Voici le reçu à conserver.',
        cta: 'Télécharger la facture',
        footer: 'Envoyé par Acme Billing · Une question ? Répondez à cet e-mail',
        details: [
          { label: 'Facture', value: '{{invoice_number}}' },
          { label: 'Formule', value: 'Team · Mensuel' },
          { label: 'Montant payé', value: '49,00 €' },
        ],
      },
      {
        code: 'de',
        status: 'published',
        subject: 'Ihre Acme-Rechnung · {{invoice_number}}',
        preheader: 'Zahlung erhalten — vielen Dank',
        greeting: 'Hallo {{first_name}},',
        body: 'Vielen Dank — Ihre Zahlung ist bei uns eingegangen. Hier ist der Beleg für Ihre Unterlagen.',
        cta: 'Rechnung herunterladen',
        footer: 'Gesendet von Acme Billing · Fragen? Antworten Sie einfach auf diese E-Mail',
        details: [
          { label: 'Rechnung', value: '{{invoice_number}}' },
          { label: 'Tarif', value: 'Team · Monatlich' },
          { label: 'Gezahlter Betrag', value: '49,00 €' },
        ],
      },
      {
        code: 'ja',
        status: 'published',
        subject: 'Acme の領収書 · {{invoice_number}}',
        preheader: 'お支払いを受け付けました',
        greeting: '{{first_name}} さん',
        body: 'お支払いを受け付けました。ありがとうございます。控えとして領収書をお送りします。',
        cta: '請求書をダウンロード',
        footer: 'Acme Billing より送信 · ご不明な点はこのメールへご返信ください',
        details: [
          { label: '請求書番号', value: '{{invoice_number}}' },
          { label: 'プラン', value: 'Team · 月額' },
          { label: 'お支払い金額', value: '€49.00' },
        ],
      },
    ],
  },
  {
    key: 'trial-ending',
    from: 'Acme <hello@acme.com>',
    to: 'sarah@example.com',
    defaultLocale: 'en',
    fallbackChain: ['en'],
    variables: [
      { name: 'first_name', type: 'string', required: true },
      { name: 'days_left', type: 'number', required: true },
      { name: 'upgrade_url', type: 'url', required: true },
    ],
    variants: [
      {
        code: 'en',
        status: 'published',
        subject: 'Your Acme trial ends in {{days_left}} days',
        preheader: 'Keep your workspace and everything in it',
        greeting: 'Hi {{first_name}},',
        body: 'Your trial ends in three days. Upgrade now and keep your workspace, your templates and your team exactly as they are.',
        cta: 'Choose a plan',
        footer: 'Sent by Acme · You can unsubscribe at any time',
      },
      {
        code: 'fr',
        status: 'published',
        subject: "Votre essai Acme se termine dans {{days_left}} jours",
        preheader: 'Conservez votre espace et tout son contenu',
        greeting: 'Bonjour {{first_name}},',
        body: "Votre essai se termine dans trois jours. Passez à une offre payante et conservez votre espace, vos modèles et votre équipe tels quels.",
        cta: 'Choisir une offre',
        footer: 'Envoyé par Acme · Désinscription possible à tout moment',
      },
      {
        code: 'de',
        status: 'draft',
        subject: 'Ihre Acme-Testphase endet in {{days_left}} Tagen',
        preheader: 'Behalten Sie Ihren Workspace und alles darin',
        greeting: 'Hallo {{first_name}},',
        body: 'Ihre Testphase endet in drei Tagen. Wechseln Sie jetzt zu einem Tarif und behalten Sie Workspace, Vorlagen und Team genau so, wie sie sind.',
        cta: 'Tarif wählen',
        footer: 'Gesendet von Acme · Jederzeit abbestellbar',
      },
    ],
  },
]

/** Rendered variables, so previews show real copy instead of raw tokens. */
export const sampleVariables: Record<string, string> = {
  first_name: 'Sarah',
  invoice_number: 'INV-2043',
  days_left: '3',
}

export function interpolate(input: string, variables = sampleVariables) {
  return input.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, key: string) => variables[key] ?? match)
}

export interface Resolution {
  variant: LocaleVariant
  /** True when the requested locale had no published variant on this template. */
  fellBack: boolean
  requested: LocaleCode
}

/**
 * Mirrors what the render endpoint does: prefer the requested locale's
 * published variant, otherwise walk the fallback chain, otherwise the
 * template's default. Drafts are never served.
 */
export function resolveVariant(template: Template, requested: LocaleCode): Resolution {
  const published = (code: LocaleCode) =>
    template.variants.find((v) => v.code === code && v.status === 'published')

  const direct = published(requested)
  if (direct) return { variant: direct, fellBack: false, requested }

  for (const code of [...template.fallbackChain, template.defaultLocale]) {
    const hit = published(code)
    if (hit) return { variant: hit, fellBack: true, requested }
  }

  return { variant: template.variants[0], fellBack: true, requested }
}

export function templateByKey(key: string) {
  return templates.find((t) => t.key === key) ?? templates[0]
}
