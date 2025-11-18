// Cache loaded properties so we only transform once per session
let cachedProperties = [];

// Load gallery overrides produced by the external scraper
async function loadGalleryOverrides() {
    try {
        const response = await fetch('central_florida_listings/gallery_properties.json', {
            cache: 'no-store'
        });
        if (!response.ok) {
            return new Map();
        }
        const galleries = await response.json();
        const lookup = new Map();

        galleries.forEach(g => {
            if (!g) return;
            if (g.zpid || g.id) {
                const idKey = String(g.zpid || g.id);
                if (Array.isArray(g.images) && g.images.length) {
                    lookup.set(idKey, g.images);
                }
            }
            if (g.address) {
                const key = String(g.address).toLowerCase().replace(/[^a-z0-9]/g, '');
                if (Array.isArray(g.images) && g.images.length) {
                    lookup.set(key, g.images);
                }
            }
        });

        return lookup;
    } catch (error) {
        console.warn('Gallery overrides not available:', error);
        return new Map();
    }
}

// Load properties from JSON file
async function loadProperties() {
    try {
        if (cachedProperties.length) {
            return cachedProperties;
        }

        const response = await fetch('central_florida_listings/all_listings.json', {
            cache: 'no-store'
        });
        if (!response.ok) {
            throw new Error(`Fetch failed with status ${response.status}`);
        }

        const data = await response.json();

        // Transform scraped data to website format
        cachedProperties = data.map(prop => ({
            id: prop.id,
            price: parseNumber(prop.price) || parseNumber(prop.priceFormatted),
            address: prop.address,
            city: prop.city,
            zip: normalizeZip(prop.zip, prop.address),
            beds: parseNumber(prop.beds),
            baths: parseNumber(prop.baths),
            sqft: parseNumber(prop.sqft || prop.livingArea || prop.squareFootage),
            image: selectImage(prop),
            images: selectImages(prop),
            status: normalizeStatus(prop),
            type: mapPropertyType(prop.propertyType),
            latitude: parseCoordinate(prop.latitude || prop.lat || prop.location?.lat),
            longitude: parseCoordinate(prop.longitude || prop.lng || prop.lon || prop.location?.lng || prop.location?.lon),
            url: normalizeUrl(prop.url || prop.detailUrl || prop.listingUrl),
            daysOnMarket: parseNumber(prop.daysOnMarket || prop.dom || prop.daysOnZillow || prop.daysActive),
            lotSize: parseNumber(prop.lotSize || prop.lotSizeValue || prop.lotSquareFeet),
            yearBuilt: parseNumber(prop.yearBuilt || prop.builtYear || prop.yearConstructed),
            description: normalizeDescription(prop.description || prop.metaDescription || ''),
            favorite: false
        })).filter(prop => Boolean(prop.address) && Boolean(prop.city));

        // Enhance images using gallery_properties.json when available
        const galleryLookup = await loadGalleryOverrides();
        if (galleryLookup.size) {
            cachedProperties = cachedProperties.map(prop => {
                const idKey = String(prop.id ?? '');
                const addressKey = String(prop.address || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                const images = galleryLookup.get(idKey) || galleryLookup.get(addressKey);
                if (Array.isArray(images) && images.length) {
                    return {
                        ...prop,
                        images,
                        image: images[0],
                        imageCount: images.length
                    };
                }
                return prop;
            });
        }
        
        console.log(`Loaded ${cachedProperties.length} properties`);
        return cachedProperties;
    } catch (error) {
        console.error('Error loading properties:', error);
        // Fallback to sample data if fetch fails
        cachedProperties = getSampleData();
        return cachedProperties;
    }
}

function normalizeZip(zip, address) {
    if (zip) {
        return String(zip);
    }
    if (!address) {
        return '';
    }
    const match = address.match(/(\d{5})(?:-\d{4})?$/);
    return match ? match[1] : '';
}

function parseNumber(value) {
    if (value === null || value === undefined) {
        return 0;
    }
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : 0;
    }
    const cleaned = String(value).replace(/[^0-9.-]/g, '');
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
}

function parseCoordinate(value) {
    if (value === null || value === undefined) {
        return undefined;
    }
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : undefined;
}

function normalizeUrl(url) {
    if (!url) {
        return '';
    }
    const value = String(url).trim();
    if (!value) {
        return '';
    }
    if (value.startsWith('http://') || value.startsWith('https://')) {
        return value;
    }
    try {
        const normalized = new URL(value, 'https://www.zillow.com');
        return normalized.toString();
    } catch (error) {
        return '';
    }
}

function normalizeDescription(value) {
    if (!value) {
        return '';
    }
    const collapsed = String(value)
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .join('\n');
    return collapsed.trim();
}

function selectImage(prop) {
    if (!prop) {
        return 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600';
    }
    if (prop.image) {
        return prop.image;
    }
    if (Array.isArray(prop.images)) {
        const validImage = prop.images.find(Boolean);
        if (validImage) {
            return validImage;
        }
    }
    return 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600';
}

function selectImages(prop) {
    const fallback = ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200'];
    if (!prop) {
        return fallback;
    }
    if (Array.isArray(prop.images)) {
        const cleaned = prop.images.filter(Boolean);
        if (cleaned.length) {
            return cleaned;
        }
    }
    if (prop.image) {
        return [prop.image];
    }
    return fallback;
}

function normalizeStatus(prop) {
    if (!prop) {
        return 'For Sale';
    }

    if (typeof prop.daysOnMarket === 'number' && prop.daysOnMarket <= 7) {
        return 'new';
    }

    const status = (prop.status || prop.listingStatus || '').toLowerCase();

    if (status.includes('pending')) {
        return 'pending';
    }
    if (status.includes('sold')) {
        return 'sold';
    }
    if (status.includes('new')) {
        return 'new';
    }
    if (status.includes('reduced') || (prop.priceChangeAmount && parseNumber(prop.priceChangeAmount) < 0)) {
        return 'reduced';
    }
    if (status.includes('hot')) {
        return 'hot';
    }
    return 'For Sale';
}

function mapPropertyType(type) {
    if (!type) {
        return 'House';
    }
    const normalized = String(type).toLowerCase();
    const map = {
        'single_family': 'House',
        'single-family': 'House',
        'condominium': 'Condo',
        'condo': 'Condo',
        'townhouse': 'Townhouse',
        'townhome': 'Townhouse',
        'apartment': 'Apartment',
        'multi_family': 'Multi-Family',
        'multi-family': 'Multi-Family',
        'manufactured': 'Manufactured',
        'mobile': 'Manufactured',
        'co_op': 'Co-Op',
        'co-op': 'Co-Op'
    };

    return map[normalized] || capitalizeWords(normalized.replace(/_/g, ' '));
}

function capitalizeWords(value) {
    return value
        .split(' ')
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') || 'House';
}

// Fallback sample data
function getSampleData() {
    return [
        {
            id: 1,
            price: 385000,
            address: '1234 Oak Street, Tampa, FL 33602',
            city: 'Tampa',
            zip: '33602',
            beds: 4,
            baths: 2.5,
            sqft: 2450,
            image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600',
            images: [
                'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600',
                'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1600',
                'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1600'
            ],
            status: 'new',
            type: 'House',
            latitude: 27.9529,
            longitude: -82.4564,
            url: 'https://www.zillow.com/homedetails/1234-Oak-Street-Tampa-FL-33602/123456_zpid/',
            daysOnMarket: 3,
            lotSize: 7405,
            yearBuilt: 2016,
            description: 'Modern Craftsman in Tampa Heights featuring a bright open concept living space, upgraded chef\'s kitchen with quartz counters, and a dreamy owner\'s retreat that opens to a sunset-ready backyard oasis.',
            favorite: false
        },
        {
            id: 2,
            price: 295000,
            address: '567 Pine Avenue, Lakeland, FL 33801',
            city: 'Lakeland',
            zip: '33801',
            beds: 3,
            baths: 2,
            sqft: 1850,
            image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600',
            images: [
                'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1600',
                'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=1600',
                'https://images.unsplash.com/photo-1512914890250-353c97c9e69f?w=1600'
            ],
            status: 'reduced',
            type: 'House',
            latitude: 28.0395,
            longitude: -81.9498,
            url: 'https://www.zillow.com/homedetails/567-Pine-Avenue-Lakeland-FL-33801/223344_zpid/',
            daysOnMarket: 12,
            lotSize: 9148,
            yearBuilt: 2004,
            description: 'Charming Lakeland bungalow with rich hardwoods, a sun-splashed breakfast nook, and a lush fenced yard perfect for weekend gatherings under the Florida palms.',
            favorite: false
        },
        {
            id: 3,
            price: 425000,
            address: '890 Palm Drive, Orlando, FL 32801',
            city: 'Orlando',
            zip: '32801',
            beds: 5,
            baths: 3,
            sqft: 3200,
            image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600',
            images: [
                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600',
                'https://images.unsplash.com/photo-1560448054-b451ccddc2c6?w=1600',
                'https://images.unsplash.com/photo-1599423300746-b62533397364?w=1600'
            ],
            status: 'For Sale',
            type: 'House',
            latitude: 28.5418,
            longitude: -81.3792,
            url: 'https://www.zillow.com/homedetails/890-Palm-Drive-Orlando-FL-32801/334455_zpid/',
            daysOnMarket: 18,
            lotSize: 10018,
            yearBuilt: 2012,
            description: 'Downtown Orlando retreat blending resort-style outdoor living with a dramatic two-story great room, private home office, and spa-like owner\'s suite minutes from Lake Eola.',
            favorite: false
        },
        {
            id: 4,
            price: 325000,
            address: '321 Beach Road, Daytona Beach, FL 32114',
            city: 'Daytona Beach',
            zip: '32114',
            beds: 3,
            baths: 2,
            sqft: 1950,
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600',
            images: [
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600',
                'https://images.unsplash.com/photo-1521780361668-d83e79397af0?w=1600',
                'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=1600'
            ],
            status: 'For Sale',
            type: 'Condo',
            latitude: 29.2108,
            longitude: -81.0228,
            url: 'https://www.zillow.com/homedetails/321-Beach-Road-Daytona-Beach-FL-32114/445566_zpid/',
            daysOnMarket: 25,
            lotSize: 0,
            yearBuilt: 2009,
            description: 'Coastal condo with floor-to-ceiling glass, wraparound balcony, and access to a private residents\' beach club overlooking the Atlantic sunrise.',
            favorite: false
        },
        {
            id: 5,
            price: 450000,
            address: '789 Sunset Boulevard, Tampa, FL 33602',
            city: 'Tampa',
            zip: '33602',
            beds: 4,
            baths: 3,
            sqft: 2800,
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
            images: [
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600',
                'https://images.unsplash.com/photo-1570129477495-0946a0a8667b?w=1600',
                'https://images.unsplash.com/photo-1451976426598-a7593bd6d0b2?w=1600'
            ],
            status: 'new',
            type: 'House',
            latitude: 27.9493,
            longitude: -82.4526,
            url: 'https://www.zillow.com/homedetails/789-Sunset-Boulevard-Tampa-FL-33602/556677_zpid/',
            daysOnMarket: 2,
            lotSize: 6534,
            yearBuilt: 2020,
            description: 'Sun-drenched Riverside Heights smart home boasting soaring ceilings, designer finishes, and a backyard summer kitchen framed by palm-lined skyline views.',
            favorite: false
        },
        {
            id: 6,
            price: 265000,
            address: '456 Maple Street, Lakeland, FL 33801',
            city: 'Lakeland',
            zip: '33801',
            beds: 3,
            baths: 2,
            sqft: 1650,
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
            images: [
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
                'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1600',
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600'
            ],
            status: 'For Sale',
            type: 'Townhouse',
            latitude: 28.0395,
            longitude: -81.9498,
            url: 'https://www.zillow.com/homedetails/456-Maple-Street-Lakeland-FL-33801/667788_zpid/',
            daysOnMarket: 30,
            lotSize: 2178,
            yearBuilt: 2018,
            description: 'Lock-and-leave Lakeland townhome with a private courtyard, airy loft flex space, and resort-style community amenities steps from Lake Mirror.',
            favorite: false
        },
        {
            id: 7,
            price: 510000,
            address: '234 Lake View Drive, Orlando, FL 32801',
            city: 'Orlando',
            zip: '32801',
            beds: 4,
            baths: 3.5,
            sqft: 3400,
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600',
            images: [
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600',
                'https://images.unsplash.com/photo-1599423300746-b62533397364?w=1600',
                'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=1600'
            ],
            status: 'For Sale',
            type: 'House',
            latitude: 28.5418,
            longitude: -81.3792,
            url: 'https://www.zillow.com/homedetails/234-Lake-View-Drive-Orlando-FL-32801/778899_zpid/',
            daysOnMarket: 7,
            lotSize: 12800,
            yearBuilt: 2010,
            description: 'Lakefront executive residence in Delaney Park with panoramic water views, a gourmet kitchen wing, and an expansive lanai ready for sunset entertaining.',
            favorite: false
        },
        {
            id: 8,
            price: 340000,
            address: '678 Ocean Avenue, Daytona Beach, FL 32114',
            city: 'Daytona Beach',
            zip: '32114',
            beds: 2,
            baths: 2,
            sqft: 1450,
            image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600',
            images: [
                'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1600',
                'https://images.unsplash.com/photo-1549187774-b4e9b0445b05?w=1600',
                'https://images.unsplash.com/photo-1512914897711-1c83be39d07b?w=1600'
            ],
            status: 'reduced',
            type: 'Condo',
            latitude: 29.2108,
            longitude: -81.0228,
            url: 'https://www.zillow.com/homedetails/678-Ocean-Avenue-Daytona-Beach-FL-32114/889900_zpid/',
            daysOnMarket: 14,
            lotSize: 0,
            yearBuilt: 2014,
            description: 'Beachfront condo with wall-to-wall glass, upgraded coastal finishes, and direct elevator access to the sand for effortless sunrise strolls.',
            favorite: false
        }
    ];
}
