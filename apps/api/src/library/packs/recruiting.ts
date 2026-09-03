import type { TemplatePack } from "../types";

// Hiring pipeline pack, from application to first day. Deliberately plain and
// warm — these are read by candidates, including the ones being rejected.
export const recruitingPack: TemplatePack = {
  id: "recruiting",
  name: "Recruiting & HR Pack",
  tagline: "Apply to first day",
  description:
    "Candidate and employee communication — applications, interviews, offers, rejections and onboarding, written to be read by humans.",
  audience: "HR, recruiting & people teams",
  theme: {
    brand: "#4338CA",
    onBrand: "#FFFFFF",
    accent: "#059669",
    bg: "#F5F5F8",
    card: "#FFFFFF",
    soft: "#F6F6FA",
    text: "#18181B",
    muted: "#6B7280",
    border: "#E4E4EA",
    fontFamily: "'Inter','Helvetica Neue',Helvetica,Arial,sans-serif",
    radius: 10,
    buttonRadius: 8,
    headerStyle: "minimal",
  },
  footer: {
    lines: [
      "{{company_name}} · {{company_address}}",
      "You're receiving this because you applied to a role at {{company_name}}.",
    ],
    links: [
      { label: "Open roles", href: "{{careers_url}}" },
      { label: "Privacy policy", href: "{{privacy_url}}" },
    ],
  },
  templates: [
    {
      key: "application-received",
      name: "Application Received",
      description: "Acknowledgement that sets an honest timeline.",
      category: "transactional",
      subject: "We got your application for {{role_title}}",
      preheader: "You'll hear from us by {{response_by}}.",
      blocks: [
        { type: "heading", text: "Thanks for applying" },
        {
          type: "text",
          text: "We've received your application for <strong>{{role_title}}</strong> and a real person on the {{team_name}} team will read it.",
        },
        {
          type: "panel",
          rows: [
            { label: "Role", value: "{{role_title}}" },
            { label: "Team", value: "{{team_name}}" },
            { label: "Applied", value: "{{applied_at}}" },
            { label: "Reference", value: "{{application_id}}" },
          ],
        },
        {
          type: "text",
          text: "We aim to come back to everyone by <strong>{{response_by}}</strong>, either way.",
        },
        { type: "button", label: "Track your application", href: "{{application_url}}", variant: "outline" },
      ],
    },
    {
      key: "interview-invitation",
      name: "Interview Invitation",
      description: "Invites to a stage, with format and who they'll meet.",
      category: "transactional",
      subject: "Interview invitation — {{role_title}}",
      preheader: "{{interview_stage}} · {{duration}} with {{interviewer_name}}.",
      blocks: [
        { type: "heading", text: "We'd like to meet you" },
        {
          type: "text",
          text: "We enjoyed your application for {{role_title}} and would like to move to the <strong>{{interview_stage}}</strong> stage.",
        },
        {
          type: "panel",
          rows: [
            { label: "Stage", value: "{{interview_stage}}" },
            { label: "Format", value: "{{format}}" },
            { label: "Duration", value: "{{duration}}" },
            { label: "You'll meet", value: "{{interviewer_name}}, {{interviewer_title}}" },
          ],
        },
        { type: "heading", text: "What we'll cover", size: "md" },
        { type: "list", items: ["{{topic_1}}", "{{topic_2}}", "{{topic_3}}"] },
        { type: "button", label: "Pick a time", href: "{{scheduling_url}}" },
        {
          type: "text",
          text: "Need an accommodation of any kind? Reply here and we'll arrange it, no explanation needed.",
          muted: true,
        },
      ],
    },
    {
      key: "interview-reminder",
      name: "Interview Reminder",
      description: "Day-before note with the join link and prep.",
      category: "operational",
      subject: "Your interview is tomorrow at {{interview_time}}",
      preheader: "{{interview_stage}} with {{interviewer_name}}.",
      blocks: [
        { type: "heading", text: "Tomorrow at {{interview_time}}" },
        {
          type: "panel",
          rows: [
            { label: "Role", value: "{{role_title}}" },
            { label: "Stage", value: "{{interview_stage}}" },
            { label: "When", value: "{{interview_date}} at {{interview_time}} {{timezone}}" },
            { label: "With", value: "{{interviewer_name}}" },
            { label: "Where", value: "{{location}}" },
          ],
        },
        { type: "button", label: "Join the interview", href: "{{meeting_url}}" },
        {
          type: "callout",
          tone: "info",
          title: "Worth knowing",
          text: "{{prep_note}} There's nothing to prepare beyond that — we're not testing memorisation.",
        },
      ],
    },
    {
      key: "offer-letter",
      name: "Offer",
      description: "The offer itself, with terms and a decision date.",
      category: "transactional",
      subject: "An offer from {{company_name}}",
      preheader: "{{role_title}} on the {{team_name}} team.",
      blocks: [
        { type: "heading", text: "We'd love you to join us" },
        {
          type: "text",
          text: "{{first_name}} — everyone you met wants to work with you. Here's our offer for <strong>{{role_title}}</strong>.",
        },
        {
          type: "panel",
          title: "The offer",
          rows: [
            { label: "Role", value: "{{role_title}}" },
            { label: "Team", value: "{{team_name}}" },
            { label: "Start date", value: "{{start_date}}" },
            { label: "Salary", value: "{{salary}}" },
            { label: "Equity", value: "{{equity}}" },
            { label: "Location", value: "{{work_location}}" },
          ],
        },
        { type: "button", label: "Review and sign", href: "{{offer_url}}" },
        {
          type: "text",
          text: "The offer stands until <strong>{{offer_expires}}</strong>. If you need longer or want to talk any of it through, just say — that's normal and not held against anyone.",
          muted: true,
        },
      ],
    },
    {
      key: "application-rejected",
      name: "Not Moving Forward",
      description: "A rejection that stays specific, brief and kind.",
      category: "transactional",
      subject: "About your application for {{role_title}}",
      preheader: "We're not moving forward this time.",
      blocks: [
        { type: "heading", text: "An update on your application" },
        {
          type: "text",
          text: "{{first_name}} — thank you for the time you put into applying for {{role_title}}. We've decided not to move forward with your application this time.",
        },
        {
          type: "text",
          text: "{{personal_note}}",
        },
        {
          type: "text",
          text: "This says far less about your work than it does about the specific shape of this one role. We'd genuinely welcome an application from you again.",
        },
        { type: "button", label: "See other open roles", href: "{{careers_url}}", variant: "outline" },
      ],
    },
    {
      key: "onboarding-day-one",
      name: "First Day Details",
      description: "Everything a new joiner needs before day one.",
      category: "onboarding",
      subject: "Your first day at {{company_name}}",
      preheader: "{{start_date}} — here's what to expect.",
      blocks: [
        { type: "heading", text: "Welcome to the team, {{first_name}}" },
        { type: "text", text: "Everything you need for {{start_date}}." },
        {
          type: "panel",
          rows: [
            { label: "Start", value: "{{start_date}} at {{start_time}}" },
            { label: "Where", value: "{{location}}" },
            { label: "Ask for", value: "{{buddy_name}}, your onboarding buddy" },
            { label: "Manager", value: "{{manager_name}}" },
          ],
        },
        { type: "heading", text: "Your first day", size: "md" },
        {
          type: "steps",
          items: [
            { title: "{{schedule_1_title}}", text: "{{schedule_1_detail}}" },
            { title: "{{schedule_2_title}}", text: "{{schedule_2_detail}}" },
            { title: "{{schedule_3_title}}", text: "{{schedule_3_detail}}" },
          ],
        },
        { type: "button", label: "Complete your paperwork", href: "{{onboarding_url}}" },
        {
          type: "text",
          text: "Nothing to bring, nothing to prepare. Wear what you like.",
          muted: true,
        },
      ],
    },
    {
      key: "referral-request",
      name: "Referral Request",
      description: "Internal ask for candidate referrals on an open role.",
      category: "marketing",
      subject: "Know anyone for {{role_title}}?",
      preheader: "{{referral_bonus}} referral bonus — the role is open now.",
      blocks: [
        { type: "heading", text: "We're hiring a {{role_title}}" },
        {
          type: "text",
          text: "The {{team_name}} team is looking for a {{role_title}}, and the best hires almost always come through people who already work here.",
        },
        { type: "heading", text: "Who we're after", size: "md" },
        { type: "list", items: ["{{criteria_1}}", "{{criteria_2}}", "{{criteria_3}}"] },
        {
          type: "callout",
          tone: "success",
          text: "Referral bonus: <strong>{{referral_bonus}}</strong>, paid once they pass probation.",
        },
        { type: "button", label: "Refer someone", href: "{{referral_url}}" },
      ],
    },
    {
      key: "policy-update",
      name: "Policy Update",
      description: "Internal announcement of a policy change and its date.",
      category: "operational",
      subject: "Update to our {{policy_name}}",
      preheader: "Effective {{effective_date}}.",
      blocks: [
        { type: "heading", text: "{{policy_name}} is changing" },
        { type: "text", text: "From <strong>{{effective_date}}</strong>, here's what's different." },
        { type: "heading", text: "What's changing", size: "md" },
        { type: "list", items: ["{{change_1}}", "{{change_2}}", "{{change_3}}"] },
        { type: "heading", text: "Why", size: "md" },
        { type: "text", text: "{{rationale}}" },
        { type: "button", label: "Read the full policy", href: "{{policy_url}}" },
        {
          type: "text",
          text: "Questions go to {{contact_name}} or your manager — no question is too small.",
          muted: true,
        },
      ],
    },
  ],
};
