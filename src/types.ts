export type AppRole = 'client' | 'technician' | 'recycler' | 'admin';
export type UserRole = AppRole;
export type AppTab = 'home' | 'repairs' | 'marketplace' | 'recycling' | 'security';

export type DeviceCategory = 'smartphone' | 'laptop' | 'tablet' | 'accessory' | 'audio' | 'console';

export type OrderStatus =
  | 'quote_requested'
  | 'quotes_received'
  | 'escrow_funded'
  | 'courier_assigned'
  | 'pickup_verified' // OTP validated & 3-photo checklist signed
  | 'in_transit_lab'
  | 'under_repair'
  | 'quality_testing'
  | 'ready_delivery'
  | 'completed_released'
  | 'disputed';

export interface RegisteredUser {
  id: string;
  role: 'client' | 'technician';
  name: string;
  phone: string;
  neighborhood: string;
  avatar?: string;
  createdAt: string;
  // Technician specific fields:
  workshopName?: string;
  vehiclePlate?: string;
  specialties?: string[];
  subscriptionPlan?: 'Pro Kigali' | 'Master Partner';
  rating?: number;
  reviewsCount?: number;
  certifiedBadge?: boolean;
  activeWatermarkCode?: string;
}

export interface TechnicianPro {
  id: string;
  name: string;
  photo: string;
  phone: string;
  workshopName: string;
  neighborhood: string;
  rating: number;
  reviewsCount: number;
  specialties: string[];
  certifiedBadge: boolean;
  vehiclePlate: string;
  subscriptionPlan: 'Pro Kigali' | 'Master Partner';
  activeWatermarkCode: string; // Dynamic daily/hourly verification code
  accentColor: string;
}

export interface PickupInventoryChecklist {
  frontPhoto: string;
  backPhoto: string;
  portsPhoto: string;
  screenCracked: boolean;
  powersOn: boolean;
  touchWorking: boolean;
  biometricsWorking: boolean;
  hasWaterDamageIndicator: boolean;
  serialOrImei: string;
  cosmeticNotes: string;
  gpsPickupLocation: string;
  clientSignatureName: string;
  technicianSignatureName: string;
  timestamp: string;
}

export interface RepairQuote {
  id: string;
  technicianId: string;
  technicianName: string;
  technicianPhoto: string;
  workshopName: string;
  neighborhood: string;
  rating: number;
  priceRWF: number;
  partsQuality: 'OEM Pièce d\'origine' | 'Certifié Grade A+' | 'Éco-Reconditionné';
  warrantyMonths: number;
  estimatedHours: number;
  message: string;
}

export interface RepairOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  clientName: string;
  clientPhone: string;
  clientNeighborhood: string;
  clientAddress: string;
  deviceCategory: DeviceCategory;
  deviceBrand: string;
  deviceModel: string;
  reportedIssue: string;
  issueTags: string[];
  devicePhotos: string[];
  status: OrderStatus;
  urgency: 'standard' | 'express_1h';
  serviceType: 'courier_pickup' | 'home_visit' | 'dropoff_workshop';
  
  // Quotes & Active technician
  quotes: RepairQuote[];
  selectedQuote?: RepairQuote;
  assignedTechnician?: TechnicianPro;
  
  // Kigali 3-Pillar Security
  otpCode: string; // 4-digit code e.g. "7392"
  qrToken: string;
  otpVerifiedAt?: string;
  inventoryChecklist?: PickupInventoryChecklist;
  
  // Escrow & Payment
  escrowAmountRWF: number;
  platformFeeRWF: number;
  paymentMethod?: 'mtn_momo' | 'airtel_money' | 'paypack' | 'card';
  momoPhoneNumber?: string;
  escrowStatus: 'unpaid' | 'held_in_escrow' | 'released_to_pro' | 'refunded';
  
  // Live GPS tracking mock
  transitStep: number; // 0 to 4
  courierGps: {
    lat: number;
    lng: number;
    currentArea: string;
    etaMinutes: number;
  };
}

export interface MarketplaceItem {
  id: string;
  title: string;
  category: DeviceCategory;
  brand: string;
  model: string;
  priceRWF: number;
  originalPriceRWF: number;
  discountPercent: number;
  conditionGrade: 'Comme Neuf (Grade A+)' | 'Très Bon État (Grade A)' | 'Bon État (Grade B)';
  batteryHealth: number;
  storage: string;
  color: string;
  warrantyMonths: number;
  images: string[];
  sellerType: 'gira_certified' | 'verified_citizen';
  sellerName: string;
  sellerRating: number;
  neighborhood: string;
  features: string[];
  diagnosticReport: {
    screen: '100% Impeccable' | 'Micro-rayures' | 'Remplacé OEM';
    battery: 'Excellente capacité' | 'Originale vérifiée' | 'Neuve';
    camera: '100% Fonctionnelle' | 'Objectifs testés';
    motherboard: 'Aucun court-circuit' | 'Tests bench validés';
    security: 'Débloqué tout opérateur' | 'iCloud/Google clean';
  };
  inStock: boolean;
}

export interface EWasteCollectionPoint {
  id: string;
  name: string;
  neighborhood: string;
  address: string;
  openingHours: string;
  phone: string;
  acceptedItems: string[];
  totalCollectedKg: number;
  lat: number;
  lng: number;
  partnerType: 'Station MTN' | 'Hub Kacyiru' | 'Maison Iriba' | 'Atelier Gira';
}

export interface EcoRewardVoucher {
  id: string;
  title: string;
  description: string;
  discountRWF: number;
  pointsCost: number;
  minSpendRWF: number;
  validityDays: number;
  category: 'repair' | 'marketplace' | 'accessory';
}

export interface EcoDropoffRecord {
  id: string;
  date: string;
  collectionPointName: string;
  itemType: string;
  estimatedWeightKg: number;
  pointsEarned: number;
  status: 'validé' | 'en_attente_pesée';
}

export interface UserEcoProfile {
  name: string;
  phone: string;
  neighborhood: string;
  giraPoints: number;
  totalEwasteKg: number;
  co2AvoidedKg: number;
  devicesRepairedCount: number;
  earnedBadges: { id: string; name: string; icon: string; description: string }[];
  dropoffHistory: EcoDropoffRecord[];
  activeVouchers: { voucher: EcoRewardVoucher; code: string; expiresAt: string }[];
}
