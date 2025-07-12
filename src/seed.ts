import { connectDB } from './db';
import { User } from './models/Profile.model';

const seedUsers = [
  {
    auth0Id: 'auth0|user1',
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    bio: 'Full Stack Developer',
    department: 'Engineering',
    degree: 'B.Tech',
    graduationYear: 2022,
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    portfolio: [
      {
        title: 'Portfolio Website',
        description: 'Built with React and TypeScript',
        link: 'https://johndoe.dev',
        tags: ['React', 'TypeScript'],
      },
    ],
  },
  {
    auth0Id: 'auth0|user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    bio: 'Backend Engineer',
    department: 'Computer Science',
    degree: 'M.Sc',
    graduationYear: 2021,
    linkedin: 'https://linkedin.com/in/janesmith',
    github: 'https://github.com/janesmith',
    portfolio: [],
  },
  {
    auth0Id: 'auth0|user3',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    bio: 'AI Researcher',
    department: 'Data Science',
    degree: 'PhD',
    graduationYear: 2020,
    linkedin: 'https://linkedin.com/in/alicejohnson',
    github: 'https://github.com/alicejohnson',
    portfolio: [
      {
        title: 'ML Pipeline',
        description: 'Machine learning pipeline with Python',
        link: '',
        tags: ['Python', 'ML'],
      },
    ],
  },
  {
    auth0Id: 'auth0|user4',
    name: 'Bob Martin',
    email: 'bob@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    bio: 'DevOps Specialist',
    department: 'IT',
    degree: 'B.E.',
    graduationYear: 2019,
    linkedin: '',
    github: 'https://github.com/bobmartin',
    portfolio: [],
  },
  {
    auth0Id: 'auth0|user5',
    name: 'Charlie Lee',
    email: 'charlie@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    bio: 'Mobile Developer',
    department: 'Software Engineering',
    degree: 'M.Tech',
    graduationYear: 2023,
    linkedin: 'https://linkedin.com/in/charlielee',
    github: '',
    portfolio: [
      {
        title: 'Fitness App',
        description: 'Built in Flutter for iOS/Android',
        link: '',
        tags: ['Flutter', 'Firebase'],
      },
    ],
  },
];

const seedDB = async () => {
  await connectDB();
  await User.deleteMany({});
  await User.insertMany(seedUsers);
  console.log('✅ Database seeded successfully!');
  process.exit(0);
};

seedDB();
