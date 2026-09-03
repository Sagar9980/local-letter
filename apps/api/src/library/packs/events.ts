import type { TemplatePack } from "../types";

// Ticketing and conference pack. Violet bar with a pink accent, rounded
// everything — celebratory without losing the detail a ticket needs.
export const eventsPack: TemplatePack = {
  id: "events",
  name: "Events Pack",
  tagline: "Tickets, reminders, follow-ups",
  description:
    "Ticketing and conference emails — registration, reminders, schedule changes, cancellations and the post-event thank-you.",
  audience: "Events, conferences & ticketing",
  theme: {
    brand: "#7C3AED",
    onBrand: "#FFFFFF",
    accent: "#DB2777",
    bg: "#F8F5FF",
    card: "#FFFFFF",
    soft: "#F8F5FE",
    text: "#1E1B33",
    muted: "#6B6785",
    border: "#E8E2F7",
    fontFamily: "'Inter','Helvetica Neue',Helvetica,Arial,sans-serif",
    radius: 14,
    buttonRadius: 24,
    headerStyle: "bar",
  },
  footer: {
    lines: [
      "{{event_name}} · organised by {{company_name}}",
      "{{company_address}}",
    ],
    links: [
      { label: "Event site", href: "{{event_url}}" },
      { label: "Manage ticket", href: "{{ticket_url}}" },
      { label: "Unsubscribe", href: "{{unsubscribe_url}}" },
    ],
  },
  templates: [
    {
      key: "ticket-confirmation",
      name: "Ticket Confirmation",
      description: "Registration confirmation carrying the entry code.",
      category: "transactional",
      subject: "You're going to {{event_name}}",
      preheader: "Your ticket for {{event_date}} is confirmed.",
      blocks: [
        { type: "heading", text: "You're in 🎟" },
        {
          type: "image",
          src: "{{event_banner_url}}",
          alt: "{{event_name}}",
          radius: true,
        },
        { type: "text", text: "Your ticket for <strong>{{event_name}}</strong> is confirmed." },
        {
          type: "panel",
          rows: [
            { label: "Event", value: "{{event_name}}" },
            { label: "Date", value: "{{event_date}}" },
            { label: "Doors", value: "{{doors_time}}" },
            { label: "Venue", value: "{{venue_name}}, {{venue_address}}" },
            { label: "Ticket type", value: "{{ticket_type}} × {{ticket_quantity}}" },
          ],
        },
        { type: "code", value: "{{ticket_code}}", caption: "Show this at the door" },
        { type: "button", label: "View your ticket", href: "{{ticket_url}}" },
      ],
    },
    {
      key: "event-reminder",
      name: "Event Reminder",
      description: "Day-before logistics: timings, travel, what to bring.",
      category: "operational",
      subject: "{{event_name}} is tomorrow",
      preheader: "Doors at {{doors_time}} · {{venue_name}}.",
      blocks: [
        { type: "heading", text: "Tomorrow: {{event_name}}" },
        {
          type: "panel",
          rows: [
            { label: "Doors open", value: "{{doors_time}}" },
            { label: "Starts", value: "{{start_time}}" },
            { label: "Venue", value: "{{venue_name}}" },
            { label: "Address", value: "{{venue_address}}" },
          ],
        },
        { type: "heading", text: "Good to know", size: "md" },
        { type: "list", items: ["{{note_1}}", "{{note_2}}", "{{note_3}}"] },
        { type: "button", label: "Open your ticket", href: "{{ticket_url}}" },
        {
          type: "text",
          text: 'Getting there: <a href="{{directions_url}}" style="color:inherit;">directions and parking</a>.',
          muted: true,
        },
      ],
    },
    {
      key: "schedule-change",
      name: "Schedule Change",
      description: "Programme update, old and new side by side.",
      category: "operational",
      subject: "Schedule change for {{event_name}}",
      preheader: "{{session_name}} has moved.",
      blocks: [
        { type: "heading", text: "A session has moved" },
        {
          type: "text",
          text: "<strong>{{session_name}}</strong> at {{event_name}} has been rescheduled.",
        },
        {
          type: "panel",
          rows: [
            { label: "Was", value: "{{old_time}}, {{old_room}}" },
            { label: "Now", value: "{{new_time}}, {{new_room}}" },
            { label: "Speaker", value: "{{speaker_name}}" },
          ],
        },
        { type: "button", label: "See the full schedule", href: "{{schedule_url}}" },
        {
          type: "text",
          text: "Nothing else in your personal agenda has changed.",
          muted: true,
        },
      ],
    },
    {
      key: "event-cancelled",
      name: "Event Cancelled",
      description: "Cancellation notice with the automatic refund terms.",
      category: "operational",
      subject: "{{event_name}} has been cancelled",
      preheader: "Your refund of {{refund_amount}} is being processed.",
      blocks: [
        { type: "heading", text: "{{event_name}} is cancelled" },
        {
          type: "text",
          text: "We're sorry — {{event_name}} scheduled for {{event_date}} won't go ahead. Reason: {{reason}}.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Your refund",
          text: "{{refund_amount}} goes back to your original payment method automatically. Expect it within {{refund_eta}}. There's nothing you need to do.",
        },
        { type: "button", label: "See upcoming events", href: "{{events_url}}", variant: "outline" },
        {
          type: "text",
          text: "Questions about your booking? Contact {{support_email}}.",
          muted: true,
        },
      ],
    },
    {
      key: "speaker-invitation",
      name: "Speaker Invitation",
      description: "Invites a speaker with slot, audience and deadline.",
      category: "transactional",
      subject: "Invitation to speak at {{event_name}}",
      preheader: "{{session_length}} on {{event_date}} — we'd love to have you.",
      blocks: [
        { type: "heading", text: "Would you speak at {{event_name}}?" },
        {
          type: "text",
          text: "Hi {{first_name}} — we'd love you on stage at {{event_name}}. Your work on {{topic}} is exactly what our audience is asking for.",
        },
        {
          type: "panel",
          rows: [
            { label: "Date", value: "{{event_date}}" },
            { label: "Slot", value: "{{session_length}}, {{session_format}}" },
            { label: "Audience", value: "{{audience_size}} {{audience_type}}" },
            { label: "Location", value: "{{venue_name}}" },
            { label: "Respond by", value: "{{respond_by}}" },
          ],
        },
        { type: "button", label: "Accept the invitation", href: "{{accept_url}}" },
        {
          type: "text",
          text: "Travel and accommodation are covered. Happy to talk it through — just reply here.",
          muted: true,
        },
      ],
    },
    {
      key: "check-in-open",
      name: "Check-in Open",
      description: "Opens day-of check-in with the QR entry code.",
      category: "transactional",
      subject: "Check-in is open for {{event_name}}",
      preheader: "Skip the queue — check in from your phone.",
      blocks: [
        { type: "heading", text: "Check-in is open" },
        {
          type: "text",
          text: "Check in now and walk straight past the registration desk at {{venue_name}}.",
        },
        { type: "code", value: "{{ticket_code}}", caption: "Your entry code" },
        { type: "button", label: "Check in now", href: "{{checkin_url}}" },
        {
          type: "panel",
          rows: [
            { label: "Doors", value: "{{doors_time}}" },
            { label: "Your session", value: "{{first_session}}" },
            { label: "Wifi", value: "{{wifi_network}} / {{wifi_password}}" },
          ],
        },
      ],
    },
    {
      key: "post-event-thanks",
      name: "Thank You",
      description: "Post-event wrap with recordings and a feedback ask.",
      category: "lifecycle",
      subject: "Thanks for coming to {{event_name}}",
      preheader: "Slides, recordings and a two-minute survey.",
      blocks: [
        { type: "heading", text: "Thanks for being there" },
        {
          type: "text",
          text: "{{attendee_count}} of you joined us at {{event_name}} — thank you. Everything from the day is now online.",
        },
        {
          type: "list",
          items: [
            'Session recordings — <a href="{{recordings_url}}" style="color:inherit;">watch anytime</a>',
            'Slides and resources — <a href="{{slides_url}}" style="color:inherit;">download</a>',
            'Photos — <a href="{{photos_url}}" style="color:inherit;">browse the gallery</a>',
          ],
        },
        {
          type: "image",
          src: "{{recap_photo_url}}",
          alt: "{{event_name}} highlights",
          radius: true,
        },
        { type: "button", label: "Share your feedback", href: "{{survey_url}}" },
        {
          type: "text",
          text: "{{next_event_name}} is on {{next_event_date}} — early tickets are already open.",
          muted: true,
        },
      ],
    },
    {
      key: "waitlist-spot",
      name: "Waitlist Spot Available",
      description: "Time-boxed offer of a released ticket.",
      category: "transactional",
      subject: "A spot opened up at {{event_name}}",
      preheader: "Claim it within {{claim_window}} before it goes to the next person.",
      blocks: [
        { type: "heading", text: "A ticket just opened up" },
        {
          type: "text",
          text: "You're next on the waitlist for <strong>{{event_name}}</strong> and a {{ticket_type}} ticket has been released.",
        },
        {
          type: "callout",
          tone: "warning",
          text: "This spot is held for you for <strong>{{claim_window}}</strong>. After that it goes to the next person in line.",
        },
        { type: "button", label: "Claim your ticket", href: "{{claim_url}}" },
        {
          type: "panel",
          rows: [
            { label: "Event", value: "{{event_name}}" },
            { label: "Date", value: "{{event_date}}" },
            { label: "Price", value: "{{ticket_price}}" },
          ],
        },
      ],
    },
  ],
};
