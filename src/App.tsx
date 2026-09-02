import React, { useState } from 'react';
import { 
  AppTab, 
  UserRole, 
  RepairOrder, 
  MarketplaceItem, 
  UserEcoProfile, 
  TechnicianPro,
  EcoRewardVoucher,
  RegisteredUser 
} from './types';
import { 
  INITIAL_TECHNICIANS, 
  INITIAL_ORDERS, 
  INITIAL_MARKETPLACE, 
  INITIAL_COLLECTION_POINTS, 
  INITIAL_ECO_REWARDS, 
  INITIAL_USER_PROFILE,
  INITIAL_USERS 
} from './data/mockData';

import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { Navbar } from './components/Navbar';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { HomeView } from './components/HomeView';
import { RepairTrackingView } from './components/RepairTrackingView';
import { MarketplaceView } from './components/MarketplaceView';
import { RecyclingView } from './components/RecyclingView';
import { TechnicianPortalView } from './components/TechnicianPortalView';
import { SecurityProtocolView } from './components/SecurityProtocolView';

// Modals
import { RepairBookingModal } from './components/RepairBookingModal';
import { SecurityBadgeModal } from './components/SecurityBadgeModal';
import { InventoryChecklistModal } from './components/InventoryChecklistModal';
import { OtpVerificationModal } from './components/OtpVerificationModal';
import { AutoDiagnosticModal } from './components/AutoDiagnosticModal';
import { AuthModal } from './components/AuthModal';

function MainAppContent() {
  const { t } = useLanguage();
  // User Authentication State
  const [users, setUsers] = useState<RegisteredUser[]>(() => {
    try {
      const saved = localStorage.getItem('giratech_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(() => {
    try {
      const saved = localStorage.getItem('giratech_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_USERS[0]; // Pre-connected as Patrick Habimana (Client)
  });

  const [technicians, setTechnicians] = useState<TechnicianPro[]>(INITIAL_TECHNICIANS);

  // Navigation & Role State
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return currentUser?.role || 'client';
  });
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Application Data State
  const [orders, setOrders] = useState<RepairOrder[]>(INITIAL_ORDERS);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(INITIAL_MARKETPLACE);
  const [userEcoProfile, setUserEcoProfile] = useState<UserEcoProfile>(() => {
    if (currentUser && currentUser.role === 'client') {
      return {
        ...INITIAL_USER_PROFILE,
        name: currentUser.name,
        phone: currentUser.phone,
        neighborhood: currentUser.neighborhood,
      };
    }
    return INITIAL_USER_PROFILE;
  });
  const [collectionPoints] = useState(INITIAL_COLLECTION_POINTS);
  const [rewards] = useState<EcoRewardVoucher[]>(INITIAL_ECO_REWARDS);

  // Modal Visibility States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authModalRole, setAuthModalRole] = useState<'client' | 'technician'>('client');
  
  // Specific Entity Modals
  const [selectedTechForBadge, setSelectedTechForBadge] = useState<TechnicianPro | null>(null);
  const [selectedOrderForChecklist, setSelectedOrderForChecklist] = useState<RepairOrder | null>(null);
  const [selectedOrderForOtp, setSelectedOrderForOtp] = useState<RepairOrder | null>(null);

  // Active Technician computation (if currentUser is a tech, use their account)
  const currentTechnician = (currentUser?.role === 'technician'
    ? technicians.find((t) => t.id === currentUser.id || t.name.toLowerCase() === currentUser.name.toLowerCase())
    : null) || technicians[0];

  const handleOpenAuthModal = (mode: 'login' | 'register' = 'login', role: 'client' | 'technician' = 'client') => {
    setAuthModalMode(mode);
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: RegisteredUser, isNewRegistration: boolean) => {
    if (isNewRegistration) {
      const updatedUsers = [user, ...users.filter((u) => u.id !== user.id)];
      setUsers(updatedUsers);
      try {
        localStorage.setItem('giratech_users', JSON.stringify(updatedUsers));
      } catch (e) {}

      // If registered as technician, append to technicians list so they get their full pro profile
      if (user.role === 'technician') {
        const newTechPro: TechnicianPro = {
          id: user.id,
          name: user.name,
          photo: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          phone: user.phone,
          workshopName: user.workshopName || 'Kigali Tech Lab',
          neighborhood: user.neighborhood,
          rating: 5.0,
          reviewsCount: 1,
          specialties: user.specialties || ['Écrans OLED', 'Batteries OEM'],
          certifiedBadge: true,
          vehiclePlate: user.vehiclePlate || 'RAD 418 K (Moto Coursier)',
          subscriptionPlan: user.subscriptionPlan || 'Pro Kigali',
          activeWatermarkCode: user.activeWatermarkCode || `GIRA-KGL-${Math.floor(1000 + Math.random() * 9000)}-VERIFIED`,
          accentColor: '#10b981',
        };
        setTechnicians((prev) => [newTechPro, ...prev]);
      }
    }

    setCurrentUser(user);
    try {
      localStorage.setItem('giratech_current_user', JSON.stringify(user));
    } catch (e) {}

    // Auto-switch role to match the authenticated user
    setActiveRole(user.role);
    if (user.role === 'client') {
      setUserEcoProfile((prev) => ({
        ...prev,
        name: user.name,
        phone: user.phone,
        neighborhood: user.neighborhood,
      }));
      setActiveTab('repairs');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('giratech_current_user');
    } catch (e) {}
  };

  // Handlers for Repair Workflow
  const handleAddNewOrder = (newOrder: RepairOrder) => {
    setOrders([newOrder, ...orders]);
    setActiveTab('repairs');
    // Open OTP modal immediately to show user their security credentials
    setSelectedOrderForOtp(newOrder);
  };

  const handleReleaseEscrow = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'completed_released',
              escrowStatus: 'released_to_technician',
            }
          : ord
      )
    );
    // Award bonus Gira-Points for repairing rather than discarding!
    setUserEcoProfile((prev) => ({
      ...prev,
      giraPoints: prev.giraPoints + 150,
      devicesRepairedCount: prev.devicesRepairedCount + 1,
      co2AvoidedKg: Number((prev.co2AvoidedKg + 18.5).toFixed(1)),
    }));
  };

  // Handlers for Technician OTP & Status
  const handleVerifyClientOtp = (orderId: string, enteredOtp: string): boolean => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder && targetOrder.otpCode === enteredOtp.trim()) {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId
            ? {
                ...ord,
                status: 'in_transit_lab',
                transitStep: 2,
              }
            : ord
        )
      );
      return true;
    }
    return false;
  };

  const handleUpdateOrderStatus = (orderId: string, nextStatus: any) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: nextStatus,
            }
          : ord
      )
    );
  };

  // Handlers for Marketplace
  const handleBuyMarketplaceItem = (item: MarketplaceItem) => {
    // Remove from active stock and create an escrow order
    setMarketplaceItems((prev) => prev.filter((i) => i.id !== item.id));
    const newMarketplaceOrder: RepairOrder = {
      id: `ord-mkt-${Date.now()}`,
      orderNumber: `GT-BUY-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: t('order_created_just_now'),
      clientName: currentUser?.name || 'Patrick Habimana',
      clientPhone: currentUser?.phone || '+250 788 654 321',
      clientNeighborhood: currentUser?.neighborhood || 'Remera',
      clientAddress: 'KG 11 Ave',
      deviceCategory: item.category,
      deviceBrand: item.brand,
      deviceModel: item.model,
      reportedIssue: `${item.title} (${item.conditionGrade})`,
      issueTags: [item.conditionGrade, `${item.warrantyMonths} ${t('months_unit')}`],
      devicePhotos: item.images,
      status: 'courier_assigned',
      urgency: 'express_1h',
      serviceType: 'courier_pickup',
      quotes: [],
      assignedTechnician: INITIAL_TECHNICIANS[0],
      otpCode: `${Math.floor(1000 + Math.random() * 9000)}`,
      qrToken: `GT-ESCROW-BUY-${Date.now()}-RW`,
      escrowAmountRWF: item.priceRWF,
      platformFeeRWF: Math.round(item.priceRWF * 0.04),
      paymentMethod: 'mtn_momo',
      momoPhoneNumber: currentUser?.phone || '+250 788 654 321',
      escrowStatus: 'held_in_escrow',
      transitStep: 1,
      courierGps: {
        lat: -1.9536,
        lng: 30.0911,
        currentArea: `Kacyiru: ${t('courier_assigned_enroute')}`,
        etaMinutes: 18,
      },
    };
    setOrders([newMarketplaceOrder, ...orders]);
  };

  const handleListDiagnosedItem = (newItem: MarketplaceItem) => {
    setMarketplaceItems([newItem, ...marketplaceItems]);
    setActiveTab('marketplace');
  };

  // Handlers for Recycling & Rewards
  const handleRedeemReward = (reward: EcoRewardVoucher) => {
    setUserEcoProfile((prev) => ({
      ...prev,
      giraPoints: prev.giraPoints - reward.pointsCost,
      activeVouchers: [
        {
          code: `GT-${Math.floor(1000 + Math.random() * 9000)}-ECO`,
          voucher: reward,
          expiresAt: '31 Déc 2026',
        },
        ...prev.activeVouchers,
      ],
    }));
  };

  const handleRecordDeposit = (_deposit: any) => {
    // Handled in component
  };

  const activeOrdersCount = orders.filter(o => o.status !== 'completed_released').length;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
      
      {/* Frosted Glass Atmospheric Ambient Orbs */}
      <div className="fixed top-[-150px] left-[-150px] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-200px] right-[-100px] w-[700px] h-[700px] bg-blue-500/15 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed top-[45%] right-[-100px] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed top-[20%] left-[30%] w-[450px] h-[450px] bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* PWA Install Banner */}
      <div className="relative z-30">
        <PwaInstallBanner />
      </div>

      {/* Main Navigation Bar */}
      <div className="relative z-30">
        <Navbar
          currentTab={activeTab}
          setCurrentTab={(tab: string) => setActiveTab(tab as AppTab)}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          isMobileDeviceFrame={isMobileFrame}
          setIsMobileDeviceFrame={setIsMobileFrame}
          giraPoints={userEcoProfile.giraPoints}
          activeOrdersCount={activeOrdersCount}
          currentUser={currentUser}
          onOpenAuthModal={handleOpenAuthModal}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        
        {isMobileFrame ? (
          <div className="flex justify-center items-center py-4">
            {/* Realistic Mobile Device Mockup Frame with Frosted Glass Accents */}
            <div className="w-[390px] h-[820px] bg-slate-900/90 backdrop-blur-2xl rounded-[48px] p-3 ring-12 ring-slate-800/80 shadow-2xl border-4 border-white/10 flex flex-col overflow-hidden relative">
              {/* Dynamic Island / Notch */}
              <div className="w-28 h-5 bg-black rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center border border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700"></span>
              </div>

              {/* Scrollable Screen Content inside mobile */}
              <div className="flex-1 overflow-y-auto px-1 pb-8 space-y-5">
                {activeRole === 'technician' ? (
                  <TechnicianPortalView
                    technician={currentTechnician}
                    orders={orders}
                    onVerifyClientOtp={handleVerifyClientOtp}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                    onOpenBadgePreview={() => setSelectedTechForBadge(currentTechnician)}
                    onReturnHome={() => {
                      setActiveRole('client');
                      setActiveTab('home');
                    }}
                  />
                ) : (
                  <>
                    {activeTab === 'home' && (
                      <HomeView
                        orders={orders}
                        technicians={technicians}
                        marketplaceItems={marketplaceItems}
                        userEcoProfile={userEcoProfile}
                        onNavigateTab={(tab) => setActiveTab(tab)}
                        onOpenBookingModal={() => setIsBookingModalOpen(true)}
                        onOpenDiagnosticModal={() => setIsDiagnosticModalOpen(true)}
                        onOpenBadgeModal={(tech) => setSelectedTechForBadge(tech)}
                        onOpenOtpModal={(ord) => setSelectedOrderForOtp(ord)}
                        onOpenChecklistModal={(ord) => setSelectedOrderForChecklist(ord)}
                        onSwitchToTechPortal={() => setActiveRole('technician')}
                      />
                    )}

                    {activeTab === 'repairs' && (
                      <RepairTrackingView
                        orders={orders}
                        onOpenBookingModal={() => setIsBookingModalOpen(true)}
                        onOpenOtpModal={(ord) => setSelectedOrderForOtp(ord)}
                        onOpenBadgeModal={(tech) => setSelectedTechForBadge(tech)}
                        onOpenChecklistModal={(ord) => setSelectedOrderForChecklist(ord)}
                        onReleaseEscrow={handleReleaseEscrow}
                        onReturnHome={() => setActiveTab('home')}
                      />
                    )}

                    {activeTab === 'marketplace' && (
                      <MarketplaceView
                        items={marketplaceItems}
                        onOpenDiagnosticModal={() => setIsDiagnosticModalOpen(true)}
                        onBuyItem={handleBuyMarketplaceItem}
                        onReturnHome={() => setActiveTab('home')}
                      />
                    )}

                    {activeTab === 'recycling' && (
                      <RecyclingView
                        userProfile={userEcoProfile}
                        collectionPoints={collectionPoints}
                        rewards={rewards}
                        onRedeemReward={handleRedeemReward}
                        onRecordDeposit={handleRecordDeposit}
                        onReturnHome={() => setActiveTab('home')}
                      />
                    )}

                    {activeTab === 'security' && (
                      <SecurityProtocolView
                        onOpenBookingModal={() => setIsBookingModalOpen(true)}
                        onOpenBadgePreview={() => setSelectedTechForBadge(currentTechnician)}
                        onReturnHome={() => setActiveTab('home')}
                      />
                    )}
                  </>
                )}
              </div>

              {/* Home indicator bar at bottom */}
              <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mt-2 shrink-0" />
            </div>
          </div>
        ) : (
          <div>
            {/* Pro Technician Portal View */}
            {activeRole === 'technician' ? (
              <TechnicianPortalView
                technician={currentTechnician}
                orders={orders}
                onVerifyClientOtp={handleVerifyClientOtp}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onOpenBadgePreview={() => setSelectedTechForBadge(currentTechnician)}
                onReturnHome={() => {
                  setActiveRole('client');
                  setActiveTab('home');
                }}
              />
            ) : (
              <>
                {/* Tab 0: Home Hub */}
                {activeTab === 'home' && (
                  <HomeView
                    orders={orders}
                    technicians={technicians}
                    marketplaceItems={marketplaceItems}
                    userEcoProfile={userEcoProfile}
                    onNavigateTab={(tab) => {
                      setActiveTab(tab);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onOpenBookingModal={() => setIsBookingModalOpen(true)}
                    onOpenDiagnosticModal={() => setIsDiagnosticModalOpen(true)}
                    onOpenBadgeModal={(tech) => setSelectedTechForBadge(tech)}
                    onOpenOtpModal={(ord) => setSelectedOrderForOtp(ord)}
                    onOpenChecklistModal={(ord) => setSelectedOrderForChecklist(ord)}
                    onSwitchToTechPortal={() => {
                      setActiveRole('technician');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}

                {/* Tab 1: Repair Service & Tracking */}
                {activeTab === 'repairs' && (
                  <RepairTrackingView
                    orders={orders}
                    onOpenBookingModal={() => setIsBookingModalOpen(true)}
                    onOpenOtpModal={(ord) => setSelectedOrderForOtp(ord)}
                    onOpenBadgeModal={(tech) => setSelectedTechForBadge(tech)}
                    onOpenChecklistModal={(ord) => setSelectedOrderForChecklist(ord)}
                    onReleaseEscrow={handleReleaseEscrow}
                    onReturnHome={() => {
                      setActiveTab('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}

                {/* Tab 2: Second-hand Certified Marketplace */}
                {activeTab === 'marketplace' && (
                  <MarketplaceView
                    items={marketplaceItems}
                    onOpenDiagnosticModal={() => setIsDiagnosticModalOpen(true)}
                    onBuyItem={handleBuyMarketplaceItem}
                    onReturnHome={() => {
                      setActiveTab('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}

                {/* Tab 3: Recycling & Eco Rewards */}
                {activeTab === 'recycling' && (
                  <RecyclingView
                    userProfile={userEcoProfile}
                    collectionPoints={collectionPoints}
                    rewards={rewards}
                    onRedeemReward={handleRedeemReward}
                    onRecordDeposit={handleRecordDeposit}
                    onReturnHome={() => {
                      setActiveTab('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}

                {/* Tab 4: 3-Pillar Security Protocol */}
                {activeTab === 'security' && (
                  <SecurityProtocolView
                    onOpenBookingModal={() => setIsBookingModalOpen(true)}
                    onOpenBadgePreview={() => setSelectedTechForBadge(currentTechnician)}
                    onReturnHome={() => {
                      setActiveTab('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}
              </>
            )}
          </div>
        )}

      </main>

      {/* Frosted Glass Footer */}
      <footer className="bg-white/5 backdrop-blur-xl border-t border-white/10 py-8 px-4 text-center text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div 
            onClick={() => {
              setActiveRole('client');
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="font-bold text-white font-display group-hover:text-emerald-300 transition">Gira-Tech Rwanda</span>
            <span>• Kigali Circular Tech Ecosystem</span>
          </div>

          {/* Direct Tab Navigation Links in Footer */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
            <button
              onClick={() => {
                setActiveRole('client');
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-2.5 py-1 rounded-lg transition ${activeTab === 'home' && activeRole === 'client' ? 'text-emerald-400 font-bold bg-white/10' : 'text-slate-400 hover:text-white'}`}
            >
              {t('tab_home')}
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => {
                setActiveRole('client');
                setActiveTab('repairs');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-2.5 py-1 rounded-lg transition ${activeTab === 'repairs' ? 'text-emerald-400 font-bold bg-white/10' : 'text-slate-400 hover:text-white'}`}
            >
              {t('tab_repairs')}
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => {
                setActiveRole('client');
                setActiveTab('marketplace');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-2.5 py-1 rounded-lg transition ${activeTab === 'marketplace' ? 'text-emerald-400 font-bold bg-white/10' : 'text-slate-400 hover:text-white'}`}
            >
              {t('tab_marketplace')}
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => {
                setActiveRole('client');
                setActiveTab('recycling');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-2.5 py-1 rounded-lg transition ${activeTab === 'recycling' ? 'text-emerald-400 font-bold bg-white/10' : 'text-slate-400 hover:text-white'}`}
            >
              {t('tab_recycling')}
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => {
                setActiveRole('client');
                setActiveTab('security');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-2.5 py-1 rounded-lg transition ${activeTab === 'security' ? 'text-emerald-400 font-bold bg-white/10' : 'text-slate-400 hover:text-white'}`}
            >
              {t('tab_security')}
            </button>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="bg-white/5 px-2.5 py-1 rounded-full border border-white/10">{t('pwa_ready')}</span>
            <span className="bg-white/5 px-2.5 py-1 rounded-full border border-white/10">{t('momo_secured')}</span>
          </div>
        </div>
      </footer>

      {/* Modals Container */}
      <RepairBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSubmitOrder={handleAddNewOrder}
        initialClient={currentUser ? {
          name: currentUser.name,
          phone: currentUser.phone,
          neighborhood: currentUser.neighborhood
        } : undefined}
      />

      <AutoDiagnosticModal
        isOpen={isDiagnosticModalOpen}
        onClose={() => setIsDiagnosticModalOpen(false)}
        onListDevice={handleListDiagnosedItem}
      />

      {selectedTechForBadge && (
        <SecurityBadgeModal
          isOpen={Boolean(selectedTechForBadge)}
          onClose={() => setSelectedTechForBadge(null)}
          technician={selectedTechForBadge}
          clientName={currentUser?.name || "Patrick Habimana"}
        />
      )}

      {selectedOrderForChecklist && selectedOrderForChecklist.inventoryChecklist && (
        <InventoryChecklistModal
          isOpen={Boolean(selectedOrderForChecklist)}
          onClose={() => setSelectedOrderForChecklist(null)}
          checklist={selectedOrderForChecklist.inventoryChecklist}
          deviceTitle={`${selectedOrderForChecklist.deviceBrand} ${selectedOrderForChecklist.deviceModel}`}
          orderNumber={selectedOrderForChecklist.orderNumber}
        />
      )}

      {selectedOrderForOtp && (
        <OtpVerificationModal
          isOpen={Boolean(selectedOrderForOtp)}
          onClose={() => setSelectedOrderForOtp(null)}
          otpCode={selectedOrderForOtp.otpCode}
          qrToken={selectedOrderForOtp.qrToken}
          orderNumber={selectedOrderForOtp.orderNumber}
          technicianName={selectedOrderForOtp.assignedTechnician?.name || 'Jean-Paul Mugisha'}
          onSimulateTechnicianScan={() => {
            handleVerifyClientOtp(selectedOrderForOtp.id, selectedOrderForOtp.otpCode);
          }}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
        initialRole={authModalRole}
        registeredUsers={users}
      />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainAppContent />
    </LanguageProvider>
  );
}
