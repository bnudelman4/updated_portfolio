import type { Project } from '@/lib/types'

export const projects: Project[] = [
  {
    id: 1,
    screen: "portfolio",
    name: "Financial Data Verifier Pipeline",
    description:
      "A deterministic verification pipeline that cross-references AI agent financial outputs against the FMP API and SEC EDGAR data, using the SEC's 5% materiality threshold with intermediate bands at 0.1%, 0.5%, and 1%.",
    techStack: "Python",
    category: "AI Evaluation",
    github: "https://github.com/bnudelman4/skill_eval",
    live: null,
    code: `# Materiality bands: SEC 5% threshold + intermediate bands
BANDS = [0.001, 0.005, 0.01, 0.05]

def verify(expected, actual):
    diff = abs(actual - expected) / abs(expected)
    if diff <= 0.001: return "EXACT"
    if diff <= 0.05:  return f"WITHIN {next_band(diff)}"
    return "MATERIAL_MISMATCH"   # e.g. JPM shares 4x too high

# Route each cell by complexity: direct | comparative | derived
verdict = verify(edgar_value(cell), agent_value(cell))`,
    demo: null,
    features: [
      "Deterministic pipeline cross-referencing AI agent financial outputs against FMP API and SEC EDGAR, using the SEC 5% materiality threshold with intermediate bands at 0.1%, 0.5%, and 1%",
      "Classified data cells by complexity type (direct lookups, comparative, derived metrics) and routed each to appropriate verification methods, rejecting an LLM-judge approach due to shared blind spots",
      "Discovered a model hallucination where JPM shares outstanding was reported 4x too high (stock vs. flow aggregation error), and caught a fiscal-year period-boundary bug in the SEC EDGAR client",
    ],
    technologies: ["Python", "FMP API", "SEC EDGAR", "LLM Evaluation"],
    timeframe: "May 2026 – June 2026",
  },
  {
    id: 2,
    device: "phone",
    screen: "streak",
    name: "In21",
    description:
      "Co-founded a productivity application catered to teenagers and young adults interested in self-improvement, built on the idea that 21 days is enough to turn an activity into a habit.",
    techStack: "React Native",
    category: "Mobile",
    github: null,
    live: null,
    code: `// Backend: user metrics + 21-day habit streaks
const logActivity = async (userId, activityId, metrics) => {
  await db.collection('users').doc(userId).update({
    [\`activities.\${activityId}\`]: metrics,
    streak: increment(1),
    updatedAt: serverTimestamp(),
  })
}

// Email verification / messaging between users
const sendVerification = async (email, code) =>
  sendEmail({ to: email, template: 'verify', code })`,
    demo: null,
    features: [
      "Co-founded a productivity app catered to teenagers and young adults interested in self-improvement",
      "Implementing an efficient backend for user contact info and metrics from in-app activities and surveys; built a messaging system between users and an email verification / sending system",
      "Used Figma to design the page flows, then directly implemented the front end and APIs using React Native",
    ],
    technologies: ["Swift", "React Native", "Firebase", "Docker", "Tailwind CSS", "Git"],
    timeframe: "June 2025 – Present",
  },
  {
    id: 3,
    screen: "stockSearch",
    name: "StockPuppet",
    description:
      "A stock research tool that matches natural-language queries against ~3,500 companies using TF-IDF with cosine similarity and field-weighted scoring across ticker, name, sector, and description.",
    techStack: "Python / React",
    category: "Web / Search",
    github: "https://github.com/ArielleNu/stock-puppet",
    live: null,
    code: `# Field-weighted TF-IDF + cosine similarity over ~3,500 companies
WEIGHTS = {"ticker": 3.0, "name": 2.0, "sector": 1.5, "description": 1.0}

def search(query):
    qv = vectorize(query)
    scored = [(c, sum(WEIGHTS[f] * cosine(qv, c.vec[f]) for f in FIELDS))
              for c in companies]
    return sorted(scored, key=lambda x: -x[1])[:20]

# Levenshtein fuzzy match for ticker typos
def fuzzy_ticker(q): return min(tickers, key=lambda t: levenshtein(q, t))`,
    demo: null,
    features: [
      "Stock research tool matching natural-language queries against ~3,500 companies via TF-IDF with cosine similarity and field-weighted scoring across ticker, name, sector, and description",
      "Integrated an LLM layer that suggests follow-up searches from query history and generates explanations for why a stock was surfaced",
      "Implemented fuzzy matching via Levenshtein distance for ticker search to handle typos and partial inputs",
    ],
    technologies: ["Python", "Flask", "React", "TypeScript", "TF-IDF", "LLM APIs", "Git"],
    timeframe: "Feb 2026 – May 2026",
  },
  {
    id: 4,
    device: "phone",
    screen: "rideApp",
    name: "UniRides",
    description:
      "An iOS carpooling application enabling university students to discover, join, and create rides between campus and home locations.",
    techStack: "Swift",
    category: "Mobile",
    github: "https://github.com/bnudelman4/UniRides",
    live: null,
    code: `// Codable models with custom CodingKeys for API mapping
struct Ride: Codable {
  let id: String
  let origin: String
  let destination: String
  var joinedUserIds: [String]
  enum CodingKeys: String, CodingKey {
    case id, origin, destination
    case joinedUserIds = "joined_user_ids"
  }
}

func fetchRides() async throws -> [Ride] {
  let data = try await api.get("/rides")
  return try JSONDecoder().decode([Ride].self, from: data)
}`,
    demo: null,
    features: [
      "Built an iOS carpooling app letting university students discover, join, and create rides between campus and home locations",
      "Implemented the frontend using UIKit and MVC architecture",
      "Integrated the frontend with backend REST APIs; defined JSON schema and implemented Codable models with custom CodingKeys to map backend responses",
    ],
    technologies: ["Swift", "UIKit", "REST APIs", "Codable", "MVC", "JSON", "Git"],
    timeframe: "Nov 2024 – Mar 2025",
  },
  {
    id: 5,
    screen: "ideAudio",
    name: "2FA Pipeline",
    description:
      "At Cornell Custom Silicon Systems (C2S2), a secure two-factor authentication system that uses the device's microphone and motion sensors to verify the user. The repository is private and owned by the C2S2 project team.",
    techStack: "C / C++",
    category: "Embedded Systems",
    github: null,
    live: null,
    code: `// TensorFlow Lite on microcontroller: 2FA using mic + IMU
// Deploy a lightweight NN on chip (TinyML)

// Pipeline: audio + IMU -> feature extraction -> inference -> auth
// Firmware in C/C++; integrates with hardware and other subteams`,
    demo: null,
    features: [
      "Secure 2FA on a microcontroller using on-chip microphone and IMU sensor data",
      "Neural network deployed with TensorFlow Lite and TinyML directly on chip",
      "C/C++ firmware; software and hardware integration; collaboration across subteams",
    ],
    technologies: ["C", "C++", "TensorFlow Lite", "TinyML", "Assembly"],
    timeframe: "Sep 2025 – Present",
  },
  {
    id: 6,
    screen: "ideAsm",
    name: "Eta Compiler",
    description:
      "A complete optimizing compiler for the Eta and Rho languages, built with a team of three. The full pipeline runs lexing, parsing, semantic analysis, IR generation, SSA-based optimization, and x86-64 code generation with graph-coloring register allocation.",
    techStack: "Java",
    category: "Systems",
    github: null,
    live: null,
    code: `; pipeline: .eta/.rh -> lex -> parse -> typecheck -> IR
;        -> CFG -> SSA -> opt -> tile -> regalloc -> x86-64
main:
  push  %rbp
  mov   %rsp, %rbp
  mov   $0, %eax        ; constant prop + value numbering
loop:
  cmp   $10, %eax
  jge   done
  add   $1, %eax        ; graph-coloring regalloc, 14 regs
  jmp   loop
done:
  pop   %rbp
  ret`,
    demo: null,
    features: [
      "Full pipeline: lexical, syntactic, and semantic analysis, IR generation, optimization, and x86-64 assembly generation for both Eta and Rho",
      "SSA-based optimization pipeline: copy propagation, constant propagation with local value numbering, and dead-code elimination over a generic forward/backward dataflow framework",
      "Graph-coloring register allocation with liveness analysis, interference graphs, move coalescing, and stack spilling; DP instruction tiling for x86-64",
      "Rho language support, backward-compatible with Eta, sharing the same compiler backend",
    ],
    technologies: ["Java", "JFlex", "CUP", "x86-64", "Gradle", "Docker"],
    timeframe: "Jan 2026 – Present",
  },
  {
    id: 7,
    screen: "music",
    name: "Music Recommender",
    description:
      "A music playlist app that recommends songs from seed tracks or artists. Pick a few you like and get a playlist built from learned musical attributes and similarity.",
    techStack: "OCaml",
    category: "Machine Learning",
    github: "https://github.com/bnudelman4/Codysseia",
    live: null,
    code: `(* K-means classifier: nearest-centroid assignment *)
let nearest_centroid model features =
  let best_idx = ref 0 and best_dist = ref max_float in
  for cid = 0 to Array.length model.centroids - 1 do
    let d = sq_euclidean features model.centroids.(cid) in
    if d < !best_dist then (best_dist := d; best_idx := cid)
  done;
  (!best_idx, !best_dist)`,
    demo: null,
    features: [
      "Recommends playlists from seed songs or artists using ML-style classification",
      "K-means classifier: songs as feature vectors, k centroids, nearest-centroid assignment, iterative training with reinitialization",
      "Bogue GUI with splash screen, light/dark/dynamic themes, and song/artist/both modes; data loading and normalization for large catalogs",
    ],
    technologies: ["OCaml", "Bogue", "Dune"],
    timeframe: "Sep 2025 – Jan 2026",
  },
  {
    id: 8,
    screen: "clutch",
    name: "Clutch",
    description:
      "AI-powered pre-exam study intelligence. Upload your lecture notes and Clutch extracts key topics, auto-generates flashcards and practice questions, builds a dependency-aware study workflow, and schedules smart sessions around your Google Calendar.",
    techStack: "Next.js",
    category: "AI / Web",
    github: "https://github.com/bnudelman4/clutch",
    live: "https://clutch-cornell.vercel.app",
    code: `// /api/analyze — PDF -> topics, flashcards, audit questions
export async function POST(req: Request) {
  const text = await extractPdf(await req.arrayBuffer())
  const { topics, flashcards, audit } =
    await claude.analyze(truncate(text))
  return Response.json({ topics, flashcards, audit })
}`,
    demo: null,
    features: [
      "Smart upload (PDF/TXT/MD) with server-side PDF text extraction and intelligent truncation for large files",
      "Claude-powered analysis: key topics & subtopics, auto-generated flashcards, and pre-flight practice audit questions",
      "Git-log-style workflow commit tree and Google Calendar OAuth2 integration that schedules AI-optimized study sessions around existing commitments",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Anthropic Claude", "Google OAuth2", "Vercel"],
    timeframe: "",
  },
  {
    id: 9,
    screen: "bios",
    name: "DES",
    description:
      "DES is a secure firmware distribution software for automotive embedded systems. A software installer/updater that keeps firmware updates confidential and tamper-proof.",
    techStack: "C / Python",
    category: "Embedded Systems",
    github: "https://github.com/randall-sim/FirmwareDistribution",
    live: null,
    code: `// CIA: Confidentiality, Integrity, Authentication
// Protect: append version + release message; encrypt + sign binary
// Build: compile C bootloader; emit AES-128 key + RSA keypair
// Update: framed transfer; verify signatures/tags before applying
// Confidentiality: AES-128 CBC; integrity/auth: RSA sign + verify`,
    demo: null,
    features: [
      "Secure installer/updater for an automotive embedded system: bootloader (C) on device, host-side toolchain (Python)",
      "Build tool compiles the bootloader, emits a symmetric key and RSA keypair, and injects keys into the device header",
      "Protect/Update tools enforce CIA: AES-128 CBC encryption and RSA signing/verification; framed firmware transfer to avoid buffer overflow",
    ],
    technologies: ["C", "Python", "BASH", "Makefile"],
    timeframe: "Feb 2023 – Aug 2023",
  },
  {
    id: 10,
    screen: "browser",
    name: "SimplifyCS",
    description:
      "A CS education platform where instructors organize content into courses, units, and lessons. Students work through articles, quizzes, and assignments, with sign-in and email verification.",
    techStack: "Next.js",
    category: "Web Development",
    github: "https://github.com/randall-sim/simplifycs",
    live: null,
    code: `// Activity index: polymorphic lesson content
const activityIndex = lesson.activities.map((a, order) => ({
  model: a.model,      // 'Article' | 'Quiz' | 'Assignment'
  itemId: a.itemId,
  order
}))

export async function deleteUnit(req, res) {
  await requireAdmin(req)
  await prisma.unit.delete({ where: { id: req.params.id } })
  await reorderSiblings(req.params.id)
  res.json({ ok: true })
}`,
    demo: null,
    features: [
      "Curriculum hierarchy: course → unit → lesson, with polymorphic lesson content via an activity index (Article/Quiz/Assignment)",
      "REST CRUD + admin-only delete with authorization; token-based sessions, bcrypt passwords, HTTP cookie auth",
      "Email verification (6-digit code), orphan prevention, and consistent ordering under concurrent requests",
    ],
    technologies: ["Next.js", "Node.js", "MongoDB", "Prisma", "bcrypt"],
    timeframe: "Feb 2023 – Jan 2024",
  },
  {
    id: 11,
    screen: "bridge",
    name: "Bridge",
    description:
      "Community-crisis coordination software built for the Cornell Claude Builders Hackathon 2026. Bridge turns scattered messages from SMS, GroupMe, Discord, and intake forms into structured, privacy-protected matches of needs, offers, and pairings, with a human-in-the-loop two-step approval before anything goes out.",
    techStack: "Next.js",
    category: "AI / Web",
    github: "https://github.com/bnudelman4/crisisproj",
    live: null,
    code: `// match state machine
// proposed -> helper_accepted -> approved -> completed

// /api/analyze: Claude Opus extracts typed, urgency-scored needs/offers
const { needs, offers, matches } = await analyze(rawMultiChannelText)

// privacy: coords jittered ±0.001° (~100m); phone numbers
// never leave the server — map payload uses display names only`,
    demo: null,
    features: [
      "Claude Opus 4 extracts typed, urgency-scored (1–5) needs and offers from multi-channel text and proposes matches",
      "Live OpenStreetMap (react-leaflet) with need/offer/match pins and USGS earthquake + NWS alert overlays",
      "WhatsApp/SMS via Twilio with a two-step approval state machine ('CONFIRM HELP'); privacy jitter (~±100m) and phone numbers never exposed to the client",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Anthropic Claude", "Twilio", "react-leaflet", "SQLite"],
    timeframe: "",
  },
]
