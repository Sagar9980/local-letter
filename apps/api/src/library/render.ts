// Turns a library template's `Block[]` into the HTML an email client can
// actually render: nested `<table>` layout, styles inlined on every element,
// and a fixed 600px card that collapses on narrow screens.
//
// The output is a `<body>` fragment — the same shape the GrapesJS editor saves
// and the render endpoint interpolates — so an imported template drops straight
// into `TemplateLocale.htmlBody` and opens in the editor unchanged.

import type { Align, Block, CalloutTone, LibraryTemplate, TemplatePack, Theme } from "./types";

const CARD_WIDTH = 600;
const GUTTER = 40;

/** Blends two hex colours; `ratio` is how much of `b` ends up in the result. */
function mix(a: string, b: string, ratio: number): string {
  const parse = (hex: string) => {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  };
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const channel = (x: number, y: number) =>
    Math.round(x + (y - x) * ratio)
      .toString(16)
      .padStart(2, "0");
  return `#${channel(r1, r2)}${channel(g1, g2)}${channel(b1, b2)}`;
}

const TONE_COLORS = {
  success: "#15803D",
  warning: "#B45309",
  danger: "#B91C1C",
} as const;

// `info` intentionally has no fixed colour — it picks up the pack's brand.
function toneColor(theme: Theme, tone: CalloutTone): string {
  return tone === "info" ? theme.brand : TONE_COLORS[tone];
}

function headingFont(theme: Theme): string {
  return theme.headingFamily ?? theme.fontFamily;
}

/** `<td>` wrapper used by every full-width block, so rows line up exactly. */
function row(inner: string, isLast: boolean): string {
  return `<tr><td style="padding:0 0 ${isLast ? 0 : 24}px 0;">${inner}</td></tr>`;
}

function renderBlock(block: Block, theme: Theme): string {
  const font = theme.fontFamily;
  const align = (a: Align | undefined) => a ?? "left";

  switch (block.type) {
    case "heading": {
      const isLarge = (block.size ?? "lg") === "lg";
      const tag = isLarge ? "h1" : "h2";
      return (
        `<${tag} class="ll-h" style="margin:0;font-family:${headingFont(theme)};` +
        `font-size:${isLarge ? 26 : 19}px;line-height:1.32;font-weight:700;` +
        `color:${theme.text};text-align:${align(block.align)};">${block.text}</${tag}>`
      );
    }

    case "text":
      return (
        `<p style="margin:0;font-family:${font};font-size:15px;line-height:1.65;` +
        `color:${block.muted ? theme.muted : theme.text};text-align:${align(block.align)};">${block.text}</p>`
      );

    case "button": {
      const outline = block.variant === "outline";
      const bg = outline ? theme.card : theme.brand;
      const fg = outline ? theme.brand : theme.onBrand;
      const border = outline ? `1px solid ${theme.brand}` : `1px solid ${theme.brand}`;
      return (
        `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="${align(block.align)}" style="margin:0 auto 0 ${align(block.align) === "center" ? "auto" : "0"};">` +
        `<tr><td style="background-color:${bg};border:${border};border-radius:${theme.buttonRadius}px;">` +
        `<a href="${block.href}" style="display:inline-block;padding:13px 28px;font-family:${font};` +
        `font-size:15px;font-weight:600;line-height:1.2;color:${fg};text-decoration:none;` +
        `border-radius:${theme.buttonRadius}px;">${block.label}</a>` +
        `</td></tr></table>`
      );
    }

    case "code":
      return (
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">` +
        `<tr><td align="center" style="background-color:${theme.soft};border:1px dashed ${theme.border};` +
        `border-radius:${theme.radius}px;padding:22px 16px;">` +
        `<div style="font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;` +
        `font-size:30px;font-weight:700;letter-spacing:7px;color:${theme.text};">${block.value}</div>` +
        (block.caption
          ? `<div style="margin-top:10px;font-family:${font};font-size:13px;color:${theme.muted};">${block.caption}</div>`
          : "") +
        `</td></tr></table>`
      );

    case "panel": {
      const title = block.title
        ? `<tr><td colspan="2" style="padding:14px 20px 4px 20px;font-family:${font};font-size:12px;` +
          `font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:${theme.muted};">${block.title}</td></tr>`
        : "";
      const rows = block.rows
        .map(
          (r) =>
            `<tr>` +
            `<td style="padding:10px 20px;font-family:${font};font-size:14px;color:${theme.muted};">${r.label}</td>` +
            `<td align="right" style="padding:10px 20px;font-family:${font};font-size:14px;` +
            `font-weight:600;color:${theme.text};">${r.value}</td>` +
            `</tr>`,
        )
        .join("");
      return (
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ` +
        `style="width:100%;background-color:${theme.soft};border:1px solid ${theme.border};` +
        `border-radius:${theme.radius}px;padding:6px 0;">${title}${rows}</table>`
      );
    }

    case "table": {
      const head = block.columns
        .map(
          (c, i) =>
            `<th align="${i === 0 ? "left" : "right"}" style="padding:0 0 10px 0;font-family:${font};` +
            `font-size:11px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;` +
            `color:${theme.muted};border-bottom:1px solid ${theme.border};">${c}</th>`,
        )
        .join("");
      const body = block.rows
        .map(
          (cells) =>
            `<tr>` +
            cells
              .map(
                (cell, i) =>
                  `<td align="${i === 0 ? "left" : "right"}" style="padding:12px 0;font-family:${font};` +
                  `font-size:14px;color:${i === 0 ? theme.text : theme.muted};` +
                  `border-bottom:1px solid ${theme.border};">${cell}</td>`,
              )
              .join("") +
            `</tr>`,
        )
        .join("");
      const total = block.total
        ? `<tr>` +
          `<td colspan="${Math.max(block.columns.length - 1, 1)}" style="padding:14px 0 0 0;font-family:${font};` +
          `font-size:15px;font-weight:700;color:${theme.text};">${block.total.label}</td>` +
          `<td align="right" style="padding:14px 0 0 0;font-family:${font};font-size:15px;` +
          `font-weight:700;color:${theme.text};">${block.total.value}</td>` +
          `</tr>`
        : "";
      return (
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">` +
        `<tr>${head}</tr>${body}${total}</table>`
      );
    }

    case "list": {
      const tag = block.ordered ? "ol" : "ul";
      const items = block.items
        .map(
          (item) =>
            `<li style="margin:0 0 9px 0;font-family:${font};font-size:15px;line-height:1.6;` +
            `color:${theme.text};">${item}</li>`,
        )
        .join("");
      return `<${tag} style="margin:0;padding:0 0 0 22px;">${items}</${tag}>`;
    }

    case "callout": {
      const color = toneColor(theme, block.tone ?? "info");
      return (
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">` +
        `<tr><td style="background-color:${mix(color, theme.card, 0.9)};border-left:3px solid ${color};` +
        `border-radius:${Math.min(theme.radius, 8)}px;padding:16px 20px;">` +
        (block.title
          ? `<div style="margin:0 0 4px 0;font-family:${headingFont(theme)};font-size:14px;` +
            `font-weight:700;color:${color};">${block.title}</div>`
          : "") +
        `<div style="font-family:${font};font-size:14px;line-height:1.6;color:${theme.text};">${block.text}</div>` +
        `</td></tr></table>`
      );
    }

    case "steps": {
      const items = block.items
        .map(
          (step, i) =>
            `<tr>` +
            `<td width="34" valign="top" style="padding:0 14px 16px 0;">` +
            `<div style="width:26px;height:26px;line-height:26px;text-align:center;border-radius:13px;` +
            `background-color:${mix(theme.brand, theme.card, 0.86)};font-family:${font};font-size:13px;` +
            `font-weight:700;color:${theme.brand};">${i + 1}</div></td>` +
            `<td valign="top" style="padding:0 0 16px 0;">` +
            `<div style="font-family:${headingFont(theme)};font-size:15px;font-weight:600;color:${theme.text};">${step.title}</div>` +
            `<div style="margin-top:3px;font-family:${font};font-size:14px;line-height:1.6;color:${theme.muted};">${step.text}</div>` +
            `</td></tr>`,
        )
        .join("");
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">${items}</table>`;
    }

    case "metrics": {
      const cells = block.items
        .map(
          (m) =>
            `<td align="center" valign="top" style="padding:18px 8px;background-color:${theme.soft};` +
            `border:1px solid ${theme.border};border-radius:${theme.radius}px;">` +
            `<div style="font-family:${headingFont(theme)};font-size:24px;font-weight:700;color:${theme.brand};">${m.value}</div>` +
            `<div style="margin-top:4px;font-family:${font};font-size:12px;letter-spacing:.3px;color:${theme.muted};">${m.label}</div>` +
            `</td>`,
        )
        .join(`<td width="12" style="width:12px;font-size:0;line-height:0;">&nbsp;</td>`);
      return (
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">` +
        `<tr>${cells}</tr></table>`
      );
    }

    case "articles": {
      const items = block.items
        .map(
          (a, i) =>
            `<tr><td style="padding:${i === 0 ? 0 : 20}px 0 20px 0;` +
            `border-bottom:1px solid ${theme.border};">` +
            (a.meta
              ? `<div style="margin:0 0 6px 0;font-family:${font};font-size:11px;font-weight:700;` +
                `letter-spacing:.7px;text-transform:uppercase;color:${theme.accent};">${a.meta}</div>`
              : "") +
            `<a href="${a.href}" style="font-family:${headingFont(theme)};font-size:18px;font-weight:700;` +
            `line-height:1.35;color:${theme.text};text-decoration:none;">${a.title}</a>` +
            `<div style="margin-top:7px;font-family:${font};font-size:14px;line-height:1.6;color:${theme.muted};">${a.excerpt}</div>` +
            `<div style="margin-top:10px;"><a href="${a.href}" style="font-family:${font};font-size:14px;` +
            `font-weight:600;color:${theme.brand};text-decoration:none;">Read more &rarr;</a></div>` +
            `</td></tr>`,
        )
        .join("");
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">${items}</table>`;
    }

    case "quote":
      return (
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">` +
        `<tr><td style="border-left:3px solid ${theme.brand};padding:4px 0 4px 18px;">` +
        `<div style="font-family:${headingFont(theme)};font-size:17px;line-height:1.55;font-style:italic;color:${theme.text};">${block.text}</div>` +
        (block.author
          ? `<div style="margin-top:8px;font-family:${font};font-size:13px;color:${theme.muted};">— ${block.author}</div>`
          : "") +
        `</td></tr></table>`
      );

    case "divider":
      return `<div style="height:1px;line-height:1px;font-size:0;background-color:${theme.border};">&nbsp;</div>`;

    case "spacer": {
      const size = block.size ?? 12;
      return `<div style="height:${size}px;line-height:${size}px;font-size:0;">&nbsp;</div>`;
    }
  }
}

function renderHeader(pack: TemplatePack): string {
  const { theme } = pack;
  const wordmark = "{{company_name}}";

  if (theme.headerStyle === "bar") {
    return (
      `<tr><td class="ll-pad" style="background-color:${theme.brand};padding:22px ${GUTTER}px;">` +
      `<span style="font-family:${headingFont(theme)};font-size:17px;font-weight:700;` +
      `letter-spacing:.2px;color:${theme.onBrand};">${wordmark}</span>` +
      `</td></tr>`
    );
  }

  if (theme.headerStyle === "centered") {
    return (
      `<tr><td class="ll-pad" align="center" style="padding:32px ${GUTTER}px 0 ${GUTTER}px;">` +
      `<span style="font-family:${headingFont(theme)};font-size:16px;font-weight:700;` +
      `${theme.uppercaseWordmark ? "text-transform:uppercase;letter-spacing:3px;" : "letter-spacing:.2px;"}` +
      `color:${theme.text};">${wordmark}</span>` +
      `<div style="margin:18px auto 0 auto;width:40px;height:2px;line-height:2px;font-size:0;` +
      `background-color:${theme.brand};">&nbsp;</div>` +
      `</td></tr>`
    );
  }

  return (
    `<tr><td class="ll-pad" style="padding:26px ${GUTTER}px;border-bottom:1px solid ${theme.border};">` +
    `<span style="font-family:${headingFont(theme)};font-size:17px;font-weight:700;` +
    `letter-spacing:.2px;color:${theme.brand};">${wordmark}</span>` +
    `</td></tr>`
  );
}

function renderFooter(pack: TemplatePack): string {
  const { theme, footer } = pack;
  const links = footer.links
    .map(
      (l) =>
        `<a href="${l.href}" style="color:${theme.muted};text-decoration:underline;">${l.label}</a>`,
    )
    .join(`<span style="color:${theme.border};"> &nbsp;•&nbsp; </span>`);

  const lines = footer.lines
    .map((line) => `<div style="margin:0 0 6px 0;">${line}</div>`)
    .join("");

  return (
    `<table role="presentation" width="${CARD_WIDTH}" cellpadding="0" cellspacing="0" border="0" ` +
    `class="ll-card" style="width:${CARD_WIDTH}px;max-width:100%;">` +
    `<tr><td class="ll-pad" align="center" style="padding:24px ${GUTTER}px 8px ${GUTTER}px;` +
    `font-family:${theme.fontFamily};font-size:12px;line-height:1.7;color:${theme.muted};">` +
    lines +
    (links ? `<div style="margin-top:10px;">${links}</div>` : "") +
    `</td></tr></table>`
  );
}

/**
 * Renders one library template as a `<body>` fragment ready to store as
 * `TemplateLocale.htmlBody`.
 */
export function renderEmail(pack: TemplatePack, template: LibraryTemplate): string {
  const { theme } = pack;

  const content = template.blocks
    .map((block, i) => row(renderBlock(block, theme), i === template.blocks.length - 1))
    .join("");

  const responsive =
    `<style>@media only screen and (max-width:620px){` +
    `.ll-card{width:100% !important;}` +
    `.ll-pad{padding-left:24px !important;padding-right:24px !important;}` +
    `.ll-h{font-size:22px !important;}` +
    `}</style>`;

  return (
    `<body style="margin:0;padding:0;background-color:${theme.bg};">` +
    responsive +
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;` +
    `color:${theme.bg};">${template.preheader}</div>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ` +
    `style="width:100%;background-color:${theme.bg};">` +
    `<tr><td align="center" style="padding:32px 16px;">` +
    `<table role="presentation" width="${CARD_WIDTH}" cellpadding="0" cellspacing="0" border="0" ` +
    `class="ll-card" style="width:${CARD_WIDTH}px;max-width:100%;background-color:${theme.card};` +
    `border:1px solid ${theme.border};border-radius:${theme.radius}px;">` +
    renderHeader(pack) +
    `<tr><td class="ll-pad" style="padding:34px ${GUTTER}px 38px ${GUTTER}px;">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">` +
    content +
    `</table></td></tr>` +
    `</table>` +
    renderFooter(pack) +
    `</td></tr></table>` +
    `</body>`
  );
}

/** Every `{{token}}` a template references, in first-appearance order. */
export function extractVariables(...sources: string[]): string[] {
  const seen: string[] = [];
  for (const source of sources) {
    for (const match of source.matchAll(/{{\s*([\w.]+)\s*}}/g)) {
      const token = match[1];
      if (!seen.includes(token)) seen.push(token);
    }
  }
  return seen;
}
