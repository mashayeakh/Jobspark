import { JobService } from '../src/app/module/job/job.service';
import { prisma } from '../src/app/lib/prisma';

async function main() {
  console.log("=== Testing JobService.getAllJobs ===");

  // 1. Get all categories
  const categories = await prisma.category.findMany();
  
  // 2. Query all jobs (unfiltered)
  const allResult = await JobService.getAllJobs({});
  console.log(`Unfiltered Total (Open/Active): ${allResult.meta.total} jobs (expected around 49)`);

  // 3. Query by categoryId for each category
  for (const cat of categories) {
    const res = await JobService.getAllJobs({ categoryId: cat.id });
    if (res.meta.total > 0) {
      console.log(`Category: ${cat.name} (ID: ${cat.id}) | Filtered Total: ${res.meta.total}`);
    }
  }

  // 4. Query by location
  const locationResult = await JobService.getAllJobs({ location: "Dhaka" });
  console.log(`Location "Dhaka" Filtered Total: ${locationResult.meta.total}`);

  // 5. Query by searchTerm
  const searchResult = await JobService.getAllJobs({ searchTerm: "Senior" });
  console.log(`SearchTerm "Senior" Filtered Total: ${searchResult.meta.total}`);

  // 6. Query by minSalary
  const salaryResult = await JobService.getAllJobs({ minSalary: 60000 });
  console.log(`Salary >= 60000 Filtered Total: ${salaryResult.meta.total}`);
}

main()
  .catch(err => console.error(err))
  .finally(async () => await prisma.$disconnect());
