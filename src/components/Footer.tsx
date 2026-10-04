import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import SiteLink from './SiteLink'
import { IconFacebook, IconInstagram, IconX } from './icons'
import { yatraPage } from '../data/yatras'
import { REGISTER_URL } from '../data/kashi'

/* a link with no destination yet (href null) is shown as plain text, never pointed somewhere else */
type FooterLink = { label: string; href: string | null; external?: boolean }
const offerings: FooterLink[] = [
  { label: 'Kailash Manasarovar', href: yatraPage('kailash-manasarovar') },
  { label: 'Himalayas', href: yatraPage('himalayan-yatra') },
  { label: 'Kashi Krama', href: yatraPage('kashi-krama') },
  { label: 'Southern Sojourn', href: yatraPage('southern-sojourn') },
]
const quickLinks: FooterLink[] = [
  { label: 'Why Pilgrimage', href: '/why-pilgrimage' },
  { label: 'About Us', href: null },
  { label: 'Register', href: REGISTER_URL, external: true },
  { label: 'Contact Us', href: null },
]
const offices = [
  { region: 'India', phone: '+91 8144123123', tel: '+918144123123', email: 'india.sacredwalks@sadhguru.org' },
  { region: 'USA', phone: '+1-931-218-6466', tel: '+19312186466', email: 'usa.sacredwalks@sadhguru.org' },
]
// profile URLs still to come; until then the icons are not links
const socials: { label: string; href: string | null; Icon: typeof IconX }[] = [
  { label: 'Isha Sacred Walks on X', href: null, Icon: IconX },
  { label: 'Isha Sacred Walks on Facebook', href: null, Icon: IconFacebook },
  { label: 'Isha Sacred Walks on Instagram', href: null, Icon: IconInstagram },
]

function Column({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h3 className="type-display-s text-ink">{title}</h3>
      <div className="mt-5">{children}</div>
    </div>
  )
}

const link = 'type-body-sm text-ink-2 transition-colors hover:text-saffron'

function FooterItem({ l }: { l: FooterLink }) {
  if (!l.href) return <span className="type-body-sm text-ink-mute">{l.label}</span>
  if (l.external)
    return (
      <a href={l.href} target="_blank" rel="noopener noreferrer" className={link}>
        {l.label}
      </a>
    )
  return <SiteLink href={l.href} className={link}>{l.label}</SiteLink>
}

/**
 * The page comes to rest on warm paper. The ribbon lies across the top
 * edge, the same hand as the hero illustration, and a
 * small lotus sits on the closing rule above the copyright.
 */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-transparent via-[#fdf6ee] to-[#fbeee2] px-4 pt-20 pb-8 md:px-5 md:pt-28 lg:pt-36">
      {/* ribbon: always present, drifts gently */}
      <div aria-hidden className="pointer-events-none mx-auto -mb-4 max-w-[1280px] md:-mb-10">
        <motion.img
          src="/images/footer/ribbon.webp"
          alt=""
          width={1600}
          height={533}
          loading="lazy"
          decoding="async"
          className="h-auto w-full select-none"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 9, ease: 'easeInOut', repeat: Infinity }}
        />
      </div>

      <div className="relative mx-auto max-w-[1180px]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-[1.35fr_1fr_1fr_1.3fr] lg:gap-10">
          <div className="col-span-2 lg:col-span-1">
            <SiteLink href="/" aria-label="Isha Sacred Walks home" className="block w-fit">
              <img src="/images/footer/logo.webp" alt="Isha Sacred Walks" width={218} height={109} className="h-20 w-auto md:h-24 lg:h-[128px]" loading="lazy" />
            </SiteLink>
            <p className="mt-6 max-w-[560px] type-body-sm lg:max-w-[380px] text-ink-soft">
              Isha Sacred Walks are journeys to places of divine connection, where the veil between the physical and
              spiritual is thin. Such sacred spaces revitalize and energize us, and give us an experience of our
              inner nature.
            </p>
            <ul className="mt-7 flex gap-2.5">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-saffron/20 bg-white/60 text-ink-2 transition-colors hover:border-saffron hover:bg-saffron hover:text-white"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-saffron/10 bg-white/40 text-ink-mute">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <Column title="Our Offerings">
            <ul className="space-y-3">
              {offerings.map((l) => (
                <li key={l.label}>
                  <FooterItem l={l} />
                </li>
              ))}
            </ul>
          </Column>

          <Column title="Quick Links">
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <FooterItem l={l} />
                </li>
              ))}
            </ul>
          </Column>

          <Column title="Contact Us" className="col-span-2 lg:col-span-1">
            <address className="type-body-sm text-ink-soft not-italic">
              <span className="font-medium text-ink-2">Isha Sacred Walks</span>
              <br />
              A unit of Thenkailaya Bakthi Peravai
              <br />
              Thanneerpandal, Velliangiri Foothills,
              <br />
              Coimbatore, Tamil Nadu 641 114
            </address>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {offices.map((o) => (
                <div key={o.region} className="border-l-2 border-saffron/40 pl-3.5">
                  <p className="type-chip tracking-[0.08em] text-saffron-ink uppercase">{o.region}</p>
                  <a href={`tel:${o.tel}`} className="mt-1 block type-body-sm text-ink-2 tabular-nums hover:text-saffron">
                    {o.phone}
                  </a>
                  <a href={`mailto:${o.email}`} className="block type-body-sm break-all text-ink-soft hover:text-saffron">
                    {o.email}
                  </a>
                </div>
              ))}
            </div>
          </Column>
        </div>

        {/* closing rule, lotus at its centre */}
        <div className="mt-16 flex items-center gap-5" aria-hidden>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-saffron/35" />
          <img src="/images/footer/lotus.webp" alt="" width={400} height={218} loading="lazy" className="h-9 w-auto" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-saffron/35" />
        </div>
        <p className="mt-5 text-center type-caption text-ink-mute">
          © 2018 – {new Date().getFullYear()} Isha Sacred Walks. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
