import type { MetadataRoute } from 'next'
import { generateStaticParamsFor } from 'nextra/pages'
import { siteUrl } from './site-url'

// Built from the same params the catch-all route prerenders, so a new .mdx file
// under content/ lands in the sitemap without anyone remembering to add it.
const getParams = generateStaticParamsFor('mdxPath')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const params = (await getParams()) as { mdxPath?: string[] }[]

  return params.map(({ mdxPath = [] }) => {
    const path = mdxPath.join('/')
    return {
      url: path ? `${siteUrl}/${path}` : siteUrl,
      changeFrequency: 'weekly',
      // The landing page outranks the rest; everything else is equal weight.
      priority: path ? 0.8 : 1,
    }
  })
}
