import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'

const docsComponents = getDocsMDXComponents()

type DocsComponents = typeof docsComponents

export function useMDXComponents(components?: Partial<DocsComponents>): DocsComponents {
  return { ...docsComponents, ...components }
}
