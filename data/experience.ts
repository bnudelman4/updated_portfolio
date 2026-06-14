import type { ExperienceEntry } from '@/lib/types'

export const experience: ExperienceEntry[] = [
  {
    id: 'aws',
    logo: '/aws.png',
    role: 'Software Development Engineer Intern',
    org: 'Amazon Web Services',
    start: 'Aug 2026',
    end: 'Oct 2026',
    bullets: [
      'Joining the Amazon GameLift Servers Experience team in Seattle, WA.',
      'The team builds game-server hosting infrastructure, including the AWS Console, the Server SDK, and matchmaking services.',
    ],
  },
  {
    id: 'c2s2',
    logo: '/c2s2.png',
    role: 'Embedded Software Engineer',
    org: 'Cornell Custom Silicon Systems (C2S2)',
    start: 'Sep 2025',
    end: 'Present',
    bullets: [
      'Designed and deployed a neural network with TensorFlow Lite on a microcontroller for a secure two-factor authentication system using on-chip microphone and IMU sensor data.',
      'Write firmware in C and C++ that runs directly on microcontrollers, integrating software with hardware and developing collaboratively with other subteams.',
      'Use libraries such as TinyML to deploy lightweight neural networks directly on chip.',
    ],
  },
  {
    id: 'in21',
    logo: '/in21.png',
    role: 'Lead Software Developer',
    org: 'In21',
    start: 'June 2025',
    end: 'Present',
    bullets: [
      'Co-founded a productivity application catered to teenagers and young adults interested in self-improvement.',
      'Built an efficient backend for storing user contact information and metrics from in-app activities and surveys, plus a messaging system between users and an email verification / sending system.',
      'Used Figma to design the page flows, then directly implemented the front end and APIs in React Native.',
    ],
  },
]
