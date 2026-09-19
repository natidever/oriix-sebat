import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import StartProjectForm from '../start-project-form'

export default function StartProjectPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 md:px-8 lg:px-12">
        <Link
          href="/"
          className="flex items-center gap-2 font-serif text-xl font-semibold tracking-[-0.04em]"
          aria-label="ሰባትAI studio home"
        >
          <span className="flex size-8 items-center justify-center rounded-full border border-foreground font-sans text-lg font-bold leading-none">
            ፯
          </span>
          <span>
            ሰባትAI <span className="text-muted-foreground">studio</span>
          </span>
        </Link>
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
          Back to studio
        </Link>
      </header>

      <StartProjectForm />
    </main>
  )
}
