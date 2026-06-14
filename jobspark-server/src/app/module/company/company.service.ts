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

const getPipelineStages = async (companyId: string) => {
  return await prisma.pipelineStage.findMany({
    where: { companyId },
    orderBy: { order: 'asc' }
  });
};

const createPipelineStage = async (companyId: string, data: { name: string; color?: string; isDefault?: boolean; order?: number }) => {
  // If order is not provided, place it at the end
  let order = data.order;
  if (order === undefined) {
    const lastStage = await prisma.pipelineStage.findFirst({
      where: { companyId },
      orderBy: { order: 'desc' }
    });
    order = lastStage ? lastStage.order + 1 : 1;
  }

  return await prisma.pipelineStage.create({
    data: {
      companyId,
      name: data.name,
      color: data.color,
      isDefault: data.isDefault || false,
      order
    }
  });
};

const updatePipelineStage = async (stageId: string, data: { name?: string; color?: string }) => {
  return await prisma.pipelineStage.update({
    where: { id: stageId },
    data
  });
};

const deletePipelineStage = async (stageId: string) => {
  return await prisma.pipelineStage.delete({
    where: { id: stageId }
  });
};

const reorderPipelineStages = async (companyId: string, stages: { id: string; order: number }[]) => {
  const transactions = stages.map(stage => 
    prisma.pipelineStage.update({
      where: { id: stage.id, companyId },
      data: { order: stage.order }
    })
  );
  return await prisma.$transaction(transactions);
};

export const CompanyService = {
  getAllCompanies,
  getCompanyById,
  getPipelineStages,
  createPipelineStage,
  updatePipelineStage,
  deletePipelineStage,
  reorderPipelineStages
};
