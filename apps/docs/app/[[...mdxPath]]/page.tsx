import type { Metadata } from 'next'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

type PageProps = {
  params: Promise<{ mdxPath: string[] }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)

  // Next.js applies the layout's `openGraph.title` template to a page's
  // `openGraph.title`, not to its `title` — so a page that only sets frontmatter
  // `title` would unfurl under the site default everywhere. Carry the page's own
  // title and description across so each link previews as itself.
  const title = typeof metadata.title === 'string' ? metadata.title : undefined
  const description = typeof metadata.description === 'string' ? metadata.description : undefined

  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, ...(title && { title }), ...(description && { description }) },
    twitter: { ...metadata.twitter, ...(title && { title }), ...(description && { description }) },
  }
}

const Wrapper = getMDXComponents().wrapper!

export default async function Page(props: PageProps) {
  const params = await props.params
  const { default: MDXContent, toc, metadata, sourceCode } = await importPage(params.mdxPath)

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
