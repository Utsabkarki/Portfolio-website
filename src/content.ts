// Everything personal lives here — edit this file to change the site's copy.

export const profile = {
  name: 'Utsab Karki',
  role: 'Student · Developer · Editor',
  location: 'Kyoto, Japan',
  timeZone: 'Asia/Tokyo',
  github: 'Utsabkarki',
  domain: 'utsabkarki.com.np',
  tagline:
    'Computer science student in Japan, building modern web experiences with an editor’s eye for detail.',
  about: [
    'I’m a student at Kyoto Computer Gakuin (KCG) in Japan, where I study computing and software development.',
    'Alongside my studies I build for the web and work in editing. Both come down to the same discipline: take something rough, cut what doesn’t belong, and deliver a clean, finished result on time.',
    'Moving to Japan to study taught me to adapt quickly, communicate across languages and stay curious. I bring that to every project I take on.',
  ],
}

export const facts: { label: string; value: string }[] = [
  { label: 'Based in', value: 'Kyoto, Japan' },
  { label: 'Studying at', value: 'Kyoto Computer Gakuin (KCG)' },
  { label: 'Focus', value: 'Web development & editing' },
  { label: 'Languages', value: 'Nepali · English · Japanese' },
]

export const services: { title: string; detail: string }[] = [
  { title: 'Web development', detail: 'Fast, responsive sites built with modern tools — React, TypeScript and clean, semantic HTML and CSS.' },
  { title: 'Editing', detail: 'Turning raw material into polished, finished work with attention to pacing, consistency and deadlines.' },
  { title: 'Interactive 3D', detail: 'Real-time graphics in the browser with Three.js and custom shaders, like the landscape behind this page.' },
]

export type Entry = { title: string; place: string; period: string; detail: string }

export const education: Entry[] = [
  {
    title: 'Student, Computer Science',
    place: 'Kyoto Computer Gakuin (KCG) — Japan',
    period: 'Present',
    detail: 'Studying computing fundamentals, programming and web technologies.',
  },
]

export const experience: Entry[] = [
  {
    title: 'Editor',
    place: 'Editing',
    period: '',
    detail:
      'Hands-on editing experience: shaping raw material into polished, finished work with attention to pacing, consistency and deadlines.',
  },
]

export const skills: { group: string; items: string[] }[] = [
  { group: 'Development', items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Python'] },
  { group: 'Creative', items: ['Editing', '3D for the web', 'UI design'] },
  { group: 'Languages', items: ['Nepali', 'English', 'Japanese'] },
]
