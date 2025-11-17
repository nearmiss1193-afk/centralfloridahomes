/**
 * CENTRAL FLORIDA PROPERTY SCRAPER - UPDATED FOR DAN'S RAPIDAPI SETUP
 * 
 * Uses YOUR actual RapidAPI subscriptions:
 * - Realty in US API (Pro $20/mo)
 * - Zillow API (Pro $25/mo) 
 * - Realtor.com API (Basic FREE)
 * 
 * API Key: 92a128e717mshca101e9b16e00f3p1aa262jsne8ecaf176caa
 * 
 * For: centralfloridahomes.com
 * Coverage: Tampa → Lakeland → Orlando → Daytona + 27 cities
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// ========================================
// YOUR RAPIDAPI CONFIGURATION
// ========================================

const CONFIG = {
  // Your actual RapidAPI key from screenshots
  rapidapi: {
    key: '92a128e717mshca101e9b16e00f3p1aa262jsne8ecaf176caa',
    
    // Your subscribed APIs
    apis: {
      realtyInUS: {
        host: 'realty-in-us.p.rapidapi.com',
        active: true,
        plan: 'Pro ($20/mo)',
        usage: '0.01%' // Tons of room!
      },
      zillow: {
        host: 'zillow-com1.p.rapidapi.com',
        active: true,
        plan: 'Pro ($25/mo)',
        usage: '2.65%' // Good
      },
      realtor: {
        host: 'realtor-com-real-estate.p.rapidapi.com',
        active: true,
        plan: 'Basic (FREE)',
        usage: '84%' // Getting close to limit, use sparingly
      }
    }
  },

  // Central Florida Markets - Tampa to Daytona
  markets: [
    // Tampa Bay Area
    { city: 'Tampa', state: 'FL', state_code: 'FL', zip: '33602', region: 'Tampa Bay', priority: 1 },
    { city: 'St Petersburg', state: 'FL', state_code: 'FL', zip: '33701', region: 'Tampa Bay', priority: 2 },
    { city: 'Clearwater', state: 'FL', state_code: 'FL', zip: '33755', region: 'Tampa Bay', priority: 2 },
    { city: 'Brandon', state: 'FL', state_code: 'FL', zip: '33511', region: 'Tampa Bay', priority: 3 },
    { city: 'Wesley Chapel', state: 'FL', state_code: 'FL', zip: '33544', region: 'Tampa Bay', priority: 3 },
    
    // Lakeland / Polk County
    { city: 'Lakeland', state: 'FL', state_code: 'FL', zip: '33801', region: 'Polk County', priority: 1 },
    { city: 'Winter Haven', state: 'FL', state_code: 'FL', zip: '33880', region: 'Polk County', priority: 2 },
    { city: 'Auburndale', state: 'FL', state_code: 'FL', zip: '33823', region: 'Polk County', priority: 3 },
    
    // Orlando Area
    { city: 'Orlando', state: 'FL', state_code: 'FL', zip: '32801', region: 'Greater Orlando', priority: 1 },
    { city: 'Kissimmee', state: 'FL', state_code: 'FL', zip: '34741', region: 'Greater Orlando', priority: 2 },
    { city: 'Winter Park', state: 'FL', state_code: 'FL', zip: '32789', region: 'Greater Orlando', priority: 2 },
    { city: 'Clermont', state: 'FL', state_code: 'FL', zip: '34711', region: 'Greater Orlando', priority: 3 },
    
    // Daytona Beach Area
    { city: 'Daytona Beach', state: 'FL', state_code: 'FL', zip: '32114', region: 'Daytona Area', priority: 1 },
    { city: 'Ormond Beach', state: 'FL', state_code: 'FL', zip: '32174', region: 'Daytona Area', priority: 2 },
    { city: 'Port Orange', state: 'FL', state_code: 'FL', zip: '32127', region: 'Daytona Area', priority: 2 }
  ],

  // Output Configuration
  output: {
    directory: path.join(__dirname, 'central_florida_listings'),
    jsonFile: 'all_listings.json',
    csvFile: 'all_listings.csv',
    byCity: true,
    byRegion: true
  }
};

// Create output directory
if (!fs.existsSync(CONFIG.output.directory)) {
  fs.mkdirSync(CONFIG.output.directory, { recursive: true });
}

// ========================================
// REALTY IN US API (YOUR BEST BET - PRO PLAN, LOW USAGE)
// ========================================

/**
 * Search using Realty in US API - Your Pro plan with tons of quota!
 */
async function searchRealtyInUS(location) {
  try {
    console.log(`🔍 Realty in US: ${location.city}, ${location.state}`);

    const options = {
      method: 'POST',
      url: 'https://realty-in-us.p.rapidapi.com/properties/v3/list',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': CONFIG.rapidapi.key,
        'X-RapidAPI-Host': CONFIG.rapidapi.apis.realtyInUS.host
      },
      data: {
        limit: 200,
        offset: 0,
        postal_code: location.zip,
        status: ['for_sale'],
        sort: {
          direction: 'desc',
          field: 'list_date'
        }
      }
    };

    const response = await axios.request(options);
    
    if (response.data && response.data.data && response.data.data.home_search) {
      const results = response.data.data.home_search.results || [];
      console.log(`  ✅ Found ${results.length} properties`);
      return results.map(prop => formatRealtyInUSProperty(prop, location));
    }

    return [];
  } catch (error) {
    console.error(`  ❌ Error:`, error.message);
    return [];
  }
}

/**
 * Format Realty in US property data
 */
function formatRealtyInUSProperty(prop, location) {
  const description = prop.description || {};
  const location_data = prop.location || {};
  const address_data = location_data.address || {};
  
  return {
    // Basic Info
    id: prop.property_id || `realty_${Date.now()}_${Math.random()}`,
    source: 'realty_in_us',
    address: address_data.line || 'Address not available',
    city: address_data.city || location.city,
    state: address_data.state_code || location.state,
    zip: address_data.postal_code || location.zip,
    region: location.region,
    
    // Property Details
    price: prop.list_price || 0,
    priceFormatted: formatPrice(prop.list_price),
    beds: description.beds || 0,
    baths: description.baths || 0,
    sqft: description.sqft || 0,
    lotSize: description.lot_sqft || 0,
    yearBuilt: description.year_built || null,
    propertyType: description.type || 'Single Family',
    
    // Listing Info
    listingStatus: prop.status || 'for_sale',
    daysOnMarket: prop.days_on_mls || 0,
    mlsNumber: prop.mls?.id || null,
    listingId: prop.listing_id || null,
    
    // Images & URLs
    image: prop.primary_photo?.href || '',
    images: (prop.photos || []).map(img => img.href).filter(Boolean),
    listingUrl: prop.href || '',
    virtualTourUrl: prop.virtual_tours?.[0]?.href || null,
    
    // Additional Features
    description: description.text || '',
    photoCount: prop.photo_count || 0,
    
    // Tags & Features
    tags: prop.tags || [],
    hasGarage: description.garage ? true : false,
    hasPool: (prop.tags || []).includes('pool'),
    
    // SEO & Website Fields
    slug: generateSlug(address_data.line, location.city),
    metaTitle: `${address_data.line || 'Home'} - ${location.city}, FL - $${formatPrice(prop.list_price)}`,
    metaDescription: `${description.beds || 0} bed, ${description.baths || 0} bath home in ${location.city}. ${description.sqft || 0} sqft. Listed at $${formatPrice(prop.list_price)}.`,
    
    // Timestamps
    scrapedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };
}

// ========================================
// ZILLOW API (YOUR PRO PLAN)
// ========================================

/**
 * Get property details from Zillow using zpid
 */
async function getZillowPropertyDetails(zpid) {
  try {
    const options = {
      method: 'GET',
      url: 'https://zillow-com1.p.rapidapi.com/property',
      params: { zpid: zpid.toString() },
      headers: {
        'X-RapidAPI-Key': CONFIG.rapidapi.key,
        'X-RapidAPI-Host': CONFIG.rapidapi.apis.zillow.host
      }
    };

    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(`  ❌ Zillow error for zpid ${zpid}:`, error.message);
    return null;
  }
}

/**
 * Search Zillow by location
 */
async function searchZillow(location) {
  try {
    console.log(`🔍 Zillow: ${location.city}, ${location.state}`);

    const options = {
      method: 'GET',
      url: 'https://zillow-com1.p.rapidapi.com/propertyExtendedSearch',
      params: {
        location: `${location.city}, ${location.state}`,
        status_type: 'ForSale',
        home_type: 'Houses',
        sort: 'Homes_for_You',
        page: '1'
      },
      headers: {
        'X-RapidAPI-Key': CONFIG.rapidapi.key,
        'X-RapidAPI-Host': CONFIG.rapidapi.apis.zillow.host
      }
    };

    const response = await axios.request(options);
    
    if (response.data && response.data.props) {
      console.log(`  ✅ Found ${response.data.props.length} properties`);
      return response.data.props.map(prop => formatZillowProperty(prop, location));
    }

    return [];
  } catch (error) {
    console.error(`  ❌ Zillow error:`, error.message);
    return [];
  }
}

/**
 * Format Zillow property data
 */
function formatZillowProperty(prop, location) {
  return {
    id: prop.zpid || `zillow_${Date.now()}_${Math.random()}`,
    source: 'zillow',
    address: prop.address || 'Address not available',
    city: location.city,
    state: location.state,
    zip: prop.zipcode || location.zip,
    region: location.region,
    
    price: prop.price || 0,
    priceFormatted: formatPrice(prop.price),
    beds: prop.bedrooms || 0,
    baths: prop.bathrooms || 0,
    sqft: prop.livingArea || 0,
    lotSize: prop.lotAreaValue || 0,
    yearBuilt: prop.yearBuilt || null,
    propertyType: prop.homeType || 'Single Family',
    
    listingStatus: 'for_sale',
    daysOnMarket: prop.daysOnZillow || 0,
    zpid: prop.zpid,
    
    image: prop.imgSrc || '',
    images: (prop.carouselPhotos || []).map(img => img.url).filter(Boolean),
    listingUrl: `https://www.zillow.com/homedetails/${prop.zpid}_zpid/`,
    
    description: prop.description || '',
    hasGarage: prop.parking ? true : false,
    hasPool: false,
    
    slug: generateSlug(prop.address, location.city),
    metaTitle: `${prop.address} - ${location.city}, FL - $${formatPrice(prop.price)}`,
    metaDescription: `${prop.bedrooms || 0} bed, ${prop.bathrooms || 0} bath home in ${location.city}.`,
    
    scrapedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };
}

// ========================================
// DATA PROCESSING & EXPORT
// ========================================

function removeDuplicates(properties) {
  const seen = new Set();
  return properties.filter(prop => {
    const key = `${prop.address}_${prop.city}`.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sortByPrice(properties) {
  return properties.sort((a, b) => a.price - b.price);
}

function exportToJSON(properties, filename) {
  const filepath = path.join(CONFIG.output.directory, filename);
  fs.writeFileSync(filepath, JSON.stringify(properties, null, 2));
  console.log(`💾 Saved ${properties.length} properties to ${filename}`);
  return filepath;
}

function exportToCSV(properties, filename) {
  const filepath = path.join(CONFIG.output.directory, filename);
  
  const headers = [
    'id', 'source', 'address', 'city', 'state', 'zip', 'region',
    'price', 'beds', 'baths', 'sqft', 'lotSize', 'yearBuilt', 'propertyType',
    'listingStatus', 'daysOnMarket', 'mlsNumber', 'listingId',
    'image', 'listingUrl', 'photoCount',
    'hasGarage', 'hasPool', 'slug', 'scrapedAt'
  ];
  
  let csv = headers.join(',') + '\n';
  
  properties.forEach(prop => {
    const row = headers.map(header => {
      const value = prop[header];
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    });
    csv += row.join(',') + '\n';
  });
  
  fs.writeFileSync(filepath, csv);
  console.log(`💾 Saved ${properties.length} properties to ${filename}`);
  return filepath;
}

function groupByCity(properties) {
  const grouped = {};
  properties.forEach(prop => {
    if (!grouped[prop.city]) grouped[prop.city] = [];
    grouped[prop.city].push(prop);
  });
  return grouped;
}

function groupByRegion(properties) {
  const grouped = {};
  properties.forEach(prop => {
    if (!grouped[prop.region]) grouped[prop.region] = [];
    grouped[prop.region].push(prop);
  });
  return grouped;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function formatPrice(price) {
  if (!price) return '0';
  return parseInt(price).toLocaleString('en-US');
}

function generateSlug(address, city) {
  if (!address) return `property-${Date.now()}`;
  return `${address}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ========================================
// MAIN SCRAPER
// ========================================

async function main() {
  console.log('🏠 CENTRAL FLORIDA PROPERTY SCRAPER');
  console.log('===================================');
  console.log('Using YOUR RapidAPI subscriptions:');
  console.log(`  ✅ Realty in US: ${CONFIG.rapidapi.apis.realtyInUS.plan} - ${CONFIG.rapidapi.apis.realtyInUS.usage} used`);
  console.log(`  ✅ Zillow: ${CONFIG.rapidapi.apis.zillow.plan} - ${CONFIG.rapidapi.apis.zillow.usage} used`);
  console.log(`  ⚠️  Realtor.com: ${CONFIG.rapidapi.apis.realtor.plan} - ${CONFIG.rapidapi.apis.realtor.usage} used (near limit!)`);
  console.log(`\n📍 Scraping ${CONFIG.markets.length} cities...\n`);

  const allProperties = [];
  let totalFetched = 0;

  // Primary source: Realty in US (you have tons of quota here!)
  for (const market of CONFIG.markets) {
    console.log(`\n📍 ${market.city}, ${market.state} (${market.region})`);
    
    try {
      // Use Realty in US API (your Pro plan with 0.01% usage!)
      const realtyProps = await searchRealtyInUS(market);
      allProperties.push(...realtyProps);
      totalFetched += realtyProps.length;
      
      // Delay to be nice to API
      await delay(1000);
      
      // Optional: Add Zillow for more coverage (you have Pro plan)
      if (market.priority === 1) { // Only major cities
        const zillowProps = await searchZillow(market);
        allProperties.push(...zillowProps);
        totalFetched += zillowProps.length;
        await delay(1000);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${market.city}:`, error.message);
    }
  }

  console.log('\n\n📊 Processing data...');
  
  const uniqueProperties = removeDuplicates(allProperties);
  console.log(`  📊 Total fetched: ${totalFetched}`);
  console.log(`  🎯 Unique properties: ${uniqueProperties.length}`);
  
  const sortedProperties = sortByPrice(uniqueProperties);

  console.log('\n💾 Exporting data...');
  exportToJSON(sortedProperties, CONFIG.output.jsonFile);
  exportToCSV(sortedProperties, CONFIG.output.csvFile);

  if (CONFIG.output.byCity) {
    const byCity = groupByCity(sortedProperties);
    Object.keys(byCity).forEach(city => {
      exportToJSON(byCity[city], `${city.replace(/\s+/g, '-').toLowerCase()}-listings.json`);
    });
  }

  if (CONFIG.output.byRegion) {
    const byRegion = groupByRegion(sortedProperties);
    Object.keys(byRegion).forEach(region => {
      exportToJSON(byRegion[region], `${region.replace(/\s+/g, '-').toLowerCase()}-listings.json`);
    });
  }

  const summary = {
    totalProperties: uniqueProperties.length,
    scrapedAt: new Date().toISOString(),
    markets: CONFIG.markets.length,
    apiUsage: {
      realtyInUS: 'Primary source',
      zillow: 'Major cities only',
      realtor: 'Skipped (84% quota used)'
    },
    byRegion: {},
    byCity: {},
    priceStats: {
      min: Math.min(...sortedProperties.map(p => p.price)),
      max: Math.max(...sortedProperties.map(p => p.price)),
      average: Math.round(sortedProperties.reduce((sum, p) => sum + p.price, 0) / sortedProperties.length)
    }
  };

  Object.keys(groupByRegion(sortedProperties)).forEach(region => {
    summary.byRegion[region] = groupByRegion(sortedProperties)[region].length;
  });

  Object.keys(groupByCity(sortedProperties)).forEach(city => {
    summary.byCity[city] = groupByCity(sortedProperties)[city].length;
  });

  exportToJSON(summary, 'scraping-summary.json');

  console.log('\n✅ SCRAPING COMPLETE!');
  console.log('===================');
  console.log(`📊 Total Properties: ${uniqueProperties.length}`);
  console.log(`💰 Price Range: $${formatPrice(summary.priceStats.min)} - $${formatPrice(summary.priceStats.max)}`);
  console.log(`📍 Markets: ${CONFIG.markets.length} cities`);
  console.log(`📁 Files: ${CONFIG.output.directory}`);
  console.log('\nNext: Upload to centralfloridahomes.com! 🚀');
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  searchRealtyInUS,
  searchZillow,
  exportToJSON,
  exportToCSV
};
