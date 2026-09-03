import type { TemplatePack } from "../types";

// Fundraising and supporter comms. Deep green with a serif headline face —
// the register charities use when they want warmth without sentimentality.
export const nonprofitPack: TemplatePack = {
  id: "nonprofit",
  name: "Nonprofit Pack",
  tagline: "Donate, thank, report back",
  description:
    "Supporter emails for charities and causes — donation receipts, campaign appeals, impact reports and volunteer coordination.",
  audience: "Nonprofits & causes",
  theme: {
    brand: "#15803D",
    onBrand: "#FFFFFF",
    accent: "#B45309",
    bg: "#F6F8F4",
    card: "#FFFFFF",
    soft: "#F4F8F2",
    text: "#1A2419",
    muted: "#647063",
    border: "#E1E8DE",
    fontFamily: "'Inter','Helvetica Neue',Helvetica,Arial,sans-serif",
    headingFamily: "Georgia,'Times New Roman',serif",
    radius: 10,
    buttonRadius: 6,
    headerStyle: "centered",
  },
  footer: {
    lines: [
      "{{company_name}} · {{company_address}}",
      "Registered charity {{charity_number}}. Donations may be tax deductible.",
    ],
    links: [
      { label: "Our work", href: "{{about_url}}" },
      { label: "Email preferences", href: "{{preferences_url}}" },
      { label: "Unsubscribe", href: "{{unsubscribe_url}}" },
    ],
  },
  templates: [
    {
      key: "donation-receipt",
      name: "Donation Receipt",
      description: "Tax-ready receipt that also says what the gift does.",
      category: "transactional",
      subject: "Thank you — your {{amount}} donation",
      preheader: "Receipt {{receipt_number}} for your records.",
      blocks: [
        { type: "heading", text: "Thank you, {{first_name}}", align: "center" },
        {
          type: "text",
          text: "Your gift of <strong>{{amount}}</strong> is already at work. {{impact_statement}}",
          align: "center",
        },
        {
          type: "panel",
          title: "Receipt",
          rows: [
            { label: "Receipt number", value: "{{receipt_number}}" },
            { label: "Date", value: "{{donation_date}}" },
            { label: "Amount", value: "{{amount}}" },
            { label: "Designation", value: "{{designation}}" },
            { label: "Charity number", value: "{{charity_number}}" },
          ],
        },
        { type: "button", label: "Download receipt", href: "{{receipt_url}}", align: "center", variant: "outline" },
        {
          type: "text",
          text: "Keep this email for your tax records. No goods or services were provided in exchange for this gift.",
          align: "center",
          muted: true,
        },
      ],
    },
    {
      key: "recurring-donation-started",
      name: "Monthly Giving Started",
      description: "Welcomes a recurring donor and sets expectations.",
      category: "billing",
      subject: "Your monthly gift of {{amount}} starts today",
      preheader: "Thank you for becoming a monthly supporter.",
      blocks: [
        { type: "heading", text: "You're now a monthly supporter", align: "center" },
        {
          type: "text",
          text: "Regular giving is the thing that lets us plan more than a few months ahead. Thank you, {{first_name}}.",
        },
        {
          type: "panel",
          rows: [
            { label: "Amount", value: "{{amount}} monthly" },
            { label: "First gift", value: "{{first_charge_date}}" },
            { label: "Then", value: "{{charge_day}} of each month" },
            { label: "Supporting", value: "{{designation}}" },
          ],
        },
        {
          type: "text",
          text: 'You can change or pause this anytime from <a href="{{manage_url}}" style="color:inherit;">your supporter page</a> — no phone call, no guilt.',
          muted: true,
        },
      ],
    },
    {
      key: "campaign-appeal",
      name: "Campaign Appeal",
      description: "Fundraising ask built around one story and one number.",
      category: "marketing",
      subject: "{{campaign_name}}: {{amount_needed}} to go",
      preheader: "{{campaign_summary}}",
      blocks: [
        { type: "heading", text: "{{campaign_name}}", align: "center" },
        { type: "text", text: "{{campaign_summary}}" },
        { type: "quote", text: "{{beneficiary_quote}}", author: "{{beneficiary_name}}" },
        {
          type: "metrics",
          items: [
            { label: "Raised", value: "{{amount_raised}}" },
            { label: "Goal", value: "{{goal_amount}}" },
            { label: "Days left", value: "{{days_left}}" },
          ],
        },
        { type: "text", text: "{{ask_statement}}" },
        { type: "button", label: "Give {{suggested_amount}}", href: "{{donate_url}}", align: "center" },
      ],
    },
    {
      key: "impact-report",
      name: "Impact Report",
      description: "Shows supporters what their money actually did.",
      category: "lifecycle",
      subject: "What your support achieved in {{period}}",
      preheader: "The numbers behind {{period}}.",
      blocks: [
        { type: "heading", text: "{{period}} in numbers", align: "center" },
        {
          type: "metrics",
          items: [
            { label: "{{metric_1_label}}", value: "{{metric_1_value}}" },
            { label: "{{metric_2_label}}", value: "{{metric_2_value}}" },
            { label: "{{metric_3_label}}", value: "{{metric_3_value}}" },
          ],
        },
        { type: "heading", text: "One story from this year", size: "md" },
        { type: "text", text: "{{story_text}}" },
        { type: "divider" },
        { type: "heading", text: "Where the money went", size: "md" },
        {
          type: "table",
          columns: ["Area", "Share"],
          rows: [
            ["{{spend_1_area}}", "{{spend_1_share}}"],
            ["{{spend_2_area}}", "{{spend_2_share}}"],
            ["{{spend_3_area}}", "{{spend_3_share}}"],
          ],
        },
        { type: "button", label: "Read the full report", href: "{{report_url}}", align: "center" },
      ],
    },
    {
      key: "volunteer-signup",
      name: "Volunteer Confirmed",
      description: "Shift confirmation with logistics and a contact.",
      category: "transactional",
      subject: "You're signed up for {{shift_name}}",
      preheader: "{{shift_date}} at {{shift_location}}.",
      blocks: [
        { type: "heading", text: "Thanks for volunteering" },
        { type: "text", text: "You're confirmed for <strong>{{shift_name}}</strong>." },
        {
          type: "panel",
          rows: [
            { label: "When", value: "{{shift_date}}, {{shift_time}}" },
            { label: "Where", value: "{{shift_location}}" },
            { label: "Role", value: "{{volunteer_role}}" },
            { label: "Ask for", value: "{{coordinator_name}} · {{coordinator_phone}}" },
          ],
        },
        { type: "heading", text: "Please bring", size: "md" },
        { type: "list", items: ["{{bring_1}}", "{{bring_2}}"] },
        { type: "button", label: "Add to calendar", href: "{{calendar_url}}" },
        {
          type: "text",
          text: "Plans changed? Let {{coordinator_name}} know as early as you can so the shift can be refilled.",
          muted: true,
        },
      ],
    },
    {
      key: "event-fundraiser",
      name: "Fundraising Event",
      description: "Invitation to a gala, run or community fundraiser.",
      category: "marketing",
      subject: "Join us at {{event_name}}",
      preheader: "{{event_date}} · {{event_location}}.",
      blocks: [
        { type: "heading", text: "{{event_name}}", align: "center" },
        { type: "text", text: "{{event_summary}}", align: "center" },
        {
          type: "panel",
          rows: [
            { label: "When", value: "{{event_date}} at {{event_time}}" },
            { label: "Where", value: "{{event_location}}" },
            { label: "Tickets", value: "{{ticket_price}}" },
            { label: "Raising for", value: "{{campaign_name}}" },
          ],
        },
        { type: "button", label: "Reserve your place", href: "{{rsvp_url}}", align: "center" },
        {
          type: "text",
          text: "Can't make it but want to help? {{alternative_ask}}",
          align: "center",
          muted: true,
        },
      ],
    },
    {
      key: "thank-you-anniversary",
      name: "Supporter Anniversary",
      description: "Marks a giving anniversary with cumulative impact.",
      category: "lifecycle",
      subject: "{{years}} years of support — thank you",
      preheader: "Here's what you've made possible since {{first_gift_date}}.",
      blocks: [
        { type: "heading", text: "{{years}} years, {{first_name}}", align: "center" },
        {
          type: "text",
          text: "You first gave on {{first_gift_date}}. Here's the shape of what you've made possible since.",
          align: "center",
        },
        {
          type: "metrics",
          items: [
            { label: "Total given", value: "{{lifetime_amount}}" },
            { label: "Gifts", value: "{{gift_count}}" },
            { label: "{{impact_label}}", value: "{{impact_value}}" },
          ],
        },
        { type: "text", text: "{{thank_you_note}}" },
        { type: "button", label: "See your impact", href: "{{impact_url}}", align: "center", variant: "outline" },
      ],
    },
    {
      key: "grant-application-update",
      name: "Grant Decision",
      description: "Outcome notice for a grant or bursary application.",
      category: "transactional",
      subject: "A decision on your {{grant_name}} application",
      preheader: "Reference {{application_id}}.",
      blocks: [
        { type: "heading", text: "{{grant_name}} — our decision" },
        { type: "text", text: "{{decision_summary}}" },
        {
          type: "panel",
          rows: [
            { label: "Application", value: "{{application_id}}" },
            { label: "Decision", value: "{{decision}}" },
            { label: "Amount", value: "{{awarded_amount}}" },
            { label: "Decided", value: "{{decided_at}}" },
          ],
        },
        { type: "heading", text: "Next steps", size: "md" },
        { type: "list", items: ["{{next_step_1}}", "{{next_step_2}}"], ordered: true },
        { type: "button", label: "View the decision letter", href: "{{decision_url}}" },
      ],
    },
  ],
};
