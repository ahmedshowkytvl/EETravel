import { storage } from './server/storage';

async function testStorageConnection() {
  try {
    console.log('Testing storage connection directly...');
    const packages = await storage.listPackages();
    console.log('Packages retrieved:', packages.length);
    console.log('First package:', packages[0]);
  } catch (error) {
    console.error('Storage test failed:', error);
  }
}

testStorageConnection();