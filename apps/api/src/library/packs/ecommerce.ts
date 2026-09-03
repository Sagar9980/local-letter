import type { TemplatePack } from "../types";

// Retail order lifecycle. Warm off-white paper, near-black brand bar and an
// amber accent — reads like a printed order slip rather than an app email.
export const ecommercePack: TemplatePack = {
  id: "ecommerce",
  name: "E-commerce Pack",
  tagline: "Cart to doorstep",
  description:
    "Order, shipping and post-purchase emails for an online store, with line-item tables and tracking panels ready to wire up.",
  audience: "Online stores & retail",
  theme: {
    brand: "#111827",
    onBrand: "#FFFFFF",
    accent: "#D97706",
    bg: "#FAF9F7",
    card: "#FFFFFF",
    soft: "#F7F5F2",
    text: "#18181B",
    muted: "#71717A",
    border: "#E7E3DC",
    fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
    radius: 6,
    buttonRadius: 4,
    headerStyle: "bar",
  },
  footer: {
    lines: [
      "{{company_name}} · {{company_address}}",
      "Questions about your order? Reply to this email or contact {{support_email}}.",
    ],
    links: [
      { label: "Track order", href: "{{order_status_url}}" },
      { label: "Returns", href: "{{returns_url}}" },
      { label: "Unsubscribe", href: "{{unsubscribe_url}}" },
    ],
  },
  templates: [
    {
      key: "order-confirmation",
      name: "Order Confirmation",
      description: "Itemised confirmation sent the moment an order is placed.",
      category: "transactional",
      subject: "Order {{order_number}} confirmed",
      preheader: "Thanks {{first_name}} — we're getting your order ready.",
      blocks: [
        { type: "heading", text: "Thanks for your order" },
        {
          type: "text",
          text: "We've received order <strong>{{order_number}}</strong> and we're packing it now. You'll get tracking details as soon as it ships.",
        },
        {
          type: "table",
          columns: ["Item", "Qty", "Price"],
          rows: [
            ["{{item_1_name}}", "{{item_1_qty}}", "{{item_1_price}}"],
            ["{{item_2_name}}", "{{item_2_qty}}", "{{item_2_price}}"],
          ],
          total: { label: "Total", value: "{{order_total}}" },
        },
        {
          type: "panel",
          title: "Delivery",
          rows: [
            { label: "Ship to", value: "{{shipping_name}}" },
            { label: "Address", value: "{{shipping_address}}" },
            { label: "Method", value: "{{shipping_method}}" },
            { label: "Estimated arrival", value: "{{estimated_delivery}}" },
          ],
        },
        { type: "button", label: "View your order", href: "{{order_status_url}}" },
      ],
    },
    {
      key: "order-shipped",
      name: "Order Shipped",
      description: "Dispatch notice with carrier, tracking number and ETA.",
      category: "transactional",
      subject: "Your order is on its way",
      preheader: "Tracking number {{tracking_number}} · arriving {{estimated_delivery}}.",
      blocks: [
        { type: "heading", text: "Order {{order_number}} has shipped" },
        { type: "text", text: "Your parcel left our warehouse and is heading to {{shipping_city}}." },
        {
          type: "panel",
          rows: [
            { label: "Carrier", value: "{{carrier}}" },
            { label: "Tracking number", value: "{{tracking_number}}" },
            { label: "Estimated arrival", value: "{{estimated_delivery}}" },
            { label: "Items", value: "{{item_count}}" },
          ],
        },
        { type: "button", label: "Track your parcel", href: "{{tracking_url}}" },
        {
          type: "text",
          text: "Tracking can take a few hours to show its first scan.",
          muted: true,
        },
      ],
    },
    {
      key: "out-for-delivery",
      name: "Out for Delivery",
      description: "Same-day heads-up so someone is home for the parcel.",
      category: "transactional",
      subject: "Arriving today: order {{order_number}}",
      preheader: "Your parcel is out for delivery.",
      blocks: [
        { type: "heading", text: "Out for delivery" },
        {
          type: "text",
          text: "Order <strong>{{order_number}}</strong> is on the van and should arrive today between {{delivery_window}}.",
        },
        {
          type: "panel",
          rows: [
            { label: "Delivering to", value: "{{shipping_address}}" },
            { label: "Carrier", value: "{{carrier}}" },
            { label: "Tracking", value: "{{tracking_number}}" },
          ],
        },
        { type: "button", label: "Follow live tracking", href: "{{tracking_url}}" },
      ],
    },
    {
      key: "order-delivered",
      name: "Delivered",
      description: "Delivery confirmation that doubles as a returns reminder.",
      category: "transactional",
      subject: "Delivered: order {{order_number}}",
      preheader: "Your parcel arrived at {{delivered_at}}.",
      blocks: [
        { type: "heading", text: "Your order has arrived" },
        {
          type: "text",
          text: "{{carrier}} marked order <strong>{{order_number}}</strong> as delivered at {{delivered_at}}.",
        },
        {
          type: "callout",
          tone: "success",
          text: "Not what you expected? You have {{return_window}} to start a return, no questions asked.",
        },
        { type: "button", label: "View order", href: "{{order_status_url}}" },
        {
          type: "text",
          text: 'Parcel missing? <a href="{{support_url}}" style="color:inherit;">Let us know</a> and we\'ll chase the carrier.',
          muted: true,
        },
      ],
    },
    {
      key: "order-cancelled",
      name: "Order Cancelled",
      description: "Cancellation notice with the refund timeline.",
      category: "transactional",
      subject: "Order {{order_number}} cancelled",
      preheader: "Your refund of {{refund_amount}} is on the way.",
      blocks: [
        { type: "heading", text: "Order {{order_number}} was cancelled" },
        { type: "text", text: "As requested, we've cancelled your order. Nothing will ship." },
        {
          type: "panel",
          rows: [
            { label: "Cancelled on", value: "{{cancelled_at}}" },
            { label: "Refund amount", value: "{{refund_amount}}" },
            { label: "Refunded to", value: "{{payment_method}}" },
            { label: "Expect it by", value: "{{refund_eta}}" },
          ],
        },
        { type: "button", label: "Shop again", href: "{{shop_url}}", variant: "outline" },
      ],
    },
    {
      key: "refund-issued",
      name: "Refund Issued",
      description: "Confirms money sent back, with the bank-timing caveat.",
      category: "transactional",
      subject: "Your refund of {{refund_amount}} is on its way",
      preheader: "Refund processed for order {{order_number}}.",
      blocks: [
        { type: "heading", text: "Refund processed" },
        {
          type: "text",
          text: "We've refunded <strong>{{refund_amount}}</strong> for order {{order_number}} back to your original payment method.",
        },
        {
          type: "table",
          columns: ["Item", "Amount"],
          rows: [
            ["{{refund_item_1}}", "{{refund_item_1_amount}}"],
            ["Shipping", "{{refund_shipping}}"],
          ],
          total: { label: "Total refunded", value: "{{refund_amount}}" },
        },
        {
          type: "text",
          text: "Most banks show the refund within {{refund_eta}}, though some take a full billing cycle.",
          muted: true,
        },
      ],
    },
    {
      key: "abandoned-cart",
      name: "Abandoned Cart",
      description: "Recovery nudge with the cart contents and an incentive slot.",
      category: "marketing",
      subject: "You left something behind",
      preheader: "Your cart is saved — but not forever.",
      blocks: [
        { type: "heading", text: "Still thinking it over?" },
        { type: "text", text: "We saved your cart, {{first_name}}. Here's what's in it:" },
        {
          type: "table",
          columns: ["Item", "Qty", "Price"],
          rows: [
            ["{{item_1_name}}", "{{item_1_qty}}", "{{item_1_price}}"],
            ["{{item_2_name}}", "{{item_2_qty}}", "{{item_2_price}}"],
          ],
          total: { label: "Cart total", value: "{{cart_total}}" },
        },
        {
          type: "callout",
          tone: "warning",
          text: "Use code <strong>{{discount_code}}</strong> for {{discount_value}} off — expires {{discount_expiry}}.",
        },
        { type: "button", label: "Complete your order", href: "{{cart_url}}" },
      ],
    },
    {
      key: "back-in-stock",
      name: "Back in Stock",
      description: "Restock alert for a product the customer watched.",
      category: "marketing",
      subject: "{{product_name}} is back",
      preheader: "The item you were waiting for is available again.",
      blocks: [
        { type: "heading", text: "{{product_name}} is back in stock" },
        {
          type: "text",
          text: "You asked us to tell you when this returned — it's available again, but stock is limited.",
        },
        {
          type: "panel",
          rows: [
            { label: "Product", value: "{{product_name}}" },
            { label: "Variant", value: "{{product_variant}}" },
            { label: "Price", value: "{{product_price}}" },
          ],
        },
        { type: "button", label: "Buy it now", href: "{{product_url}}" },
        {
          type: "text",
          text: 'No longer interested? <a href="{{unsubscribe_url}}" style="color:inherit;">Stop stock alerts</a>.',
          muted: true,
        },
      ],
    },
    {
      key: "review-request",
      name: "Review Request",
      description: "Post-delivery ask, timed for after the customer has used it.",
      category: "lifecycle",
      subject: "How's your {{product_name}}?",
      preheader: "A quick review helps other shoppers decide.",
      blocks: [
        { type: "heading", text: "How did we do?" },
        {
          type: "text",
          text: "You received {{product_name}} on {{delivered_at}}. If you have a minute, other shoppers would love to hear what you think.",
        },
        { type: "button", label: "Leave a review", href: "{{review_url}}" },
        { type: "divider" },
        {
          type: "text",
          text: 'Something wrong with your order? <a href="{{support_url}}" style="color:inherit;">Tell us instead</a> — we\'ll put it right.',
          muted: true,
        },
      ],
    },
    {
      key: "welcome-discount",
      name: "Welcome Discount",
      description: "First-purchase incentive for a new subscriber.",
      category: "marketing",
      subject: "Here's {{discount_value}} off your first order",
      preheader: "Welcome to {{company_name}} — your code is inside.",
      blocks: [
        { type: "heading", text: "Welcome — here's {{discount_value}} off" },
        {
          type: "text",
          text: "Thanks for joining {{company_name}}. Use this code at checkout on your first order.",
        },
        { type: "code", value: "{{discount_code}}", caption: "Valid until {{discount_expiry}}" },
        { type: "button", label: "Start shopping", href: "{{shop_url}}" },
      ],
    },
  ],
};
