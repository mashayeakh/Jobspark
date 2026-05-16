import { prisma } from "@/app/lib/prisma";

export const BlogService = {
  createBlog: async (data: any) => {
    return await prisma.blog.create({
      data,
    });
  },

  getAllBlogs: async () => {
    return await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  getSingleBlog: async (id: string) => {
    return await prisma.blog.findUnique({
      where: { id },
    });
  },
};
