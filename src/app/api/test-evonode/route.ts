import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get the request body if needed
    const body = await request.text();
    
    // Test evonode endpoint
    const evonodeUrl = 'http://52.13.132.146:1443';
    const endpoint = '/org.dash.platform.dapi.v0.Platform/getIdentity';
    
    console.log('Testing evonode connectivity from server side...');
    console.log('Target URL:', evonodeUrl + endpoint);
    
    // Prepare gRPC-Web headers
    const headers = {
      'Content-Type': 'application/grpc-web+proto',
      'X-Grpc-Web': '1',
      'Accept': 'application/grpc-web+proto',
    };
    
    // Log request details
    console.log('Request headers:', headers);
    console.log('Request body length:', body.length);
    
    const startTime = Date.now();
    
    try {
      // Make the request to evonode
      const response = await fetch(evonodeUrl + endpoint, {
        method: 'POST',
        headers: headers,
        body: body,
        // Disable SSL verification for testing (only for development)
        // @ts-ignore
        agent: process.env.NODE_ENV === 'development' ? new (require('https').Agent)({ rejectUnauthorized: false }) : undefined,
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('Response time:', responseTime, 'ms');
      
      // Get response body
      const responseBody = await response.arrayBuffer();
      console.log('Response body length:', responseBody.byteLength);
      
      // Return detailed response
      return NextResponse.json({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        responseTime: responseTime,
        bodyLength: responseBody.byteLength,
        timestamp: new Date().toISOString(),
        evonodeUrl: evonodeUrl,
        endpoint: endpoint,
        // Include first 100 bytes of response for debugging
        bodyPreview: Array.from(new Uint8Array(responseBody.slice(0, 100))),
      });
      
    } catch (fetchError: any) {
      console.error('Fetch error:', fetchError);
      
      return NextResponse.json({
        success: false,
        error: 'Fetch failed',
        errorMessage: fetchError.message,
        errorType: fetchError.constructor.name,
        errorCode: fetchError.code,
        timestamp: new Date().toISOString(),
        evonodeUrl: evonodeUrl,
        endpoint: endpoint,
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('API route error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      errorMessage: error.message,
      errorType: error.constructor.name,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// Also support GET for simple connectivity tests
export async function GET(request: NextRequest) {
  try {
    const evonodeUrl = 'http://52.13.132.146:1443';
    
    console.log('Testing basic connectivity to evonode...');
    
    const startTime = Date.now();
    
    try {
      // Try a simple HTTP request first
      const response = await fetch(evonodeUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Dash-3D-NFT-Marketplace/1.0',
        },
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      const responseText = await response.text();
      
      return NextResponse.json({
        success: true,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        responseTime: responseTime,
        bodyLength: responseText.length,
        bodyPreview: responseText.substring(0, 200),
        timestamp: new Date().toISOString(),
        evonodeUrl: evonodeUrl,
        method: 'GET',
      });
      
    } catch (fetchError: any) {
      console.error('GET request error:', fetchError);
      
      // Try to get more network info
      const dns = require('dns').promises;
      let dnsInfo = null;
      
      try {
        const addresses = await dns.resolve4('52.13.132.146');
        dnsInfo = { addresses };
      } catch (dnsError) {
        dnsInfo = { error: 'DNS resolution not applicable for IP address' };
      }
      
      return NextResponse.json({
        success: false,
        error: 'Connection failed',
        errorMessage: fetchError.message,
        errorType: fetchError.constructor.name,
        errorCode: fetchError.code,
        dnsInfo: dnsInfo,
        timestamp: new Date().toISOString(),
        evonodeUrl: evonodeUrl,
        method: 'GET',
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('GET route error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      errorMessage: error.message,
      errorType: error.constructor.name,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}