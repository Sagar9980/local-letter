import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { site } from '@/lib/site'

interface ContactPayload {
  name: string
  email: string
  company: string
  locales: string
  interest: string
  message: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Contact form is not configured.' }, { status: 500 })
  }

  const body = (await request.json().catch(() => null)) as Partial<ContactPayload> | null
  if (!body?.name?.trim() || !emailPattern.test(body.email ?? '') || !body.message?.trim()) {
    return NextResponse.json({ error: 'Missing or invalid fields.' }, { status: 400 })
  }

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? 'Local Letter <onboarding@resend.dev>',
    to: site.salesEmail,
    replyTo: body.email,
    subject: `Local Letter enquiry — ${body.company?.trim() || body.name}`,
    text: [
      `Name: ${body.name}`,
      `Email: ${body.email}`,
      `Company: ${body.company || '—'}`,
      `Locales: ${body.locales || '—'}`,
      `Interested in: ${body.interest || '—'}`,
      '',
      body.message,
    ].join('\n'),
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
