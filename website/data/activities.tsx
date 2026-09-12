import { GraduationCap, MapPin, Package, Puzzle, BookOpen, Briefcase, Library, Users, MessageCircle } from 'lucide-react'
import type { Activity } from '../types'

export const activities: Activity[] = [
  {
    title: 'Funded Scholarships',
    description: 'We help children from rural areas across India get their right to education through funded scholarships, making quality education accessible.',
    icon: <GraduationCap className="w-10 h-10 text-gold-500" strokeWidth={1.5} />,
  },
  {
    title: 'Travel & Meet the Kids',
    description: 'Our team travels to rural areas to personally meet the children, understand their needs, and build meaningful connections with the communities we serve.',
    icon: <MapPin className="w-10 h-10 text-gold-500" strokeWidth={1.5} />,
  },
  {
    title: 'Essential Supplies Distribution',
    description: 'We distribute school bags, notebooks, pens, stationery, sanitary pads, drawing kits, and other essential supplies to support children\'s education.',
    icon: <Package className="w-10 h-10 text-gold-500" strokeWidth={1.5} />,
  },
  {
    title: 'Educational Games & Activities',
    description: 'We organize fun educational games and interactive activities that make learning enjoyable and help children develop critical thinking skills.',
    icon: <Puzzle className="w-10 h-10 text-gold-500" strokeWidth={1.5} />,
  },
  {
    title: 'Cultural Awareness Programs',
    description: 'We share stories of language and culture, helping children understand their history. Children leave knowing their roots better.',
    icon: <BookOpen className="w-10 h-10 text-gold-500" strokeWidth={1.5} />,
  },
  {
    title: 'Career Counselling',
    description: 'We provide career counselling to 9th and 10th standard students, helping them make informed decisions about their future education and career paths.',
    icon: <Briefcase className="w-10 h-10 text-gold-500" strokeWidth={1.5} />,
  },
  {
    title: 'Library Setup',
    description: 'We establish libraries in rural schools with donated books including story books, academic books, and unused notebooks, creating spaces for learning and exploration.',
    icon: <Library className="w-10 h-10 text-gold-500" strokeWidth={1.5} />,
  },
  {
    title: 'Community Engagement',
    description: 'We organize community events, talent showcases, and interactive sessions where children can express themselves through singing, dancing, and other activities.',
    icon: <Users className="w-10 h-10 text-gold-500" strokeWidth={1.5} />,
  },
  {
    title: 'Parent Counselling',
    description: 'We offer parent counselling to support families in understanding their children\'s educational needs, fostering a supportive home environment for learning.',
    icon: <MessageCircle className="w-10 h-10 text-gold-500" strokeWidth={1.5} />,
  },
]
