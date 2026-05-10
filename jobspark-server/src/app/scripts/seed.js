import { seedMarketData } from './seedMarketData.ts';

// Run the market data seeding
seedMarketData()
  .then(() => {
    console.log('🎉 Market data seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Market data seeding failed:', error);
    process.exit(1);
  });
