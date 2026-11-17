// Everything personal lives here — edit this file to change the site's copy.

export const profile = {
  name: 'Utsab Karki',
  role: 'Developer',
  location: 'Nepal',
  coords: '28.39° N, 84.12° E',
  github: 'Utsabkarki',
  domain: 'utsabkarki.com.np',
  tagline:
    'I build things for the web — clean interfaces, small experiments, and the occasional Python script.',
  about: [
    'I’m a developer from Nepal who learns by shipping. Most of what I make starts as a small idea, turns into a repository, and ends up live on the internet.',
    'I care about pages that load fast, read well, and feel a little bit alive. This site is one of those experiments: the mountains behind this text are generated and rendered in real time in your browser.',
  ],
  workingWith: ['HTML', 'CSS', 'JavaScript', 'Python'],
  builtWith: ['React 19', 'Three.js', 'React Three Fiber', 'TypeScript', 'Vite 8', 'Tailwind 4'],
}

// Repositories that should never show up in the Work section.
export const hiddenRepos = ['Utsabkarki', 'Sajnu']

export type Project = {
  name: string
  description: string | null
  language: string | null
  url: string
  homepage: string | null
  pushedAt: string
}

// Shown if the GitHub API can't be reached; otherwise the list is loaded live.
export const fallbackProjects: Project[] = [
  { name: 'The-Og', description: 'The Return of GG.', language: null, url: 'https://github.com/Utsabkarki/The-Og', homepage: null, pushedAt: '2026-11-17' },
  { name: 'bbk', description: null, language: 'HTML', url: 'https://github.com/Utsabkarki/bbk', homepage: null, pushedAt: '2024-06-01' },
  { name: 'anup-karki', description: null, language: 'HTML', url: 'https://github.com/Utsabkarki/anup-karki', homepage: null, pushedAt: '2024-06-01' },
  { name: 'mywebsite', description: null, language: 'HTML', url: 'https://github.com/Utsabkarki/mywebsite', homepage: null, pushedAt: '2024-06-01' },
  { name: 'Nepal', description: null, language: 'HTML', url: 'https://github.com/Utsabkarki/Nepal', homepage: null, pushedAt: '2024-05-30' },
  { name: 'Portfolio-website', description: null, language: 'HTML', url: 'https://github.com/Utsabkarki/Portfolio-website', homepage: null, pushedAt: '2024-05-30' },
  { name: 'UTSABVAI', description: null, language: 'HTML', url: 'https://github.com/Utsabkarki/UTSABVAI', homepage: null, pushedAt: '2024-05-30' },
  { name: 'QuantumFlareHub', description: null, language: 'HTML', url: 'https://github.com/Utsabkarki/QuantumFlareHub', homepage: null, pushedAt: '2024-02-04' },
]
