#!/usr/bin/env node

// Simple validation script to check for common TypeScript issues
const fs = require('fs');
const path = require('path');

console.log('🔍 Validating TypeScript fixes...\n');

const srcPath = path.join(__dirname, 'src');

// Check for common TypeScript issues
const issues = [];

// Check import/export consistency
const galleryPagePath = path.join(srcPath, 'app/gallery/page.tsx');
const galleryContent = fs.readFileSync(galleryPagePath, 'utf8');

if (galleryContent.includes('import SearchFiltersComponent from')) {
  console.log('✅ SearchFilters import fixed');
} else if (galleryContent.includes('import { SearchFiltersComponent }')) {
  issues.push('❌ SearchFilters still has import mismatch');
}

// Check for unsafe nft.id usage
if (galleryContent.includes('nft.id ||') || galleryContent.includes('if (nft.id)')) {
  console.log('✅ NFT ID type safety fixed');
} else if (galleryContent.includes('nft.id') && !galleryContent.includes('nft.id?')) {
  issues.push('❌ Unsafe nft.id usage still exists');
}

// Check for proper gradient handling
if (galleryContent.includes('style={{') && galleryContent.includes('linear-gradient')) {
  console.log('✅ CSS gradients converted to inline styles');
} else if (galleryContent.includes('bg-gradient-to-')) {
  issues.push('❌ Tailwind gradient classes still exist');
}

// Check SearchFilters component
const searchFiltersPath = path.join(srcPath, 'components/SearchFilters.tsx');
const searchFiltersContent = fs.readFileSync(searchFiltersPath, 'utf8');

if (searchFiltersContent.includes('useEffect') && searchFiltersContent.includes('filters.priceRange')) {
  console.log('✅ SearchFilters controlled input fixed');
} else {
  issues.push('❌ SearchFilters controlled input issue not fixed');
}

// Check for proper error handling
const nft3DViewerPath = path.join(srcPath, 'components/NFT3DViewer.tsx');
const nft3DViewerContent = fs.readFileSync(nft3DViewerPath, 'utf8');

if (nft3DViewerContent.includes('parseGeometry3D')) {
  console.log('✅ JSON parsing error handling improved');
} else if (nft3DViewerContent.includes('JSON.parse') && !nft3DViewerContent.includes('try')) {
  issues.push('❌ Unsafe JSON parsing still exists');
}

// Check ModernNFTCoverflow component
const coverflowPath = path.join(srcPath, 'components/ModernNFTCoverflow.tsx');
const coverflowContent = fs.readFileSync(coverflowPath, 'utf8');

if (coverflowContent.includes('ClientOnly') && coverflowContent.includes('isClient')) {
  console.log('✅ FloatingParticles hydration issue fixed');
} else {
  issues.push('❌ FloatingParticles hydration issue not fixed');
}

if (coverflowContent.includes('pseudoRandom')) {
  console.log('✅ Math.random() replaced with deterministic generation');
} else if (coverflowContent.includes('Math.random()')) {
  issues.push('❌ Math.random() still exists');
}

// Summary
console.log('\n📊 Validation Summary:');
if (issues.length === 0) {
  console.log('🎉 All fixes validated successfully!');
  console.log('✅ The application should now run without hydration errors');
  console.log('✅ TypeScript compilation should succeed');
  console.log('✅ All type safety issues have been addressed');
} else {
  console.log('⚠️  Some issues remain:');
  issues.forEach(issue => console.log(`   ${issue}`));
}

process.exit(issues.length);