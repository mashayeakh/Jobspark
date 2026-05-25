import { prisma } from "@/app/lib/prisma";

const getAllCompanies = async () => {
  const result = await prisma.company.findMany({
    include: {
      _count: {
        select: { jobs: true }
      }
    }
  });
  return result;
};

const getCompanyById = async (id: string) => {
  const result = await prisma.company.findUnique({
    where: { id },
    include: {
      jobs: true,
      recruiters: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            }
          }
        }
      },
      _count: {
        select: { jobs: true }
      }
    }
  });
  return result;
};

export const CompanyService = {
  getAllCompanies,
  getCompanyById
};
