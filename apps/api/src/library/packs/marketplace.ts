import type { TemplatePack } from "../types";

// Two-sided marketplace pack — the seller/provider half of the relationship.
// Orange on warm sand, so it reads distinctly from the buyer-facing store pack.
export const marketplacePack: TemplatePack = {
  id: "marketplace",
  name: "Marketplace Pack",
  tagline: "Bookings, payouts, disputes",
  description:
    "Seller- and provider-side emails for a two-sided marketplace — new orders, bookings, payouts, listings and dispute handling.",
  audience: "Marketplaces & gig platforms",
  theme: {
    brand: "#EA580C",
    onBrand: "#FFFFFF",
    accent: "#0F766E",
    bg: "#FDF8F3",
    card: "#FFFFFF",
    soft: "#FDF6EF",
    text: "#1C1917",
    muted: "#78716C",
    border: "#EDE3D8",
    fontFamily: "'Inter','Helvetica Neue',Helvetica,Arial,sans-serif",
    radius: 10,
    buttonRadius: 8,
    headerStyle: "minimal",
  },
  footer: {
    lines: [
      "{{company_name}} · {{company_address}}",
      "You're getting this because you sell on {{company_name}}.",
    ],
    links: [
      { label: "Seller dashboard", href: "{{dashboard_url}}" },
      { label: "Seller help", href: "{{help_url}}" },
    ],
  },
  templates: [
    {
      key: "new-order",
      name: "New Order",
      description: "Seller alert with the accept deadline front and centre.",
      category: "transactional",
      subject: "New order from {{buyer_name}} — {{order_total}}",
      preheader: "Accept within {{accept_window}} to keep your response rate.",
      blocks: [
        { type: "heading", text: "You've got an order" },
        {
          type: "text",
          text: "<strong>{{buyer_name}}</strong> just placed order {{order_number}}.",
        },
        {
          type: "table",
          columns: ["Item", "Qty", "Amount"],
          rows: [["{{item_name}}", "{{item_qty}}", "{{item_amount}}"]],
          total: { label: "Order total", value: "{{order_total}}" },
        },
        {
          type: "callout",
          tone: "warning",
          text: "Accept within <strong>{{accept_window}}</strong> — unaccepted orders are released to other sellers and affect your response rate.",
        },
        { type: "button", label: "Accept the order", href: "{{order_url}}" },
      ],
    },
    {
      key: "booking-confirmed",
      name: "Booking Confirmed",
      description: "Confirms a scheduled service for both sides.",
      category: "transactional",
      subject: "Booking confirmed: {{service_name}} on {{booking_date}}",
      preheader: "{{buyer_name}} booked you for {{booking_time}}.",
      blocks: [
        { type: "heading", text: "Booking confirmed" },
        {
          type: "panel",
          rows: [
            { label: "Service", value: "{{service_name}}" },
            { label: "Client", value: "{{buyer_name}}" },
            { label: "When", value: "{{booking_date}} at {{booking_time}}" },
            { label: "Duration", value: "{{duration}}" },
            { label: "Location", value: "{{location}}" },
            { label: "You'll earn", value: "{{seller_earnings}}" },
          ],
        },
        { type: "button", label: "View booking", href: "{{booking_url}}" },
        {
          type: "text",
          text: "Cancelling less than {{cancellation_window}} beforehand affects your reliability score.",
          muted: true,
        },
      ],
    },
    {
      key: "payout-sent",
      name: "Payout Sent",
      description: "Settlement summary with the platform fee shown plainly.",
      category: "billing",
      subject: "Your {{payout_amount}} payout is on its way",
      preheader: "Covering {{period_start}} – {{period_end}}.",
      blocks: [
        { type: "heading", text: "{{payout_amount}} sent" },
        { type: "text", text: "Your earnings for {{period_start}} – {{period_end}} have been released." },
        {
          type: "table",
          columns: ["Line", "Amount"],
          rows: [
            ["{{order_count}} orders", "{{gross_earnings}}"],
            ["Platform fee ({{fee_rate}})", "-{{platform_fee}}"],
            ["Refunds", "-{{refunds}}"],
          ],
          total: { label: "Net payout", value: "{{payout_amount}}" },
        },
        {
          type: "panel",
          rows: [
            { label: "To", value: "{{bank_name}} •••• {{bank_last4}}" },
            { label: "Arrives by", value: "{{arrival_estimate}}" },
          ],
        },
        { type: "button", label: "See earnings breakdown", href: "{{earnings_url}}" },
      ],
    },
    {
      key: "listing-approved",
      name: "Listing Approved",
      description: "Approval notice plus ranking tips.",
      category: "operational",
      subject: "{{listing_name}} is live",
      preheader: "Your listing passed review and is now searchable.",
      blocks: [
        { type: "heading", text: "{{listing_name}} is live" },
        { type: "text", text: "Your listing passed review and is now visible to buyers." },
        {
          type: "panel",
          rows: [
            { label: "Listing", value: "{{listing_name}}" },
            { label: "Category", value: "{{category}}" },
            { label: "Price", value: "{{price}}" },
            { label: "Live since", value: "{{approved_at}}" },
          ],
        },
        { type: "heading", text: "Get found faster", size: "md" },
        { type: "list", items: ["{{tip_1}}", "{{tip_2}}", "{{tip_3}}"] },
        { type: "button", label: "View your listing", href: "{{listing_url}}" },
      ],
    },
    {
      key: "listing-rejected",
      name: "Listing Needs Changes",
      description: "Rejection with the specific policy and a resubmit path.",
      category: "operational",
      subject: "{{listing_name}} needs a change before it goes live",
      preheader: "One thing to fix, then resubmit.",
      blocks: [
        { type: "heading", text: "Almost there" },
        {
          type: "text",
          text: "We couldn't approve <strong>{{listing_name}}</strong> as submitted.",
        },
        {
          type: "callout",
          tone: "warning",
          title: "What needs changing",
          text: "{{rejection_reason}}",
        },
        {
          type: "panel",
          rows: [
            { label: "Policy", value: "{{policy_name}}" },
            { label: "Reviewed", value: "{{reviewed_at}}" },
          ],
        },
        { type: "button", label: "Edit and resubmit", href: "{{listing_url}}" },
        {
          type: "text",
          text: 'Think we got this wrong? <a href="{{appeal_url}}" style="color:inherit;">Appeal the decision</a>.',
          muted: true,
        },
      ],
    },
    {
      key: "review-received",
      name: "Review Received",
      description: "New buyer review with a reply prompt.",
      category: "lifecycle",
      subject: "{{buyer_name}} left you a {{rating}}-star review",
      preheader: "Your rating is now {{average_rating}} across {{review_count}} reviews.",
      blocks: [
        { type: "heading", text: "New review from {{buyer_name}}" },
        { type: "quote", text: "{{review_text}}", author: "{{buyer_name}} · {{rating}} stars" },
        {
          type: "metrics",
          items: [
            { label: "Your rating", value: "{{average_rating}}" },
            { label: "Reviews", value: "{{review_count}}" },
            { label: "Response rate", value: "{{response_rate}}" },
          ],
        },
        { type: "button", label: "Reply to the review", href: "{{review_url}}" },
        {
          type: "text",
          text: "Sellers who reply to reviews get around a third more repeat bookings.",
          muted: true,
        },
      ],
    },
    {
      key: "dispute-opened",
      name: "Dispute Opened",
      description: "Dispute notice with the response deadline and hold amount.",
      category: "operational",
      subject: "A dispute was opened on order {{order_number}}",
      preheader: "Respond by {{respond_by}} — {{disputed_amount}} is on hold.",
      blocks: [
        { type: "heading", text: "Dispute on order {{order_number}}" },
        {
          type: "text",
          text: "{{buyer_name}} has opened a dispute. Your side of the story matters here, so please respond with any evidence you have.",
        },
        {
          type: "panel",
          rows: [
            { label: "Order", value: "{{order_number}}" },
            { label: "Reason", value: "{{dispute_reason}}" },
            { label: "Amount on hold", value: "{{disputed_amount}}" },
            { label: "Respond by", value: "{{respond_by}}" },
          ],
        },
        {
          type: "callout",
          tone: "danger",
          text: "If we don't hear from you by {{respond_by}}, the dispute is resolved in the buyer's favour automatically.",
        },
        { type: "button", label: "Respond to the dispute", href: "{{dispute_url}}" },
      ],
    },
    {
      key: "weekly-seller-summary",
      name: "Weekly Seller Summary",
      description: "Performance digest with the metric that needs attention.",
      category: "lifecycle",
      subject: "Your week: {{order_count}} orders, {{gross_earnings}}",
      preheader: "{{week_range}} performance summary.",
      blocks: [
        { type: "heading", text: "Your week on {{company_name}}" },
        { type: "text", text: "{{week_range}}", muted: true },
        {
          type: "metrics",
          items: [
            { label: "Orders", value: "{{order_count}}" },
            { label: "Earnings", value: "{{gross_earnings}}" },
            { label: "Views", value: "{{listing_views}}" },
          ],
        },
        {
          type: "callout",
          tone: "info",
          title: "Worth a look",
          text: "{{insight}}",
        },
        { type: "button", label: "Open seller dashboard", href: "{{dashboard_url}}" },
      ],
    },
  ],
};
