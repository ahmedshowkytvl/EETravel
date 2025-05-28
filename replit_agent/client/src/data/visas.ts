export interface Visa {
  id: number;
  type: string;
  country: string;
  flag: string;
  targetNationality: string;
  eligibility: string[];
  duration: string;
  entries: string;
  processingTime: string;
  standardProcessingTime: string;
  expressProcessingTime: string;
  rushProcessingTime: string;
  price: number;
  expressFee: number;
  rushFee: number;
  currency: string;
  requirements: string[];
  description: string;
  validity: string;
  stayLength: string;
  documents: string[];
  additionalInfo: string[];
  rating: number;
  reviewCount: number;
  embassyWebsite: string;
  applicationLink: string;
  refundPolicy: string;
}

export interface VisasFilterState {
  minPrice: number;
  maxPrice: number;
  types: string[];
  processingTimes: string[];
  entries: string[];
  duration: string[];
}

export const visaTypes = [
  { id: 1, name: 'Tourist' },
  { id: 2, name: 'Business' },
  { id: 3, name: 'Transit' },
  { id: 4, name: 'Student' },
  { id: 5, name: 'Work' },
  { id: 6, name: 'Electronic Visa (e-Visa)' },
  { id: 7, name: 'Visa On Arrival' },
  { id: 8, name: 'Resident' }
];

export const processingTimes = [
  { id: 1, name: 'Standard', range: '5-10 business days' },
  { id: 2, name: 'Express', range: '3-5 business days' },
  { id: 3, name: 'Rush', range: '1-2 business days' },
  { id: 4, name: 'Same Day', range: 'Same business day' }
];

export const visasData: Visa[] = [
  {
    id: 1,
    type: 'Tourist',
    country: 'United Arab Emirates',
    flag: 'https://flagcdn.com/ae.svg',
    targetNationality: 'Egyptian',
    eligibility: ['Valid passport', 'Return ticket', 'Hotel reservation'],
    duration: '30 days',
    entries: 'Single',
    processingTime: '3-5 business days',
    standardProcessingTime: '5-7 business days',
    expressProcessingTime: '3-5 business days',
    rushProcessingTime: '1-2 business days',
    price: 95,
    expressFee: 40,
    rushFee: 80,
    currency: 'USD',
    requirements: ['Passport with 6 months validity', 'Passport-sized photos', 'Flight itinerary', 'Hotel reservation', 'Proof of sufficient funds'],
    description: 'Standard tourist visa for the UAE, allowing visitors to explore Dubai, Abu Dhabi, and other emirates.',
    validity: '90 days from issue',
    stayLength: 'Up to 30 days',
    documents: ['Passport scan', 'Photo (white background)', 'Flight reservation', 'Hotel booking confirmation'],
    additionalInfo: ['Visa can be extended once in the UAE for an additional 30 days', 'Sponsorship by UAE hotel or tour operator may be required'],
    rating: 4.5,
    reviewCount: 324,
    embassyWebsite: 'https://www.mofaic.gov.ae/en/Services/Visa',
    applicationLink: 'https://smartservices.icp.gov.ae',
    refundPolicy: 'Non-refundable if visa is issued. Partial refund if denied.'
  },
  {
    id: 2,
    type: 'Tourist',
    country: 'United Kingdom',
    flag: 'https://flagcdn.com/gb.svg',
    targetNationality: 'Egyptian',
    eligibility: ['Valid passport', 'Sufficient funds', 'Return ticket'],
    duration: '6 months',
    entries: 'Multiple',
    processingTime: '15-20 business days',
    standardProcessingTime: '15-20 business days',
    expressProcessingTime: '5-10 business days',
    rushProcessingTime: '3-5 business days',
    price: 142,
    expressFee: 65,
    rushFee: 120,
    currency: 'USD',
    requirements: ['Passport with 6 months validity', 'Passport-sized photos', 'Bank statements (last 6 months)', 'Employment letter', 'Accommodation details', 'Travel itinerary'],
    description: 'Standard visitor visa for the United Kingdom, suitable for tourism, visiting family/friends, or short business trips.',
    validity: '6 months from entry',
    stayLength: 'Up to 6 months',
    documents: ['Passport scan', 'Photo (light background)', 'Bank statements', 'Employment verification', 'Invitation letter (if applicable)'],
    additionalInfo: ['Biometric data collection required', 'Personal interview may be necessary', 'Proof of ties to home country recommended'],
    rating: 3.9,
    reviewCount: 512,
    embassyWebsite: 'https://www.gov.uk/browse/visas-immigration',
    applicationLink: 'https://www.gov.uk/standard-visitor-visa',
    refundPolicy: 'Non-refundable application fee'
  },
  {
    id: 3,
    type: 'Tourist',
    country: 'United States',
    flag: 'https://flagcdn.com/us.svg',
    targetNationality: 'Egyptian',
    eligibility: ['Valid passport', 'Proof of ties to home country', 'Travel purpose'],
    duration: '10 years',
    entries: 'Multiple',
    processingTime: '30-90 days',
    standardProcessingTime: '30-90 days',
    expressProcessingTime: 'Not available',
    rushProcessingTime: 'Not available',
    price: 160,
    expressFee: 0,
    rushFee: 0,
    currency: 'USD',
    requirements: ['Passport with 6 months validity', 'DS-160 confirmation page', 'Appointment confirmation', 'Photo', 'Evidence of ties to home country', 'Financial documents', 'Travel itinerary'],
    description: 'B-2 tourist visa for the United States, allowing for tourism, visiting family/friends, or medical treatment.',
    validity: '10 years (typical)',
    stayLength: 'Up to 6 months per entry',
    documents: ['Passport', 'Completed DS-160 form', 'Photo (white background)', 'Financial documents', 'Travel itinerary', 'Ties to home country proof'],
    additionalInfo: ['Personal interview required', 'Visa does not guarantee entry', 'Approval at port of entry by CBP officer'],
    rating: 3.7,
    reviewCount: 748,
    embassyWebsite: 'https://eg.usembassy.gov/visas/',
    applicationLink: 'https://ceac.state.gov/genniv/',
    refundPolicy: 'Non-refundable application fee'
  },
  {
    id: 4,
    type: 'Electronic Visa (e-Visa)',
    country: 'Turkey',
    flag: 'https://flagcdn.com/tr.svg',
    targetNationality: 'Egyptian',
    eligibility: ['Valid passport', 'Travel dates', 'Email address'],
    duration: '90 days',
    entries: 'Single',
    processingTime: '24-72 hours',
    standardProcessingTime: '24-72 hours',
    expressProcessingTime: 'Same day',
    rushProcessingTime: 'Not applicable',
    price: 30,
    expressFee: 20,
    rushFee: 0,
    currency: 'USD',
    requirements: ['Passport with 6 months validity', 'Valid email address', 'Credit/debit card for payment'],
    description: 'Electronic visa for tourism or business travel to Turkey. Simple online application process with quick approval.',
    validity: '180 days from issue',
    stayLength: 'Up to 90 days',
    documents: ['Passport scan only'],
    additionalInfo: ['Print your e-Visa or have digital copy available', 'Return ticket may be requested at entry'],
    rating: 4.8,
    reviewCount: 589,
    embassyWebsite: 'https://www.mfa.gov.tr',
    applicationLink: 'https://www.evisa.gov.tr',
    refundPolicy: 'Non-refundable once processed'
  },
  {
    id: 5,
    type: 'Tourist',
    country: 'Saudi Arabia',
    flag: 'https://flagcdn.com/sa.svg',
    targetNationality: 'Egyptian',
    eligibility: ['Valid passport', 'Hotel reservation', 'Return ticket'],
    duration: '90 days',
    entries: 'Multiple',
    processingTime: '2-5 business days',
    standardProcessingTime: '3-5 business days',
    expressProcessingTime: '1-2 business days',
    rushProcessingTime: 'Same day',
    price: 125,
    expressFee: 50,
    rushFee: 100,
    currency: 'USD',
    requirements: ['Passport with 6 months validity', 'Digital photo', 'Hotel reservations', 'Return flight', 'Travel insurance'],
    description: 'Tourist visa for Saudi Arabia, allowing visitors to explore historic sites, modern cities, and cultural attractions.',
    validity: '1 year from issue',
    stayLength: 'Up to 90 days (total)',
    documents: ['Passport scan', 'Digital photo', 'Flight details', 'Accommodation details'],
    additionalInfo: ['Women under 40 may require a mahram (male guardian)', 'Strict adherence to local laws and customs required'],
    rating: 4.2,
    reviewCount: 312,
    embassyWebsite: 'https://www.mofa.gov.sa',
    applicationLink: 'https://visa.visitsaudi.com',
    refundPolicy: 'Non-refundable if visa is issued. Partial refund if denied.'
  },
  {
    id: 6,
    type: 'Tourist',
    country: 'Schengen Area',
    flag: 'https://flagcdn.com/eu.svg',
    targetNationality: 'Egyptian',
    eligibility: ['Valid passport', 'Sufficient funds', 'Travel insurance', 'Return ticket'],
    duration: '90 days',
    entries: 'Multiple',
    processingTime: '10-15 business days',
    standardProcessingTime: '10-15 business days',
    expressProcessingTime: '5-7 business days',
    rushProcessingTime: '3 business days',
    price: 80,
    expressFee: 60,
    rushFee: 120,
    currency: 'EUR',
    requirements: ['Passport with 3 months validity beyond stay', 'Photos', 'Travel insurance (€30,000+ coverage)', 'Hotel reservations', 'Flight itinerary', 'Bank statements', 'Employment verification'],
    description: 'Short-stay visa allowing travel to any of the 26 Schengen countries, including France, Germany, Italy, Spain, and more.',
    validity: 'Generally matches requested travel dates plus buffer',
    stayLength: 'Up to 90 days within a 180-day period',
    documents: ['Application form', 'Passport', 'Photos', 'Travel insurance certificate', 'Itinerary', 'Financial documents', 'Employment letter'],
    additionalInfo: ['Apply through the embassy of your main destination country', 'Biometric data collection required', 'No border controls between Schengen countries once inside'],
    rating: 4.0,
    reviewCount: 876,
    embassyWebsite: 'Varies by country',
    applicationLink: 'Varies by country',
    refundPolicy: 'Non-refundable application fee'
  },
  {
    id: 7,
    type: 'Visa On Arrival',
    country: 'Jordan',
    flag: 'https://flagcdn.com/jo.svg',
    targetNationality: 'Egyptian',
    eligibility: ['Valid passport', 'Entry through authorized ports'],
    duration: '30 days',
    entries: 'Single',
    processingTime: 'Immediate (at arrival)',
    standardProcessingTime: 'Immediate (at arrival)',
    expressProcessingTime: 'Not applicable',
    rushProcessingTime: 'Not applicable',
    price: 40,
    expressFee: 0,
    rushFee: 0,
    currency: 'JOD',
    requirements: ['Passport with 6 months validity', 'Return ticket (may be asked)', 'Proof of accommodation (may be asked)'],
    description: 'Visa issued upon arrival at Jordanian airports and most land border crossings.',
    validity: '30 days from entry',
    stayLength: 'Up to 30 days',
    documents: ['Passport only (at border)'],
    additionalInfo: ['Cash payment preferred at border', 'Jordan Pass holders get visa fee waived', 'Can be extended once in Jordan'],
    rating: 4.7,
    reviewCount: 423,
    embassyWebsite: 'http://www.mfa.gov.jo',
    applicationLink: 'Not applicable (obtained at border)',
    refundPolicy: 'Not applicable (paid at border)'
  },
  {
    id: 8,
    type: 'Electronic Visa (e-Visa)',
    country: 'Thailand',
    flag: 'https://flagcdn.com/th.svg',
    targetNationality: 'Egyptian',
    eligibility: ['Valid passport', 'Return ticket', 'Proof of accommodation'],
    duration: '60 days',
    entries: 'Single',
    processingTime: '3-5 business days',
    standardProcessingTime: '3-5 business days',
    expressProcessingTime: '24-48 hours',
    rushProcessingTime: 'Not available',
    price: 40,
    expressFee: 25,
    rushFee: 0,
    currency: 'USD',
    requirements: ['Passport with 6 months validity', 'Digital photo', 'Flight itinerary', 'Hotel reservations', 'Proof of funds (20,000 THB per person)'],
    description: 'Electronic tourist visa for Thailand, allowing exploration of Bangkok, beaches, and cultural sites.',
    validity: '3 months from issue',
    stayLength: 'Up to 60 days',
    documents: ['Passport scan', 'Digital photo', 'Flight confirmation', 'Accommodation confirmation', 'Bank statement'],
    additionalInfo: ['Can be extended once in Thailand for 30 days', 'Address in Thailand required on arrival card'],
    rating: 4.4,
    reviewCount: 512,
    embassyWebsite: 'https://thaiembdc.org',
    applicationLink: 'https://www.thaievisa.go.th',
    refundPolicy: 'Non-refundable once processed'
  },
  {
    id: 9,
    type: 'Tourist',
    country: 'Canada',
    flag: 'https://flagcdn.com/ca.svg',
    targetNationality: 'Egyptian',
    eligibility: ['Valid passport', 'Good travel history', 'Ties to home country'],
    duration: 'Up to 10 years',
    entries: 'Multiple',
    processingTime: '30-60 days',
    standardProcessingTime: '30-60 days',
    expressProcessingTime: 'Not available',
    rushProcessingTime: 'Not available',
    price: 100,
    expressFee: 0,
    rushFee: 0,
    currency: 'CAD',
    requirements: ['Passport with 6 months validity', 'Digital photo', 'Biometrics', 'Financial documents', 'Travel history', 'Employment letter', 'Family information'],
    description: 'Temporary Resident Visa (TRV) for visiting Canada as a tourist.',
    validity: 'Up to 10 years or passport expiry',
    stayLength: 'Usually up to 6 months per entry',
    documents: ['Application form', 'Passport scan', 'Photo', 'Financial proof', 'Employment verification', 'Travel history', 'Family information form'],
    additionalInfo: ['Biometrics required', 'Online application process', 'Maximum stay determined at port of entry'],
    rating: 3.6,
    reviewCount: 428,
    embassyWebsite: 'https://www.canadainternational.gc.ca',
    applicationLink: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html',
    refundPolicy: 'Non-refundable application fee'
  },
  {
    id: 10,
    type: 'Tourist',
    country: 'Australia',
    flag: 'https://flagcdn.com/au.svg',
    targetNationality: 'Egyptian',
    eligibility: ['Valid passport', 'Genuine visitor purpose', 'Sufficient funds'],
    duration: '3 months',
    entries: 'Single or Multiple',
    processingTime: '20-30 days',
    standardProcessingTime: '20-30 days',
    expressProcessingTime: '5-10 business days',
    rushProcessingTime: 'Not available',
    price: 140,
    expressFee: 50,
    rushFee: 0,
    currency: 'AUD',
    requirements: ['Passport with 6 months validity', 'Completed application form', 'Financial proof', 'Travel itinerary', 'Employment verification', 'Family ties evidence'],
    description: 'Visitor visa (subclass 600) for tourism or visiting family and friends in Australia.',
    validity: '1 year from issue',
    stayLength: '3 months per entry',
    documents: ['Application form', 'Passport scan', 'Photo', 'Financial documents', 'Travel itinerary', 'Employment letter'],
    additionalInfo: ['Online application', 'No visa stamp/sticker issued (electronic visa)', 'Health insurance recommended'],
    rating: 4.1,
    reviewCount: 380,
    embassyWebsite: 'https://egypt.embassy.gov.au',
    applicationLink: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600/tourist-stream-overseas',
    refundPolicy: 'Non-refundable application fee'
  },
  {
    id: 11,
    type: 'Business',
    country: 'United Arab Emirates',
    flag: 'https://flagcdn.com/ae.svg',
    targetNationality: 'Egyptian',
    eligibility: ['Valid passport', 'Business purpose', 'Invitation letter'],
    duration: '90 days',
    entries: 'Multiple',
    processingTime: '3-5 business days',
    standardProcessingTime: '5-7 business days',
    expressProcessingTime: '2-3 business days',
    rushProcessingTime: '24 hours',
    price: 250,
    expressFee: 100,
    rushFee: 150,
    currency: 'USD',
    requirements: ['Passport with 6 months validity', 'Business invitation letter', 'Company registration documents', 'Travel itinerary', 'Bank statements'],
    description: 'Business visa for UAE allowing attendance at meetings, conferences, or exploring business opportunities.',
    validity: '90 days from issue',
    stayLength: 'Up to 90 days',
    documents: ['Passport scan', 'Photo', 'Business invitation', 'Company letter', 'Company registration'],
    additionalInfo: ['Sponsorship by UAE company required', 'Can conduct business activities but not work'],
    rating: 4.6,
    reviewCount: 284,
    embassyWebsite: 'https://www.mofaic.gov.ae/en/Services/Visa',
    applicationLink: 'https://smartservices.icp.gov.ae',
    refundPolicy: 'Non-refundable if visa is issued. Partial refund if denied.'
  },
  {
    id: 12,
    type: 'Student',
    country: 'United Kingdom',
    flag: 'https://flagcdn.com/gb.svg',
    targetNationality: 'Egyptian',
    eligibility: ['University acceptance', 'Financial proof', 'English proficiency'],
    duration: 'Course duration + 4 months',
    entries: 'Multiple',
    processingTime: '15 business days',
    standardProcessingTime: '15 business days',
    expressProcessingTime: '5 business days',
    rushProcessingTime: 'Not available',
    price: 363,
    expressFee: 150,
    rushFee: 0,
    currency: 'GBP',
    requirements: ['Passport with 6 months validity', 'CAS from UK institution', 'Financial documents', 'English language certification', 'Tuberculosis test certificate (if applicable)'],
    description: 'Student visa (Tier 4) for studying at a UK educational institution.',
    validity: 'Course duration + grace period',
    stayLength: 'Course duration + 4 months (bachelor's/master's)',
    documents: ['Application form', 'Passport', 'CAS letter', 'Financial proof', 'English test results', 'ATAS certificate (if required)'],
    additionalInfo: ['Biometric residence permit issued after arrival', 'Healthcare surcharge required', 'Limited work permission included'],
    rating: 4.2,
    reviewCount: 315,
    embassyWebsite: 'https://www.gov.uk/government/world/organisations/british-embassy-cairo',
    applicationLink: 'https://www.gov.uk/student-visa',
    refundPolicy: 'Non-refundable application fee'
  },
  {
    id: 13,
    type: 'Transit',
    country: 'Schengen Area',
    flag: 'https://flagcdn.com/eu.svg',
    targetNationality: 'Egyptian',
    eligibility: ['Valid passport', 'Onward ticket', 'Final destination visa (if required)'],
    duration: 'Up to 24 hours',
    entries: 'Single',
    processingTime: '5-10 business days',
    standardProcessingTime: '5-10 business days',
    expressProcessingTime: '3 business days',
    rushProcessingTime: 'Not available',
    price: 80,
    expressFee: 40,
    rushFee: 0,
    currency: 'EUR',
    requirements: ['Passport with 3 months validity beyond stay', 'Flight reservations showing transit', 'Valid visa for final destination (if required)'],
    description: 'Airport Transit Visa for passing through the international transit areas of Schengen airports.',
    validity: 'Covers transit period',
    stayLength: 'Airport transit only (do not pass border control)',
    documents: ['Application form', 'Passport', 'Photo', 'Flight tickets', 'Final destination visa'],
    additionalInfo: ['Not needed for all nationalities', 'Apply through the embassy of transit country', 'Not permitted to enter Schengen territory'],
    rating: 4.0,
    reviewCount: 185,
    embassyWebsite: 'Varies by country',
    applicationLink: 'Varies by country',
    refundPolicy: 'Non-refundable application fee'
  },
  {
    id: 14,
    type: 'Work',
    country: 'Saudi Arabia',
    flag: 'https://flagcdn.com/sa.svg',
    targetNationality: 'Egyptian',
    eligibility: ['Job offer from Saudi employer', 'Qualifications', 'Medical fitness'],
    duration: '1-2 years',
    entries: 'Multiple',
    processingTime: '2-4 weeks',
    standardProcessingTime: '2-4 weeks',
    expressProcessingTime: '1-2 weeks',
    rushProcessingTime: 'Not available',
    price: 230,
    expressFee: 120,
    rushFee: 0,
    currency: 'USD',
    requirements: ['Passport with validity of at least 6 months', 'Employment contract', 'Educational certificates (attested)', 'Medical examination report', 'Police clearance certificate'],
    description: 'Work visa for employment in Saudi Arabia, sponsored by Saudi employer.',
    validity: 'Employment contract duration',
    stayLength: 'Employment contract duration',
    documents: ['Application form', 'Passport', 'Photos', 'Employment contract', 'Educational certificates', 'Medical report'],
    additionalInfo: ['Employer must initiate application process', 'Iqama (residence permit) issued after arrival', 'Family visas available for dependents'],
    rating: 3.9,
    reviewCount: 418,
    embassyWebsite: 'https://www.mofa.gov.sa',
    applicationLink: 'Through Saudi employer',
    refundPolicy: 'Determined by employer'
  },
  {
    id: 15,
    type: 'Visa On Arrival',
    country: 'Bahrain',
    flag: 'https://flagcdn.com/bh.svg',
    targetNationality: 'Egyptian',
    eligibility: ['Valid passport', 'Return ticket', 'Hotel reservation'],
    duration: '14 days',
    entries: 'Single',
    processingTime: 'Immediate (at arrival)',
    standardProcessingTime: 'Immediate (at arrival)',
    expressProcessingTime: 'Not applicable',
    rushProcessingTime: 'Not applicable',
    price: 25,
    expressFee: 0,
    rushFee: 0,
    currency: 'BHD',
    requirements: ['Passport with 6 months validity', 'Return ticket', 'Hotel reservation (may be asked)', 'Sufficient funds (may be asked)'],
    description: 'Short-term visitor visa issued upon arrival at Bahrain International Airport.',
    validity: '14 days from entry',
    stayLength: 'Up to 14 days',
    documents: ['Passport only (at border)'],
    additionalInfo: ['Payment by credit card or local currency', 'E-visa available as alternative', 'Can be extended once in Bahrain'],
    rating: 4.5,
    reviewCount: 276,
    embassyWebsite: 'https://www.mofa.gov.bh',
    applicationLink: 'Not applicable (obtained at border)',
    refundPolicy: 'Not applicable (paid at border)'
  }
];

export const defaultVisasFilter: VisasFilterState = {
  minPrice: 20,
  maxPrice: 400,
  types: [],
  processingTimes: [],
  entries: [],
  duration: []
};

export const filterVisas = (visas: Visa[], filters: VisasFilterState): Visa[] => {
  return visas.filter(visa => {
    // Price filter
    if (visa.price < filters.minPrice || visa.price > filters.maxPrice) {
      return false;
    }
    
    // Types filter
    if (filters.types.length > 0 && !filters.types.includes(visa.type)) {
      return false;
    }
    
    // Processing times filter
    if (filters.processingTimes.length > 0) {
      let matchesProcessingTime = false;
      for (const time of filters.processingTimes) {
        if (visa.processingTime.toLowerCase().includes(time.toLowerCase())) {
          matchesProcessingTime = true;
          break;
        }
      }
      if (!matchesProcessingTime) {
        return false;
      }
    }
    
    // Entries filter
    if (filters.entries.length > 0 && !filters.entries.includes(visa.entries)) {
      return false;
    }
    
    // Duration filter
    if (filters.duration.length > 0) {
      let matchesDuration = false;
      for (const dur of filters.duration) {
        // This is a simplified check - in a real app you'd parse the duration better
        if (visa.duration.includes(dur)) {
          matchesDuration = true;
          break;
        }
      }
      if (!matchesDuration) {
        return false;
      }
    }
    
    return true;
  });
};

export const searchVisas = (
  visas: Visa[],
  country: string,
  nationality: string = 'Egyptian',
  type: string = 'All'
): Visa[] => {
  return visas.filter(visa => {
    const countryMatch = visa.country.toLowerCase().includes(country.toLowerCase());
    const nationalityMatch = visa.targetNationality.toLowerCase() === nationality.toLowerCase();
    const typeMatch = type === 'All' || visa.type === type;
    
    return countryMatch && nationalityMatch && typeMatch;
  });
};