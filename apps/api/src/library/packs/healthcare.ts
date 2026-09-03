import type { TemplatePack } from "../types";

// Patient-facing pack: calm teal, soft radii, no marketing tone. Every
// template keeps clinical detail in a panel so it survives a quick skim.
export const healthcarePack: TemplatePack = {
  id: "healthcare",
  name: "Healthcare Pack",
  tagline: "Appointments, results, care",
  description:
    "Patient communication for clinics and health apps — appointments, results, prescriptions and intake, in a calm clinical tone.",
  audience: "Clinics, telehealth & health apps",
  theme: {
    brand: "#0D7C74",
    onBrand: "#FFFFFF",
    accent: "#0369A1",
    bg: "#F2F7F6",
    card: "#FFFFFF",
    soft: "#F3F8F7",
    text: "#132A28",
    muted: "#5F7674",
    border: "#DCE8E6",
    fontFamily: "'Inter','Helvetica Neue',Helvetica,Arial,sans-serif",
    radius: 14,
    buttonRadius: 8,
    headerStyle: "minimal",
  },
  footer: {
    lines: [
      "{{company_name}} · {{company_address}}",
      "This email may contain personal health information. If it reached you in error, please delete it and let us know.",
      "For medical emergencies call your local emergency number — do not reply to this email.",
    ],
    links: [
      { label: "Patient portal", href: "{{portal_url}}" },
      { label: "Privacy policy", href: "{{privacy_url}}" },
    ],
  },
  templates: [
    {
      key: "appointment-confirmed",
      name: "Appointment Confirmed",
      description: "Booking confirmation with location and preparation notes.",
      category: "transactional",
      subject: "Appointment confirmed for {{appointment_date}}",
      preheader: "{{appointment_time}} with {{provider_name}}.",
      blocks: [
        { type: "heading", text: "Your appointment is confirmed" },
        {
          type: "panel",
          rows: [
            { label: "Provider", value: "{{provider_name}}, {{provider_title}}" },
            { label: "Date", value: "{{appointment_date}}" },
            { label: "Time", value: "{{appointment_time}} ({{duration}})" },
            { label: "Location", value: "{{location}}" },
            { label: "Reference", value: "{{appointment_id}}" },
          ],
        },
        { type: "heading", text: "Before you come in", size: "md" },
        { type: "list", items: ["{{prep_1}}", "{{prep_2}}", "{{prep_3}}"] },
        { type: "button", label: "Add to calendar", href: "{{calendar_url}}" },
        {
          type: "text",
          text: 'Need to change it? <a href="{{reschedule_url}}" style="color:inherit;">Reschedule online</a> at least {{cancellation_notice}} beforehand.',
          muted: true,
        },
      ],
    },
    {
      key: "appointment-reminder",
      name: "Appointment Reminder",
      description: "Day-before reminder with the what-to-bring list.",
      category: "operational",
      subject: "Reminder: {{appointment_date}} at {{appointment_time}}",
      preheader: "Your appointment with {{provider_name}} is tomorrow.",
      blocks: [
        { type: "heading", text: "See you tomorrow" },
        {
          type: "text",
          text: "This is a reminder of your appointment with <strong>{{provider_name}}</strong>.",
        },
        {
          type: "panel",
          rows: [
            { label: "When", value: "{{appointment_date}} at {{appointment_time}}" },
            { label: "Where", value: "{{location}}" },
            { label: "Arrive by", value: "{{arrival_time}}" },
          ],
        },
        { type: "heading", text: "Please bring", size: "md" },
        { type: "list", items: ["{{bring_1}}", "{{bring_2}}", "{{bring_3}}"] },
        { type: "button", label: "Confirm attendance", href: "{{confirm_url}}" },
        { type: "button", label: "Reschedule", href: "{{reschedule_url}}", variant: "outline" },
      ],
    },
    {
      key: "telehealth-link",
      name: "Telehealth Link",
      description: "Join details for a video consultation.",
      category: "transactional",
      subject: "Your video appointment link",
      preheader: "Join {{appointment_time}} — test your camera first.",
      blocks: [
        { type: "heading", text: "Your video consultation" },
        {
          type: "panel",
          rows: [
            { label: "With", value: "{{provider_name}}" },
            { label: "When", value: "{{appointment_date}} at {{appointment_time}}" },
            { label: "Duration", value: "{{duration}}" },
          ],
        },
        { type: "button", label: "Join the consultation", href: "{{meeting_url}}" },
        {
          type: "callout",
          tone: "info",
          title: "Before you join",
          text: "Find a quiet, well-lit spot with a stable connection, and test your camera and microphone a few minutes early.",
        },
        {
          type: "text",
          text: "The link opens 10 minutes before your slot. If you're disconnected, rejoin with the same link.",
          muted: true,
        },
      ],
    },
    {
      key: "results-ready",
      name: "Results Ready",
      description: "Notifies that results are available, without disclosing them.",
      category: "transactional",
      subject: "Your results are ready to view",
      preheader: "Sign in to the patient portal to see them securely.",
      blocks: [
        { type: "heading", text: "Your results are ready" },
        {
          type: "text",
          text: "The results from your {{test_name}} on {{test_date}} are available in your patient portal.",
        },
        {
          type: "callout",
          tone: "info",
          text: "For your privacy, results are never included in email. Sign in to the portal to view them.",
        },
        { type: "button", label: "View results securely", href: "{{portal_url}}" },
        {
          type: "text",
          text: "{{provider_name}} will contact you directly if anything needs follow-up. Questions in the meantime? Message your care team through the portal.",
          muted: true,
        },
      ],
    },
    {
      key: "prescription-refill",
      name: "Prescription Refill",
      description: "Refill-due notice with pharmacy details.",
      category: "operational",
      subject: "Time to refill {{medication_name}}",
      preheader: "{{days_remaining}} days of medication left.",
      blocks: [
        { type: "heading", text: "Your prescription is running low" },
        {
          type: "text",
          text: "You have about <strong>{{days_remaining}} days</strong> of {{medication_name}} remaining.",
        },
        {
          type: "panel",
          rows: [
            { label: "Medication", value: "{{medication_name}} {{dosage}}" },
            { label: "Prescribed by", value: "{{provider_name}}" },
            { label: "Refills left", value: "{{refills_remaining}}" },
            { label: "Pharmacy", value: "{{pharmacy_name}}" },
          ],
        },
        { type: "button", label: "Request a refill", href: "{{refill_url}}" },
        {
          type: "text",
          text: "Allow {{processing_time}} for your pharmacy to prepare it.",
          muted: true,
        },
      ],
    },
    {
      key: "intake-form",
      name: "Intake Form",
      description: "Pre-visit paperwork request with a deadline.",
      category: "operational",
      subject: "Please complete your intake form",
      preheader: "Takes {{estimated_time}} — due before {{appointment_date}}.",
      blocks: [
        { type: "heading", text: "A few questions before your visit" },
        {
          type: "text",
          text: "Completing this ahead of {{appointment_date}} means more of your appointment is spent on care rather than paperwork.",
        },
        {
          type: "panel",
          rows: [
            { label: "Form", value: "{{form_name}}" },
            { label: "Takes about", value: "{{estimated_time}}" },
            { label: "Complete by", value: "{{due_date}}" },
          ],
        },
        { type: "button", label: "Complete the form", href: "{{form_url}}" },
        {
          type: "text",
          text: "Your answers are encrypted and visible only to your care team.",
          muted: true,
        },
      ],
    },
    {
      key: "appointment-cancelled",
      name: "Appointment Cancelled",
      description: "Cancellation notice with a rebooking route.",
      category: "operational",
      subject: "Your appointment on {{appointment_date}} was cancelled",
      preheader: "Rebook a new time whenever suits you.",
      blocks: [
        { type: "heading", text: "Appointment cancelled" },
        {
          type: "text",
          text: "Your appointment with {{provider_name}} on {{appointment_date}} at {{appointment_time}} has been cancelled. Reason: {{reason}}.",
        },
        {
          type: "text",
          text: "There's nothing you need to do — no fee applies and no referral is affected.",
        },
        { type: "button", label: "Book a new appointment", href: "{{booking_url}}" },
        {
          type: "text",
          text: "Need to be seen sooner? Call us on {{phone_number}} and we'll find something.",
          muted: true,
        },
      ],
    },
    {
      key: "care-plan-update",
      name: "Care Plan Update",
      description: "Summarises a change to an ongoing care plan.",
      category: "transactional",
      subject: "Your care plan has been updated",
      preheader: "Changes from your visit on {{visit_date}}.",
      blocks: [
        { type: "heading", text: "Your care plan has been updated" },
        {
          type: "text",
          text: "Following your visit on {{visit_date}}, {{provider_name}} has updated your plan.",
        },
        { type: "heading", text: "What's changed", size: "md" },
        { type: "list", items: ["{{change_1}}", "{{change_2}}"] },
        { type: "heading", text: "Next steps", size: "md" },
        {
          type: "steps",
          items: [
            { title: "{{step_1_title}}", text: "{{step_1_detail}}" },
            { title: "{{step_2_title}}", text: "{{step_2_detail}}" },
          ],
        },
        { type: "button", label: "View your care plan", href: "{{portal_url}}" },
      ],
    },
  ],
};
