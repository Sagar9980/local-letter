import nextra from 'nextra'

const withNextra = nextra({
  // Codeblocks are excluded from the search index so a query like "apiKey"
  // matches the prose that explains it, not every snippet that mentions it.
  search: { codeblocks: false },
  defaultShowCopyCode: true,
})

export default withNextra({
  reactStrictMode: true,
})
