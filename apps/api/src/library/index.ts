// Registry for the built-in template library.
//
// Packs are static data compiled into the API — there is no library table and
// nothing to migrate. Importing a pack copies its rendered HTML into ordinary
// `Template`/`TemplateLocale` rows owned by the project, so an imported
// template is immediately editable and has no link back to the library.

import { extractVariables, renderEmail } from "./render";
import type { LibraryTemplate, TemplatePack } from "./types";
import { agencyPack } from "./packs/agency";
import { communityPack } from "./packs/community";
import { devtoolsPack } from "./packs/devtools";
import { ecommercePack } from "./packs/ecommerce";
import { educationPack } from "./packs/education";
import { eventsPack } from "./packs/events";
import { fintechPack } from "./packs/fintech";
import { healthcarePack } from "./packs/healthcare";
import { marketplacePack } from "./packs/marketplace";
import { newsletterPack } from "./packs/newsletter";
import { nonprofitPack } from "./packs/nonprofit";
import { recruitingPack } from "./packs/recruiting";
import { saasStarterPack } from "./packs/saas-starter";
import { travelPack } from "./packs/travel";

// Ordered as they appear in the dashboard: broadest audience first.
export const PACKS: TemplatePack[] = [
  saasStarterPack,
  ecommercePack,
  newsletterPack,
  agencyPack,
  educationPack,
  fintechPack,
  healthcarePack,
  eventsPack,
  marketplacePack,
  communityPack,
  devtoolsPack,
  travelPack,
  recruitingPack,
  nonprofitPack,
];

export function getPack(id: string): TemplatePack | undefined {
  return PACKS.find((pack) => pack.id === id);
}

export function getPackTemplate(
  pack: TemplatePack,
  key: string,
): LibraryTemplate | undefined {
  return pack.templates.find((template) => template.key === key);
}

export type LibraryTemplateView = {
  key: string;
  name: string;
  description: string;
  category: string;
  subject: string;
  preheader: string;
  variables: string[];
  html: string;
};

export type LibraryPackView = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  audience: string;
  templateCount: number;
  /** Enough of the theme for the browser to render a swatch and a mini preview. */
  colors: { brand: string; accent: string; bg: string; card: string; text: string };
  templates: LibraryTemplateView[];
};

export function renderLibraryTemplate(
  pack: TemplatePack,
  template: LibraryTemplate,
): LibraryTemplateView {
  const html = renderEmail(pack, template);
  return {
    key: template.key,
    name: template.name,
    description: template.description,
    category: template.category,
    subject: template.subject,
    preheader: template.preheader,
    variables: extractVariables(template.subject, html),
    html,
  };
}

/**
 * Full pack view. `includeHtml: false` drops the rendered markup, which is by
 * far the heaviest part of the payload — the list endpoint doesn't need it.
 */
export function toPackView(pack: TemplatePack, includeHtml = true): LibraryPackView {
  return {
    id: pack.id,
    name: pack.name,
    tagline: pack.tagline,
    description: pack.description,
    audience: pack.audience,
    templateCount: pack.templates.length,
    colors: {
      brand: pack.theme.brand,
      accent: pack.theme.accent,
      bg: pack.theme.bg,
      card: pack.theme.card,
      text: pack.theme.text,
    },
    templates: pack.templates.map((template) => {
      const view = renderLibraryTemplate(pack, template);
      return includeHtml ? view : { ...view, html: "" };
    }),
  };
}

/**
 * A minimal JSON Schema describing the `{{tokens}}` a template expects, stored
 * on the imported locale so the editor and SDK have something to validate
 * against later.
 */
export function variablesSchema(variables: string[]) {
  return {
    type: "object" as const,
    properties: Object.fromEntries(
      variables.map((name) => [name, { type: "string" as const }]),
    ),
  };
}

export type { LibraryTemplate, TemplatePack } from "./types";
