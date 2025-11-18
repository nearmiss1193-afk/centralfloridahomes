// Cache loaded properties so we only transform once per session
let cachedProperties = [];

// Load properties from JSON file
async function loadProperties() {
    try {
        if (cachedProperties.length) {
            return cachedProperties;
        }

        const response = await fetch('/central_florida_listings/all_listings.json');
        if (!response.ok) {
            throw new Error(`Fetch failed with status ${response.status}`);
        }

        const data = await response.json();

        // Transform scraped data to website format
        cachedProperties = data.map(prop => ({
            id: prop.id,
            price: prop.price,
            address: prop.address,
            city: prop.city,
            zip: normalizeZip(prop.zip, prop.address),
            beds: prop.beds,
            baths: prop.baths,
            sqft: prop.sqft,
            image: prop.image || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600',
            status: prop.daysOnMarket <= 7 ? 'new' : 'For Sale',
            type: prop.propertyType || 'House',
            favorite: false
        }));
        
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
            status: 'new',
            type: 'House',
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
            status: 'reduced',
            type: 'House',
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
            status: 'For Sale',
            type: 'House',
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
            status: 'For Sale',
            type: 'Condo',
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
            status: 'new',
            type: 'House',
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
            status: 'For Sale',
            type: 'Townhouse',
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
            status: 'For Sale',
            type: 'House',
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
            status: 'reduced',
            type: 'Condo',
            favorite: false
        }
    ];
}
