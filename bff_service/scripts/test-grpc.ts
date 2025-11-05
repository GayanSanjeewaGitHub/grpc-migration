import axios from 'axios';

const BFF_URL = 'http://localhost:3000';

async function testGrpcEndpoints() {
  console.log('⚡ Testing gRPC API endpoints through BFF...\n');

  try {
    // Test users endpoint via gRPC
    console.log('👥 Testing users endpoint via gRPC...');
    const usersResponse = await axios.get(`${BFF_URL}/api/grpc/users`);
    console.log('✅ Users Response (gRPC):', usersResponse.data);
    console.log();

    // Test products endpoint via gRPC
    console.log('📦 Testing products endpoint via gRPC...');
    const productsResponse = await axios.get(`${BFF_URL}/api/grpc/products`);
    console.log('✅ Products Response (gRPC):', productsResponse.data);
    console.log();

    // Test specific user via gRPC
    console.log('👤 Testing specific user (ID: 1) via gRPC...');
    const userResponse = await axios.get(`${BFF_URL}/api/grpc/users/1`);
    console.log('✅ User Response (gRPC):', userResponse.data);
    console.log();

    // Test specific product via gRPC
    console.log('📱 Testing specific product (ID: 1) via gRPC...');
    const productResponse = await axios.get(`${BFF_URL}/api/grpc/products/1`);
    console.log('✅ Product Response (gRPC):', productResponse.data);
    console.log();

    // Test dashboard endpoint via gRPC
    console.log('📊 Testing dashboard endpoint via gRPC...');
    const dashboardResponse = await axios.get(`${BFF_URL}/api/grpc/dashboard`);
    console.log('✅ Dashboard Response (gRPC):', dashboardResponse.data);
    console.log();

    // Test filtered users (Engineering department)
    console.log('🔍 Testing filtered users (department=Engineering) via gRPC...');
    const filteredUsersResponse = await axios.get(`${BFF_URL}/api/grpc/users?department=Engineering`);
    console.log('✅ Filtered Users Response (gRPC):', filteredUsersResponse.data);
    console.log();

    // Test filtered products (Electronics category)
    console.log('🔍 Testing filtered products (category=Electronics) via gRPC...');
    const filteredProductsResponse = await axios.get(`${BFF_URL}/api/grpc/products?category=Electronics`);
    console.log('✅ Filtered Products Response (gRPC):', filteredProductsResponse.data);
    console.log();

    console.log('🎉 All gRPC API tests completed successfully!');
    console.log('\n📊 Performance Note: gRPC typically offers better performance than REST for:');
    console.log('   - High-frequency requests');
    console.log('   - Streaming data');
    console.log('   - Binary data transfer');
    console.log('   - Microservices communication');

  } catch (error: any) {
    console.error('❌ Error testing gRPC APIs:', error.response?.data || error.message);
    console.log('\n💡 Make sure all services are running:');
    console.log('   - BFF Service: npm run dev (port 3000)');
    console.log('   - Service1 REST: port 3001, gRPC: port 50051');
    console.log('   - Service2 REST: port 3002, gRPC: port 50052');
  }
}

// Run the tests
testGrpcEndpoints();