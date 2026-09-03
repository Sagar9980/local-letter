// Shape of the built-in template library. A pack is a themed family of email
// templates — every template in a pack renders through the same `Theme`, so a
// project that installs a pack gets a visually consistent set out of the box.
//
// Templates are authored as structured `Block[]` rather than raw HTML: the
// renderer (see ./render.ts) turns blocks into the table-based, inline-styled
// markup email clients need, and applies the pack theme while doing it. That
// keeps a template definition short enough to read at a glance and makes a
// theme tweak land across every template at once.

export type Align = "left" | "center";

export type CalloutTone = "info" | "success" | "warning" | "danger";

export type Block =
  /** Section title. `lg` is the one-per-email headline, `md` a sub-section. */
  | { type: "heading"; text: string; size?: "lg" | "md"; align?: Align }
  /** Paragraph. `text` may contain inline HTML (<strong>, <a>, <br>). */
  | { type: "text"; text: string; align?: Align; muted?: boolean }
  | { type: "button"; label: string; href: string; align?: Align; variant?: "solid" | "outline" }
  /** Big monospaced value — verification codes, PINs, tracking numbers. */
  | { type: "code"; value: string; caption?: string }
  /** Bordered label/value summary — order details, invoice meta, appointments. */
  | { type: "panel"; title?: string; rows: { label: string; value: string }[] }
  /** Line items with an optional emphasised total row. */
  | {
      type: "table";
      columns: string[];
      rows: string[][];
      total?: { label: string; value: string };
    }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; text: string; tone?: CalloutTone; title?: string }
  /** Numbered "what happens next" sequence. */
  | { type: "steps"; items: { title: string; text: string }[] }
  /** Headline figures for digests and reports. */
  | { type: "metrics"; items: { label: string; value: string }[] }
  /** Linked story list for newsletters and digests. */
  | { type: "articles"; items: { title: string; excerpt: string; href: string; meta?: string }[] }
  | { type: "quote"; text: string; author?: string }
  /** `src`/`alt` are almost always `{{variables}}` — real assets live outside the template. */
  | {
      type: "image";
      src: string;
      alt: string;
      /** Fraction of the card width, 0-1. Defaults to full width. */
      widthRatio?: number;
      align?: Align;
      radius?: boolean;
      caption?: string;
    }
  | { type: "divider" }
  | { type: "spacer"; size?: number };

export type TemplateCategory =
  | "onboarding"
  | "security"
  | "billing"
  | "transactional"
  | "lifecycle"
  | "marketing"
  | "operational";

export type LibraryTemplate = {
  /** Becomes the project template key on import — `^[a-z0-9-]+$`. */
  key: string;
  name: string;
  description: string;
  category: TemplateCategory;
  subject: string;
  /** Inbox preview text; rendered into a hidden preheader span. */
  preheader: string;
  blocks: Block[];
};

export type Theme = {
  /** Primary brand colour — buttons, links, header bar. */
  brand: string;
  /** Text colour used on top of `brand` (buttons, header bar). */
  onBrand: string;
  /** Secondary highlight, used sparingly (metrics, article meta). */
  accent: string;
  /** Page background, outside the card. */
  bg: string;
  /** Card background. */
  card: string;
  /** Subtle fill for panels, code blocks and table headers. */
  soft: string;
  text: string;
  muted: string;
  border: string;
  fontFamily: string;
  /** Falls back to `fontFamily` when a pack has no display face. */
  headingFamily?: string;
  /** Card and panel corner radius, px. */
  radius: number;
  buttonRadius: number;
  headerStyle: "bar" | "minimal" | "centered";
  /** Wordmark letter-spacing style for the `centered` header. */
  uppercaseWordmark?: boolean;
};

export type PackFooter = {
  /** Muted lines under the card — company name, address, why-you-got-this. */
  lines: string[];
  links: { label: string; href: string }[];
};

export type TemplatePack = {
  /** Stable id used in URLs and import payloads. */
  id: string;
  name: string;
  tagline: string;
  description: string;
  /** Who the pack is for, shown as a chip in the library browser. */
  audience: string;
  theme: Theme;
  footer: PackFooter;
  templates: LibraryTemplate[];
};
