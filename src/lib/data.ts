import d0 from "@/assets/doctor-0.asset.json";
import d1 from "@/assets/doctor-1.asset.json";
import d2 from "@/assets/doctor-2.asset.json";
import d3 from "@/assets/doctor-3.asset.json";

export const services = [
  { id: "cardiology", name: "Cardiology", icon: "HeartPulse", desc: "Advanced heart care from prevention to complex interventions.", detail: "Echocardiography, stress testing, catheterization and long-term cardiac rehabilitation programs led by board-certified cardiologists." },
  { id: "neurology", name: "Neurology", icon: "Brain", desc: "Diagnosis and treatment of brain and nervous-system disorders.", detail: "EEG, nerve-conduction studies, stroke response and memory clinics with AI-assisted imaging review." },
  { id: "dentistry", name: "Dentistry", icon: "Smile", desc: "Preventive, cosmetic and restorative dental care.", detail: "Digital X-rays, implants, aligners and same-day crowns in calm, modern suites." },
  { id: "orthopedics", name: "Orthopedics", icon: "Bone", desc: "Bones, joints and sports-injury recovery.", detail: "Minimally invasive joint replacement, robotic-assisted surgery and personalized physiotherapy." },
  { id: "pediatrics", name: "Pediatrics", icon: "Baby", desc: "Gentle, comprehensive care for children.", detail: "Well-child visits, vaccinations, developmental screening and a 24/7 pediatric nurse line." },
  { id: "dermatology", name: "Dermatology", icon: "Sparkles", desc: "Skin, hair and nail health.", detail: "Skin-cancer screening with digital dermoscopy, acne and eczema programs, and laser treatments." },
  { id: "ophthalmology", name: "Ophthalmology", icon: "Eye", desc: "Complete eye care and vision correction.", detail: "Retinal imaging, cataract surgery, glaucoma management and LASIK consultations." },
  { id: "general", name: "General Medicine", icon: "Stethoscope", desc: "Everyday care and annual check-ups.", detail: "Annual physicals, chronic-condition management, lab work and referrals coordinated in one place." },
] as const;

export type Doctor = { id: number; name: string; dept: string; years: number; rating: number; fee: number; available: "Today" | "This week" | "Next week"; photo: string; bio: string; quals: string[]; slots: string[] };

const photos = [d0.url, d1.url, d2.url, d3.url];
const raw: [string, string, number, number, number, Doctor["available"]][] = [
  ["Dr. Amelia Hart", "Cardiology", 18, 4.9, 180, "Today"],
  ["Dr. Rafael Ortiz", "Neurology", 14, 4.8, 200, "This week"],
  ["Dr. Priya Nair", "Pediatrics", 11, 4.9, 120, "Today"],
  ["Dr. James Whitfield", "Orthopedics", 22, 4.7, 210, "Next week"],
  ["Dr. Sofia Lindqvist", "Dermatology", 9, 4.6, 140, "This week"],
  ["Dr. Kenji Watanabe", "Ophthalmology", 16, 4.8, 160, "Today"],
  ["Dr. Leila Haddad", "Dentistry", 12, 4.7, 110, "This week"],
  ["Dr. Marcus Bell", "General Medicine", 7, 4.5, 90, "Today"],
];
export const doctors: Doctor[] = raw.map(([name, dept, years, rating, fee, available], i) => ({
  id: i, name, dept, years, rating, fee, available, photo: photos[i % 4]!,
  bio: `${name.split(" ").slice(1).join(" ")} has spent ${years} years in ${dept.toLowerCase()}, combining evidence-based medicine with a warm, unhurried approach to every patient.`,
  quals: ["MD, Johns Hopkins University", `Board Certified, ${dept}`, "Fellow, MediNova Clinical Institute"],
  slots: ["09:00", "10:30", "13:00", "15:30", "17:00"].filter((_, j) => (i + j) % 4 !== 0),
}));

export const organs = [
  { id: "heart", name: "Heart", system: "Cardiovascular", pos: [0.25, 0.6, 0.3], color: "#e2566b", info: "Pumps about 7,500 litres of blood daily through 100,000 km of vessels." },
  { id: "brain", name: "Brain", system: "Nervous", pos: [0, 2.15, 0], color: "#f2a6c0", info: "86 billion neurons coordinate thought, movement and every bodily function." },
  { id: "lungs", name: "Lungs", system: "Respiratory", pos: [0, 0.75, 0.1], color: "#7fc8e8", info: "Around 480 million alveoli exchange oxygen and carbon dioxide." },
  { id: "liver", name: "Liver", system: "Digestive", pos: [-0.3, 0.1, 0.25], color: "#a8574a", info: "Performs 500+ functions, including detoxification and protein synthesis." },
  { id: "kidneys", name: "Kidneys", system: "Urinary", pos: [0, -0.2, -0.15], color: "#c47a5a", info: "Filter roughly 180 litres of blood plasma every day." },
  { id: "skeleton", name: "Skeleton", system: "Musculoskeletal", pos: [0, 0, 0], color: "#efe8d8", info: "206 bones provide structure, protect organs and produce blood cells." },
] as const;

export const testimonials = [
  { name: "Hannah M.", text: "From booking to follow-up, everything felt effortless. Dr. Hart explained my results with real patience.", rating: 5 },
  { name: "Omar K.", text: "The robotic knee procedure had me walking in two days. The care team was outstanding.", rating: 5 },
  { name: "Grace L.", text: "Our pediatrician made my son feel completely at ease. The app reminders are a lifesaver.", rating: 4 },
];

export const visits = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i]!,
  visits: 3200 + Math.round(Math.sin(i / 1.7) * 600 + i * 140),
  appointments: 2800 + Math.round(Math.cos(i / 2) * 400 + i * 120),
  satisfaction: 88 + Math.round(Math.sin(i) * 4 + i / 3),
}));
