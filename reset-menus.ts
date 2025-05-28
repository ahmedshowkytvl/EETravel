import { seedMenus } from './server/seed-menus';

async function resetMenus() {
  // Reset menus with reset=true parameter
  await seedMenus(true);
  console.log('Menu reset complete');
}

resetMenus()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });