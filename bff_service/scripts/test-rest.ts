import axios from 'axios';

const BFF_URL = 'http://localhost:3000';

async function testRestEndpoints() {
  console.log('🧪 Testing REST API endpoints through BFF...\n');

  try {
    // Test BFF health
    console.log('📋 Testing BFF health...');
    const healthResponse = await axios.get(`${BFF_URL}/health`);
    console.log('✅ BFF Health:', healthResponse.data);
    console.log();

    // Test users endpoint
    console.log('👥 Testing users endpoint...');
    const usersResponse = await axios.get(`${BFF_URL}/api/rest/users`);
    console.log('✅ Users Response:', usersResponse.data);
    console.log();

    // Test products endpoint
    console.log('📦 Testing products endpoint...');
    const productsResponse = await axios.get(`${BFF_URL}/api/rest/products`);
    console.log('✅ Products Response:', productsResponse.data);
    console.log();

    // Test specific user
    console.log('👤 Testing specific user (ID: 1)...');
    const userResponse = await axios.get(`${BFF_URL}/api/rest/users/1`);
    console.log('✅ User Response:', userResponse.data);
    console.log();

    // Test specific product
    console.log('📱 Testing specific product (ID: 1)...');
    const productResponse = await axios.get(`${BFF_URL}/api/rest/products/1`);
    console.log('✅ Product Response:', productResponse.data);
    console.log();

    // Test dashboard endpoint
    console.log('📊 Testing dashboard endpoint...');
    const dashboardResponse = await axios.get(`${BFF_URL}/api/rest/dashboard`);
    console.log('✅ Dashboard Response:', dashboardResponse.data);
    console.log();

    console.log('🎉 All REST API tests completed successfully!');

  } catch (error: any) {
    console.error('❌ Error testing REST APIs:', error.response?.data || error.message);
    console.log('\n💡 Make sure all services are running:');
    console.log('   - BFF Service: npm run dev (port 3000)');
    console.log('   - Service1: npm run dev (port 3001)');
    console.log('   - Service2: npm run dev (port 3002)');
  }
}

// Run the tests
testRestEndpoints();