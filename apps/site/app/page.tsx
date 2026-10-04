import Hero from '@/sections/Hero'
import Problem from '@/sections/Problem'
import Features from '@/sections/Features'
import HowItWorks from '@/sections/HowItWorks'
import LocaleShowcase from '@/sections/LocaleShowcase'
import SdkSection from '@/sections/SdkSection'
import SelfHost from '@/sections/SelfHost'
import DocsTeaser from '@/sections/DocsTeaser'
import Faq from '@/sections/Faq'
import FinalCta from '@/sections/FinalCta'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Features />
      <HowItWorks />
      <LocaleShowcase />
      <SdkSection />
      <SelfHost />
      <DocsTeaser />
      <Faq />
      <FinalCta />
    </>
  )
}
