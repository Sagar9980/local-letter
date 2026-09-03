import type { TemplatePack } from "../types";

// Social and community product pack. Sky blue on a pale wash, centred
// wordmark — light in tone, since almost none of these are urgent.
export const communityPack: TemplatePack = {
  id: "community",
  name: "Community Pack",
  tagline: "Invite, notify, moderate",
  description:
    "Membership and social notifications — invites, mentions, digests and the moderation notices nobody enjoys writing from scratch.",
  audience: "Communities & social products",
  theme: {
    brand: "#0284C7",
    onBrand: "#FFFFFF",
    accent: "#7C3AED",
    bg: "#F0F7FC",
    card: "#FFFFFF",
    soft: "#F2F8FC",
    text: "#0C1A26",
    muted: "#5C7080",
    border: "#DDE9F1",
    fontFamily: "'Inter','Helvetica Neue',Helvetica,Arial,sans-serif",
    radius: 12,
    buttonRadius: 20,
    headerStyle: "centered",
  },
  footer: {
    lines: [
      "{{community_name}} · powered by {{company_name}}",
      "You're getting this because you're a member of {{community_name}}.",
    ],
    links: [
      { label: "Notification settings", href: "{{preferences_url}}" },
      { label: "Community guidelines", href: "{{guidelines_url}}" },
      { label: "Unsubscribe", href: "{{unsubscribe_url}}" },
    ],
  },
  templates: [
    {
      key: "member-welcome",
      name: "Member Welcome",
      description: "Onboards a new member with the norms and a first action.",
      category: "onboarding",
      subject: "Welcome to {{community_name}}",
      preheader: "Start by introducing yourself in {{intro_channel}}.",
      blocks: [
        { type: "heading", text: "Welcome to {{community_name}}", align: "center" },
        {
          type: "text",
          text: "You're one of {{member_count}} members. Here's how to get the most out of the first week.",
          align: "center",
        },
        {
          type: "steps",
          items: [
            { title: "Say hello", text: "Introduce yourself in {{intro_channel}} — people genuinely reply." },
            { title: "Pick your interests", text: "So your feed and digests stay relevant." },
            { title: "Read the guidelines", text: "Short, and it keeps this place worth being in." },
          ],
        },
        { type: "button", label: "Jump in", href: "{{community_url}}", align: "center" },
      ],
    },
    {
      key: "group-invitation",
      name: "Group Invitation",
      description: "Invite from a member to a private group or space.",
      category: "transactional",
      subject: "{{inviter_name}} invited you to {{group_name}}",
      preheader: "Join {{member_count}} members in {{group_name}}.",
      blocks: [
        { type: "heading", text: "You've been invited to {{group_name}}", align: "center" },
        {
          type: "text",
          text: "<strong>{{inviter_name}}</strong> thinks you'd fit right in.",
          align: "center",
        },
        {
          type: "panel",
          rows: [
            { label: "Group", value: "{{group_name}}" },
            { label: "Members", value: "{{member_count}}" },
            { label: "Privacy", value: "{{privacy}}" },
            { label: "About", value: "{{group_description}}" },
          ],
        },
        { type: "button", label: "Accept invitation", href: "{{invite_url}}", align: "center" },
      ],
    },
    {
      key: "new-mention",
      name: "You Were Mentioned",
      description: "Single-mention notification with inline context.",
      category: "transactional",
      subject: "{{author_name}} mentioned you in {{channel_name}}",
      preheader: "{{message_preview}}",
      blocks: [
        { type: "heading", text: "{{author_name}} mentioned you" },
        { type: "text", text: "In <strong>{{channel_name}}</strong> · {{posted_at}}", muted: true },
        { type: "quote", text: "{{message_preview}}", author: "{{author_name}}" },
        { type: "button", label: "Reply in the thread", href: "{{thread_url}}" },
        {
          type: "text",
          text: 'Too many of these? <a href="{{preferences_url}}" style="color:inherit;">Tune your notifications</a>.',
          muted: true,
        },
      ],
    },
    {
      key: "activity-digest",
      name: "Activity Digest",
      description: "Batched catch-up of what happened while they were away.",
      category: "lifecycle",
      subject: "{{unread_count}} things happened in {{community_name}}",
      preheader: "Your catch-up for {{period}}.",
      blocks: [
        { type: "heading", text: "While you were away" },
        {
          type: "metrics",
          items: [
            { label: "New posts", value: "{{post_count}}" },
            { label: "Replies to you", value: "{{reply_count}}" },
            { label: "New members", value: "{{new_member_count}}" },
          ],
        },
        { type: "heading", text: "Worth reading", size: "md" },
        {
          type: "articles",
          items: [
            {
              meta: "{{post_1_channel}}",
              title: "{{post_1_title}}",
              excerpt: "{{post_1_excerpt}}",
              href: "{{post_1_url}}",
            },
            {
              meta: "{{post_2_channel}}",
              title: "{{post_2_title}}",
              excerpt: "{{post_2_excerpt}}",
              href: "{{post_2_url}}",
            },
          ],
        },
        { type: "button", label: "Catch up", href: "{{community_url}}" },
      ],
    },
    {
      key: "new-follower",
      name: "New Follower",
      description: "Follow notification with a lightweight profile card.",
      category: "transactional",
      subject: "{{follower_name}} started following you",
      preheader: "You now have {{follower_count}} followers.",
      blocks: [
        { type: "heading", text: "{{follower_name}} is now following you", align: "center" },
        {
          type: "panel",
          rows: [
            { label: "Name", value: "{{follower_name}}" },
            { label: "Bio", value: "{{follower_bio}}" },
            { label: "Followers", value: "{{follower_follower_count}}" },
          ],
        },
        { type: "button", label: "View their profile", href: "{{profile_url}}", align: "center" },
      ],
    },
    {
      key: "moderation-notice",
      name: "Moderation Notice",
      description: "Content removal notice citing the rule and appeal route.",
      category: "operational",
      subject: "Your post in {{channel_name}} was removed",
      preheader: "Here's which guideline it broke and how to appeal.",
      blocks: [
        { type: "heading", text: "A post of yours was removed" },
        {
          type: "text",
          text: "Our moderators removed your post in <strong>{{channel_name}}</strong> on {{removed_at}}.",
        },
        {
          type: "panel",
          rows: [
            { label: "Guideline", value: "{{guideline_name}}" },
            { label: "Moderator note", value: "{{moderator_note}}" },
            { label: "Account status", value: "{{account_status}}" },
          ],
        },
        {
          type: "text",
          text: "This is a note, not a strike — your account is in good standing.",
        },
        { type: "button", label: "Appeal this decision", href: "{{appeal_url}}", variant: "outline" },
      ],
    },
    {
      key: "event-invite",
      name: "Community Event",
      description: "Invitation to a community call or meetup.",
      category: "marketing",
      subject: "{{event_name}} — {{event_date}}",
      preheader: "{{event_summary}}",
      blocks: [
        { type: "heading", text: "{{event_name}}", align: "center" },
        { type: "text", text: "{{event_summary}}", align: "center" },
        {
          type: "panel",
          rows: [
            { label: "When", value: "{{event_date}} at {{event_time}} {{timezone}}" },
            { label: "Where", value: "{{event_location}}" },
            { label: "Hosted by", value: "{{host_name}}" },
            { label: "Going", value: "{{attendee_count}} members" },
          ],
        },
        { type: "button", label: "Save your spot", href: "{{rsvp_url}}", align: "center" },
      ],
    },
    {
      key: "milestone-reached",
      name: "Milestone Reached",
      description: "Celebrates a member streak, anniversary or badge.",
      category: "lifecycle",
      subject: "You hit {{milestone_name}} 🎉",
      preheader: "{{milestone_detail}}",
      blocks: [
        { type: "heading", text: "{{milestone_name}}", align: "center" },
        { type: "text", text: "{{milestone_detail}}", align: "center" },
        {
          type: "metrics",
          items: [
            { label: "Posts", value: "{{post_count}}" },
            { label: "Helpful replies", value: "{{helpful_count}}" },
            { label: "Member since", value: "{{joined_date}}" },
          ],
        },
        { type: "button", label: "See your profile", href: "{{profile_url}}", align: "center" },
      ],
    },
  ],
};
