import { prisma } from '@/app/lib/prisma';
import { IReview } from './review.interface';

const createReview = async (payload: IReview) => {
  const result = await prisma.review.create({
    data: payload,
  });
  return result;
};

const getAllReviews = async () => {
  const result = await prisma.review.findMany({
    include: {
      author: {
        select: {
          name: true,
          image: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return result;
};

export const ReviewService = {
  createReview,
  getAllReviews,
};
