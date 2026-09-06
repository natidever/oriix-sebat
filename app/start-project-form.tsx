'use client'

import { ArrowUpRight, CheckCircle2, ChevronLeft, FileText, Upload, X } from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'

type Step = 1 | 2 | 3

type FormState = {
  name: string
  email: string
  phone: string
  company: string
  industry: string
  brandName: string
  hasExistingSite: 'yes' | 'no' | ''
  inspirationUrl: string
  inspirationNotes: string
  detailsMode: 'text' | 'file'
  detailsText: string
  detailsFile: File | null
}

const initialState: FormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  industry: '',
  brandName: '',
  hasExistingSite: '',
  inspirationUrl: '',
  inspirationNotes: '',
  detailsMode: 'text',
  detailsText: '',
  detailsFile: null,
}

const industries = [
  'Hospitality',
  'Fintech',
  'E-commerce',
  'Education',
  'Healthcare',
  'Real estate',
  'Creative / Agency',
  'SaaS',
  'Restaurant / Café',
  'Other',
]

export default function StartProjectForm({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [isDragging, setIsDragging] = useState(false)
  const [submittedAt, setSubmittedAt] = useState<string>('')
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    setTimeout(() => firstFieldRef.current?.focus(), 60)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  function close() {
    setIsOpen(false)
    setTimeout(() => {
      setStep(1)
      setForm(initialState)
      setErrors({})
      setSubmittedAt('')
    }, 300)
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validateStep(s: Step): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (s === 1) {
      if (!form.name.trim()) next.name = 'Required.'
      if (!form.email.trim()) next.email = 'Required.'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Looks off.'
      if (!form.phone.trim()) next.phone = 'Required.'
      else {
        const digits = form.phone.replace(/\D/g, '')
        const local = digits.startsWith('251') ? digits.slice(3) : digits
        if (local.length !== 10 || !/^(09|07)/.test(local)) {
          next.phone = 'Use 10 digits, starting with 09 or 07.'
        }
      }
    } else if (s === 2) {
      if (!form.industry) next.industry = 'Pick one.'
      if (!form.brandName.trim()) next.brandName = 'Required.'
      if (!form.hasExistingSite) next.hasExistingSite = 'Pick one.'
      if (form.hasExistingSite === 'yes' && !form.inspirationUrl.trim()) {
        next.inspirationUrl = 'Drop a URL.'
      }
      if (
        form.inspirationUrl.trim() &&
        !/^https?:\/\/.+\..+/.test(form.inspirationUrl)
      ) {
        next.inspirationUrl = 'Use a full URL (https://…).'
      }
      if (form.detailsMode === 'text') {
        if (!form.detailsText.trim() || form.detailsText.trim().length < 20) {
          next.detailsText = 'Give us a bit more to work with.'
        }
      } else if (!form.detailsFile) {
        next.detailsFile = 'Upload a PDF or switch to text.'
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function next() {
    if (!validateStep(step)) return
    if (step < 3) setStep((s) => (s + 1) as Step)
  }

  function back() {
    if (step > 1) setStep((s) => (s - 1) as Step)
  }

  function onFile(file: File | null) {
    if (file && file.type !== 'application/pdf') {
      setErrors((e) => ({ ...e, detailsFile: 'PDF only.' }))
      update('detailsFile', null)
      return
    }
    if (file && file.size > 10 * 1024 * 1024) {
      setErrors((e) => ({ ...e, detailsFile: 'Max 10 MB.' }))
      update('detailsFile', null)
      return
    }
    update('detailsFile', file)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validateStep(step)) return
    if (step === 2) {
      setSubmittedAt(new Date().toLocaleString())
    }
    setStep((s) => (s + 1) as Step)
  }

  const phaseMeta = [
    { num: '01', label: 'Contact', sub: 'How we reach you.' },
    { num: '02', label: 'Project', sub: 'About the website.' },
    { num: '03', label: 'Confirm', sub: 'We are on it.' },
  ]

  return (
    <>
      <span onClick={() => setIsOpen(true)} className="contents cursor-pointer">
        {children}
      </span>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-stretch justify-center bg-ink/50 backdrop-blur-md md:items-center md:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="start-project-title"
            className="relative flex h-full w-full max-w-5xl flex-col overflow-hidden border border-border bg-background text-foreground shadow-[0_30px_80px_-20px_rgba(32,33,29,0.4)] md:h-auto md:max-h-[88vh] md:flex-row"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-foreground hover:text-foreground md:right-5 md:top-5"
            >
              <X size={14} />
            </button>

            {/* Step rail */}
            <aside className="relative hidden w-72 shrink-0 border-r border-border bg-secondary/40 p-8 md:flex md:flex-col md:justify-between">
              <div>
                <p className="label">Brief · 02 / 03</p>
                <h2
                  id="start-project-title"
                  className="mt-6 font-serif text-4xl leading-[0.95] tracking-[-0.05em]"
                >
                  Start a<br />
                  <em className="text-muted-foreground">project.</em>
                </h2>
                <p className="mt-4 max-w-[18ch] text-sm leading-6 text-muted-foreground">
                  The more we know now, the less we have to guess later.
                </p>
              </div>

              <ol className="mt-12 space-y-1">
                {phaseMeta.map((p, i) => {
                  const idx = (i + 1) as Step
                  const active = step === idx
                  const done = step > idx
                  return (
                    <li key={p.num}>
                      <button
                        type="button"
                        onClick={() => step > idx && setStep(idx)}
                        disabled={step < idx}
                        className={`flex w-full items-baseline gap-4 border-t border-border py-4 text-left transition-colors ${active ? 'text-foreground' : 'text-muted-foreground'
                          } ${step > idx ? 'hover:text-foreground' : ''}`}
                      >
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                          {done ? '✓' : p.num}
                        </span>
                        <span className="flex-1">
                          <span className="block font-serif text-lg tracking-[-0.02em]">{p.label}</span>
                          <span className="block text-xs text-muted-foreground">{p.sub}</span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>

              <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Avg. time · 4 min
              </p>
            </aside>

            {/* Main panel */}
            <div className="flex min-h-0 flex-1 flex-col">
              {/* Mobile header */}
              <div className="border-b border-border px-6 pb-5 pt-6 md:hidden">
                <p className="label">Start a project</p>
                <h2 id="start-project-title-mobile" className="mt-2 font-serif text-2xl tracking-[-0.04em]">
                  {step === 1 && 'Contact'}
                  {step === 2 && 'Project'}
                  {step === 3 && 'Confirmed'}
                </h2>
              </div>

              <div className="flex h-px w-full bg-border">
                <div
                  className="h-full bg-foreground transition-all duration-700 ease-out"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>

              <div className="flex-1 overflow-y-auto">
                {step !== 3 && (
                  <form onSubmit={onSubmit} className="mx-auto max-w-2xl px-6 py-10 md:px-12 md:py-14">
                    {step === 1 && (
                      <div>
                        <SectionHeader
                          eyebrow="Phase 01"
                          title="Tell us about you."
                          sub="We will only use these to get back to you about your project."
                        />
                        <div className="mt-10 space-y-7">
                          <Field label="Full name" required error={errors.name}>
                            <input
                              ref={firstFieldRef}
                              type="text"
                              autoComplete="name"
                              value={form.name}
                              onChange={(e) => update('name', e.target.value)}
                              placeholder="Abel Tadesse"
                              className={inputClass(!!errors.name)}
                            />
                          </Field>
                          <div className="grid gap-7 sm:grid-cols-2">
                            <Field label="Email" required error={errors.email}>
                              <input
                                type="email"
                                autoComplete="email"
                                value={form.email}
                                onChange={(e) => update('email', e.target.value)}
                                placeholder="you@brand.com"
                                className={inputClass(!!errors.email)}
                              />
                            </Field>
                            <Field label="Phone" required error={errors.phone}>
                              <input
                                type="tel"
                                autoComplete="tel"
                                inputMode="tel"
                                value={form.phone}
                                onChange={(e) => update('phone', e.target.value)}
                                placeholder="09.. .. .. .."
                                className={inputClass(!!errors.phone)}
                              />
                            </Field>
                          </div>
                          <Field label="Company or role" hint="Optional">
                            <input
                              type="text"
                              value={form.company}
                              onChange={(e) => update('company', e.target.value)}
                              placeholder="Founder at Aster House"
                              className={inputClass(false)}
                            />
                          </Field>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div>
                        <SectionHeader
                          eyebrow="Phase 02"
                          title="About the website."
                          sub="A few honest details. Long enough that we do not have to chase you."
                        />
                        <div className="mt-10 space-y-9">
                          <Field label="Industry" required error={errors.industry}>
                            <div className="flex flex-wrap gap-2">
                              {industries.map((ind) => {
                                const active = form.industry === ind
                                return (
                                  <button
                                    key={ind}
                                    type="button"
                                    onClick={() => update('industry', ind)}
                                    className={`rounded-full border px-4 py-2 text-xs transition-colors ${active
                                        ? 'border-foreground bg-foreground text-background'
                                        : 'border-border bg-background text-foreground hover:border-foreground'
                                      }`}
                                  >
                                    {ind}
                                  </button>
                                )
                              })}
                            </div>
                          </Field>

                          <Field label="Brand name" required error={errors.brandName}>
                            <input
                              type="text"
                              value={form.brandName}
                              onChange={(e) => update('brandName', e.target.value)}
                              placeholder="Aster House"
                              className={inputClass(!!errors.brandName)}
                            />
                          </Field>

                          <Field label="Already have a website?" required error={errors.hasExistingSite}>
                            <Segmented
                              value={form.hasExistingSite}
                              onChange={(v) => update('hasExistingSite', v as 'yes' | 'no' | '')}
                              options={[
                                { value: 'yes', label: 'Yes, give us the URL' },
                                { value: 'no', label: 'No, starting fresh' },
                              ]}
                            />
                          </Field>

                          {form.hasExistingSite === 'yes' && (
                            <Field
                              label="Current website"
                              required
                              hint="We will only look at it for context."
                              error={errors.inspirationUrl}
                            >
                              <input
                                type="url"
                                value={form.inspirationUrl}
                                onChange={(e) => update('inspirationUrl', e.target.value)}
                                placeholder="https://yourbrand.com"
                                className={inputClass(!!errors.inspirationUrl)}
                              />
                            </Field>
                          )}

                          <Field
                            label="Sites you admire"
                            hint="Optional · separate by comma"
                          >
                            <textarea
                              rows={2}
                              value={form.inspirationNotes}
                              onChange={(e) => update('inspirationNotes', e.target.value)}
                              placeholder="linear.app, apple.com, are.na"
                              className={`${inputClass(false)} resize-none leading-6`}
                            />
                          </Field>

                          <div className="border-t border-border pt-9">
                            <Field
                              label="Project brief"
                              required
                              hint="What are we making, for whom, and by when?"
                              error={errors.detailsText || (errors.detailsFile as string | undefined)}
                            >
                              <div className="mb-4 flex w-full border border-border">
                                <button
                                  type="button"
                                  onClick={() => update('detailsMode', 'text')}
                                  className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-xs transition-colors ${form.detailsMode === 'text'
                                      ? 'bg-foreground text-background'
                                      : 'bg-background text-foreground hover:bg-secondary'
                                    }`}
                                >
                                  <FileText size={13} /> Write it
                                </button>
                                <button
                                  type="button"
                                  onClick={() => update('detailsMode', 'file')}
                                  className={`flex flex-1 items-center justify-center gap-2 border-l border-border px-4 py-3 text-xs transition-colors ${form.detailsMode === 'file'
                                      ? 'bg-foreground text-background'
                                      : 'bg-background text-foreground hover:bg-secondary'
                                    }`}
                                >
                                  <Upload size={13} /> Upload PDF
                                </button>
                              </div>

                              {form.detailsMode === 'text' ? (
                                <textarea
                                  rows={7}
                                  value={form.detailsText}
                                  onChange={(e) => update('detailsText', e.target.value)}
                                  placeholder="Pages you need, the mood, references, the deadline, anything we should know before we start."
                                  className={`${inputClass(!!errors.detailsText)} resize-y leading-7`}
                                />
                              ) : (
                                <DropZone
                                  file={form.detailsFile}
                                  error={errors.detailsFile as string | undefined}
                                  isDragging={isDragging}
                                  onDragging={setIsDragging}
                                  onFile={onFile}
                                />
                              )}
                            </Field>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-12 flex items-center justify-between gap-3 border-t border-border pt-6">
                      <button
                        type="button"
                        onClick={back}
                        disabled={step === 1}
                        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-0"
                      >
                        <ChevronLeft size={14} /> Back
                      </button>
                      <button
                        type="submit"
                        className="group inline-flex min-w-44 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm text-background transition-transform hover:-translate-y-0.5"
                      >
                        {step === 2 ? 'Send brief' : 'Continue'}
                        <ArrowUpRight
                          size={14}
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </button>
                    </div>
                  </form>
                )}

                {step === 3 && (
                  <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center px-6 py-16 text-center md:py-24">
                    <div className="flex size-12 items-center justify-center rounded-full border border-foreground text-foreground">
                      <CheckCircle2 size={20} />
                    </div>
                    <p className="label mt-8">Brief received</p>
                    <h3 className="mt-3 font-serif text-4xl leading-[0.95] tracking-[-0.05em] md:text-5xl">
                      Thanks,{form.name.split(' ')[0] || 'friend'}.
                    </h3>
                    <p className="mt-5 max-w-sm text-base leading-7 text-muted-foreground">
                      We have everything we need to start. A short reply will land in your inbox at{' '}
                      <span className="text-foreground">{form.email}</span> within 24 hours.
                    </p>
                    <dl className="mt-10 w-full divide-y divide-border border-y border-border text-left text-sm">
                      <Row label="Submitted">{submittedAt}</Row>
                      <Row label="Reference">
                        {form.brandName} · {form.industry}
                      </Row>
                      <Row label="Reply by">Within 24 hours</Row>
                    </dl>
                    <button
                      type="button"
                      onClick={close}
                      className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Close <ArrowUpRight size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function inputClass(hasError: boolean) {
  return `w-full border bg-secondary/30 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-foreground focus:bg-background focus:outline-none transition-colors ${hasError ? 'border-destructive' : 'border-border'
    }`
}

function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </span>
        {hint && !error && <span className="text-[10px] text-muted-foreground">{hint}</span>}
        {error && <span className="text-[10px] text-destructive">{error}</span>}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  )
}

function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string
  title: string
  sub?: string
}) {
  return (
    <header>
      <p className="label">{eyebrow}</p>
      <h3 className="mt-4 font-serif text-4xl leading-[0.95] tracking-[-0.05em] md:text-5xl">
        {title}
      </h3>
      {sub && (
        <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground md:text-base">
          {sub}
        </p>
      )}
    </header>
  )
}

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="grid w-full grid-cols-1 border border-border sm:grid-cols-2">
      {options.map((opt, i) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-4 py-3 text-sm transition-colors ${active ? 'bg-foreground text-background' : 'bg-background text-foreground hover:bg-secondary'
              } ${i > 0 ? 'border-t border-border sm:border-l sm:border-t-0' : ''}`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  )
}

function DropZone({
  file,
  error,
  isDragging,
  onDragging,
  onFile,
}: {
  file: File | null
  error?: string
  isDragging: boolean
  onDragging: (v: boolean) => void
  onFile: (f: File | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(list: FileList | null) {
    const f = list?.[0] ?? null
    if (!f) return
    if (f.type !== 'application/pdf') {
      onFile(null)
      setTimeout(() => {
        const evt = new CustomEvent('dzerr')
      }, 0)
      return
    }
    onFile(f)
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          onDragging(true)
        }}
        onDragLeave={() => onDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          onDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={`flex w-full flex-col items-center justify-center gap-3 border border-dashed px-6 py-12 text-center transition-colors ${isDragging
            ? 'border-foreground bg-secondary'
            : 'border-border bg-background hover:border-foreground'
          }`}
      >
        <Upload size={18} className="text-muted-foreground" />
        {file ? (
          <>
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-foreground" />
              <span className="text-sm text-foreground">{file.name}</span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {(file.size / 1024).toFixed(0)} KB · click to replace
            </span>
          </>
        ) : (
          <>
            <p className="text-sm text-foreground">Drop a PDF here, or click to browse</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Up to 10 MB · PDF only
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)}
        />
      </button>
      {file && (
        <button
          type="button"
          onClick={() => onFile(null)}
          className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
        >
          <X size={11} /> Remove file
        </button>
      )}
      {error && !file && (
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground">
          {error}
        </p>
      )}
    </div>
  )
}