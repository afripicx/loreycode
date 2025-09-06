import prismaPkg from '@prisma/client';
const { PrismaClient } = prismaPkg as unknown as { PrismaClient: new () => any };

declare global {
  // eslint-disable-next-line no-var
  var __prisma: InstanceType<typeof PrismaClient> | undefined;
}

// Prevent multiple instances of Prisma Client in development
const prisma = (globalThis as any).__prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

export { prisma };

// Helper function to connect to the database
export async function connectToDatabase() {
  try {
    await (prisma as any).$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

// Helper function to disconnect from the database
export async function disconnectFromDatabase() {
  await (prisma as any).$disconnect();
}

// Export commonly used models for convenience
export const db = {
  user: (prisma as any).user,
  siteSettings: (prisma as any).siteSettings,
  page: (prisma as any).page,
  section: (prisma as any).section,
  service: (prisma as any).service,
  course: (prisma as any).course,
  project: (prisma as any).project,
  teamMember: (prisma as any).teamMember,
  testimonial: (prisma as any).testimonial,
  contactSubmission: (prisma as any).contactSubmission,
  mediaFile: (prisma as any).mediaFile,
  contentRevision: (prisma as any).contentRevision,
};
