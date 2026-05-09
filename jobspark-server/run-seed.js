import { seedJobs } from './src/app/scripts/seedJobs.js';

seedJobs()
  .then(() => {
    console.log("Job seeding completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Job seeding failed:", error);
    process.exit(1);
  });
