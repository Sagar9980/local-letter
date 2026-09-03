import type { TemplatePack } from "../types";

// Travel and hospitality. Sand paper, deep cyan, centred wordmark — closer to
// a boarding pass than an app notification.
export const travelPack: TemplatePack = {
  id: "travel",
  name: "Travel Pack",
  tagline: "Book, board, check out",
  description:
    "Booking and stay emails for travel, hotels and rentals — confirmations, itineraries, check-in details and changes of plan.",
  audience: "Travel, hotels & rentals",
  theme: {
    brand: "#0E7490",
    onBrand: "#FFFFFF",
    accent: "#C2761B",
    bg: "#FAF6EF",
    card: "#FFFFFF",
    soft: "#F7F3EB",
    text: "#1B2A2E",
    muted: "#6B7A80",
    border: "#E8E0D3",
    fontFamily: "'Inter','Helvetica Neue',Helvetica,Arial,sans-serif",
    radius: 14,
    buttonRadius: 8,
    headerStyle: "centered",
    uppercaseWordmark: true,
  },
  footer: {
    lines: [
      "{{company_name}} · {{company_address}}",
      "Booking reference {{booking_reference}} · keep this email for your records.",
    ],
    links: [
      { label: "Manage booking", href: "{{booking_url}}" },
      { label: "Help", href: "{{help_url}}" },
    ],
  },
  templates: [
    {
      key: "booking-confirmation",
      name: "Booking Confirmation",
      description: "The keeper email — reference, dates, price, cancellation terms.",
      category: "transactional",
      subject: "Booking confirmed — {{destination_name}}",
      preheader: "{{check_in_date}} to {{check_out_date}} · reference {{booking_reference}}.",
      blocks: [
        { type: "heading", text: "You're booked", align: "center" },
        { type: "text", text: "{{destination_name}}", align: "center", muted: true },
        {
          type: "image",
          src: "{{property_image_url}}",
          alt: "{{destination_name}}",
          radius: true,
        },
        {
          type: "panel",
          title: "Your booking",
          rows: [
            { label: "Reference", value: "{{booking_reference}}" },
            { label: "Check in", value: "{{check_in_date}} from {{check_in_time}}" },
            { label: "Check out", value: "{{check_out_date}} by {{check_out_time}}" },
            { label: "Guests", value: "{{guest_count}}" },
            { label: "Room", value: "{{room_type}}" },
          ],
        },
        {
          type: "table",
          columns: ["Charge", "Amount"],
          rows: [
            ["{{nights}} nights", "{{room_total}}"],
            ["Taxes and fees", "{{taxes}}"],
          ],
          total: { label: "Total", value: "{{booking_total}}" },
        },
        { type: "button", label: "Manage your booking", href: "{{booking_url}}", align: "center" },
        {
          type: "text",
          text: "Free cancellation until {{free_cancellation_until}}.",
          align: "center",
          muted: true,
        },
      ],
    },
    {
      key: "itinerary",
      name: "Itinerary",
      description: "Day-by-day plan sent shortly before departure.",
      category: "transactional",
      subject: "Your itinerary for {{destination_name}}",
      preheader: "Everything for {{trip_dates}} in one place.",
      blocks: [
        { type: "heading", text: "Your trip to {{destination_name}}", align: "center" },
        { type: "text", text: "{{trip_dates}}", align: "center", muted: true },
        {
          type: "image",
          src: "{{destination_image_url}}",
          alt: "{{destination_name}}",
          radius: true,
        },
        { type: "divider" },
        {
          type: "steps",
          items: [
            { title: "{{day_1_title}}", text: "{{day_1_detail}}" },
            { title: "{{day_2_title}}", text: "{{day_2_detail}}" },
            { title: "{{day_3_title}}", text: "{{day_3_detail}}" },
          ],
        },
        {
          type: "panel",
          title: "Good to have",
          rows: [
            { label: "Booking reference", value: "{{booking_reference}}" },
            { label: "Local contact", value: "{{local_phone}}" },
            { label: "Address", value: "{{property_address}}" },
          ],
        },
        { type: "button", label: "Open full itinerary", href: "{{itinerary_url}}", align: "center" },
      ],
    },
    {
      key: "check-in-reminder",
      name: "Check-in Reminder",
      description: "Arrival-day instructions with access details.",
      category: "operational",
      subject: "Checking in tomorrow — here's how",
      preheader: "Access details for {{property_name}}.",
      blocks: [
        { type: "heading", text: "See you tomorrow", align: "center" },
        { type: "text", text: "Everything you need to get in at {{property_name}}." },
        {
          type: "panel",
          rows: [
            { label: "Check in from", value: "{{check_in_time}}" },
            { label: "Address", value: "{{property_address}}" },
            { label: "Access", value: "{{access_method}}" },
            { label: "Host", value: "{{host_name}} · {{host_phone}}" },
          ],
        },
        { type: "code", value: "{{door_code}}", caption: "Door code — active from {{check_in_time}}" },
        { type: "button", label: "Get directions", href: "{{directions_url}}", align: "center" },
      ],
    },
    {
      key: "booking-changed",
      name: "Booking Changed",
      description: "Amendment notice, before and after.",
      category: "operational",
      subject: "Your booking has been updated",
      preheader: "Reference {{booking_reference}} — see what changed.",
      blocks: [
        { type: "heading", text: "Your booking has changed" },
        { type: "text", text: "Booking <strong>{{booking_reference}}</strong> has been updated." },
        {
          type: "panel",
          title: "Previously",
          rows: [
            { label: "Dates", value: "{{old_dates}}" },
            { label: "Room", value: "{{old_room}}" },
            { label: "Total", value: "{{old_total}}" },
          ],
        },
        {
          type: "panel",
          title: "Now",
          rows: [
            { label: "Dates", value: "{{new_dates}}" },
            { label: "Room", value: "{{new_room}}" },
            { label: "Total", value: "{{new_total}}" },
          ],
        },
        { type: "callout", tone: "info", text: "{{balance_note}}" },
        { type: "button", label: "View booking", href: "{{booking_url}}" },
      ],
    },
    {
      key: "booking-cancelled",
      name: "Booking Cancelled",
      description: "Cancellation with the refund breakdown.",
      category: "transactional",
      subject: "Booking {{booking_reference}} cancelled",
      preheader: "Refund of {{refund_amount}} on its way.",
      blocks: [
        { type: "heading", text: "Your booking is cancelled" },
        {
          type: "text",
          text: "We've cancelled your stay at {{property_name}} for {{trip_dates}}.",
        },
        {
          type: "table",
          columns: ["Line", "Amount"],
          rows: [
            ["Original total", "{{booking_total}}"],
            ["Cancellation fee", "-{{cancellation_fee}}"],
          ],
          total: { label: "Refund", value: "{{refund_amount}}" },
        },
        {
          type: "text",
          text: "Refunds reach your original payment method within {{refund_eta}}.",
          muted: true,
        },
        { type: "button", label: "Find another stay", href: "{{search_url}}", variant: "outline" },
      ],
    },
    {
      key: "post-stay-review",
      name: "Post-stay Review",
      description: "Feedback request sent after check-out.",
      category: "lifecycle",
      subject: "How was {{property_name}}?",
      preheader: "Two minutes of feedback helps the next traveller.",
      blocks: [
        { type: "heading", text: "How was your stay?", align: "center" },
        {
          type: "text",
          text: "You checked out of {{property_name}} on {{check_out_date}}. {{host_name}} would love to know how it went.",
          align: "center",
        },
        { type: "button", label: "Leave a review", href: "{{review_url}}", align: "center" },
        { type: "divider" },
        {
          type: "text",
          text: 'Something went wrong during your stay? <a href="{{support_url}}" style="color:inherit;">Tell us privately</a> instead.',
          align: "center",
          muted: true,
        },
      ],
    },
    {
      key: "loyalty-points",
      name: "Loyalty Points",
      description: "Points earned and how close the next tier is.",
      category: "lifecycle",
      subject: "You earned {{points_earned}} points",
      preheader: "{{points_to_next_tier}} points from {{next_tier}}.",
      blocks: [
        { type: "heading", text: "{{points_earned}} points added", align: "center" },
        { type: "text", text: "From your stay at {{property_name}}.", align: "center" },
        {
          type: "metrics",
          items: [
            { label: "Balance", value: "{{points_balance}}" },
            { label: "Tier", value: "{{current_tier}}" },
            { label: "To {{next_tier}}", value: "{{points_to_next_tier}}" },
          ],
        },
        { type: "button", label: "Spend your points", href: "{{rewards_url}}", align: "center" },
      ],
    },
    {
      key: "travel-disruption",
      name: "Travel Disruption",
      description: "Urgent change of plan with rebooking options.",
      category: "operational",
      subject: "Important: change to your {{trip_dates}} trip",
      preheader: "{{disruption_summary}}",
      blocks: [
        { type: "heading", text: "A change to your trip" },
        {
          type: "callout",
          tone: "danger",
          title: "{{disruption_type}}",
          text: "{{disruption_summary}}",
        },
        {
          type: "panel",
          rows: [
            { label: "Booking", value: "{{booking_reference}}" },
            { label: "Affected", value: "{{affected_segment}}" },
            { label: "Reported", value: "{{reported_at}}" },
          ],
        },
        { type: "heading", text: "Your options", size: "md" },
        { type: "list", items: ["{{option_1}}", "{{option_2}}", "{{option_3}}"], ordered: true },
        { type: "button", label: "Choose an option", href: "{{rebooking_url}}" },
        {
          type: "text",
          text: "Our team is on {{support_phone}} around the clock while this is ongoing.",
          muted: true,
        },
      ],
    },
  ],
};
