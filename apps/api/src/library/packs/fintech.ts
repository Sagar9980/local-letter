import type { TemplatePack } from "../types";

// Money-movement pack. Navy bar, restrained radii and a green accent reserved
// for confirmed amounts — the visual grammar people expect from a bank.
export const fintechPack: TemplatePack = {
  id: "fintech",
  name: "Fintech Pack",
  tagline: "Money in, money out, verified",
  description:
    "Account and payment notifications for banking, wallet and payments products, with the security framing regulated comms need.",
  audience: "Fintech, banking & payments",
  theme: {
    brand: "#1E3A8A",
    onBrand: "#FFFFFF",
    accent: "#047857",
    bg: "#F4F6F9",
    card: "#FFFFFF",
    soft: "#F5F7FB",
    text: "#0F172A",
    muted: "#5B6779",
    border: "#DFE4EC",
    fontFamily: "'Inter','Helvetica Neue',Helvetica,Arial,sans-serif",
    radius: 10,
    buttonRadius: 6,
    headerStyle: "bar",
  },
  footer: {
    lines: [
      "{{company_name}} · {{company_address}}",
      "{{company_name}} will never ask for your password, PIN or full card number by email.",
    ],
    links: [
      { label: "Security centre", href: "{{security_url}}" },
      { label: "Contact support", href: "{{support_url}}" },
    ],
  },
  templates: [
    {
      key: "transaction-alert",
      name: "Transaction Alert",
      description: "Real-time spend notification with a dispute path.",
      category: "transactional",
      subject: "{{amount}} spent at {{merchant}}",
      preheader: "Card ending {{card_last4}} · {{transaction_time}}.",
      blocks: [
        { type: "heading", text: "{{amount}} at {{merchant}}" },
        {
          type: "panel",
          rows: [
            { label: "Amount", value: "{{amount}}" },
            { label: "Merchant", value: "{{merchant}}" },
            { label: "Card", value: "{{card_brand}} •••• {{card_last4}}" },
            { label: "When", value: "{{transaction_time}}" },
            { label: "Balance after", value: "{{balance_after}}" },
          ],
        },
        {
          type: "callout",
          tone: "warning",
          title: "Don't recognise this?",
          text: "Freeze your card straight away — it takes one tap and you can unfreeze it later.",
        },
        { type: "button", label: "Freeze card", href: "{{freeze_url}}" },
      ],
    },
    {
      key: "payment-received",
      name: "Payment Received",
      description: "Incoming funds confirmation with the new balance.",
      category: "transactional",
      subject: "You received {{amount}}",
      preheader: "From {{sender_name}} · available now.",
      blocks: [
        { type: "heading", text: "{{amount}} received" },
        { type: "text", text: "{{sender_name}} sent you money. It's already available to spend." },
        {
          type: "panel",
          rows: [
            { label: "From", value: "{{sender_name}}" },
            { label: "Amount", value: "{{amount}}" },
            { label: "Reference", value: "{{reference}}" },
            { label: "Received", value: "{{received_at}}" },
            { label: "New balance", value: "{{balance}}" },
          ],
        },
        { type: "button", label: "View transaction", href: "{{transaction_url}}" },
      ],
    },
    {
      key: "transfer-sent",
      name: "Transfer Sent",
      description: "Outgoing transfer confirmation with arrival estimate.",
      category: "transactional",
      subject: "You sent {{amount}} to {{recipient_name}}",
      preheader: "Arriving {{arrival_estimate}}.",
      blocks: [
        { type: "heading", text: "Transfer on its way" },
        {
          type: "panel",
          rows: [
            { label: "To", value: "{{recipient_name}}" },
            { label: "Account", value: "•••• {{recipient_last4}}" },
            { label: "Amount", value: "{{amount}}" },
            { label: "Fee", value: "{{fee}}" },
            { label: "Arrives", value: "{{arrival_estimate}}" },
            { label: "Reference", value: "{{transaction_id}}" },
          ],
        },
        { type: "button", label: "Track transfer", href: "{{transaction_url}}" },
      ],
    },
    {
      key: "security-alert",
      name: "Security Alert",
      description: "New sign-in warning with immediate lock-down action.",
      category: "security",
      subject: "New sign-in to your {{company_name}} account",
      preheader: "{{device}} in {{location}} — was this you?",
      blocks: [
        { type: "heading", text: "New sign-in detected" },
        { type: "text", text: "Your account was accessed from a device we haven't seen before." },
        {
          type: "panel",
          rows: [
            { label: "When", value: "{{signed_in_at}}" },
            { label: "Device", value: "{{device}}" },
            { label: "Location", value: "{{location}}" },
            { label: "IP address", value: "{{ip_address}}" },
          ],
        },
        {
          type: "callout",
          tone: "danger",
          title: "Wasn't you?",
          text: "Secure your account now — we'll sign out every device and walk you through a password reset.",
        },
        { type: "button", label: "Secure my account", href: "{{security_url}}" },
      ],
    },
    {
      key: "verification-code",
      name: "Verification Code",
      description: "One-time passcode with anti-phishing warning.",
      category: "security",
      subject: "Your verification code is {{code}}",
      preheader: "Expires in {{expires_in}}. Never share it.",
      blocks: [
        { type: "heading", text: "Your verification code" },
        { type: "code", value: "{{code}}", caption: "Expires in {{expires_in}}" },
        {
          type: "callout",
          tone: "danger",
          title: "Never share this code",
          text: "{{company_name}} staff will never ask for it — not by phone, email or chat. Anyone who does is trying to defraud you.",
        },
      ],
    },
    {
      key: "identity-verification",
      name: "Identity Verification",
      description: "KYC request listing accepted documents and the deadline.",
      category: "operational",
      subject: "Action needed: verify your identity",
      preheader: "Complete verification by {{deadline}} to keep full account access.",
      blocks: [
        { type: "heading", text: "We need to verify your identity" },
        {
          type: "text",
          text: "Financial regulations require us to confirm who you are before {{deadline}}. It takes about {{estimated_time}}.",
        },
        { type: "heading", text: "You'll need one of", size: "md" },
        { type: "list", items: ["{{document_1}}", "{{document_2}}", "{{document_3}}"] },
        { type: "button", label: "Start verification", href: "{{verification_url}}" },
        {
          type: "callout",
          tone: "warning",
          text: "Accounts not verified by {{deadline}} are limited to withdrawals only until this is done.",
        },
      ],
    },
    {
      key: "statement-ready",
      name: "Statement Ready",
      description: "Monthly statement notice with the period summary.",
      category: "operational",
      subject: "Your {{month}} statement is ready",
      preheader: "In {{total_in}} · out {{total_out}}.",
      blocks: [
        { type: "heading", text: "{{month}} statement" },
        {
          type: "metrics",
          items: [
            { label: "Money in", value: "{{total_in}}" },
            { label: "Money out", value: "{{total_out}}" },
            { label: "Closing balance", value: "{{closing_balance}}" },
          ],
        },
        {
          type: "panel",
          rows: [
            { label: "Account", value: "{{account_name}} •••• {{account_last4}}" },
            { label: "Period", value: "{{period_start}} – {{period_end}}" },
            { label: "Transactions", value: "{{transaction_count}}" },
          ],
        },
        { type: "button", label: "Download statement", href: "{{statement_url}}" },
      ],
    },
    {
      key: "card-issued",
      name: "Card Issued",
      description: "New card dispatch and activation instructions.",
      category: "operational",
      subject: "Your new card is on its way",
      preheader: "Arriving by {{delivery_estimate}} — activate it when it lands.",
      blocks: [
        { type: "heading", text: "Your {{card_type}} card is on its way" },
        {
          type: "image",
          src: "{{card_image_url}}",
          alt: "{{card_brand}} {{card_type}} card",
          widthRatio: 0.55,
          align: "center",
        },
        {
          type: "panel",
          rows: [
            { label: "Card", value: "{{card_brand}} •••• {{card_last4}}" },
            { label: "Delivering to", value: "{{shipping_address}}" },
            { label: "Expected by", value: "{{delivery_estimate}}" },
          ],
        },
        {
          type: "steps",
          items: [
            { title: "Wait for the envelope", text: "It arrives in plain packaging with no branding." },
            { title: "Activate in the app", text: "Settings → Cards → Activate, then set your PIN." },
            { title: "Add it to your wallet", text: "Apple Pay and Google Pay work straight after activation." },
          ],
        },
        { type: "button", label: "Open the app", href: "{{app_url}}" },
      ],
    },
    {
      key: "low-balance",
      name: "Low Balance",
      description: "Threshold alert listing what's due next.",
      category: "lifecycle",
      subject: "Your balance is below {{threshold}}",
      preheader: "{{balance}} left with {{upcoming_count}} payments due.",
      blocks: [
        { type: "heading", text: "Balance running low" },
        {
          type: "text",
          text: "Your {{account_name}} balance is <strong>{{balance}}</strong>, below the {{threshold}} alert you set.",
        },
        {
          type: "table",
          columns: ["Upcoming payment", "Date", "Amount"],
          rows: [
            ["{{upcoming_1_name}}", "{{upcoming_1_date}}", "{{upcoming_1_amount}}"],
            ["{{upcoming_2_name}}", "{{upcoming_2_date}}", "{{upcoming_2_amount}}"],
          ],
          total: { label: "Due in the next 7 days", value: "{{upcoming_total}}" },
        },
        { type: "button", label: "Add money", href: "{{topup_url}}" },
      ],
    },
    {
      key: "payout-sent",
      name: "Payout Sent",
      description: "Merchant settlement note with the fee breakdown.",
      category: "billing",
      subject: "Payout of {{net_amount}} sent",
      preheader: "Settling to {{bank_name}} •••• {{bank_last4}}.",
      blocks: [
        { type: "heading", text: "{{net_amount}} is on its way" },
        { type: "text", text: "Your payout for {{period_start}} – {{period_end}} has been sent." },
        {
          type: "table",
          columns: ["Line", "Amount"],
          rows: [
            ["Gross volume", "{{gross_amount}}"],
            ["Processing fees", "-{{fees}}"],
            ["Refunds", "-{{refunds}}"],
          ],
          total: { label: "Net payout", value: "{{net_amount}}" },
        },
        {
          type: "panel",
          rows: [
            { label: "To", value: "{{bank_name}} •••• {{bank_last4}}" },
            { label: "Expected", value: "{{arrival_estimate}}" },
            { label: "Payout ID", value: "{{payout_id}}" },
          ],
        },
        { type: "button", label: "View payout", href: "{{payout_url}}" },
      ],
    },
  ],
};
