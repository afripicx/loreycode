import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Super Admin user
  const hashedPassword = await bcrypt.hash('admin123!', 10);
  
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@loreycode.com' },
    update: {},
    create: {
      email: 'admin@loreycode.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
    },
  });

  console.log('✅ Created Super Admin user:', superAdmin.email);

  // Site Settings
  const siteSettings = [
    { key: 'site_title', value: 'LoreyCode Developers', type: 'text', description: 'Main site title' },
    { key: 'site_description', value: 'Professional ICT training and development services', type: 'text', description: 'Site meta description' },
    { key: 'company_name', value: 'LoreyCode Developers', type: 'text', description: 'Company name' },
    { key: 'footer_year', value: '2024', type: 'text', description: 'Copyright year in footer' },
    { key: 'contact_phone_1', value: '0748261019', type: 'text', description: 'Primary phone number' },
    { key: 'contact_phone_2', value: '0705660783', type: 'text', description: 'Secondary phone number' },
    { key: 'contact_email', value: 'loreycode@gmail.com', type: 'text', description: 'Contact email address' },
    { key: 'contact_location', value: 'Kenya', type: 'text', description: 'Business location' },
    { key: 'business_hours', value: 'Mon - Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 4:00 PM', type: 'text', description: 'Business operating hours' },
    { key: 'social_facebook', value: 'https://facebook.com/loreycode', type: 'text', description: 'Facebook URL' },
    { key: 'social_twitter', value: 'https://twitter.com/loreycode', type: 'text', description: 'Twitter URL' },
    { key: 'social_instagram', value: 'https://instagram.com/loreycode', type: 'text', description: 'Instagram URL' },
    { key: 'social_linkedin', value: 'https://linkedin.com/company/loreycode', type: 'text', description: 'LinkedIn URL' },
    { key: 'social_github', value: 'https://github.com/loreycode', type: 'text', description: 'GitHub URL' },
    { key: 'hero_title', value: 'Build Your Digital Future with LoreyCode', type: 'text', description: 'Homepage hero title' },
    { key: 'hero_subtitle', value: 'Transform your career with professional ICT training, custom software development, and cutting-edge technology solutions.', type: 'text', description: 'Homepage hero subtitle' },
    { key: 'stats_students', value: '500+', type: 'text', description: 'Number of students trained' },
    { key: 'stats_projects', value: '50+', type: 'text', description: 'Number of projects delivered' },
    { key: 'stats_experience', value: '5+', type: 'text', description: 'Years of experience' },
    { key: 'stats_placement_rate', value: '95%', type: 'text', description: 'Job placement rate' },
  ];

  for (const setting of siteSettings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log('✅ Created site settings');

  // Create default pages
  const pages = [
    { slug: 'home', title: 'Home', description: 'Homepage of LoreyCode website' },
    { slug: 'about', title: 'About Us', description: 'About LoreyCode Developers' },
    { slug: 'services', title: 'Our Services', description: 'Services offered by LoreyCode' },
    { slug: 'portfolio', title: 'Portfolio', description: 'Our projects and portfolio' },
    { slug: 'classes', title: 'Classes', description: 'ICT training classes and courses' },
    { slug: 'contact', title: 'Contact Us', description: 'Get in touch with LoreyCode' },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }

  console.log('✅ Created default pages');

  // Sample Services
  const services = [
    {
      title: 'Web Development',
      description: 'Custom websites and web applications using modern technologies like React, Node.js, and PHP.',
      icon: 'Globe',
      features: JSON.stringify(['Responsive Design', 'E-commerce Solutions', 'CMS Development']),
      order: 1,
    },
    {
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android devices.',
      icon: 'Smartphone',
      features: JSON.stringify(['iOS & Android Apps', 'Cross-platform Solutions', 'App Store Deployment']),
      order: 2,
    },
    {
      title: 'ICT Training',
      description: 'Professional training courses in programming, web development, and digital skills.',
      icon: 'GraduationCap',
      features: JSON.stringify(['Beginner to Advanced', 'Hands-on Projects', 'Certificate Programs']),
      order: 3,
    },
  ];

  for (const service of services) {
    await prisma.service.create({
      data: service,
    });
  }

  console.log('✅ Created sample services');

  // Sample Courses
  const courses = [
    {
      title: 'Web Development Fundamentals',
      description: 'Learn HTML, CSS, JavaScript, and modern frameworks to build professional websites.',
      level: 'Beginner',
      price: 'KSh 25,000',
      duration: '12 weeks',
      lessons: 40,
      students: 24,
      isFeatured: true,
      order: 1,
    },
    {
      title: 'Full Stack Development',
      description: 'Master both frontend and backend development with React, Node.js, and databases.',
      level: 'Intermediate',
      price: 'KSh 45,000',
      duration: '16 weeks',
      lessons: 60,
      students: 18,
      isFeatured: true,
      order: 2,
    },
    {
      title: 'Mobile App Development',
      description: 'Build native and cross-platform mobile applications for iOS and Android.',
      level: 'Advanced',
      price: 'KSh 60,000',
      duration: '20 weeks',
      lessons: 80,
      students: 12,
      isFeatured: true,
      order: 3,
    },
  ];

  for (const course of courses) {
    await prisma.course.create({
      data: course,
    });
  }

  console.log('✅ Created sample courses');

  // Sample Projects
  const projects = [
    {
      title: 'E-commerce Platform',
      description: 'A modern e-commerce platform with advanced features and secure payment integration.',
      category: 'Web Development',
      technologies: JSON.stringify(['React', 'Node.js', 'MongoDB', 'Stripe']),
      images: JSON.stringify(['/placeholder-project-1.jpg']),
      isFeatured: true,
      order: 1,
    },
    {
      title: 'Learning Management System',
      description: 'A comprehensive LMS for online education with video streaming and progress tracking.',
      category: 'Web Development',
      technologies: JSON.stringify(['Vue.js', 'Laravel', 'MySQL', 'AWS']),
      images: JSON.stringify(['/placeholder-project-2.jpg']),
      isFeatured: true,
      order: 2,
    },
    {
      title: 'Mobile Banking App',
      description: 'Secure mobile banking application with biometric authentication and real-time transactions.',
      category: 'Mobile App',
      technologies: JSON.stringify(['React Native', 'Node.js', 'PostgreSQL', 'Firebase']),
      images: JSON.stringify(['/placeholder-project-3.jpg']),
      isFeatured: true,
      order: 3,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({
      data: project,
    });
  }

  console.log('✅ Created sample projects');

  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('Super Admin Login:');
  console.log('Email: admin@loreycode.com');
  console.log('Password: admin123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
