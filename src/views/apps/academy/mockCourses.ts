import boyAppAcademy from '@/assets/images/illustrations/boy-app-academy.png'
import girlAppAcademy from '@/assets/images/illustrations/girl-app-academy.png'

export interface Course {
  id: number
  courseTitle: string
  desc: string
  time: string
  rating: number
  ratingCount: number
  tags: string
  color: string
  logo: string
  tutorImg: string
  completedTasks: number
  totalTasks: number
  user: string
  userCount: number
  note: number
  view: string
  image: string
}

export const mockCoursesData: Course[] = [
  {
    id: 1,
    courseTitle: 'Fundamentos de Desenho de Observação',
    desc: 'Aprenda a ver e registrar proporções exatas usando materiais básicos.',
    time: '15h 30m',
    rating: 4.8,
    ratingCount: 124,
    tags: 'Desenho',
    color: 'primary',
    logo: 'tabler-pencil',
    tutorImg: boyAppAcademy,
    completedTasks: 35,
    totalTasks: 50,
    user: 'Arthur Oliveira',
    userCount: 308,
    note: 45,
    view: '2.5k',
    image: boyAppAcademy,
  },
  {
    id: 2,
    courseTitle: 'Aquarela: Texturas e Luz',
    desc: 'Domine a arte da aquarela desde o básico até técnicas úmidas complexas.',
    time: '8h 45m',
    rating: 4.9,
    ratingCount: 89,
    tags: 'Pintura',
    color: 'info',
    logo: 'tabler-palette',
    tutorImg: girlAppAcademy,
    completedTasks: 20,
    totalTasks: 20,
    user: 'Danielle Santos',
    userCount: 201,
    note: 30,
    view: '1.8k',
    image: girlAppAcademy,
  },
  {
    id: 3,
    courseTitle: 'Perspectiva para Arquitetura',
    desc: 'Trabalhe composições com 1, 2 e 3 pontos de fuga para cenários precisos.',
    time: '12h 10m',
    rating: 4.6,
    ratingCount: 56,
    tags: 'Arquitetura',
    color: 'warning',
    logo: 'tabler-building',
    tutorImg: boyAppAcademy,
    completedTasks: 15,
    totalTasks: 40,
    user: 'Carlos Mendonça',
    userCount: 95,
    note: 15,
    view: '900',
    image: boyAppAcademy,
  },
  {
    id: 4,
    courseTitle: 'Retrato e Figura Humana',
    desc: 'Estudo de anatomia, gestual e proporções de cabeça do zero ao avançado.',
    time: '22h 15m',
    rating: 4.7,
    ratingCount: 210,
    tags: 'Anatomia',
    color: 'error',
    logo: 'tabler-user',
    tutorImg: girlAppAcademy,
    completedTasks: 5,
    totalTasks: 60,
    user: 'Beatriz Costa',
    userCount: 450,
    note: 80,
    view: '3.4k',
    image: girlAppAcademy,
  },
  {
    id: 5,
    courseTitle: 'Introdução à Arte Digital 2D',
    desc: 'Aprenda a usar tablets e softwares como Photoshop e Procreate.',
    time: '18h 00m',
    rating: 4.8,
    ratingCount: 150,
    tags: 'Digital',
    color: 'success',
    logo: 'tabler-device-ipad',
    tutorImg: girlAppAcademy,
    completedTasks: 25,
    totalTasks: 30,
    user: 'Beatriz Costa',
    userCount: 300,
    note: 60,
    view: '2.8k',
    image: girlAppAcademy,
  },
]
