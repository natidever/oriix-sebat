'use client'

import { ArrowUpRight, Play, Plus } from 'lucide-react'
import { useRef, useState } from 'react'
import StartProjectForm from './start-project-form'

const projects = [
  { name: 'Aaron Events', type: 'Orthodox wedding planner', year: '2025', image: '/projects/aaron-events.png', link: 'https://aaron-events.netlify.app/' },
  { name: 'BlockBar', type: 'Rare wines and liqueurs', year: '2025', image: '/projects/black-bar.png', link: 'https://blockbar.com/' },
  { name: 'Carra Market', type: 'Lottery platform with physical prizes', year: '2025', image: '/projects/carra.png', link: 'https://carramarket.com/' },
  { name: 'Maraki Cleaning Service', type: 'Cleaning service for corporates and homes', year: '2024', image: '/projects/maraki-cleaning-service.png', link: 'https://marakicleaning.netlify.app/' },
]

export default function Page() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 md:px-8 lg:px-12">
        <a href="#top" className="flex items-center gap-2 font-serif text-xl font-semibold tracking-[-0.04em]" aria-label="ሰባትAI studio home"><span className="flex size-8 items-center justify-center rounded-full border border-foreground font-sans text-lg font-bold leading-none">፯</span><span>ሰባትAI <span className="text-muted-foreground">studio</span></span></a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex" aria-label="Main navigation">
          <a className="transition-colors hover:text-foreground" href="#work">Work</a>
          <a className="transition-colors hover:text-foreground" href="#approach">Approach</a>
          <a className="transition-colors hover:text-foreground" href="#studio">Studio</a>
        </nav>
        <StartProjectForm>
          <a className="group flex items-center gap-2 rounded-full border border-foreground bg-foreground px-4 py-2 text-sm text-background transition-transform hover:-translate-y-0.5">
            Start a project <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </StartProjectForm>
      </header>

      <section id="top" className="mx-auto flex min-h-[calc(100svh-80px)] max-w-7xl flex-col items-center px-5 pb-6 pt-4 md:px-8 md:pb-8 md:pt-6 lg:px-12">
        <div className="flex max-w-3xl flex-col items-center text-center">
          <h1 className="max-w-3xl font-serif text-3xl leading-[0.94] tracking-[-0.06em] text-balance sm:text-4xl md:text-5xl lg:text-6xl">እንከን የለሽ ጥራት፡ <em className="text-muted-foreground">የማይታመን ዋጋ</em></h1>
          <p className="mt-3 max-w-2xl text-base font-medium leading-6 text-foreground md:text-lg">We build your websites in 48 hours. If you don't love it, you don't pay.</p>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground md:text-sm">Senior design and development, without the agency overhead.</p>
        </div>

         <div className="relative w-full max-w-5xl overflow-hidden border border-border bg-ink mt-4 md:mt-5 rounded-[14px]" style={{ aspectRatio: '832 / 466' }}>
             <video ref={videoRef} src="/I can give you value .mp4" poster="/thumbnail.png" className="absolute inset-0 h-full w-full object-cover" playsInline onPlay={() => { setIsPlaying(true); setHasEnded(false) }} onPause={() => setIsPlaying(false)} onEnded={() => { setIsPlaying(false); setHasEnded(true) }} />
             {!hasInteracted && (
               <button type="button" aria-label="Play showreel" onClick={() => { const v = videoRef.current; if (v) { v.play(); setHasInteracted(true) } }} className="absolute inset-0 z-10 flex items-center justify-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background">
                 <div className="absolute inset-0 bg-black/20" />
                 <div className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/90 md:left-8 md:top-8">ሰባትAI / Showreel 01</div>
                 <div className="absolute bottom-5 left-5 max-w-sm text-white md:bottom-8 md:left-8"><p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">Play 01:42</p></div>
                 <span className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-110"><Play size={21} fill="currentColor" /></span>
                 <span className="absolute bottom-5 right-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70 md:bottom-8 md:right-8">Sound on · Click to play</span>
               </button>
             )}
             {hasInteracted && !isPlaying && (
               <button type="button" aria-label={hasEnded ? 'Replay showreel' : 'Play showreel'} onClick={() => { const v = videoRef.current; if (v) { if (hasEnded) v.currentTime = 0; v.play() } }} className="absolute left-1/2 top-1/2 z-20 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground">
                 <Play size={21} fill="currentColor" />
               </button>
             )}
             {isPlaying && (
               <button type="button" aria-label="Pause showreel" onClick={() => videoRef.current?.pause()} className="absolute left-1/2 top-1/2 z-20 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary/80 text-primary-foreground backdrop-blur-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground">
                 <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
               </button>
             )}
            </div>

        <div className="mt-3 flex w-full max-w-5xl flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <StartProjectForm>
            <a className="group inline-flex min-w-56 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5">Start a project <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>
          </StartProjectForm>
        </div>
      </section>

      <section id="work" className="border-y border-border">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28 lg:px-12">
           <div className="mb-12 flex items-end justify-between gap-6"><div><p className="label">Selected work</p><h2 className="mt-4 font-serif text-5xl tracking-[-0.06em] md:text-7xl">A few things<br /><em className="text-muted-foreground">we&apos;ve made.</em></h2></div><span className="hidden font-mono text-xs text-muted-foreground md:block">(01 — 04)</span></div>
           <div className="grid gap-10 md:grid-cols-4">{projects.map((project, index) => <article key={project.name} className="group"><a href={project.link} target="_blank" rel="noreferrer" className="block"><div className="relative aspect-[4/5] overflow-hidden bg-muted"><img src={project.image} alt={project.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-6 border border-background/30"><div className="absolute bottom-5 left-5 right-5 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-background/75"><span>Case study {String(index + 1).padStart(2, '0')}</span><ArrowUpRight size={14} /></div></div><div className="absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-background/40 transition-transform duration-500 group-hover:scale-125" /></div><div className="flex justify-between gap-4 pt-4 text-sm"><div><h3 className="font-medium">{project.name}</h3><p className="mt-1 text-muted-foreground">{project.type}</p></div><span className="text-muted-foreground">{project.year}</span></div></a></article>)}</div>
        </div>
      </section>

      <section id="approach" className="mx-auto grid max-w-7xl gap-16 px-5 py-20 md:px-8 md:py-32 lg:grid-cols-[0.8fr_1fr] lg:px-12"><div><p className="label">A fair question</p><h2 className="mt-4 max-w-xl font-serif text-5xl leading-[0.95] tracking-[-0.06em] md:text-7xl">Premium work.<br /><em className="text-muted-foreground">Without the mystery.</em></h2></div><div className="border-t border-border"><details open className="group border-b border-border py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl font-medium [&::-webkit-details-marker]:hidden"><span>Why is it so much cheaper?</span><Plus size={20} className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45" /></summary><p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">We use a multi-agent system of up to six autonomous agents to work across your project. That gives you the capability of a larger team without paying for a separate developer, designer, strategist, and project manager.</p></details><details className="group border-b border-border py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl font-medium [&::-webkit-details-marker]:hidden"><span>Does it look like a generic AI-generated website?</span><Plus size={20} className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45" /></summary><p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">Absolutely not. We do not simply generate a website and hand it over. We design carefully around your requirements, then use autonomous agents to refine the layout, details, copy, and interactions until it feels distinctly yours.</p></details><details className="group border-b border-border py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl font-medium [&::-webkit-details-marker]:hidden"><span>How does the payment work?</span><Plus size={20} className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45" /></summary><p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">There is no upfront payment. First, you review the website draft. Then we contact you with the draft, gather your feedback, and finalize your website within 48 hours.</p></details></div></section>

      <section id="studio" className="bg-ink text-background"><div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28 lg:px-12"><div className="grid gap-16 md:grid-cols-2 md:items-end"><div><p className="label text-background/60">The studio</p><h2 className="mt-4 max-w-2xl font-serif text-5xl leading-[0.95] tracking-[-0.06em] md:text-7xl">You deserve not just quality,<br />but speed.</h2></div><p className="max-w-sm text-lg leading-7 text-background/65">ሰባትAI studio is a compact creative technology studio that is part of Oriix for people who care deeply about what they put into the world.</p></div><div className="mt-20 grid grid-cols-2 border-t border-background/20 pt-6 text-sm md:grid-cols-3"><div><p className="font-mono text-xs text-background/50">Based in</p><p className="mt-3">Addis Ababa</p></div><div><p className="font-mono text-xs text-background/50">Founded</p><p className="mt-3">2024</p></div><div><p className="font-mono text-xs text-background/50">Collaborators</p><p className="mt-3">human and agents</p></div></div></div></section>

      <section id="contact" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-40 lg:px-12"><p className="label">Have a good one?</p><div className="mt-6 flex flex-col justify-between gap-10 md:flex-row md:items-end"><h2 className="max-w-4xl font-serif text-6xl leading-[0.9] tracking-[-0.07em] md:text-8xl">Let&apos;s make<br /><em className="text-muted-foreground">something matter.</em></h2><a href="mailto:sebat@oriix.net" className="group flex shrink-0 items-center gap-3 rounded-full bg-foreground px-6 py-4 text-background transition-transform hover:-translate-y-1">sebat@oriix.net <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a></div></section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-border px-5 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8 lg:px-12"><span>© 2025 ሰባትAI studio</span><div className="flex gap-6"><a href="#top" className="hover:text-foreground">Back to top</a><a href="mailto:sebat@oriix.net" className="hover:text-foreground">Email us</a></div></footer>
    </main>
  )
}

 
