import type { TemplatePack } from "../types";

// The default pack: the sixteen emails almost every B2B SaaS product sends
// between signup and renewal. Clean indigo-on-white, minimal header rule.
export const saasStarterPack: TemplatePack = {
  id: "saas-starter",
  name: "SaaS Starter Pack",
  tagline: "Signup to renewal, all sixteen",
  description:
    "The complete lifecycle set for a subscription product — onboarding, auth, trials, billing and product comms in one consistent indigo theme.",
  audience: "SaaS & B2B software",
  theme: {
    brand: "#4F46E5",
    onBrand: "#FFFFFF",
    accent: "#7C3AED",
    bg: "#F4F5FA",
    card: "#FFFFFF",
    soft: "#F7F8FC",
    text: "#111827",
    muted: "#6B7280",
    border: "#E4E7EE",
    fontFamily: "'Inter','Helvetica Neue',Helvetica,Arial,sans-serif",
    radius: 12,
    buttonRadius: 8,
    headerStyle: "minimal",
  },
  footer: {
    lines: [
      "{{company_name}} · {{company_address}}",
      "You're receiving this because you have a {{company_name}} account.",
    ],
    links: [
      { label: "Help centre", href: "{{help_url}}" },
      { label: "Email preferences", href: "{{preferences_url}}" },
    ],
  },
  templates: [
    {
      key: "welcome",
      name: "Welcome",
      description: "First email after signup — orients the user and points at one action.",
      category: "onboarding",
      subject: "Welcome to {{product_name}}, {{first_name}}",
      preheader: "Here's how to get your first win in the next five minutes.",
      blocks: [
        { type: "heading", text: "Welcome aboard, {{first_name}} 👋" },
        {
          type: "text",
          text: "Your {{product_name}} account is ready. Most teams get their first result within ten minutes — here's the shortest path there.",
        },
        {
          type: "steps",
          items: [
            { title: "Set up your workspace", text: "Name it, pick a timezone, and you're done." },
            { title: "Invite a teammate", text: "{{product_name}} gets useful fast once two people are in it." },
            { title: "Connect your first integration", text: "Pull in the data you already have." },
          ],
        },
        { type: "button", label: "Open your workspace", href: "{{action_url}}" },
        {
          type: "text",
          text: "Stuck on anything? Just reply to this email — it reaches a real person on our team.",
          muted: true,
        },
      ],
    },
    {
      key: "email-verification",
      name: "Email Verification",
      description: "Confirms ownership of the address with a link and a fallback code.",
      category: "security",
      subject: "Verify your email address",
      preheader: "One click and your {{product_name}} account is confirmed.",
      blocks: [
        { type: "heading", text: "Confirm your email address" },
        {
          type: "text",
          text: "Tap the button below to finish setting up your {{product_name}} account. The link expires in {{expires_in}}.",
        },
        { type: "button", label: "Verify email address", href: "{{verification_url}}" },
        { type: "divider" },
        { type: "code", value: "{{verification_code}}", caption: "Or enter this code manually" },
        {
          type: "text",
          text: "If you didn't create a {{product_name}} account, you can safely ignore this email.",
          muted: true,
        },
      ],
    },
    {
      key: "forgot-password",
      name: "Forgot Password",
      description: "Time-limited reset link with clear do-nothing guidance.",
      category: "security",
      subject: "Reset your {{product_name}} password",
      preheader: "This reset link expires in {{expires_in}}.",
      blocks: [
        { type: "heading", text: "Reset your password" },
        {
          type: "text",
          text: "We got a request to reset the password for <strong>{{email}}</strong>. Choose a new one using the button below.",
        },
        { type: "button", label: "Choose a new password", href: "{{reset_url}}" },
        {
          type: "callout",
          tone: "warning",
          title: "Didn't request this?",
          text: "Ignore this email and your password stays as it is. The link expires in {{expires_in}}.",
        },
      ],
    },
    {
      key: "password-changed",
      name: "Password Changed",
      description: "Security confirmation with device details and a lock-out escape hatch.",
      category: "security",
      subject: "Your password was changed",
      preheader: "If this wasn't you, secure your account now.",
      blocks: [
        { type: "heading", text: "Your password was changed" },
        {
          type: "text",
          text: "The password for <strong>{{email}}</strong> was updated. Here's where the change came from:",
        },
        {
          type: "panel",
          rows: [
            { label: "When", value: "{{changed_at}}" },
            { label: "Device", value: "{{device}}" },
            { label: "Location", value: "{{location}}" },
            { label: "IP address", value: "{{ip_address}}" },
          ],
        },
        {
          type: "callout",
          tone: "danger",
          title: "Wasn't you?",
          text: 'Secure your account immediately at <a href="{{security_url}}" style="color:inherit;">{{security_url}}</a> or reply to this email.',
        },
      ],
    },
    {
      key: "invitation",
      name: "Team Invitation",
      description: "Workspace invite from a named colleague with role context.",
      category: "onboarding",
      subject: "{{inviter_name}} invited you to {{workspace_name}}",
      preheader: "Join the {{workspace_name}} workspace on {{product_name}}.",
      blocks: [
        { type: "heading", text: "You've been invited to {{workspace_name}}" },
        {
          type: "text",
          text: "<strong>{{inviter_name}}</strong> ({{inviter_email}}) has invited you to collaborate on {{product_name}}.",
        },
        {
          type: "panel",
          rows: [
            { label: "Workspace", value: "{{workspace_name}}" },
            { label: "Your role", value: "{{role}}" },
            { label: "Invited by", value: "{{inviter_name}}" },
          ],
        },
        { type: "button", label: "Accept invitation", href: "{{invite_url}}" },
        { type: "text", text: "This invitation expires in {{expires_in}}.", muted: true },
      ],
    },
    {
      key: "trial-started",
      name: "Trial Started",
      description: "Sets the trial clock and the one thing to try first.",
      category: "lifecycle",
      subject: "Your {{trial_days}}-day trial has started",
      preheader: "Full access to every {{product_name}} feature until {{trial_end_date}}.",
      blocks: [
        { type: "heading", text: "Your trial is live" },
        {
          type: "text",
          text: "You've got full access to every {{product_name}} feature until <strong>{{trial_end_date}}</strong> — no card, no limits.",
        },
        {
          type: "list",
          items: [
            "Unlimited projects and team members",
            "All integrations, including {{premium_integration}}",
            "Priority support while you evaluate",
          ],
        },
        { type: "button", label: "Start exploring", href: "{{action_url}}" },
        {
          type: "text",
          text: "Want a walkthrough? <a href=\"{{demo_url}}\" style=\"color:inherit;\">Book 20 minutes</a> with our team.",
          muted: true,
        },
      ],
    },
    {
      key: "trial-ending",
      name: "Trial Ending",
      description: "Deadline reminder that leads with what the user built.",
      category: "lifecycle",
      subject: "Your trial ends in {{days_left}} days",
      preheader: "Pick a plan to keep your workspace and data.",
      blocks: [
        { type: "heading", text: "{{days_left}} days left in your trial" },
        {
          type: "text",
          text: "Your {{product_name}} trial ends on <strong>{{trial_end_date}}</strong>. Here's what you've built so far:",
        },
        {
          type: "metrics",
          items: [
            { label: "Projects", value: "{{projects_count}}" },
            { label: "Teammates", value: "{{members_count}}" },
            { label: "Hours saved", value: "{{hours_saved}}" },
          ],
        },
        {
          type: "text",
          text: "Choose a plan before {{trial_end_date}} and everything stays exactly where it is.",
        },
        { type: "button", label: "Choose a plan", href: "{{upgrade_url}}" },
      ],
    },
    {
      key: "subscription-started",
      name: "Subscription Started",
      description: "Plan confirmation with the first renewal date up front.",
      category: "billing",
      subject: "You're on {{plan_name}} — welcome",
      preheader: "Your subscription is active. Here are the details.",
      blocks: [
        { type: "heading", text: "You're on {{plan_name}}" },
        { type: "text", text: "Thanks for subscribing, {{first_name}}. Your plan is active from today." },
        {
          type: "panel",
          title: "Subscription",
          rows: [
            { label: "Plan", value: "{{plan_name}}" },
            { label: "Billing cycle", value: "{{billing_cycle}}" },
            { label: "Amount", value: "{{amount}}" },
            { label: "Next renewal", value: "{{next_billing_date}}" },
          ],
        },
        { type: "button", label: "View your workspace", href: "{{action_url}}" },
        {
          type: "text",
          text: 'Manage billing, seats and invoices anytime from <a href="{{billing_url}}" style="color:inherit;">your billing settings</a>.',
          muted: true,
        },
      ],
    },
    {
      key: "subscription-cancelled",
      name: "Subscription Cancelled",
      description: "Confirms the end date, keeps the door open, asks why.",
      category: "billing",
      subject: "Your subscription has been cancelled",
      preheader: "You keep access until {{access_until}}.",
      blocks: [
        { type: "heading", text: "Your subscription is cancelled" },
        {
          type: "text",
          text: "We've cancelled the {{plan_name}} subscription for {{workspace_name}}. You won't be billed again.",
        },
        {
          type: "panel",
          rows: [
            { label: "Access until", value: "{{access_until}}" },
            { label: "Data kept until", value: "{{data_retention_date}}" },
            { label: "Final invoice", value: "{{final_amount}}" },
          ],
        },
        {
          type: "text",
          text: "Changed your mind? Reactivating before {{access_until}} restores everything untouched.",
        },
        { type: "button", label: "Reactivate subscription", href: "{{reactivate_url}}", variant: "outline" },
        {
          type: "text",
          text: 'We\'d genuinely like to know what went wrong — <a href="{{feedback_url}}" style="color:inherit;">two questions, one minute</a>.',
          muted: true,
        },
      ],
    },
    {
      key: "payment-successful",
      name: "Payment Successful",
      description: "Short receipt-style confirmation of a successful charge.",
      category: "billing",
      subject: "Payment received — {{amount}}",
      preheader: "Thanks, we've received your payment for {{plan_name}}.",
      blocks: [
        { type: "heading", text: "Payment received" },
        { type: "text", text: "We've charged {{amount}} to your {{card_brand}} ending {{card_last4}}." },
        {
          type: "panel",
          rows: [
            { label: "Plan", value: "{{plan_name}}" },
            { label: "Billing period", value: "{{period_start}} – {{period_end}}" },
            { label: "Amount", value: "{{amount}}" },
            { label: "Next charge", value: "{{next_billing_date}}" },
          ],
        },
        { type: "button", label: "Download invoice", href: "{{invoice_url}}", variant: "outline" },
      ],
    },
    {
      key: "payment-failed",
      name: "Payment Failed",
      description: "Dunning email with the deadline and one fix-it action.",
      category: "billing",
      subject: "Action needed: payment failed",
      preheader: "Update your card to keep {{workspace_name}} running.",
      blocks: [
        { type: "heading", text: "We couldn't process your payment" },
        {
          type: "text",
          text: "The {{amount}} charge for {{plan_name}} was declined by your {{card_brand}} ending {{card_last4}}.",
        },
        {
          type: "callout",
          tone: "danger",
          title: "What happens next",
          text: "We'll retry on {{retry_date}}. If it fails again, {{workspace_name}} will be downgraded on {{suspension_date}}.",
        },
        { type: "button", label: "Update payment method", href: "{{billing_url}}" },
        {
          type: "text",
          text: "Already fixed it? You can ignore this — the next retry will go through.",
          muted: true,
        },
      ],
    },
    {
      key: "invoice",
      name: "Invoice",
      description: "Itemised invoice with due date and payment link.",
      category: "billing",
      subject: "Invoice {{invoice_number}} from {{company_name}}",
      preheader: "{{amount_due}} due {{due_date}}.",
      blocks: [
        { type: "heading", text: "Invoice {{invoice_number}}" },
        {
          type: "panel",
          rows: [
            { label: "Billed to", value: "{{customer_name}}" },
            { label: "Issued", value: "{{issue_date}}" },
            { label: "Due", value: "{{due_date}}" },
          ],
        },
        {
          type: "table",
          columns: ["Description", "Qty", "Amount"],
          rows: [
            ["{{line_1_description}}", "{{line_1_qty}}", "{{line_1_amount}}"],
            ["{{line_2_description}}", "{{line_2_qty}}", "{{line_2_amount}}"],
          ],
          total: { label: "Total due", value: "{{amount_due}}" },
        },
        { type: "button", label: "Pay invoice", href: "{{payment_url}}" },
      ],
    },
    {
      key: "receipt",
      name: "Receipt",
      description: "Paid-in-full record for accounting, with tax line.",
      category: "billing",
      subject: "Your receipt from {{company_name}}",
      preheader: "Receipt {{receipt_number}} for {{amount_paid}}.",
      blocks: [
        { type: "heading", text: "Receipt {{receipt_number}}" },
        { type: "text", text: "Thanks for your payment. This is your receipt for {{company_name}}." },
        {
          type: "table",
          columns: ["Item", "Amount"],
          rows: [
            ["{{plan_name}} ({{billing_cycle}})", "{{subtotal}}"],
            ["Tax ({{tax_rate}})", "{{tax_amount}}"],
          ],
          total: { label: "Paid on {{paid_at}}", value: "{{amount_paid}}" },
        },
        {
          type: "panel",
          rows: [
            { label: "Paid with", value: "{{card_brand}} •••• {{card_last4}}" },
            { label: "Reference", value: "{{transaction_id}}" },
          ],
        },
        { type: "button", label: "Download PDF", href: "{{receipt_url}}", variant: "outline" },
      ],
    },
    {
      key: "account-suspended",
      name: "Account Suspended",
      description: "States the reason, the data window, and the route back.",
      category: "operational",
      subject: "Your account has been suspended",
      preheader: "Here's why, and how to restore access.",
      blocks: [
        { type: "heading", text: "Your account has been suspended" },
        {
          type: "text",
          text: "Access to {{workspace_name}} is paused as of {{suspended_at}}.",
        },
        {
          type: "panel",
          rows: [
            { label: "Reason", value: "{{reason}}" },
            { label: "Suspended on", value: "{{suspended_at}}" },
            { label: "Data retained until", value: "{{data_retention_date}}" },
          ],
        },
        {
          type: "text",
          text: "Nothing has been deleted. Resolving the issue below restores your workspace exactly as you left it.",
        },
        { type: "button", label: "Restore access", href: "{{action_url}}" },
        {
          type: "text",
          text: "Think this is a mistake? Reply to this email or contact {{support_email}}.",
          muted: true,
        },
      ],
    },
    {
      key: "weekly-digest",
      name: "Weekly Digest",
      description: "Recurring activity summary with headline numbers.",
      category: "lifecycle",
      subject: "Your week on {{product_name}}",
      preheader: "{{highlight_stat}} — plus what your team shipped.",
      blocks: [
        { type: "heading", text: "Your week in review" },
        { type: "text", text: "{{week_range}} · {{workspace_name}}", muted: true },
        {
          type: "metrics",
          items: [
            { label: "Created", value: "{{created_count}}" },
            { label: "Completed", value: "{{completed_count}}" },
            { label: "Active members", value: "{{active_members}}" },
          ],
        },
        { type: "heading", text: "Highlights", size: "md" },
        {
          type: "list",
          items: ["{{highlight_1}}", "{{highlight_2}}", "{{highlight_3}}"],
        },
        { type: "button", label: "Open dashboard", href: "{{dashboard_url}}" },
        {
          type: "text",
          text: 'Prefer these monthly? <a href="{{preferences_url}}" style="color:inherit;">Change your digest frequency</a>.',
          muted: true,
        },
      ],
    },
    {
      key: "product-update",
      name: "Product Update",
      description: "Release announcement — headline feature plus the smaller ones.",
      category: "marketing",
      subject: "New in {{product_name}}: {{feature_name}}",
      preheader: "Plus {{other_count}} smaller improvements this month.",
      blocks: [
        { type: "heading", text: "{{feature_name}} is here" },
        { type: "text", text: "{{feature_summary}}" },
        { type: "button", label: "See what's new", href: "{{changelog_url}}" },
        { type: "divider" },
        { type: "heading", text: "Also shipped", size: "md" },
        {
          type: "list",
          items: ["{{improvement_1}}", "{{improvement_2}}", "{{improvement_3}}"],
        },
        {
          type: "text",
          text: 'Got a request? <a href="{{feedback_url}}" style="color:inherit;">Tell us what to build next</a>.',
          muted: true,
        },
      ],
    },
  ],
};
