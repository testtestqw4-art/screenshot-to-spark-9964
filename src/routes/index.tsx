import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useMemo, useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import * as Icons from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { doctors, services, organs, testimonials, visits, type Doctor } from "@/lib/data";
import mri from "@/assets/mri.asset.json";

const Heart3D = lazy(() => import("@/components/site/Heart3D"));
const Anatomy3D = lazy(() => import("@/components/site/Anatomy3D"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediNova — Healthcare, Reimagined" },
      { name: "description", content: "Find expert doctors, book appointments and explore modern care at MediNova." },
      { property: "og:title", content: "MediNova — Healthcare, Reimagined" },
      { property: "og:description", content: "Find expert doctors, book appointments and explore modern care at MediNova." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type OrganId = (typeof organs)[number]["id"];
const Icon = ({ name, className }: { name: string; className?: string }) => {
  const C = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Activity;
  return <C className={className} />;
};
const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

function useMounted() { const [m, s] = useState(false); useEffect(() => s(true), []); return m; }

function Section({ id, eyebrow, title, children, dark }: { id: string; eyebrow: string; title: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <section id={id} className={`scroll-mt-20 px-5 py-24 ${dark ? "bg-navy text-navy-foreground" : ""}`}>
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">{eyebrow}</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl md:text-5xl">{title}</h2>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

const nav = [["services", "Services"], ["doctors", "Doctors"], ["booking", "Book"], ["anatomy", "Anatomy"], ["technology", "Technology"], ["dashboard", "Dashboard"], ["contact", "Contact"]] as const;

function Index() {
  const mounted = useMounted();
  const [service, setService] = useState<(typeof services)[number] | null>(null);
  const [profile, setProfile] = useState<Doctor | null>(null);
  const [preset, setPreset] = useState<{ dept?: string | undefined; doc?: number | undefined; key: number }>({ key: 0 });
  const book = (d?: Doctor) => { setProfile(null); setPreset({ dept: d?.dept, doc: d?.id, key: Date.now() }); go("booking"); };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-navy-foreground/10 bg-navy/85 text-navy-foreground backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 font-display text-xl"><Icons.HeartPulse className="h-6 w-6 text-secondary" />MediNova</button>
          <nav className="hidden gap-6 text-sm lg:flex">{nav.map(([id, l]) => <button key={id} onClick={() => go(id)} className="opacity-80 hover:opacity-100">{l}</button>)}</nav>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => book()}>Book now</Button>
            <Sheet>
              <SheetTrigger asChild><Button size="icon" variant="ghost" className="lg:hidden" aria-label="Open menu"><Icons.Menu /></Button></SheetTrigger>
              <SheetContent><SheetTitle>Menu</SheetTitle><div className="mt-6 flex flex-col gap-4">{nav.map(([id, l]) => <button key={id} className="text-left text-lg" onClick={() => setTimeout(() => go(id), 300)}>{l}</button>)}</div></SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero px-5 pt-28 pb-16 text-navy-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/20 px-3 py-1 text-xs"><span className="h-2 w-2 rounded-full bg-accent" />Accepting new patients</p>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] md:text-6xl">Healthcare, Reimagined for a Better Tomorrow.</h1>
            <p className="mt-6 max-w-lg text-lg opacity-80">Experience smarter healthcare with expert doctors, modern medical facilities, and personalized patient experiences.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" onClick={() => book()}>Book an Appointment</Button>
              <Button size="lg" variant="outline" className="border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-foreground/10" onClick={() => go("services")}>Explore Our Services</Button>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-4 text-sm">{[["120+", "Specialists"], ["98%", "Satisfaction"], ["24/7", "Care line"]].map(([a, b]) => <div key={b}><div className="font-display text-3xl text-secondary">{a}</div><div className="opacity-70">{b}</div></div>)}</div>
          </div>
          <div className="relative h-[420px] md:h-[520px]">
            {mounted && <Suspense fallback={null}><Heart3D /></Suspense>}
            <div className="pointer-events-none absolute left-0 top-10 rounded-xl border border-navy-foreground/15 bg-navy/60 p-3 text-xs backdrop-blur"><div className="opacity-70">Heart rate</div><div className="font-display text-2xl text-secondary">72 bpm</div></div>
            <div className="pointer-events-none absolute right-0 bottom-12 rounded-xl border border-navy-foreground/15 bg-navy/60 p-3 text-xs backdrop-blur"><div className="opacity-70">Blood pressure</div><div className="font-display text-2xl text-accent">118/76</div></div>
          </div>
        </div>
      </section>

      <Section id="services" eyebrow="Medical services" title="Specialist care, all under one roof.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.id} className="group flex flex-col rounded-2xl bg-card p-6 shadow-soft transition hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground"><Icon name={s.icon} className="h-6 w-6" /></div>
              <h3 className="mt-5 text-lg font-semibold">{s.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.desc}</p>
              <Button variant="link" className="mt-3 justify-start px-0" onClick={() => setService(s)}>Learn More <Icons.ArrowRight className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </Section>

      <Dialog open={!!service} onOpenChange={(o) => !o && setService(null)}>
        <DialogContent>
          {service && <><DialogHeader><DialogTitle className="font-display text-2xl">{service.name}</DialogTitle><DialogDescription>{service.desc}</DialogDescription></DialogHeader>
            <p className="text-sm">{service.detail}</p>
            <div className="text-sm"><b>Specialists:</b> {doctors.filter((d) => d.dept === service.name).map((d) => d.name).join(", ") || "—"}</div>
            <Button onClick={() => { const s = service; setService(null); setPreset({ dept: s.name, key: Date.now() }); go("booking"); }}>Book {service.name}</Button></>}
        </DialogContent>
      </Dialog>

      <Doctors onProfile={setProfile} onBook={book} />

      <Dialog open={!!profile} onOpenChange={(o) => !o && setProfile(null)}>
        <DialogContent className="max-w-lg">
          {profile && <>
            <div className="flex gap-4"><img src={profile.photo} alt={profile.name} className="h-24 w-24 rounded-xl object-cover" />
              <DialogHeader className="text-left"><DialogTitle className="font-display text-2xl">{profile.name}</DialogTitle><DialogDescription>{profile.dept} · {profile.years} yrs · ★ {profile.rating}</DialogDescription></DialogHeader></div>
            <p className="text-sm">{profile.bio}</p>
            <ul className="list-disc pl-5 text-sm">{profile.quals.map((q) => <li key={q}>{q}</li>)}</ul>
            <div><p className="mb-2 text-sm font-semibold">Available slots</p><div className="flex flex-wrap gap-2">{profile.slots.map((t) => <span key={t} className="rounded-full bg-muted px-3 py-1 text-sm">{t}</span>)}</div></div>
            <Button onClick={() => book(profile)}>Book with {profile.name.split(" ")[1]} · ${profile.fee}</Button>
          </>}
        </DialogContent>
      </Dialog>

      <Booking key={preset.key} preset={preset} />
      <Anatomy mounted={mounted} />
      <Technology />
      <Dashboard />
      <Stats />
      <Team onProfile={setProfile} />
      <Testimonials />
      <Contact />

      <footer className="bg-navy px-5 py-12 text-sm text-navy-foreground/70">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 md:flex-row">
          <div className="font-display text-xl text-navy-foreground">MediNova</div>
          <div className="flex flex-wrap gap-4">{nav.map(([id, l]) => <button key={id} onClick={() => go(id)}>{l}</button>)}</div>
          <div>© 2026 MediNova Health. Sample site.</div>
        </div>
      </footer>
    </div>
  );
}

function Doctors({ onProfile, onBook }: { onProfile: (d: Doctor) => void; onBook: (d: Doctor) => void }) {
  const [q, setQ] = useState(""); const [dept, setDept] = useState("all"); const [av, setAv] = useState("all"); const [sort, setSort] = useState("rating");
  const list = useMemo(() => doctors.filter((d) => d.name.toLowerCase().includes(q.toLowerCase()) && (dept === "all" || d.dept === dept) && (av === "all" || d.available === av)).sort((a, b) => sort === "rating" ? b.rating - a.rating : b.years - a.years), [q, dept, av, sort]);
  return (
    <Section id="doctors" eyebrow="Find a doctor" title="Meet the specialist who fits you.">
      <div className="grid gap-3 md:grid-cols-4">
        <Input placeholder="Search by name…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={dept} onValueChange={setDept}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All specializations</SelectItem>{services.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent></Select>
        <Select value={av} onValueChange={setAv}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Any availability</SelectItem>{["Today", "This week", "Next week"].map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent></Select>
        <Select value={sort} onValueChange={setSort}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="rating">Sort: Rating</SelectItem><SelectItem value="years">Sort: Experience</SelectItem></SelectContent></Select>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((d) => (
          <div key={d.id} className="overflow-hidden rounded-2xl bg-card shadow-soft">
            <img src={d.photo} alt={d.name} className="h-52 w-full object-cover" loading="lazy" />
            <div className="p-5">
              <div className="flex justify-between text-xs"><span className="rounded-full bg-accent px-2 py-0.5 text-accent-foreground">{d.available}</span><span>★ {d.rating}</span></div>
              <h3 className="mt-3 font-semibold">{d.name}</h3>
              <p className="text-sm text-muted-foreground">{d.dept} · {d.years} yrs · ${d.fee}</p>
              <div className="mt-4 flex gap-2"><Button size="sm" variant="outline" onClick={() => onProfile(d)}>Profile</Button><Button size="sm" onClick={() => onBook(d)}>Book</Button></div>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="text-muted-foreground">No doctors match those filters.</p>}
      </div>
    </Section>
  );
}

const patientSchema = z.object({ name: z.string().trim().min(2, "Enter your full name").max(80), email: z.string().trim().email("Enter a valid email"), phone: z.string().trim().regex(/^[+\d\s()-]{7,20}$/, "Enter a valid phone") });

function Booking({ preset }: { preset: { dept?: string | undefined; doc?: number | undefined } }) {
  const [step, setStep] = useState(preset.doc !== undefined ? 3 : preset.dept ? 2 : 1);
  const [dept, setDept] = useState(preset.dept ?? ""); const [doc, setDoc] = useState<number | undefined>(preset.doc);
  const [date, setDate] = useState(""); const [slot, setSlot] = useState("");
  const [p, setP] = useState({ name: "", email: "", phone: "" }); const [err, setErr] = useState<Record<string, string>>({});
  const [ref, setRef] = useState("");
  const d = doctors.find((x) => x.id === doc);
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => { const t = new Date(); t.setDate(t.getDate() + i + 1); return t.toISOString().slice(0, 10); }), []);
  const steps = ["Department", "Doctor", "Date", "Time", "Details", "Review"];
  const next = () => {
    if (step === 5) { const r = patientSchema.safeParse(p); if (!r.success) { setErr(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message]))); return; } setErr({}); }
    setStep(step + 1);
  };
  const ok = [true, !!dept, doc !== undefined, !!date, !!slot, true, true][step];
  const chip = (on: boolean) => `rounded-xl border p-4 text-left transition ${on ? "border-secondary bg-secondary/15" : "bg-card hover:border-secondary"}`;
  return (
    <Section id="booking" eyebrow="Appointment booking" title="Book your visit in under a minute.">
      <div className="rounded-3xl bg-card p-6 shadow-soft md:p-10">
        {ref ? (
          <div className="py-10 text-center">
            <Icons.CircleCheck className="mx-auto h-16 w-16 text-secondary" />
            <h3 className="mt-4 font-display text-3xl">Appointment confirmed</h3>
            <p className="mt-2 text-muted-foreground">{d?.name} · {date} at {slot}</p>
            <p className="mt-4 inline-block rounded-full bg-accent px-4 py-2 font-mono text-accent-foreground">Ref {ref}</p>
            <div className="mt-6"><Button onClick={() => { setRef(""); setStep(1); setDept(""); setDoc(undefined); setDate(""); setSlot(""); setP({ name: "", email: "", phone: "" }); }}>Book another</Button></div>
          </div>
        ) : <>
          <ol className="mb-8 flex flex-wrap gap-2 text-xs">{steps.map((s, i) => <li key={s} className={`rounded-full px-3 py-1 ${i + 1 === step ? "bg-primary text-primary-foreground" : i + 1 < step ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}. {s}</li>)}</ol>
          {step === 1 && <div className="grid gap-3 sm:grid-cols-4">{services.map((s) => <button key={s.id} className={chip(dept === s.name)} onClick={() => { setDept(s.name); setDoc(undefined); }}><Icon name={s.icon} className="mb-2 h-5 w-5 text-primary" />{s.name}</button>)}</div>}
          {step === 2 && <div className="grid gap-3 sm:grid-cols-3">{doctors.filter((x) => x.dept === dept).map((x) => <button key={x.id} className={chip(doc === x.id)} onClick={() => setDoc(x.id)}><b>{x.name}</b><div className="text-sm text-muted-foreground">★ {x.rating} · ${x.fee}</div></button>)}</div>}
          {step === 3 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-7">{days.map((x) => <button key={x} className={chip(date === x)} onClick={() => setDate(x)}>{new Date(x).toLocaleDateString("en", { weekday: "short", day: "numeric", month: "short" })}</button>)}</div>}
          {step === 4 && <div className="flex flex-wrap gap-3">{d?.slots.map((t) => <button key={t} className={chip(slot === t)} onClick={() => setSlot(t)}>{t}</button>)}</div>}
          {step === 5 && <div className="grid max-w-xl gap-4">{(["name", "email", "phone"] as const).map((k) => <div key={k}><Input placeholder={k[0]!.toUpperCase() + k.slice(1)} value={p[k]} onChange={(e) => setP({ ...p, [k]: e.target.value })} />{err[k] && <p className="mt-1 text-sm text-destructive">{err[k]}</p>}</div>)}</div>}
          {step === 6 && <dl className="grid max-w-md grid-cols-2 gap-2 text-sm">{[["Department", dept], ["Doctor", d?.name], ["Date", date], ["Time", slot], ["Patient", p.name], ["Email", p.email], ["Fee", `$${d?.fee}`]].map(([a, b]) => <><dt className="text-muted-foreground">{a}</dt><dd className="font-medium">{b}</dd></>)}</dl>}
          <div className="mt-8 flex gap-3">
            {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>}
            {step < 6 ? <Button disabled={!ok} onClick={next}>Continue</Button> : <Button onClick={() => { setRef("MN-" + Math.random().toString(36).slice(2, 8).toUpperCase()); toast.success("Appointment confirmed"); }}>Confirm appointment</Button>}
          </div>
        </>}
      </div>
    </Section>
  );
}

function Anatomy({ mounted }: { mounted: boolean }) {
  const [sel, setSel] = useState<OrganId>("heart");
  const o = organs.find((x) => x.id === sel)!;
  return (
    <Section id="anatomy" eyebrow="3D anatomy" title="Explore the human body." dark>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="h-[480px] rounded-3xl border border-navy-foreground/10 bg-hero">{mounted && <Suspense fallback={null}><Anatomy3D sel={sel} onSel={setSel} /></Suspense>}</div>
        <div>
          <div className="flex flex-wrap gap-2">{organs.map((x) => <Button key={x.id} size="sm" variant={sel === x.id ? "secondary" : "outline"} className={sel === x.id ? "" : "border-navy-foreground/20 bg-transparent text-navy-foreground"} onClick={() => setSel(x.id)}>{x.name}</Button>)}</div>
          <div className="mt-6 rounded-2xl border border-navy-foreground/15 p-6"><p className="text-xs uppercase tracking-widest text-secondary">{o.system} system</p><h3 className="mt-2 font-display text-3xl">{o.name}</h3><p className="mt-3 opacity-80">{o.info}</p></div>
          <p className="mt-4 text-sm opacity-60">Drag to rotate, scroll to zoom, tap an organ to select it.</p>
        </div>
      </div>
    </Section>
  );
}

const tech = [["Scan", "MRI scanning", "3-Tesla scanners with 40% faster, quieter imaging."], ["Bot", "Robotic surgery", "Sub-millimetre precision with smaller incisions and faster recovery."], ["Microscope", "Digital diagnostics", "Lab results delivered to your phone within hours."], ["BrainCircuit", "AI-assisted imaging", "Models flag anomalies so radiologists can focus on what matters."], ["Watch", "Remote monitoring", "Wearables stream vitals to your care team around the clock."]];
function Technology() {
  const [i, setI] = useState(0);
  return (
    <Section id="technology" eyebrow="Medical technology" title="Tomorrow's tools, in today's care.">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl shadow-soft"><img src={mri.url} alt="MRI scanner" className="h-full min-h-80 w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy p-6 text-navy-foreground"><h3 className="font-display text-2xl">{tech[i]![1]}</h3><p className="opacity-80">{tech[i]![2]}</p></div></div>
        <div className="flex flex-col gap-3">{tech.map(([ic, t], j) => <button key={t} onClick={() => setI(j)} className={`flex items-center gap-4 rounded-2xl p-5 text-left transition ${i === j ? "bg-primary text-primary-foreground" : "bg-card shadow-soft"}`}><Icon name={ic!} className="h-6 w-6" /><span className="font-semibold">{t}</span></button>)}</div>
      </div>
    </Section>
  );
}

function Dashboard() {
  const card = "rounded-2xl bg-card p-5 shadow-soft";
  return (
    <Section id="dashboard" eyebrow="Patient dashboard" title="Your health, beautifully organized.">
      <Tabs defaultValue="appointments">
        <TabsList className="flex h-auto flex-wrap justify-start">{["appointments", "history", "prescriptions", "labs", "doctor", "stats"].map((t) => <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>)}</TabsList>
        <TabsContent value="appointments" className="grid gap-4 md:grid-cols-2">{[["Dec 3, 10:30", "Dr. Amelia Hart", "Cardiology follow-up"], ["Dec 14, 15:30", "Dr. Kenji Watanabe", "Eye exam"]].map(([a, b, c]) => <div key={a} className={card}><p className="text-sm text-secondary">{a}</p><b>{c}</b><p className="text-sm text-muted-foreground">{b}</p></div>)}</TabsContent>
        <TabsContent value="history" className={card}><ul className="space-y-2 text-sm">{["2026-08 · Annual physical — normal", "2025-11 · Mild hypertension diagnosed", "2024-03 · Wrist fracture, healed"].map((x) => <li key={x}>{x}</li>)}</ul></TabsContent>
        <TabsContent value="prescriptions" className="grid gap-4 md:grid-cols-3">{[["Lisinopril 10mg", "Once daily"], ["Vitamin D 1000 IU", "Once daily"], ["Atorvastatin 20mg", "Evening"]].map(([a, b]) => <div key={a} className={card}><b>{a}</b><p className="text-sm text-muted-foreground">{b}</p></div>)}</TabsContent>
        <TabsContent value="labs" className={card}><table className="w-full text-sm"><tbody>{[["Cholesterol", "182 mg/dL", "Normal"], ["HbA1c", "5.4%", "Normal"], ["Vitamin D", "24 ng/mL", "Low"]].map(([a, b, c]) => <tr key={a} className="border-b"><td className="py-2">{a}</td><td>{b}</td><td className={c === "Low" ? "text-destructive" : "text-accent-foreground"}>{c}</td></tr>)}</tbody></table></TabsContent>
        <TabsContent value="doctor" className={`${card} flex items-center gap-4`}><img src={doctors[0]!.photo} alt="" className="h-20 w-20 rounded-xl object-cover" /><div><b>{doctors[0]!.name}</b><p className="text-sm text-muted-foreground">Primary cardiologist · hart@medinova.health</p></div></TabsContent>
        <TabsContent value="stats" className="grid gap-4 md:grid-cols-4">{[["Heart rate", "72 bpm"], ["Blood pressure", "118/76"], ["Sleep", "7h 20m"], ["Steps", "8,412"]].map(([a, b]) => <div key={a} className={card}><p className="text-sm text-muted-foreground">{a}</p><p className="font-display text-3xl">{b}</p></div>)}</TabsContent>
      </Tabs>
    </Section>
  );
}

function Stats() {
  const [range, setRange] = useState(12);
  const data = visits.slice(-range);
  const dept = services.map((s, i) => ({ name: s.name.split(" ")[0], score: 70 + ((i * 37 + range) % 28) }));
  const box = "rounded-2xl bg-card p-5 shadow-soft";
  return (
    <Section id="stats" eyebrow="Health statistics" title="Care, measured.">
      <div className="mb-6 flex gap-2">{[3, 6, 12].map((r) => <Button key={r} size="sm" variant={range === r ? "default" : "outline"} onClick={() => setRange(r)}>Last {r} months</Button>)}</div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className={box}><p className="mb-3 font-semibold">Patient visits</p><ResponsiveContainer height={220}><AreaChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Area dataKey="visits" stroke="var(--chart-1)" fill="var(--chart-2)" fillOpacity={0.3} /></AreaChart></ResponsiveContainer></div>
        <div className={box}><p className="mb-3 font-semibold">Appointment trends</p><ResponsiveContainer height={220}><LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line dataKey="appointments" stroke="var(--chart-2)" strokeWidth={3} /></LineChart></ResponsiveContainer></div>
        <div className={box}><p className="mb-3 font-semibold">Department performance</p><ResponsiveContainer height={220}><BarChart data={dept}><XAxis dataKey="name" fontSize={10} /><YAxis /><Tooltip /><Bar dataKey="score" fill="var(--chart-1)" radius={6} /></BarChart></ResponsiveContainer></div>
        <div className={box}><p className="mb-3 font-semibold">Patient satisfaction (%)</p><ResponsiveContainer height={220}><LineChart data={data}><XAxis dataKey="month" /><YAxis domain={[80, 100]} /><Tooltip /><Line dataKey="satisfaction" stroke="var(--chart-3)" strokeWidth={3} /></LineChart></ResponsiveContainer></div>
      </div>
    </Section>
  );
}

function Team({ onProfile }: { onProfile: (d: Doctor) => void }) {
  return (
    <Section id="team" eyebrow="Medical team" title="The people behind your care." dark>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{doctors.slice(0, 4).map((d) => (
        <div key={d.id}><img src={d.photo} alt={d.name} className="aspect-[3/4] w-full rounded-2xl object-cover" loading="lazy" /><h3 className="mt-4 font-display text-xl">{d.name}</h3><p className="text-sm opacity-70">{d.dept} · {d.quals[0]} · {d.years} yrs</p><Button size="sm" variant="secondary" className="mt-3" onClick={() => onProfile(d)}>View Profile</Button></div>
      ))}</div>
    </Section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0); const t = testimonials[i]!;
  return (
    <Section id="testimonials" eyebrow="Patient stories" title="Trusted by thousands of families.">
      <div className="rounded-3xl bg-card p-10 shadow-soft">
        <div className="text-secondary">{"★".repeat(t.rating)}<span className="text-muted">{"★".repeat(5 - t.rating)}</span></div>
        <p className="mt-4 font-display text-2xl md:text-3xl">“{t.text}”</p>
        <div className="mt-6 flex items-center justify-between"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-semibold text-accent-foreground">{t.name[0]}</span>{t.name}</div>
          <div className="flex gap-2"><Button size="icon" variant="outline" aria-label="Previous" onClick={() => setI((i + 2) % 3)}><Icons.ChevronLeft /></Button><Button size="icon" variant="outline" aria-label="Next" onClick={() => setI((i + 1) % 3)}><Icons.ChevronRight /></Button></div></div>
      </div>
    </Section>
  );
}

const contactSchema = z.object({ name: z.string().trim().min(2, "Enter your name").max(80), email: z.string().trim().email("Enter a valid email"), message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000) });
function Contact() {
  const [f, setF] = useState({ name: "", email: "", message: "" }); const [err, setErr] = useState<Record<string, string>>({});
  const submit = (e: React.FormEvent) => { e.preventDefault(); const r = contactSchema.safeParse(f); if (!r.success) { setErr(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message]))); return; } setErr({}); setF({ name: "", email: "", message: "" }); toast.success("Message sent — we'll reply within one business day."); };
  return (
    <Section id="contact" eyebrow="Contact" title="We're here when you need us.">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4 text-muted-foreground"><p className="flex gap-3"><Icons.MapPin className="text-primary" />200 Harbor Avenue, Boston, MA</p><p className="flex gap-3"><Icons.Phone className="text-primary" />+1 (617) 555-0142</p><p className="flex gap-3"><Icons.Mail className="text-primary" />care@medinova.health</p><p className="flex gap-3"><Icons.Clock className="text-primary" />Mon–Sat 7:00–21:00 · Emergency 24/7</p></div>
        <form onSubmit={submit} className="space-y-4 rounded-2xl bg-card p-6 shadow-soft" noValidate>
          <div><Input placeholder="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />{err["name"] && <p className="mt-1 text-sm text-destructive">{err["name"]}</p>}</div>
          <div><Input placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />{err["email"] && <p className="mt-1 text-sm text-destructive">{err["email"]}</p>}</div>
          <div><Textarea placeholder="How can we help?" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />{err["message"] && <p className="mt-1 text-sm text-destructive">{err["message"]}</p>}</div>
          <Button type="submit" className="w-full">Send message</Button>
        </form>
      </div>
    </Section>
  );
}
