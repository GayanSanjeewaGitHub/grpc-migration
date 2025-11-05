import axios from 'axios';

const BFF_URL = 'http://localhost:3000';

interface TestResult {
  protocol: string;
  endpoint: string;
  duration: number;
  success: boolean;
  error?: string;
}

async function measureRequest(url: string, protocol: string, endpoint: string): Promise<TestResult> {
  const startTime = Date.now();
  try {
    await axios.get(url);
    const duration = Date.now() - startTime;
    return { protocol, endpoint, duration, success: true };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    return { 
      protocol, 
      endpoint, 
      duration, 
      success: false, 
      error: error.message 
    };
  }
}

async function comparePerformance() {
  console.log('🔬 REST vs gRPC Performance Comparison\n');
  console.log('=' .repeat(80));
  
  const results: TestResult[] = [];
  
  // Test 1: Get all users
  console.log('\n📊 Test 1: Get All Users');
  console.log('-'.repeat(80));
  
  const restUsers = await measureRequest(`${BFF_URL}/api/rest/users`, 'REST', 'Get Users');
  console.log(`REST:  ${restUsers.duration}ms ${restUsers.success ? '✅' : '❌'}`);
  results.push(restUsers);
  
  const grpcUsers = await measureRequest(`${BFF_URL}/api/grpc/users`, 'gRPC', 'Get Users');
  console.log(`gRPC:  ${grpcUsers.duration}ms ${grpcUsers.success ? '✅' : '❌'}`);
  results.push(grpcUsers);
  
  if (restUsers.success && grpcUsers.success) {
    const diff = ((restUsers.duration - grpcUsers.duration) / restUsers.duration * 100).toFixed(2);
    console.log(`\n💡 gRPC is ${diff}% ${grpcUsers.duration < restUsers.duration ? 'faster' : 'slower'} than REST`);
  }
  
  // Test 2: Get specific user
  console.log('\n📊 Test 2: Get User by ID');
  console.log('-'.repeat(80));
  
  const restUser = await measureRequest(`${BFF_URL}/api/rest/users/1`, 'REST', 'Get User by ID');
  console.log(`REST:  ${restUser.duration}ms ${restUser.success ? '✅' : '❌'}`);
  results.push(restUser);
  
  const grpcUser = await measureRequest(`${BFF_URL}/api/grpc/users/1`, 'gRPC', 'Get User by ID');
  console.log(`gRPC:  ${grpcUser.duration}ms ${grpcUser.success ? '✅' : '❌'}`);
  results.push(grpcUser);
  
  if (restUser.success && grpcUser.success) {
    const diff = ((restUser.duration - grpcUser.duration) / restUser.duration * 100).toFixed(2);
    console.log(`\n💡 gRPC is ${diff}% ${grpcUser.duration < restUser.duration ? 'faster' : 'slower'} than REST`);
  }
  
  // Test 3: Get all products
  console.log('\n📊 Test 3: Get All Products');
  console.log('-'.repeat(80));
  
  const restProducts = await measureRequest(`${BFF_URL}/api/rest/products`, 'REST', 'Get Products');
  console.log(`REST:  ${restProducts.duration}ms ${restProducts.success ? '✅' : '❌'}`);
  results.push(restProducts);
  
  const grpcProducts = await measureRequest(`${BFF_URL}/api/grpc/products`, 'gRPC', 'Get Products');
  console.log(`gRPC:  ${grpcProducts.duration}ms ${grpcProducts.success ? '✅' : '❌'}`);
  results.push(grpcProducts);
  
  if (restProducts.success && grpcProducts.success) {
    const diff = ((restProducts.duration - grpcProducts.duration) / restProducts.duration * 100).toFixed(2);
    console.log(`\n💡 gRPC is ${diff}% ${grpcProducts.duration < restProducts.duration ? 'faster' : 'slower'} than REST`);
  }
  
  // Test 4: Dashboard (combined request)
  console.log('\n📊 Test 4: Get Dashboard (Combined Data)');
  console.log('-'.repeat(80));
  
  const restDashboard = await measureRequest(`${BFF_URL}/api/rest/dashboard`, 'REST', 'Dashboard');
  console.log(`REST:  ${restDashboard.duration}ms ${restDashboard.success ? '✅' : '❌'}`);
  results.push(restDashboard);
  
  const grpcDashboard = await measureRequest(`${BFF_URL}/api/grpc/dashboard`, 'gRPC', 'Dashboard');
  console.log(`gRPC:  ${grpcDashboard.duration}ms ${grpcDashboard.success ? '✅' : '❌'}`);
  results.push(grpcDashboard);
  
  if (restDashboard.success && grpcDashboard.success) {
    const diff = ((restDashboard.duration - grpcDashboard.duration) / restDashboard.duration * 100).toFixed(2);
    console.log(`\n💡 gRPC is ${diff}% ${grpcDashboard.duration < restDashboard.duration ? 'faster' : 'slower'} than REST`);
  }
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📈 Summary');
  console.log('='.repeat(80));
  
  const restResults = results.filter(r => r.protocol === 'REST');
  const grpcResults = results.filter(r => r.protocol === 'gRPC');
  
  const restAvg = restResults.reduce((sum, r) => sum + r.duration, 0) / restResults.length;
  const grpcAvg = grpcResults.reduce((sum, r) => sum + r.duration, 0) / grpcResults.length;
  
  console.log(`\nREST Average: ${restAvg.toFixed(2)}ms`);
  console.log(`gRPC Average: ${grpcAvg.toFixed(2)}ms`);
  
  const avgDiff = ((restAvg - grpcAvg) / restAvg * 100).toFixed(2);
  console.log(`\n🎯 Overall: gRPC is ${avgDiff}% ${grpcAvg < restAvg ? 'faster' : 'slower'} than REST on average`);
  
  console.log('\n📝 Notes:');
  console.log('- Performance may vary based on network conditions');
  console.log('- gRPC typically shows better performance with:');
  console.log('  • Larger payloads');
  console.log('  • High-frequency requests');
  console.log('  • Binary data transfer');
  console.log('  • Streaming operations');
  console.log('- Both protocols are running through BFF, adding extra hop');
  console.log('- Direct gRPC client-to-server would show better results');
  
  console.log('\n' + '='.repeat(80));
  
  // Check for errors
  const errors = results.filter(r => !r.success);
  if (errors.length > 0) {
    console.log('\n❌ Errors encountered:');
    errors.forEach(e => {
      console.log(`   ${e.protocol} - ${e.endpoint}: ${e.error}`);
    });
    console.log('\n💡 Make sure all services are running:');
    console.log('   - BFF Service: port 3000');
    console.log('   - Service1: REST port 3001, gRPC port 50051');
    console.log('   - Service2: REST port 3002, gRPC port 50052');
  }
}

// Run the comparison
console.log('🚀 Starting performance comparison...\n');
comparePerformance();