import { Hero } from '../components/sections/Hero'
import { FeaturedWork } from '../components/sections/FeaturedWork'
import { Categories } from '../components/sections/Categories'
import { AboutPreview } from '../components/sections/AboutPreview'
import { Testimonials } from '../components/sections/Testimonials'
import { CTA } from '../components/sections/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedWork />
      <Categories />
      <AboutPreview />
      <Testimonials />
      <CTA />
    </>
  )
}
