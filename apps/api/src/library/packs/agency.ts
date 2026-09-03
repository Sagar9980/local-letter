import type { TemplatePack } from "../types";

// Client-facing pack for studios and freelancers: slate ink, teal accent,
// tight radii. Formal enough for a proposal, warm enough for a kickoff.
export const agencyPack: TemplatePack = {
  id: "agency",
  name: "Agency Pack",
  tagline: "Pitch, deliver, invoice",
  description:
    "Client communication for agencies, studios and freelancers — proposals, kickoffs, milestones and the invoices that follow.",
  audience: "Agencies & freelancers",
  theme: {
    brand: "#0F766E",
    onBrand: "#FFFFFF",
    accent: "#0F172A",
    bg: "#F6F8F8",
    card: "#FFFFFF",
    soft: "#F3F7F6",
    text: "#0F172A",
    muted: "#64748B",
    border: "#E2E8F0",
    fontFamily: "'Inter','Helvetica Neue',Helvetica,Arial,sans-serif",
    radius: 8,
    buttonRadius: 6,
    headerStyle: "minimal",
  },
  footer: {
    lines: ["{{company_name}} · {{company_address}}", "{{company_tagline}}"],
    links: [
      { label: "Our work", href: "{{portfolio_url}}" },
      { label: "Contact", href: "{{contact_url}}" },
    ],
  },
  templates: [
    {
      key: "proposal-sent",
      name: "Proposal",
      description: "Delivers a proposal with scope, price and a decision date.",
      category: "transactional",
      subject: "Proposal for {{project_name}}",
      preheader: "Scope, timeline and investment — valid until {{valid_until}}.",
      blocks: [
        { type: "heading", text: "Proposal: {{project_name}}" },
        {
          type: "text",
          text: "Hi {{first_name}}, thanks for the conversation last week. Here's what we'd propose for {{project_name}}.",
        },
        {
          type: "panel",
          title: "At a glance",
          rows: [
            { label: "Scope", value: "{{scope_summary}}" },
            { label: "Timeline", value: "{{timeline}}" },
            { label: "Investment", value: "{{total_price}}" },
            { label: "Valid until", value: "{{valid_until}}" },
          ],
        },
        { type: "button", label: "Review the proposal", href: "{{proposal_url}}" },
        {
          type: "text",
          text: "Happy to walk you through it — reply here or grab a slot on {{calendar_url}}.",
          muted: true,
        },
      ],
    },
    {
      key: "proposal-accepted",
      name: "Proposal Accepted",
      description: "Confirms the signature and states what happens next.",
      category: "transactional",
      subject: "We're on — {{project_name}} is confirmed",
      preheader: "Signed and countersigned. Here's what happens next.",
      blocks: [
        { type: "heading", text: "Signed — let's build it" },
        {
          type: "text",
          text: "Thanks {{first_name}}. The agreement for {{project_name}} is signed by both sides and countersigned copies are attached to your portal.",
        },
        {
          type: "steps",
          items: [
            { title: "Deposit invoice", text: "{{deposit_amount}} due {{deposit_due_date}}." },
            { title: "Kickoff call", text: "{{kickoff_date}} — calendar invite on its way." },
            { title: "Discovery", text: "We'll send the brief questionnaire before the call." },
          ],
        },
        { type: "button", label: "Open project portal", href: "{{portal_url}}" },
      ],
    },
    {
      key: "project-kickoff",
      name: "Project Started",
      description: "Kickoff note naming the team, channel and first milestone.",
      category: "operational",
      subject: "{{project_name}} kicks off {{start_date}}",
      preheader: "Your team, your channel, your first milestone.",
      blocks: [
        { type: "heading", text: "{{project_name}} is underway" },
        { type: "text", text: "Here's everything you need for the weeks ahead." },
        {
          type: "panel",
          title: "Your team",
          rows: [
            { label: "Project lead", value: "{{lead_name}}" },
            { label: "Day-to-day contact", value: "{{contact_name}}" },
            { label: "Shared channel", value: "{{channel_name}}" },
            { label: "First milestone", value: "{{milestone_name}} — {{milestone_date}}" },
          ],
        },
        { type: "button", label: "Open project portal", href: "{{portal_url}}" },
        {
          type: "text",
          text: "We send a progress note every Friday. Anything urgent goes through {{channel_name}}.",
          muted: true,
        },
      ],
    },
    {
      key: "milestone-complete",
      name: "Milestone Complete",
      description: "Delivery note with what shipped and what needs approval.",
      category: "operational",
      subject: "{{milestone_name}} is ready for review",
      preheader: "Delivered on {{delivered_at}} — needs your sign-off by {{approval_due}}.",
      blocks: [
        { type: "heading", text: "{{milestone_name}} is ready" },
        { type: "text", text: "We've wrapped this milestone on {{project_name}}. Here's what's included:" },
        {
          type: "list",
          items: ["{{deliverable_1}}", "{{deliverable_2}}", "{{deliverable_3}}"],
        },
        {
          type: "callout",
          tone: "info",
          text: "We need your sign-off by <strong>{{approval_due}}</strong> to keep the next phase on schedule.",
        },
        { type: "button", label: "Review and approve", href: "{{review_url}}" },
      ],
    },
    {
      key: "invoice",
      name: "Invoice",
      description: "Itemised client invoice with payment terms.",
      category: "billing",
      subject: "Invoice {{invoice_number}} — {{project_name}}",
      preheader: "{{amount_due}} due {{due_date}}.",
      blocks: [
        { type: "heading", text: "Invoice {{invoice_number}}" },
        {
          type: "panel",
          rows: [
            { label: "Project", value: "{{project_name}}" },
            { label: "Billed to", value: "{{client_name}}" },
            { label: "Issued", value: "{{issue_date}}" },
            { label: "Due", value: "{{due_date}} ({{payment_terms}})" },
          ],
        },
        {
          type: "table",
          columns: ["Description", "Hours", "Amount"],
          rows: [
            ["{{line_1_description}}", "{{line_1_hours}}", "{{line_1_amount}}"],
            ["{{line_2_description}}", "{{line_2_hours}}", "{{line_2_amount}}"],
          ],
          total: { label: "Total due", value: "{{amount_due}}" },
        },
        { type: "button", label: "Pay invoice", href: "{{payment_url}}" },
      ],
    },
    {
      key: "payment-reminder",
      name: "Payment Reminder",
      description: "Polite chase for an invoice past its due date.",
      category: "billing",
      subject: "Reminder: invoice {{invoice_number}} is due",
      preheader: "{{amount_due}} was due on {{due_date}}.",
      blocks: [
        { type: "heading", text: "A quick reminder" },
        {
          type: "text",
          text: "Invoice <strong>{{invoice_number}}</strong> for {{amount_due}} was due on {{due_date}} and is still showing as unpaid on our side.",
        },
        {
          type: "panel",
          rows: [
            { label: "Invoice", value: "{{invoice_number}}" },
            { label: "Amount", value: "{{amount_due}}" },
            { label: "Due date", value: "{{due_date}}" },
            { label: "Days overdue", value: "{{days_overdue}}" },
          ],
        },
        { type: "button", label: "Pay now", href: "{{payment_url}}" },
        {
          type: "text",
          text: "If it's already been paid or is stuck with your finance team, just let us know and we'll pause the reminders.",
          muted: true,
        },
      ],
    },
    {
      key: "meeting-scheduled",
      name: "Meeting Scheduled",
      description: "Confirms a call with agenda and join link.",
      category: "operational",
      subject: "Confirmed: {{meeting_title}} on {{meeting_date}}",
      preheader: "{{meeting_time}} {{timezone}} · {{duration}}.",
      blocks: [
        { type: "heading", text: "{{meeting_title}}" },
        {
          type: "panel",
          rows: [
            { label: "When", value: "{{meeting_date}} at {{meeting_time}} {{timezone}}" },
            { label: "Duration", value: "{{duration}}" },
            { label: "With", value: "{{attendees}}" },
          ],
        },
        { type: "heading", text: "Agenda", size: "md" },
        { type: "list", items: ["{{agenda_1}}", "{{agenda_2}}", "{{agenda_3}}"], ordered: true },
        { type: "button", label: "Join the call", href: "{{meeting_url}}" },
      ],
    },
    {
      key: "project-complete",
      name: "Project Complete",
      description: "Handover note with assets, warranty window and a referral ask.",
      category: "lifecycle",
      subject: "{{project_name}} is complete",
      preheader: "Final handover, files and what happens next.",
      blocks: [
        { type: "heading", text: "That's a wrap on {{project_name}}" },
        {
          type: "text",
          text: "It's been a genuine pleasure, {{first_name}}. Everything is handed over and yours to keep.",
        },
        {
          type: "panel",
          rows: [
            { label: "Final deliverables", value: "{{deliverables_url}}" },
            { label: "Support window", value: "{{support_window}}" },
            { label: "Point of contact", value: "{{contact_name}}" },
          ],
        },
        { type: "button", label: "Download final files", href: "{{deliverables_url}}" },
        {
          type: "text",
          text: 'Know someone who needs similar work? <a href="{{referral_url}}" style="color:inherit;">A referral means a lot</a>.',
          muted: true,
        },
      ],
    },
  ],
};
