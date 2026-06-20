const User = require('../repositories/models/User');
const Company = require('../repositories/models/Company');
const Job = require('../repositories/models/Job');

const seedData = async () => {
  try {
    // Check if we already have jobs
    const jobCount = await Job.countDocuments();
    if (jobCount > 0) {
      console.log('Database already has jobs, skipping seeding.');
      return;
    }

    console.log('Seeding database with professional mock data...');

    // 1. Create a mock recruiter
    let recruiter = await User.findOne({ email: 'recruiter@enterprise.com' });
    if (!recruiter) {
      recruiter = new User({
        name: 'Alex Rivera',
        email: 'recruiter@enterprise.com',
        password: 'password123',
        role: 'recruiter',
        emailVerified: true
      });
      await recruiter.save();
    }

    // 2. Create some companies
    const companyData = [
      {
        name: 'Stripe',
        website: 'https://stripe.com',
        logo: 'https://ui-avatars.com/api/?name=Stripe&background=635BFF&color=fff&rounded=true&bold=true',
        description: 'Financial infrastructure for the internet. Millions of companies of all sizes use Stripe.',
        recruiterId: recruiter._id
      },
      {
        name: 'Vercel',
        website: 'https://vercel.com',
        logo: 'https://ui-avatars.com/api/?name=Vercel&background=000&color=fff&rounded=true&bold=true',
        description: 'Vercel provides developer tools and cloud infrastructure to build, deploy, and scale web applications.',
        recruiterId: recruiter._id
      },
      {
        name: 'Supabase',
        website: 'https://supabase.com',
        logo: 'https://ui-avatars.com/api/?name=Supabase&background=3ECF8E&color=fff&rounded=true&bold=true',
        description: 'Supabase is an open source Firebase alternative. Build production-grade backends in minutes.',
        recruiterId: recruiter._id
      }
    ];

    const companies = [];
    for (const c of companyData) {
      let comp = await Company.findOne({ name: c.name });
      if (!comp) {
        comp = new Company(c);
        await comp.save();
      }
      companies.push(comp);
    }

    // 3. Create jobs
    const jobsData = [
      {
        title: 'Senior Frontend Engineer',
        companyId: companies[0]._id, // Stripe
        location: 'San Francisco, CA (Hybrid)',
        salary: '8 - 14 LPA',
        description: 'We are looking for a Senior Frontend Engineer to build beautiful, highly responsive payment UI components and dashboard widgets. You will work closely with designers and product managers to define next-generation financial user experiences.',
        requirements: [
          '5+ years of production experience with modern JavaScript frameworks.',
          'Strong understanding of CSS systems, layout strategies, and web performance optimization.',
          'Experience designing reusable UI components libraries.',
          'Passionate about details, smooth micro-interactions, and accessibility (WCAG).'
        ],
        type: 'full-time',
        recruiterId: recruiter._id,
        status: 'Active',
        experienceLevel: 'senior'
      },
      {
        title: 'Lead Product Designer',
        companyId: companies[1]._id, // Vercel
        location: 'New York, NY (Hybrid)',
        salary: '10 - 16 LPA',
        description: 'Join Vercel to shape the future of visual editing, dashboard management, and framework developer tools. You will lead design initiatives, build high-fidelity interactive prototypes, and collaborate with engineering on standard components.',
        requirements: [
          '6+ years of UX/UI product design experience, preferably in developer tools or SaaS.',
          'Strong portfolio demonstrating sleek visual design, clear information hierarchy, and clean typography.',
          'Expertise in Figma and building advanced design systems.',
          'Ability to write HTML/CSS is a major plus.'
        ],
        type: 'full-time',
        recruiterId: recruiter._id,
        status: 'Active',
        experienceLevel: 'senior'
      },
      {
        title: 'Backend Node.js Engineer',
        companyId: companies[2]._id, // Supabase
        location: 'Remote (Global)',
        salary: '6 - 10 LPA',
        description: 'Help us build robust, distributed real-time APIs using Node.js, Express, Socket.io, and Redis. You will optimize complex database queries, scale messaging layers, and maintain strict security standards.',
        requirements: [
          '3+ years of professional backend development with Node.js and Mongoose/Postgres.',
          'Solid understanding of Redis caching and distributed task queues (like BullMQ).',
          'Experience with WebSocket technologies and state synchronization.',
          'Strong knowledge of JWT authentication and access control policies (RBAC).'
        ],
        type: 'remote',
        recruiterId: recruiter._id,
        status: 'Active',
        experienceLevel: 'mid'
      },
      {
        title: 'Developer Relations Intern',
        companyId: companies[1]._id, // Vercel
        location: 'Remote (US)',
        salary: '₹10K - ₹15K / month',
        description: 'Are you a junior developer passionate about sharing knowledge, creating content, and engaging with communities? Join Vercel as a Developer Relations Intern to write tutorials, run hackathons, and help developers build fast websites.',
        requirements: [
          'Current student or recent graduate in Computer Science, or self-taught developer with active GitHub.',
          'Excellent written communication skills and active developer presence (Twitter/GitHub/Blog).',
          'Basic understanding of Git, HTML, CSS, and modern web frameworks.',
          'Eagerness to learn, build, and teach others.'
        ],
        type: 'internship',
        recruiterId: recruiter._id,
        status: 'Active',
        experienceLevel: 'entry'
      }
    ];

    const jobTitles = [
      'Data Scientist', 'DevOps Engineer', 'iOS Developer', 'Android Developer', 
      'Product Manager', 'QA Automation Engineer', 'Cloud Architect', 'Security Analyst', 
      'UX Researcher', 'Machine Learning Engineer', 'Technical Lead', 'Data Engineer',
      'Site Reliability Engineer', 'Engineering Manager', 'Frontend Developer',
      'Backend Developer', 'Full Stack Developer', 'System Administrator',
      'Blockchain Engineer', 'Game Developer'
    ];
    const locations = ['Remote (Global)', 'New York, NY (Hybrid)', 'San Francisco, CA (Hybrid)', 'Austin, TX (On-site)', 'London, UK (Remote)'];
    
    for (let i = 0; i < 20; i++) {
      jobsData.push({
        title: jobTitles[i],
        companyId: companies[i % companies.length]._id,
        location: locations[i % locations.length],
        salary: `${3 + (i % 5)} - ${5.5 + (i % 5)} LPA`,
        description: 'We are looking for an experienced professional to join our team. You will be working on cutting-edge features and collaborating with a world-class team to deliver high-quality software solutions.',
        requirements: [
          '3+ years of relevant industry experience.',
          'Strong problem-solving skills and attention to detail.',
          'Excellent communication and teamwork abilities.'
        ],
        type: i % 4 === 0 ? 'remote' : 'full-time',
        recruiterId: recruiter._id,
        status: 'Active',
        experienceLevel: i % 3 === 0 ? 'senior' : (i % 2 === 0 ? 'mid' : 'entry')
      });
    }

    await Job.insertMany(jobsData);
    console.log('Seeding completed successfully with 20 additional jobs!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedData;
