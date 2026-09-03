import type { TemplatePack } from "../types";

// Editorial pack: serif headlines, a centred wordmark and no card radius, so
// issues read like a publication rather than a product notification.
export const newsletterPack: TemplatePack = {
  id: "newsletter",
  name: "Newsletter Pack",
  tagline: "Publish, announce, digest",
  description:
    "An editorial set for publications and content teams — issues, announcements and digests with serif headlines and story lists.",
  audience: "Publishers & content teams",
  theme: {
    brand: "#B91C1C",
    onBrand: "#FFFFFF",
    accent: "#B91C1C",
    bg: "#FBFAF7",
    card: "#FFFFFF",
    soft: "#F7F5F0",
    text: "#1C1917",
    muted: "#78716C",
    border: "#E5E1D8",
    fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
    headingFamily: "Georgia,'Times New Roman',serif",
    radius: 0,
    buttonRadius: 2,
    headerStyle: "centered",
    uppercaseWordmark: true,
  },
  footer: {
    lines: [
      "{{company_name}} · {{company_address}}",
      "You're getting this because you subscribed to {{newsletter_name}}.",
    ],
    links: [
      { label: "View in browser", href: "{{web_version_url}}" },
      { label: "Update preferences", href: "{{preferences_url}}" },
      { label: "Unsubscribe", href: "{{unsubscribe_url}}" },
    ],
  },
  templates: [
    {
      key: "newsletter-issue",
      name: "Newsletter Issue",
      description: "Standard issue: editor's note, lead stories, sign-off.",
      category: "marketing",
      subject: "{{newsletter_name}} #{{issue_number}}: {{issue_title}}",
      preheader: "{{issue_summary}}",
      blocks: [
        { type: "text", text: "Issue #{{issue_number}} · {{issue_date}}", align: "center", muted: true },
        { type: "heading", text: "{{issue_title}}", align: "center" },
        {
          type: "image",
          src: "{{issue_image_url}}",
          alt: "{{issue_title}}",
        },
        { type: "divider" },
        { type: "text", text: "{{editors_note}}" },
        { type: "heading", text: "This week", size: "md" },
        {
          type: "articles",
          items: [
            {
              meta: "{{story_1_category}}",
              title: "{{story_1_title}}",
              excerpt: "{{story_1_excerpt}}",
              href: "{{story_1_url}}",
            },
            {
              meta: "{{story_2_category}}",
              title: "{{story_2_title}}",
              excerpt: "{{story_2_excerpt}}",
              href: "{{story_2_url}}",
            },
            {
              meta: "{{story_3_category}}",
              title: "{{story_3_title}}",
              excerpt: "{{story_3_excerpt}}",
              href: "{{story_3_url}}",
            },
          ],
        },
        { type: "text", text: "Until next week,<br>{{author_name}}", muted: true },
      ],
    },
    {
      key: "announcement",
      name: "Announcement",
      description: "Single-message broadcast for news that deserves its own email.",
      category: "marketing",
      subject: "{{announcement_title}}",
      preheader: "{{announcement_summary}}",
      blocks: [
        { type: "heading", text: "{{announcement_title}}", align: "center" },
        { type: "text", text: "{{announcement_date}}", align: "center", muted: true },
        {
          type: "image",
          src: "{{announcement_image_url}}",
          alt: "{{announcement_title}}",
        },
        { type: "divider" },
        { type: "text", text: "{{announcement_body}}" },
        { type: "quote", text: "{{quote_text}}", author: "{{quote_author}}" },
        { type: "button", label: "Read the full story", href: "{{announcement_url}}", align: "center" },
      ],
    },
    {
      key: "product-update",
      name: "Product Update",
      description: "What changed, why it matters, where to see it.",
      category: "marketing",
      subject: "What's new: {{feature_name}}",
      preheader: "{{feature_summary}}",
      blocks: [
        { type: "heading", text: "{{feature_name}}" },
        { type: "text", text: "{{feature_summary}}" },
        { type: "heading", text: "What changed", size: "md" },
        {
          type: "list",
          items: ["{{change_1}}", "{{change_2}}", "{{change_3}}"],
        },
        { type: "button", label: "See it in action", href: "{{changelog_url}}" },
      ],
    },
    {
      key: "monthly-digest",
      name: "Monthly Digest",
      description: "Roundup of the month's best pieces with reading stats.",
      category: "marketing",
      subject: "{{month}} in review",
      preheader: "The {{story_count}} pieces worth your time this month.",
      blocks: [
        { type: "heading", text: "{{month}} in review", align: "center" },
        {
          type: "metrics",
          items: [
            { label: "Stories", value: "{{story_count}}" },
            { label: "Readers", value: "{{reader_count}}" },
            { label: "New subscribers", value: "{{new_subscribers}}" },
          ],
        },
        { type: "heading", text: "Most read", size: "md" },
        {
          type: "articles",
          items: [
            { title: "{{top_1_title}}", excerpt: "{{top_1_excerpt}}", href: "{{top_1_url}}" },
            { title: "{{top_2_title}}", excerpt: "{{top_2_excerpt}}", href: "{{top_2_url}}" },
          ],
        },
        { type: "button", label: "Browse the archive", href: "{{archive_url}}", align: "center", variant: "outline" },
      ],
    },
    {
      key: "subscription-confirmed",
      name: "Subscription Confirmed",
      description: "Double opt-in confirmation and what to expect.",
      category: "onboarding",
      subject: "You're subscribed to {{newsletter_name}}",
      preheader: "Here's what lands in your inbox and when.",
      blocks: [
        { type: "heading", text: "You're in", align: "center" },
        {
          type: "text",
          text: "Thanks for subscribing to <strong>{{newsletter_name}}</strong>. It arrives {{send_schedule}}.",
        },
        {
          type: "list",
          items: ["{{expect_1}}", "{{expect_2}}", "{{expect_3}}"],
        },
        { type: "button", label: "Read the latest issue", href: "{{latest_issue_url}}", align: "center" },
        {
          type: "text",
          text: 'Want it less often? <a href="{{preferences_url}}" style="color:inherit;">Change your frequency</a> anytime.',
          muted: true,
        },
      ],
    },
    {
      key: "confirm-subscription",
      name: "Confirm Subscription",
      description: "Opt-in request sent before the first issue.",
      category: "onboarding",
      subject: "Confirm your subscription",
      preheader: "One click to start receiving {{newsletter_name}}.",
      blocks: [
        { type: "heading", text: "Just one more step", align: "center" },
        {
          type: "text",
          text: "Confirm that <strong>{{email}}</strong> should receive {{newsletter_name}}.",
          align: "center",
        },
        { type: "button", label: "Confirm subscription", href: "{{confirm_url}}", align: "center" },
        {
          type: "text",
          text: "Didn't sign up? Ignore this email and nothing will be sent.",
          align: "center",
          muted: true,
        },
      ],
    },
    {
      key: "unsubscribe-confirmed",
      name: "Unsubscribe Confirmed",
      description: "Graceful goodbye with a resubscribe path.",
      category: "lifecycle",
      subject: "You've been unsubscribed",
      preheader: "No more emails from {{newsletter_name}}.",
      blocks: [
        { type: "heading", text: "You've been unsubscribed", align: "center" },
        {
          type: "text",
          text: "We've removed <strong>{{email}}</strong> from {{newsletter_name}}. This was the last one.",
          align: "center",
        },
        { type: "button", label: "Resubscribe", href: "{{resubscribe_url}}", align: "center", variant: "outline" },
        {
          type: "text",
          text: 'Leaving for a reason we could fix? <a href="{{feedback_url}}" style="color:inherit;">Tell us</a>.',
          align: "center",
          muted: true,
        },
      ],
    },
    {
      key: "paid-subscriber-welcome",
      name: "Paid Subscriber Welcome",
      description: "Onboarding for a supporter, listing what unlocked.",
      category: "billing",
      subject: "Welcome to {{newsletter_name}} {{tier_name}}",
      preheader: "Your subscriber benefits are live.",
      blocks: [
        { type: "heading", text: "Thank you for supporting {{newsletter_name}}" },
        {
          type: "text",
          text: "Your {{tier_name}} subscription is active. Here's what you've unlocked:",
        },
        {
          type: "list",
          items: ["{{benefit_1}}", "{{benefit_2}}", "{{benefit_3}}"],
        },
        {
          type: "panel",
          rows: [
            { label: "Tier", value: "{{tier_name}}" },
            { label: "Billed", value: "{{amount}} {{billing_cycle}}" },
            { label: "Renews", value: "{{next_billing_date}}" },
          ],
        },
        { type: "button", label: "Read the archive", href: "{{archive_url}}" },
      ],
    },
  ],
};
