#!/usr/bin/env node

// Final validation script for aggressive hydration fixes
const fs = require('fs');
const path = require('path');

console.log('🔧 Testing Aggressive Hydration Fixes...\n');

const srcPath = path.join(__dirname, 'src');
const results = [];

// Check LoginPage client-only wrapping
const loginPagePath = path.join(srcPath, 'app/page.tsx');
const loginContent = fs.readFileSync(loginPagePath, 'utf8');

if (loginContent.includes('export default function LoginPage()') && 
    loginContent.includes('<ClientOnly') && 
    loginContent.includes('LoginPageInner')) {
  results.push('✅ LoginPage fully wrapped with ClientOnly');
} else {
  results.push('❌ LoginPage not properly wrapped');
}

// Check GalleryPage client-only wrapping
const galleryPagePath = path.join(srcPath, 'app/gallery/page.tsx');
const galleryContent = fs.readFileSync(galleryPagePath, 'utf8');

if (galleryContent.includes('export default function GalleryPage()') && 
    galleryContent.includes('<ClientOnly') && 
    galleryContent.includes('GalleryPageInner')) {
  results.push('✅ GalleryPage fully wrapped with ClientOnly');
} else {
  results.push('❌ GalleryPage not properly wrapped');
}

// Check layout suppressHydrationWarning
const layoutPath = path.join(srcPath, 'app/layout.tsx');
const layoutContent = fs.readFileSync(layoutPath, 'utf8');

if (layoutContent.includes('suppressHydrationWarning') && 
    layoutContent.includes('<ClientOnly>') &&
    layoutContent.includes('<LogView />')) {
  results.push('✅ Layout has comprehensive hydration suppression');
} else {
  results.push('❌ Layout missing hydration suppression');
}

// Check enhanced ClientOnly component
const clientOnlyPath = path.join(srcPath, 'components/ClientOnly.tsx');
const clientOnlyContent = fs.readFileSync(clientOnlyPath, 'utf8');

if (clientOnlyContent.includes('typeof window === \'undefined\'') && 
    clientOnlyContent.includes('setTimeout') &&
    clientOnlyContent.includes('suppressHydrationWarning')) {
  results.push('✅ ClientOnly component enhanced with aggressive protections');
} else {
  results.push('❌ ClientOnly component not properly enhanced');
}

// Check for remaining problematic patterns
const issues = [];

// Check for any remaining direct window usage outside of ClientOnly
const files = [loginPagePath, galleryPagePath];
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('typeof window') && !content.includes('ClientOnly')) {
    issues.push(`⚠️  Direct window usage found in ${path.basename(file)}`);
  }
});

// Summary
console.log('📊 Aggressive Fix Results:');
results.forEach(result => console.log(`   ${result}`));

if (issues.length > 0) {
  console.log('\n⚠️  Potential Issues:');
  issues.forEach(issue => console.log(`   ${issue}`));
}

console.log('\n🎯 Strategy Applied:');
console.log('   • Complete client-side rendering for main pages');
console.log('   • Enhanced ClientOnly with multiple safeguards');
console.log('   • Comprehensive suppressHydrationWarning usage');
console.log('   • Browser extension interference mitigation');

console.log('\n✨ Expected Result:');
console.log('   • Zero hydration mismatch errors');
console.log('   • No controlled input warnings');
console.log('   • Clean application startup');
console.log('   • Browser extension compatibility');

const success = results.every(r => r.startsWith('✅')) && issues.length === 0;
console.log(`\n${success ? '🎉' : '⚠️ '} Overall Status: ${success ? 'ALL FIXES APPLIED' : 'SOME ISSUES REMAIN'}`);

process.exit(success ? 0 : 1);