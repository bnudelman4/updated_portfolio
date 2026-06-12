import type { Project } from '@/lib/types'

export const projects: Project[] = [
  {
    id: 1,
    name: "SimplifyCS",
    description: "A CS education platform where instructors organize content into courses, units, and lessons. Students work through articles, quizzes, and assignments, with sign-in and email verification.",
    techStack: "Next.js",
    category: "Web Development",
    github: "https://github.com/randysim/simplifycs",
    live: null,
    code: `// Activity index: polymorphic lesson content
const activityIndex = lesson.activities.map((a, order) => ({
  model: a.model,      // 'Article' | 'Quiz' | 'Assignment'
  itemId: a.itemId,
  order
}));

// REST-style CRUD with auth
export async function deleteUnit(req, res) {
  await requireAdmin(req);
  const { id } = req.params;
  await prisma.unit.delete({ where: { id } });
  await reorderSiblings(id);
  res.json({ ok: true });
}`,
    demo: null,
    features: [
      "Curriculum hierarchy: course → unit → lesson",
      "Polymorphic lesson content via activity index (Article/Quiz/Assignment)",
      "REST CRUD + admin-only delete with authorization",
      "Token-based sessions, bcrypt passwords, HTTP cookie auth",
      "Email verification (6-digit code in verify table)",
      "Orphan prevention and consistent ordering under concurrent requests",
      "Input validation and type coercion across endpoints"
    ],
    technologies: ["Next.js", "Node.js", "MongoDB", "Prisma", "bcrypt"],
    timeframe: "Feb 2023 – Jan 2024",
  },
  {
    id: 2,
    name: "UniRides",
    description: "iOS app that helps students discover, join, and create carpools for trips home from university.",
    techStack: "Swift",
    category: "Mobile",
    github: "https://github.com/bnudelman4/UniRides",
    live: null,
    code: `// Codable models with CodingKeys for API mapping
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

// GET rides, then filter by joined/requested
func fetchRides() async throws -> [Ride] {
  let data = try await api.get("/rides")
  let rides = try JSONDecoder().decode([Ride].self, from: data)
  return rides.filter { ride in
    ride.joinedUserIds.contains(currentUserId) || requestedRideIds.contains(ride.id)
  }
}`,
    demo: null,
    features: [
      "UIKit frontend with navigation flow: landing → login/signup → rides feed → ride detail & creation",
      "Codable models (users, rides, images) with explicit CodingKeys for GET/POST",
      "Login, signup, and ride creation forms with POST requests and auth",
      "Rides feed: GET available rides, frontend filtering for joined/requested",
      "Input validation and JSON serialization for reliable backend communication"
    ],
    technologies: ["Swift", "UIKit", "Codable", "REST API"],
    timeframe: "Nov 2024 – Mar 2025",
  },
  {
    id: 3,
    name: "In21",
    description: "Co-founded a productivity application for teenagers and young adults focused on self-improvement. We believe that 21 days is enough time to turn any activity into a habit, and as such we created an app to make this happen.",
    techStack: "React Native",
    category: "Mobile",
    github: null,
    live: null,
    code: `// Backend: user metrics + messaging (conceptual)
const saveActivityMetrics = async (userId, activityId, metrics) => {
  await db.collection('users').doc(userId).update({
    [\`activities.\${activityId}\`]: metrics,
    updatedAt: serverTimestamp()
  });
};

// Email verification / sending flow
const sendVerificationEmail = async (email, code) => {
  await sendEmail({ to: email, template: 'verify', code });
  await db.collection('verify').doc(email).set({ code, expiresAt: ... });
};`,
    demo: null,
    features: [
      "Co-founded productivity app for teens and young adults (self-improvement)",
      "Backend: user contact info, metrics from in-app activities and surveys",
      "Messaging system between users; email verification and sending",
      "Figma for page flows; React Native for front end and APIs",
      "Docker, Firebase, Tailwind CSS in stack"
    ],
    technologies: ["Swift", "React Native", "Firebase", "Docker", "Tailwind CSS", "Git"],
    timeframe: "June 2025 – Present",
  },
  {
    id: 4,
    name: "DES Software Distribution",
    description: "Secure firmware distribution system for automobiles. We built a software installer/updater so firmware updates stay confidential and tamper-proof.",
    techStack: "C / Python",
    category: "Embedded Systems",
    github: "https://github.com/randall-sim/FirmwareDistribution",
    live: null,
    code: `// CIA: Confidentiality, Integrity, Authentication
// Protect: append version + release message; encrypt and sign firmware binary

// Bootloader build: compile C bootloader; emit AES-128 key + RSA keypair; keys.h on device
// Update: framed transfer (no buffer overflow); parse signatures, tags, metadata on device

// Confidentiality: AES-128 CBC; integrity/auth: sign and verify with RSA`,
    demo: null,
    features: [
      "Secure installer/updater for automotive embedded system: bootloader (C) on device, host-side toolchain (Python)",
      "Build tool: compile bootloader, emit symmetric key and RSA keypair, inject keys into device header",
      "Protect tool: CIA (Confidentiality, Integrity, Authentication)—append version and release info, encrypt and sign firmware binary",
      "Update tool: transfer firmware in frames to avoid buffer overflow; on device: parse signatures, tags, and metadata; decrypt and verify before applying",
      "AES-128 CBC for confidentiality; RSA signing and verification for integrity and authentication; team of 4–5"
    ],
    technologies: ["C", "Python", "BASH", "Makefile"],
    timeframe: "Feb 2023 – Aug 2023",
  },
  {
    id: 5,
    name: "Music Recommender",
    description: "Music playlist app that recommends songs based on seed tracks or artists. You pick a few songs or artists you like and get a playlist built from learned musical attributes and similarity.",
    techStack: "OCaml",
    category: "Machine Learning",
    github: "https://github.com/bnudelman4/Codysseia",
    live: null,
    code: `(* K-means classifier: centroids in feature space, nearest-centroid assignment *)
let nearest_centroid model features =
  let best_idx = ref 0 and best_dist = ref max_float in
  for cid = 0 to Array.length model.centroids - 1 do
    let d = sq_euclidean features model.centroids.(cid) in
    if d < !best_dist then (best_dist := d; best_idx := cid)
  done;
  (!best_idx, !best_dist)

let cluster_id model song =
  let idx, _ = nearest_centroid model (Song.features song) in idx`,
    demo: null,
    features: [
      "Recommend playlists from seed songs or artists using ML-style classification",
      "K-means classifier: songs as feature vectors, k centroids in feature space; nearest-centroid assignment, iterative training with max_iters and cluster reinitialization",
      "Classifier API: train on song list, cluster_id and distance to centroid; model save/load for reuse",
      "Bogue GUI with splash screen, light/dark/dynamic themes, and song/artist/both modes",
      "Data loading and normalization for large catalogs; CLI and graphical entry points"
    ],
    technologies: ["OCaml", "Bogue", "Dune"],
    timeframe: "Sep 2025 – Jan 2026",
  },
  {
    id: 6,
    name: "2FA Pipeline",
    description: "At Cornell Custom Silicon Systems (C2S2), I work on a secure two-factor authentication system that uses the device's microphone and motion sensors to verify the user. The repository is private and owned by the C2S2 project team.",
    techStack: "C / C++",
    category: "Embedded Systems",
    github: null,
    live: null,
    code: `// TensorFlow Lite on microcontroller: 2FA using mic + IMU
// Deploy lightweight NN on chip (TinyML)

// Pipeline: audio + IMU -> feature extraction -> inference -> auth
// Firmware in C/C++; integrates with hardware and other subteams`,
    demo: null,
    features: [
      "Secure 2FA on microcontroller using on-chip microphone and IMU sensor data",
      "Neural network deployed with TensorFlow Lite and TinyML directly on chip",
      "C/C++ firmware; software–hardware integration; collaboration across subteams",
      "Part of C2S2 DSP library (2fa: audio and IMU human classification, FA25)"
    ],
    technologies: ["C", "C++", "TensorFlow Lite", "TinyML", "Assembly"],
    timeframe: "Sep 2025 – Present",
  },
  {
    id: 7,
    name: "Eta Compiler",
    description: "A compiler in progress built with a team of three. We're implementing the standard pipeline: lexing, parsing, semantic analysis, and code generation. The repository is private.",
    techStack: "Java",
    category: "Systems",
    github: null,
    live: null,
    code: `// Eta Compiler pipeline: source -> tokens -> AST -> semantic -> codegen
// Lexer (JFlex): token stream from grammar
// Parser (CUP): build AST from token stream; symbol table for semantic phase

// Structure: cli/ | lexer/ | parser/ | util/ | Main.java`,
    demo: null,
    features: [
      "Lexing (tokenization): JFlex specs produce a token stream from source; scanner generated from grammar",
      "Parsing (syntax analysis): CUP parser builds abstract syntax tree (AST) from token stream",
      "Semantic analysis: type checking, symbol table, scope resolution (in progress)",
      "Code generation: target output from AST / IR (in progress)",
      "Java codebase: cli, lexer, parser, util packages; Main.java entry point; team of three; repo private"
    ],
    technologies: ["Java", "JFlex", "CUP"],
    timeframe: "Jan 2026 – Present",
  },
]
