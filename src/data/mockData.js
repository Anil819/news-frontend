// Mock data used to render the UI. In production this would come from
// the Express + MongoDB API (see /server in the full-stack version).

export const newsCategories = [
  'All News',
  'Academics',
  'Events',
  'Placements',
  'Campus',
  'Announcements',
  'Sports'
]

export const newsItems = [
  {
    id: 1,
    title: 'Annual Sports Meet 2024 Successfully Concluded',
    excerpt:
      'The Annual Sports Meet was a grand success with enthusiastic participation from students.',
    date: 'May 12, 2024',
    day: '12',
    month: 'May',
    category: 'Sports',
    image:
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=400&fit=crop'
  },
  {
    id: 2,
    title: 'Library New Digital Resources Added',
    excerpt:
      'The library has added new digital resources for students and faculty members.',
    date: 'May 10, 2024',
    day: '10',
    month: 'May',
    category: 'Academics',
    image:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=400&fit=crop'
  },
  {
    id: 3,
    title: 'Placement Drive By Tech Solutions',
    excerpt:
      'Tech Solutions conducted a successful placement drive for final year students.',
    date: 'May 08, 2024',
    day: '08',
    month: 'May',
    category: 'Placements',
    image:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop'
  },
  {
    id: 4,
    title: 'Workshop on Cyber Security',
    excerpt:
      'A hands-on workshop on Cyber Security was organized for students.',
    date: 'May 05, 2024',
    day: '05',
    month: 'May',
    category: 'Academics',
    image:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop'
  }
]

export const upcomingEvents = [
  {
    id: 1,
    title: 'Guest Lecture on Web Development',
    date: '20 May 2024',
    day: '20',
    month: 'May',
    time: '10:00 AM - 12:00 PM',
    location: 'Seminar Hall',
    image:
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop'
  },
  {
    id: 2,
    title: 'Annual Cultural Fest 2024',
    date: '25 May 2024',
    day: '25',
    month: 'May',
    time: '09:00 AM - 06:00 PM',
    location: 'College Campus',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop'
  },
  {
    id: 3,
    title: 'Workshop on AI & ML',
    date: '30 May 2024',
    day: '30',
    month: 'May',
    time: '11:00 AM - 01:00 PM',
    location: 'Computer Lab',
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop'
  }
]

export const galleryCategories = ['All', 'Events', 'Campus', 'Sports', 'Cultural', 'Workshops']

export const galleryImages = [
  { id: 1, category: 'Campus', src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop' },
  { id: 2, category: 'Sports', src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop' },
  { id: 3, category: 'Events', src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&h=300&fit=crop' },
  { id: 4, category: 'Sports', src: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop' },
  { id: 5, category: 'Cultural', src: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&h=300&fit=crop' },
  { id: 6, category: 'Events', src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop' },
  { id: 7, category: 'Workshops', src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop' },
  { id: 8, category: 'Campus', src: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=400&h=300&fit=crop' },
  { id: 9, category: 'Cultural', src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop' },
  { id: 10, category: 'Workshops', src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop' },
  { id: 11, category: 'Campus', src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop' },
  { id: 12, category: 'Events', src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=300&fit=crop' }
]

export const recentNewsAdmin = [
  { title: 'Annual Sports Meet 2024 Successfully Concluded', category: 'Campus', date: 'May 12, 2024', status: 'Published' },
  { title: 'Library New Digital Resources Added', category: 'Academics', date: 'May 10, 2024', status: 'Published' },
  { title: 'Placement Drive By Tech Solutions', category: 'Placements', date: 'May 08, 2024', status: 'Published' },
  { title: 'Workshop on Cyber Security', category: 'Workshops', date: 'May 05, 2024', status: 'Draft' }
]

export const adminStats = [
  { label: 'Total News', value: 25, change: '+12% from last month' },
  { label: 'Total Events', value: 12, change: '+8% from last month' },
  { label: 'Total Users', value: '1,245', change: '+15% from last month' },
  { label: 'Messages', value: 18, change: '+5% from last month' }
]

// ---------- Student dashboard ----------

export const studentStats = [
  { label: 'Attendance', value: '92%', change: '+2% from last month' },
  { label: 'Pending Assignments', value: 3, change: '2 due this week' },
  { label: 'Upcoming Exams', value: 2, change: 'Next on May 28' },
  { label: 'Unread Messages', value: 5, change: '3 from faculty' }
]

export const studentCourses = [
  { id: 1, name: 'Data Structures & Algorithms', instructor: 'Dr. R. Sharma', progress: 78 },
  { id: 2, name: 'Database Management Systems', instructor: 'Prof. A. Mehta', progress: 64 },
  { id: 3, name: 'Computer Networks', instructor: 'Dr. S. Iyer', progress: 85 },
  { id: 4, name: 'Operating Systems', instructor: 'Prof. K. Nair', progress: 52 }
]

export const studentAssignments = [
  { title: 'DBMS Normalization Worksheet', course: 'DBMS', due: 'May 22, 2024', status: 'Pending' },
  { title: 'Sorting Algorithms Report', course: 'DSA', due: 'May 20, 2024', status: 'Submitted' },
  { title: 'OSI Model Case Study', course: 'Networks', due: 'May 18, 2024', status: 'Submitted' },
  { title: 'Process Scheduling Quiz', course: 'OS', due: 'May 25, 2024', status: 'Pending' }
]

// ---------- Teacher dashboard ----------

export const teacherStats = [
  { label: 'My Classes', value: 6, change: '2 sections this term' },
  { label: 'Total Students', value: 184, change: '+10 this term' },
  { label: 'Pending Reviews', value: 14, change: '5 due this week' },
  { label: 'Messages', value: 9, change: '4 from students' }
]

export const teacherClasses = [
  { id: 1, name: 'Data Structures & Algorithms', section: 'CSE - A', students: 48, schedule: 'Mon, Wed 10:00 AM' },
  { id: 2, name: 'Database Management Systems', section: 'CSE - B', students: 45, schedule: 'Tue, Thu 11:00 AM' },
  { id: 3, name: 'Computer Networks', section: 'CSE - A', students: 48, schedule: 'Fri 09:00 AM' },
  { id: 4, name: 'Operating Systems', section: 'CSE - C', students: 43, schedule: 'Mon, Thu 02:00 PM' }
]

export const teacherSubmissions = [
  { student: 'Aarav Patel', assignment: 'Sorting Algorithms Report', date: 'May 20, 2024', status: 'Reviewed' },
  { student: 'Diya Sharma', assignment: 'OSI Model Case Study', date: 'May 18, 2024', status: 'Pending' },
  { student: 'Rohan Gupta', assignment: 'Sorting Algorithms Report', date: 'May 19, 2024', status: 'Pending' },
  { student: 'Isha Verma', assignment: 'Process Scheduling Quiz', date: 'May 21, 2024', status: 'Reviewed' }
]
