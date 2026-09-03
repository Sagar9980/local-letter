import type { TemplatePack } from "../types";

// The one dark pack. Developer tools are the audience most likely to read
// email in a dark client, and mono headings read as native to the tooling.
export const devtoolsPack: TemplatePack = {
  id: "devtools",
  name: "Developer Platform Pack",
  tagline: "Dark theme, built for API products",
  description:
    "Operational email for API and infrastructure products — keys, quotas, deploys, incidents and security advisories, on a dark theme.",
  audience: "Developer tools & APIs",
  theme: {
    brand: "#3B82F6",
    onBrand: "#FFFFFF",
    accent: "#34D399",
    bg: "#010409",
    card: "#0D1117",
    soft: "#161B22",
    text: "#E6EDF3",
    muted: "#8B949E",
    border: "#26303B",
    fontFamily: "'Inter','Helvetica Neue',Helvetica,Arial,sans-serif",
    headingFamily: "'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace",
    radius: 8,
    buttonRadius: 6,
    headerStyle: "minimal",
  },
  footer: {
    lines: [
      "{{company_name}} · {{company_address}}",
      "Operational email for the {{project_name}} project. These are not marketing emails.",
    ],
    links: [
      { label: "Status page", href: "{{status_url}}" },
      { label: "Docs", href: "{{docs_url}}" },
      { label: "Notification settings", href: "{{preferences_url}}" },
    ],
  },
  templates: [
    {
      key: "api-key-created",
      name: "API Key Created",
      description: "Security notice whenever a new key is minted.",
      category: "security",
      subject: "A new API key was created",
      preheader: "{{key_name}} ({{key_prefix}}…) on {{project_name}}.",
      blocks: [
        { type: "heading", text: "New API key created" },
        {
          type: "text",
          text: "A new key was created on <strong>{{project_name}}</strong>. If this wasn't you, revoke it now.",
        },
        {
          type: "panel",
          rows: [
            { label: "Name", value: "{{key_name}}" },
            { label: "Prefix", value: "{{key_prefix}}…" },
            { label: "Scopes", value: "{{scopes}}" },
            { label: "Created by", value: "{{created_by}}" },
            { label: "Created at", value: "{{created_at}}" },
          ],
        },
        { type: "button", label: "Review API keys", href: "{{keys_url}}" },
        {
          type: "callout",
          tone: "warning",
          text: "The secret is shown only once, at creation. If it's been lost, revoke this key and create another.",
        },
      ],
    },
    {
      key: "usage-warning",
      name: "Usage Warning",
      description: "Approaching-quota alert with the reset date.",
      category: "operational",
      subject: "You've used {{usage_percent}} of your {{quota_name}}",
      preheader: "Quota resets {{reset_date}}.",
      blocks: [
        { type: "heading", text: "{{usage_percent}} of {{quota_name}} used" },
        {
          type: "text",
          text: "<strong>{{project_name}}</strong> has used {{used_amount}} of its {{quota_amount}} {{quota_name}} this period.",
        },
        {
          type: "metrics",
          items: [
            { label: "Used", value: "{{used_amount}}" },
            { label: "Remaining", value: "{{remaining_amount}}" },
            { label: "Resets", value: "{{reset_date}}" },
          ],
        },
        {
          type: "callout",
          tone: "warning",
          text: "At this rate you'll hit the limit around {{projected_exhaustion}}. Requests over the quota return <code>429</code>.",
        },
        { type: "button", label: "Review usage", href: "{{usage_url}}" },
      ],
    },
    {
      key: "quota-exceeded",
      name: "Quota Exceeded",
      description: "Hard-limit notice explaining exactly what is failing.",
      category: "operational",
      subject: "Quota exceeded on {{project_name}}",
      preheader: "Requests are being rejected with 429 until {{reset_date}}.",
      blocks: [
        { type: "heading", text: "Quota exceeded" },
        {
          type: "text",
          text: "<strong>{{project_name}}</strong> hit its {{quota_name}} limit of {{quota_amount}} at {{exceeded_at}}.",
        },
        {
          type: "callout",
          tone: "danger",
          title: "What's happening right now",
          text: "New requests return <code>429 Too Many Requests</code> until the quota resets on {{reset_date}}. Requests already in flight completed normally.",
        },
        { type: "heading", text: "Your options", size: "md" },
        {
          type: "list",
          items: [
            "Upgrade the plan — the new limit applies immediately",
            "Wait for the reset on {{reset_date}}",
            "Request a temporary limit increase from support",
          ],
        },
        { type: "button", label: "Increase your limit", href: "{{upgrade_url}}" },
      ],
    },
    {
      key: "deploy-succeeded",
      name: "Deploy Succeeded",
      description: "Green build notification with the commit and duration.",
      category: "operational",
      subject: "Deployed {{commit_sha}} to {{environment}}",
      preheader: "{{project_name}} · {{duration}}.",
      blocks: [
        { type: "heading", text: "Deploy succeeded" },
        {
          type: "panel",
          rows: [
            { label: "Project", value: "{{project_name}}" },
            { label: "Environment", value: "{{environment}}" },
            { label: "Commit", value: "{{commit_sha}} — {{commit_message}}" },
            { label: "Author", value: "{{commit_author}}" },
            { label: "Duration", value: "{{duration}}" },
          ],
        },
        { type: "button", label: "View deployment", href: "{{deployment_url}}" },
      ],
    },
    {
      key: "deploy-failed",
      name: "Deploy Failed",
      description: "Red build notification carrying the failing step.",
      category: "operational",
      subject: "Deploy failed: {{project_name}} → {{environment}}",
      preheader: "Failed at {{failed_step}}.",
      blocks: [
        { type: "heading", text: "Deploy failed" },
        {
          type: "callout",
          tone: "danger",
          title: "Failed at {{failed_step}}",
          text: "{{error_message}}",
        },
        {
          type: "panel",
          rows: [
            { label: "Project", value: "{{project_name}}" },
            { label: "Environment", value: "{{environment}}" },
            { label: "Commit", value: "{{commit_sha}} — {{commit_message}}" },
            { label: "Failed at", value: "{{failed_at}}" },
          ],
        },
        {
          type: "text",
          text: "{{environment}} is still running the previous release — nothing is down.",
        },
        { type: "button", label: "Open build logs", href: "{{logs_url}}" },
      ],
    },
    {
      key: "incident-notice",
      name: "Incident Notice",
      description: "Live incident update with impact and next update time.",
      category: "operational",
      subject: "[{{severity}}] {{incident_title}}",
      preheader: "{{impact_summary}} — next update in {{next_update}}.",
      blocks: [
        { type: "heading", text: "{{incident_title}}" },
        {
          type: "panel",
          rows: [
            { label: "Status", value: "{{status}}" },
            { label: "Severity", value: "{{severity}}" },
            { label: "Started", value: "{{started_at}}" },
            { label: "Affected", value: "{{affected_services}}" },
          ],
        },
        { type: "heading", text: "Impact", size: "md" },
        { type: "text", text: "{{impact_summary}}" },
        { type: "heading", text: "What we're doing", size: "md" },
        { type: "text", text: "{{current_action}}" },
        { type: "button", label: "Follow on the status page", href: "{{status_url}}" },
        {
          type: "text",
          text: "Next update in {{next_update}}, or sooner if the situation changes.",
          muted: true,
        },
      ],
    },
    {
      key: "security-advisory",
      name: "Security Advisory",
      description: "Vulnerability disclosure with affected versions and the fix.",
      category: "security",
      subject: "Security advisory {{advisory_id}} — action recommended",
      preheader: "Affects {{affected_versions}}. Patched in {{fixed_version}}.",
      blocks: [
        { type: "heading", text: "{{advisory_title}}" },
        {
          type: "callout",
          tone: "danger",
          title: "Severity: {{severity}}",
          text: "{{advisory_summary}}",
        },
        {
          type: "panel",
          rows: [
            { label: "Advisory", value: "{{advisory_id}}" },
            { label: "Affected versions", value: "{{affected_versions}}" },
            { label: "Patched in", value: "{{fixed_version}}" },
            { label: "Disclosed", value: "{{disclosed_at}}" },
          ],
        },
        { type: "heading", text: "What to do", size: "md" },
        {
          type: "steps",
          items: [
            { title: "Upgrade to {{fixed_version}}", text: "{{upgrade_command}}" },
            { title: "Rotate affected credentials", text: "{{rotation_guidance}}" },
            { title: "Check your logs", text: "{{detection_guidance}}" },
          ],
        },
        { type: "button", label: "Read the full advisory", href: "{{advisory_url}}" },
      ],
    },
    {
      key: "webhook-failing",
      name: "Webhook Failing",
      description: "Repeated delivery failure with the disable deadline.",
      category: "operational",
      subject: "Webhook {{endpoint_name}} is failing",
      preheader: "{{failure_count}} consecutive failures since {{first_failure_at}}.",
      blocks: [
        { type: "heading", text: "Your webhook is failing" },
        {
          type: "text",
          text: "We've had <strong>{{failure_count}}</strong> consecutive delivery failures to {{endpoint_url}}.",
        },
        {
          type: "panel",
          rows: [
            { label: "Endpoint", value: "{{endpoint_name}}" },
            { label: "URL", value: "{{endpoint_url}}" },
            { label: "Last response", value: "{{last_status_code}} — {{last_error}}" },
            { label: "First failure", value: "{{first_failure_at}}" },
            { label: "Events queued", value: "{{queued_count}}" },
          ],
        },
        {
          type: "callout",
          tone: "warning",
          text: "We'll keep retrying with backoff until {{disable_at}}, then disable the endpoint. Queued events are held for {{retention_period}}.",
        },
        { type: "button", label: "Inspect deliveries", href: "{{webhook_url}}" },
      ],
    },
  ],
};
