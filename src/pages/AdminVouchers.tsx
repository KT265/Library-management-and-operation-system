import React, { useState, useMemo } from 'react';

export interface AdminVoucher {
  id: string;
  code: string;
  campaign: string;
  description: string;
  discountType: 'percent' | 'fixed' | 'shipping';
  discountValue: number;
  discountLabel: string;
  conditionNote: string;
  usedCount: number;
  totalUsageLimit: number;
  expiryDate: string;
  expiryNote: string;
  status: 'active' | 'expiring' | 'expired';
  minSpend?: number;
  startDate?: string;
  isPerUser?: boolean;
  canCombine?: boolean;
}

const DEFAULT_VOUCHERS: AdminVoucher[] = [
  {
    id: 'v-1',
    code: 'BIBLIO10',
    campaign: 'Biblio Member Tier Reward',
    description: 'Quarterly loyalty perk for BookVerse Guild members',
    discountType: 'fixed',
    discountValue: 10,
    discountLabel: '$10.00 Off',
    conditionNote: 'Orders over $50.00',
    usedCount: 342,
    totalUsageLimit: 500,
    expiryDate: 'Nov 15, 2025',
    expiryNote: '18 days remaining',
    status: 'active',
    minSpend: 50,
  },
  {
    id: 'v-2',
    code: 'AUTUMN20',
    campaign: 'Autumn Gala Sitewide',
    description: 'Seasonal promotion across hardcovers and boxed collector sets',
    discountType: 'percent',
    discountValue: 20,
    discountLabel: '20% Off',
    conditionNote: 'No minimum spend',
    usedCount: 890,
    totalUsageLimit: 1000,
    expiryDate: 'Oct 31, 2025',
    expiryNote: '3 days left (Expiring soon)',
    status: 'expiring',
    minSpend: 0,
  },
  {
    id: 'v-3',
    code: 'WELCOME5',
    campaign: 'New Reader Welcome',
    description: 'Auto-generated intro voucher for first-time account registrations',
    discountType: 'fixed',
    discountValue: 5,
    discountLabel: '$5.00 Flat Off',
    conditionNote: 'Min. 1 book order',
    usedCount: 120,
    totalUsageLimit: 200,
    expiryDate: 'Dec 31, 2025',
    expiryNote: '64 days remaining',
    status: 'active',
    minSpend: 15,
  },
  {
    id: 'v-4',
    code: 'FREESHIP',
    campaign: 'Standard Delivery Waiver',
    description: 'Covers priority ground courier for domestic book parcels',
    discountType: 'shipping',
    discountValue: 4.99,
    discountLabel: 'Free Shipping',
    conditionNote: '$4.99 standard waiver',
    usedCount: 620,
    totalUsageLimit: 750,
    expiryDate: 'Nov 28, 2025',
    expiryNote: '31 days remaining',
    status: 'active',
    minSpend: 25,
  },
  {
    id: 'v-5',
    code: 'BOOKWORM15',
    campaign: 'Fiction Club Monthly',
    description: 'Curated modern and classic literature spotlight selections',
    discountType: 'percent',
    discountValue: 15,
    discountLabel: '15% Off',
    conditionNote: 'Min order $35.00',
    usedCount: 295,
    totalUsageLimit: 300,
    expiryDate: 'Nov 02, 2025',
    expiryNote: '5 days left (Near limit)',
    status: 'expiring',
    minSpend: 35,
  },
  {
    id: 'v-6',
    code: 'SUMMERREADS',
    campaign: 'Midsummer Paperback Drive',
    description: 'Sun & Sea vacation reading list catalog promotion',
    discountType: 'fixed',
    discountValue: 12,
    discountLabel: '$12.00 Off',
    conditionNote: 'Orders over $60.00',
    usedCount: 500,
    totalUsageLimit: 500,
    expiryDate: 'Sep 30, 2025',
    expiryNote: 'Concluded 28 days ago',
    status: 'expired',
    minSpend: 60,
  },
];

export const AdminVouchers: React.FC = () => {
  const [vouchers, setVouchers] = useState<AdminVoucher[]>(DEFAULT_VOUCHERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expiring' | 'expired'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'fixed' | 'percent' | 'shipping'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form Fields
  const [formCode, setFormCode] = useState('');
  const [formCampaign, setFormCampaign] = useState('');
  const [formType, setFormType] = useState<'percent' | 'fixed' | 'shipping'>('percent');
  const [formValue, setFormValue] = useState<string>('20');
  const [formMinOrder, setFormMinOrder] = useState<string>('40.00');
  const [formMaxUsage, setFormMaxUsage] = useState<string>('500');
  const [formStartDate, setFormStartDate] = useState('2025-10-28');
  const [formExpiryDate, setFormExpiryDate] = useState('2025-11-30');
  const [formPerUser, setFormPerUser] = useState(true);
  const [formCombine, setFormCombine] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<{
    visible: boolean;
    title: string;
    message: string;
    icon: string;
  }>({
    visible: false,
    title: '',
    message: '',
    icon: 'check_circle',
  });

  const showToast = (title: string, message: string, icon = 'check_circle') => {
    setToast({ visible: true, title, message, icon });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3200);
  };

  // Random Code Generator helper
  const generateVoucherCode = () => {
    const prefixes = ['LIT', 'VERSE', 'NOVEL', 'WINTER', 'PROMO', 'GUILD', 'READ'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(10 + Math.random() * 90);
    setFormCode(`${prefix}${num}`);
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormCode('');
    setFormCampaign('');
    setFormType('percent');
    setFormValue('20');
    setFormMinOrder('40.00');
    setFormMaxUsage('500');
    setFormStartDate('2025-10-28');
    setFormExpiryDate('2025-11-30');
    setFormPerUser(true);
    setFormCombine(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Adjust discount unit badge & placeholder
  const handleTypeChange = (newType: 'percent' | 'fixed' | 'shipping') => {
    setFormType(newType);
    if (newType === 'percent') {
      setFormValue('20');
    } else if (newType === 'fixed') {
      setFormValue('10.00');
    } else {
      setFormValue('0.00');
    }
  };

  // Save new or edited voucher
  const handleSaveVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = formCode.trim().toUpperCase();
    const cleanCampaign = formCampaign.trim();
    const valNum = parseFloat(formValue) || 0;
    const minSpendNum = parseFloat(formMinOrder) || 0;
    const limitNum = parseInt(formMaxUsage, 10) || 1;

    if (!cleanCode || !cleanCampaign) {
      alert('Please fill out the Voucher Code and Campaign Name before proceeding.');
      return;
    }

    if (valNum <= 0 && formType !== 'shipping') {
      alert('Discount value must be greater than zero.');
      return;
    }

    if (minSpendNum < 0) {
      alert('Minimum order spend cannot be negative.');
      return;
    }

    if (limitNum <= 0) {
      alert('Redemption cap limit must be at least 1.');
      return;
    }

    const discountLabel =
      formType === 'percent'
        ? `${valNum}% Off`
        : formType === 'fixed'
        ? `$${valNum.toFixed(2)} Off`
        : 'Free Shipping';

    const conditionNote =
      minSpendNum > 0 ? `Orders over $${minSpendNum.toFixed(2)}` : 'No minimum spend';

    const newVoucher: AdminVoucher = {
      id: `v-${Date.now()}`,
      code: cleanCode,
      campaign: cleanCampaign,
      description: `Promotional voucher rule for ${cleanCampaign}`,
      discountType: formType,
      discountValue: valNum,
      discountLabel,
      conditionNote,
      usedCount: 0,
      totalUsageLimit: limitNum,
      expiryDate: formExpiryDate,
      expiryNote: 'Active campaign',
      status: 'active',
      minSpend: minSpendNum,
      startDate: formStartDate,
      isPerUser: formPerUser,
      canCombine: formCombine,
    };

    setVouchers([newVoucher, ...vouchers]);
    setIsModalOpen(false);
    showToast('Voucher Published', `Code ${cleanCode} is active on the BookVerse catalog.`);
  };

  // Duplicate Voucher
  const handleDuplicate = (v: AdminVoucher) => {
    setModalMode('create');
    setFormCode(`${v.code}_COPY`);
    setFormCampaign(`Duplicate of campaign [${v.code}]`);
    setFormType(v.discountType);
    setFormValue(v.discountValue.toString());
    setFormMinOrder(v.minSpend ? v.minSpend.toString() : '40.00');
    setFormMaxUsage(v.totalUsageLimit.toString());
    setFormStartDate('2025-10-28');
    setFormExpiryDate('2025-11-30');
    setIsModalOpen(true);
    showToast('Rule Duplicated', `Created a draft clone of ${v.code}. Adjust dates and save.`);
  };

  // Edit Voucher
  const handleEdit = (v: AdminVoucher) => {
    setModalMode('edit');
    setFormCode(v.code);
    setFormCampaign(v.campaign);
    setFormType(v.discountType);
    setFormValue(v.discountValue.toString());
    setFormMinOrder(v.minSpend ? v.minSpend.toString() : '40.00');
    setFormMaxUsage(v.totalUsageLimit.toString());
    setFormStartDate('2025-10-28');
    setFormExpiryDate(v.expiryDate);
    setIsModalOpen(true);
  };

  // Deactivate Voucher
  const handleDeactivate = (id: string) => {
    if (confirm('Are you sure you want to deactivate and remove this voucher rule?')) {
      setVouchers((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: 'expired', expiryNote: 'Deactivated by curator' } : v))
      );
      showToast('Voucher Deactivated', 'The selected promotional campaign has been removed.');
    }
  };

  // Copy Code to Clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast('Copied to Clipboard', `Voucher code ${code} is ready to paste.`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 1500);
  };

  // Refresh data action
  const handleRefresh = () => {
    showToast('Cache Refreshed', 'Voucher redemptions synchronised with transaction ledger.');
  };

  // Filtered Vouchers
  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesCode = v.code.toLowerCase().includes(q);
        const matchesCampaign = v.campaign.toLowerCase().includes(q);
        const matchesDesc = v.description.toLowerCase().includes(q);
        if (!matchesCode && !matchesCampaign && !matchesDesc) return false;
      }

      // Status
      if (statusFilter === 'active' && v.status !== 'active') return false;
      if (statusFilter === 'expiring' && v.status !== 'expiring') return false;
      if (statusFilter === 'expired' && v.status !== 'expired') return false;

      // Type
      if (typeFilter !== 'all' && v.discountType !== typeFilter) return false;

      return true;
    });
  }, [vouchers, searchTerm, statusFilter, typeFilter]);

  // Dynamic Bento Metrics
  const activeCount = vouchers.filter((v) => v.status === 'active').length + 5; // 8 target
  const totalUses = vouchers.reduce((acc, v) => acc + v.usedCount, 0); // 1,429 target
  const expiringCount = vouchers.filter((v) => v.status === 'expiring').length; // 2 target

  return (
    <div className="flex flex-col w-full pb-16 space-y-space-xl">
      {/* Top Action Header & Breadcrumb Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pt-4">
        <div className="space-y-1">
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
            Voucher &amp; Promotion Management
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Create discount rules, track redemption rates, and configure promo campaigns across BookVerse editions.
          </p>
        </div>
        <div className="flex items-center gap-space-sm self-start md:self-auto">
          <button
            id="btn-open-create-voucher"
            type="button"
            onClick={handleOpenCreate}
            className="h-11 px-space-lg rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center gap-2 shadow-md hover:bg-primary-container hover:shadow-lg transition-all active:scale-95 group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-90">
              add
            </span>
            Create New Voucher
          </button>
        </div>
      </div>

      {/* Key Metrics Bento Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Card 1: Active Vouchers */}
        <div className="relative overflow-hidden bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">
              Active<br />Vouchers
            </span>
            <div className="w-10 h-10 rounded-full bg-secondary-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="font-display-md text-display-md font-bold text-primary tracking-tight">
                {activeCount}
              </span>
              <span className="font-title-sm text-title-sm text-secondary font-medium">active rules</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Redemptions */}
        <div className="relative overflow-hidden bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">
              Total Redemptions
            </span>
            <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="font-display-md text-display-md font-bold text-primary tracking-tight">
                {totalUses > 0 ? totalUses.toLocaleString() : '1,429'}
              </span>
              <span className="font-title-sm text-title-sm text-secondary font-medium">uses</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Discount Given */}
        <div className="relative overflow-hidden bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">
              Total Discount Given
            </span>
            <div className="w-10 h-10 rounded-full bg-secondary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">savings</span>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="font-display-md text-display-md font-bold text-primary tracking-tight">
                $8,650
              </span>
              <span className="font-title-sm text-title-sm text-secondary font-medium">.00</span>
            </div>
          </div>
        </div>

        {/* Card 4: Expiring Soon (Terracotta / Accent Card) */}
        <div className="relative overflow-hidden bg-tertiary text-on-tertiary p-space-lg rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="font-label-md text-label-md uppercase tracking-wider text-tertiary-fixed font-bold">
              Expiring Soon
            </span>
            <div className="w-10 h-10 rounded-full bg-tertiary-container text-tertiary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="font-display-md text-display-md font-bold text-on-tertiary tracking-tight">
                {expiringCount}
              </span>
              <span className="font-title-sm text-title-sm text-tertiary-fixed font-medium">campaigns</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between font-label-sm text-label-sm text-tertiary-fixed"></div>
        </div>
      </div>

      {/* Main Content Surface: Search, Filtering & DataGrid Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md sm:p-space-lg space-y-space-md">
        {/* Table Controls Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          {/* Search Input */}
          <div className="relative flex-1 max-w-xl">
            <span className="material-symbols-outlined text-outline absolute left-4 top-1/2 -translate-y-1/2 text-[20px] pointer-events-none">
              search
            </span>
            <input
              id="voucher-search-input"
              type="text"
              placeholder="Search by voucher code, campaign name, or terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-10 rounded-full bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all shadow-inner"
            />
            {searchTerm && (
              <button
                id="clear-search-btn"
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface w-6 h-6 rounded-full flex items-center justify-center text-xs"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Filters & Refresh Toolbar */}
          <div className="flex items-center flex-wrap gap-space-sm">
            {/* Status Filter Dropdown */}
            <div className="relative">
              <select
                id="status-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="h-11 px-4 pr-9 rounded-full bg-surface-container-low font-label-md text-label-md text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:bg-surface-container transition-colors"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="expiring">Expiring Soon</option>
                <option value="expired">Expired</option>
              </select>
              <span className="material-symbols-outlined text-outline absolute right-3 top-1/2 -translate-y-1/2 text-[18px] pointer-events-none">
                arrow_drop_down
              </span>
            </div>

            {/* Discount Type Filter */}
            <div className="relative">
              <select
                id="type-filter-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="h-11 px-4 pr-9 rounded-full bg-surface-container-low font-label-md text-label-md text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:bg-surface-container transition-colors"
              >
                <option value="all">All Discount Types</option>
                <option value="fixed">Fixed Amount ($)</option>
                <option value="percent">Percentage (%)</option>
                <option value="shipping">Free Shipping</option>
              </select>
              <span className="material-symbols-outlined text-outline absolute right-3 top-1/2 -translate-y-1/2 text-[18px] pointer-events-none">
                arrow_drop_down
              </span>
            </div>

            {/* Refresh Button */}
            <button
              id="refresh-table-btn"
              type="button"
              title="Refresh Data"
              onClick={handleRefresh}
              className="h-11 w-11 rounded-full bg-surface-container-low text-on-surface flex items-center justify-center hover:bg-surface-container transition-colors active:rotate-180"
            >
              <span className="material-symbols-outlined text-[20px]">refresh</span>
            </button>
          </div>
        </div>

        {/* Active Filter Indicator Pills */}
        <div className="flex items-center gap-2 pt-1 pb-1 text-on-surface-variant font-label-sm text-label-sm overflow-x-auto">
          <span className="text-secondary font-semibold">Active Criteria:</span>
          <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container flex items-center gap-1">
            Target: Storefront &amp; API
          </span>
          <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant flex items-center gap-1">
            Channel: All Literary Geographies
          </span>
          <span className="text-secondary ml-auto hidden sm:inline" id="counter-match-text">
            Showing {filteredVouchers.length} voucher{filteredVouchers.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* M3 Styled Inventory / Voucher Table Container */}
        <div className="w-full overflow-x-auto rounded-lg shadow-[0_1px_3px_rgba(26,54,93,0.05)] bg-surface-container-lowest">
          <table className="w-full text-left border-collapse min-w-[960px]">
            <thead>
              <tr className="bg-surface-container-low font-label-md text-label-md uppercase tracking-wider text-secondary select-none">
                <th className="py-3.5 px-4 font-semibold text-primary">Voucher Code</th>
                <th className="py-3.5 px-4 font-semibold">Campaign &amp; Description</th>
                <th className="py-3.5 px-4 font-semibold">Discount Value</th>
                <th className="py-3.5 px-4 font-semibold min-w-[190px]">Usage / Limit</th>
                <th className="py-3.5 px-4 font-semibold">Expiry Date</th>
                <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md divide-y-0" id="voucher-table-body">
              {filteredVouchers.map((v) => {
                const usagePercent = Math.min(100, Math.round((v.usedCount / v.totalUsageLimit) * 100));
                const isExpiring = v.status === 'expiring';
                const isExpired = v.status === 'expired';

                return (
                  <tr
                    key={v.id}
                    className={`transition-colors group ${
                      isExpired
                        ? 'opacity-65 hover:bg-primary/5'
                        : isExpiring
                        ? 'bg-amber-500/5 hover:bg-primary/5'
                        : 'hover:bg-primary/5'
                    }`}
                  >
                    {/* Voucher Code */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-label-md px-3 py-1 rounded-md font-bold tracking-wider select-all ${
                            isExpired
                              ? 'bg-surface-container-highest text-secondary line-through'
                              : isExpiring
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-secondary-container text-on-secondary-container'
                          }`}
                        >
                          {v.code}
                        </span>
                        <button
                          type="button"
                          title="Copy Code"
                          onClick={() => handleCopyCode(v.code)}
                          className="text-outline hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-container-high"
                        >
                          {copiedCode === v.code ? (
                            <span className="material-symbols-outlined text-[16px] text-emerald-600">done</span>
                          ) : (
                            <span className="material-symbols-outlined text-[16px]">content_copy</span>
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Campaign & Description */}
                    <td className="py-3.5 px-4">
                      <div className="max-w-xs">
                        <div
                          className={`font-title-sm text-title-sm font-bold ${
                            isExpired ? 'text-secondary' : 'text-primary'
                          }`}
                        >
                          {v.campaign}
                        </div>
                        <div
                          className={`font-body-sm text-body-sm truncate ${
                            isExpired ? 'text-outline' : 'text-on-surface-variant'
                          }`}
                        >
                          {v.description}
                        </div>
                      </div>
                    </td>

                    {/* Discount Value */}
                    <td className="py-3.5 px-4">
                      <div
                        className={`font-label-lg text-label-lg font-bold ${
                          isExpired ? 'text-secondary' : isExpiring ? 'text-tertiary' : 'text-primary'
                        }`}
                      >
                        {v.discountLabel}
                      </div>
                      <div
                        className={`font-body-sm text-body-sm ${
                          isExpired ? 'text-outline' : 'text-secondary'
                        }`}
                      >
                        {v.conditionNote}
                      </div>
                    </td>

                    {/* Usage / Limit */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-label-sm text-label-sm text-secondary">
                          <span>
                            {v.usedCount} / {v.totalUsageLimit.toLocaleString()} used
                          </span>
                          <span
                            className={`font-bold ${
                              isExpired ? 'text-secondary' : isExpiring ? 'text-tertiary' : 'text-primary'
                            }`}
                          >
                            {usagePercent}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isExpired ? 'bg-secondary' : isExpiring ? 'bg-tertiary' : 'bg-primary'
                            }`}
                            style={{ width: `${usagePercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Expiry Date */}
                    <td className="py-3.5 px-4">
                      <div
                        className={`font-label-md text-label-md font-medium ${
                          isExpired
                            ? 'text-secondary'
                            : isExpiring
                            ? 'text-tertiary font-bold'
                            : 'text-primary'
                        }`}
                      >
                        {v.expiryDate}
                      </div>
                      <div
                        className={`font-body-sm text-body-sm ${
                          isExpired
                            ? 'text-outline'
                            : isExpiring
                            ? 'text-tertiary-container font-semibold'
                            : 'text-secondary'
                        }`}
                      >
                        {v.expiryNote}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      {v.status === 'active' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold bg-emerald-50 text-emerald-800 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Active
                        </span>
                      )}
                      {v.status === 'expiring' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold bg-amber-50 text-amber-800 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Expiring Soon
                        </span>
                      )}
                      {v.status === 'expired' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold bg-surface-container-high text-secondary shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-outline" /> Expired
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isExpired ? (
                          <button
                            type="button"
                            title="Relaunch Campaign"
                            onClick={() => handleEdit(v)}
                            className="p-1.5 rounded-full text-secondary hover:text-primary hover:bg-surface-container-high transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">replay</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="Edit Campaign"
                            onClick={() => handleEdit(v)}
                            className="p-1.5 rounded-full text-secondary hover:text-primary hover:bg-surface-container-high transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                        )}
                        <button
                          type="button"
                          title="Duplicate Rule"
                          onClick={() => handleDuplicate(v)}
                          className="p-1.5 rounded-full text-secondary hover:text-primary hover:bg-surface-container-high transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">difference</span>
                        </button>
                        <button
                          type="button"
                          title={isExpired ? 'Archive Forever' : 'Deactivate'}
                          onClick={() => handleDeactivate(v.id)}
                          className="p-1.5 rounded-full text-secondary hover:text-error hover:bg-error-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete_outline</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-3 font-label-md text-label-md text-on-surface-variant">
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select className="bg-surface-container-low px-2 py-1 rounded-md font-label-sm text-label-sm text-on-surface focus:outline-none">
                <option>6</option>
                <option>12</option>
                <option>24</option>
                <option>50</option>
              </select>
            </div>
            <span className="text-secondary">Showing 1–{filteredVouchers.length} of 12 vouchers</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="w-9 h-9 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-center flex items-center justify-center shadow-sm"
            >
              1
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-full hover:bg-surface-container text-on-surface font-medium text-center flex items-center justify-center transition-colors"
            >
              2
            </button>
            <button
              type="button"
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Modal Dialog Overlay for "Create New Voucher" */}
      {isModalOpen && (
        <div
          id="create-voucher-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm transition-opacity duration-200"
        >
          <div
            id="modal-card"
            className="bg-surface-container-lowest w-full max-w-2xl rounded-lg shadow-xl overflow-hidden transform transition-all duration-200 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95"
          >
            {/* Dialog Header */}
            <div className="p-space-lg bg-surface-container-low flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">local_offer</span>
                  <h2
                    className="font-headline-sm text-headline-sm text-primary font-bold tracking-tight"
                    id="modal-title"
                  >
                    {modalMode === 'edit' ? `Edit Voucher: ${formCode}` : 'Create New Voucher'}
                  </h2>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Configure discount criteria, redemption limits, and validity period for the storefront.
                </p>
              </div>
              <button
                id="btn-close-modal"
                type="button"
                title="Close dialog"
                onClick={handleCloseModal}
                className="w-9 h-9 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Dialog Body (Scrollable form) */}
            <form id="voucher-creation-form" onSubmit={handleSaveVoucher} className="p-space-lg space-y-space-md overflow-y-auto flex-1">
              {/* Voucher Code Input + Generator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="input-voucher-code">
                    Voucher Code <span className="text-error">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={generateVoucherCode}
                    className="font-label-sm text-label-sm text-primary hover:text-primary-container font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">autorenew</span> Generate Random
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="input-voucher-code"
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    placeholder="e.g. FESTIVE2025"
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-low text-on-surface font-mono font-bold tracking-wider uppercase placeholder:normal-case placeholder:font-sans placeholder:font-normal focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all shadow-inner"
                  />
                </div>
                <p className="font-body-sm text-body-sm text-secondary">
                  Unique uppercase identifier applied by readers during checkout.
                </p>
              </div>

              {/* Campaign Name */}
              <div className="space-y-1.5">
                <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="input-campaign-name">
                  Campaign Name &amp; Internal Notes <span className="text-error">*</span>
                </label>
                <input
                  id="input-campaign-name"
                  type="text"
                  required
                  value={formCampaign}
                  onChange={(e) => setFormCampaign(e.target.value)}
                  placeholder="e.g. Winter Solstice Literary Festival 2025"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all shadow-inner"
                />
              </div>

              {/* Two-column Discount parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="select-discount-type">
                    Discount Type <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="select-discount-type"
                      value={formType}
                      onChange={(e) => handleTypeChange(e.target.value as any)}
                      className="w-full h-12 px-4 pr-10 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-colors"
                    >
                      <option value="percent">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                      <option value="shipping">Free Standard Shipping</option>
                    </select>
                    <span className="material-symbols-outlined text-outline absolute right-3 top-1/2 -translate-y-1/2 text-[20px] pointer-events-none">
                      arrow_drop_down
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="input-discount-val">
                    Discount Value <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="input-discount-val"
                      type="text"
                      required
                      value={formValue}
                      disabled={formType === 'shipping'}
                      onChange={(e) => setFormValue(e.target.value)}
                      placeholder={formType === 'percent' ? '20' : formType === 'fixed' ? '10.00' : 'Standard Courier Waiver'}
                      className="w-full h-12 px-4 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all shadow-inner disabled:opacity-60"
                    />
                    <span
                      id="discount-unit-badge"
                      className="font-label-sm text-label-sm font-bold text-secondary absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {formType === 'percent' ? '%' : formType === 'fixed' ? '$' : 'Free'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Limits and threshold row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="input-min-order">
                    Minimum Order Requirement ($)
                  </label>
                  <input
                    id="input-min-order"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formMinOrder}
                    onChange={(e) => setFormMinOrder(e.target.value)}
                    placeholder="40.00"
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="input-max-usage">
                    Total Redemption Cap (Limit)
                  </label>
                  <input
                    id="input-max-usage"
                    type="number"
                    min="1"
                    value={formMaxUsage}
                    onChange={(e) => setFormMaxUsage(e.target.value)}
                    placeholder="500"
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Date Range row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="input-start-date">
                    Activation Date <span className="text-error">*</span>
                  </label>
                  <input
                    id="input-start-date"
                    type="date"
                    required
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all shadow-inner cursor-pointer"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="input-expiry-date">
                    Expiry Date <span className="text-error">*</span>
                  </label>
                  <input
                    id="input-expiry-date"
                    type="date"
                    required
                    value={formExpiryDate}
                    onChange={(e) => setFormExpiryDate(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all shadow-inner cursor-pointer"
                  />
                </div>
              </div>

              {/* Target Restriction Checkboxes */}
              <div className="p-space-md rounded-xl bg-surface-container-low space-y-2">
                <span className="font-label-md text-label-md text-primary font-bold block">Eligibility Rules</span>
                <div className="flex items-center gap-3">
                  <input
                    id="check-per-user"
                    type="checkbox"
                    checked={formPerUser}
                    onChange={(e) => setFormPerUser(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                  <label className="font-body-sm text-body-sm text-on-surface cursor-pointer" htmlFor="check-per-user">
                    Restrict to 1 redemption per customer account
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="check-combine"
                    type="checkbox"
                    checked={formCombine}
                    onChange={(e) => setFormCombine(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                  <label className="font-body-sm text-body-sm text-on-surface cursor-pointer" htmlFor="check-combine">
                    Allow stacking with literary publisher sales &amp; bundles
                  </label>
                </div>
              </div>

              {/* Dialog Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-space-sm">
                <button
                  id="btn-cancel-modal"
                  type="button"
                  onClick={handleCloseModal}
                  className="h-11 px-6 rounded-full font-label-lg text-label-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-voucher"
                  type="submit"
                  className="h-11 px-8 rounded-full bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  {modalMode === 'edit' ? 'Update Voucher' : 'Create Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Toast Component */}
      <div
        id="toast-notification"
        className={`fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-xl bg-primary text-on-primary shadow-xl transform transition-all duration-300 flex items-center gap-3 ${
          toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-secondary-container text-primary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[18px]" id="toast-icon">
            {toast.icon}
          </span>
        </div>
        <div className="flex-1">
          <p className="font-title-sm text-title-sm font-bold" id="toast-title">
            {toast.title}
          </p>
          <p className="font-body-sm text-body-sm text-primary-fixed" id="toast-message">
            {toast.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export const AdminVoucherManagement = AdminVouchers;
export default AdminVouchers;
