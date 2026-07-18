export type TranslationKey = 
  | 'app.name'
  | 'app.tagline'
  | 'app.loading'
  | 'auth.login'
  | 'auth.logout'
  | 'auth.email'
  | 'auth.phone'
  | 'auth.password'
  | 'auth.pin'
  | 'auth.forgotPassword'
  | 'auth.signup'
  | 'auth.alreadyHaveAccount'
  | 'auth.dontHaveAccount'
  | 'auth.welcomeBack'
  | 'auth.createAccount'
  | 'auth.shopName'
  | 'auth.shopAddress'
  | 'auth.fullName'
   | 'nav.dashboard'
  | 'nav.sales'
  | 'nav.stock'
  | 'nav.shifts'
  | 'nav.reports'
  | 'nav.settings'
  | 'nav.products'
  | 'nav.outlets'
  | 'nav.users'
  | 'sales.newSale'
  | 'sales.cash'
  | 'sales.mpesa'
  | 'sales.mixed'
  | 'sales.total'
  | 'sales.items'
  | 'sales.addItem'
  | 'sales.removeItem'
  | 'sales.quantity'
  | 'sales.price'
  | 'sales.completeSale'
  | 'sales.cancel'
  | 'sales.recentSales'
  | 'stock.currentStock'
  | 'stock.addStock'
  | 'stock.removeStock'
  | 'stock.adjustStock'
  | 'stock.wasteStock'
  | 'stock.stocktake'
  | 'stock.reorder'
  | 'stock.lowStock'
  | 'shift.openShift'
  | 'shift.closeShift'
  | 'shift.openingCash'
  | 'shift.closingCash'
  | 'shift.expectedCash'
  | 'shift.actualCash'
  | 'shift.variance'
  | 'shift.currentShift'
  | 'shift.noOpenShift'
  | 'shift.startShift'
  | 'shift.endShift'
  | 'dashboard.todaySales'
  | 'dashboard.todayCash'
  | 'dashboard.todayMpesa'
  | 'dashboard.transactions'
  | 'dashboard.cashVariance'
  | 'dashboard.weeklyTrend'
  | 'dashboard.noData'
  | 'common.save'
  | 'common.cancel'
  | 'common.delete'
  | 'common.edit'
  | 'common.add'
  | 'common.search'
  | 'common.filter'
  | 'common.sort'
  | 'common.loading'
  | 'common.error'
  | 'common.success'
  | 'common.confirm'
  | 'common.yes'
  | 'common.no'
  | 'common.close'
  | 'common.open'
  | 'common.back'
  | 'common.next'
  | 'common.submit'
  | 'common.required'
  | 'common.optional'
  | 'mpesa.import'
  | 'mpesa.statement'
  | 'mpesa.reconcile'
  | 'mpesa.matched'
  | 'mpesa.unmatched'
  | 'mpesa.uploadCSV'
  | 'alerts.title'
  | 'alerts.noAlerts'
  | 'alerts.riskScore'
  | 'alerts.review'
  | 'alerts.dismiss'
  | 'settings.language'
  | 'settings.english'
  | 'settings.swahili'
  | 'settings.profile'
  | 'settings.outlets'
  | 'settings.users'
  | 'settings.notifications'
  | 'offline.title'
  | 'offline.message'
  | 'offline.syncNow'
  | 'offline.synced'
  | 'offline.pending';

type Translations = Record<string, Record<TranslationKey, string>>;

export const translations: Translations = {
  en: {
    'app.name': 'DukaGuard',
    'app.tagline': 'Know exactly where your money went today',
    'app.loading': 'Loading...',
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.phone': 'Phone Number',
    'auth.password': 'Password',
    'auth.pin': 'PIN Code',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.signup': 'Sign Up',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.welcomeBack': 'Welcome Back',
    'auth.createAccount': 'Create Account',
    'auth.shopName': 'Shop Name',
    'auth.shopAddress': 'Shop Address',
    'auth.fullName': 'Full Name',
    'nav.dashboard': 'Dashboard',
    'nav.sales': 'Sales',
    'nav.stock': 'Stock',
    'nav.shifts': 'Shifts',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.products': 'Products',
    'nav.outlets': 'Outlets',
    'nav.users': 'Users',
    'sales.newSale': 'New Sale',
    'sales.cash': 'Cash',
    'sales.mpesa': 'M-Pesa',
    'sales.mixed': 'Mixed',
    'sales.total': 'Total',
    'sales.items': 'Items',
    'sales.addItem': 'Add Item',
    'sales.removeItem': 'Remove',
    'sales.quantity': 'Qty',
    'sales.price': 'Price',
    'sales.completeSale': 'Complete Sale',
    'sales.cancel': 'Cancel',
    'sales.recentSales': 'Recent Sales',
    'stock.currentStock': 'Current Stock',
    'stock.addStock': 'Add Stock',
    'stock.removeStock': 'Remove Stock',
    'stock.adjustStock': 'Adjust Stock',
    'stock.wasteStock': 'Mark as Waste',
    'stock.stocktake': 'Stock Take',
    'stock.reorder': 'Reorder Level',
    'stock.lowStock': 'Low Stock Items',
    'shift.openShift': 'Open Shift',
    'shift.closeShift': 'Close Shift',
    'shift.openingCash': 'Opening Cash',
    'shift.closingCash': 'Closing Cash',
    'shift.expectedCash': 'Expected Cash',
    'shift.actualCash': 'Actual Cash Count',
    'shift.variance': 'Variance',
    'shift.currentShift': 'Current Shift',
    'shift.noOpenShift': 'No open shift',
    'shift.startShift': 'Start Shift',
    'shift.endShift': 'End Shift',
    'dashboard.todaySales': "Today's Sales",
    'dashboard.todayCash': 'Cash',
    'dashboard.todayMpesa': 'M-Pesa',
    'dashboard.transactions': 'Transactions',
    'dashboard.cashVariance': 'Cash Variance',
    'dashboard.weeklyTrend': 'Weekly Trend',
    'dashboard.noData': 'No data yet',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.close': 'Close',
    'common.open': 'Open',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.submit': 'Submit',
    'common.required': 'Required',
    'common.optional': 'Optional',
    'mpesa.import': 'Import M-Pesa',
    'mpesa.statement': 'M-Pesa Statement',
    'mpesa.reconcile': 'Reconcile',
    'mpesa.matched': 'Matched',
    'mpesa.unmatched': 'Unmatched',
    'mpesa.uploadCSV': 'Upload CSV',
    'alerts.title': 'Alerts',
    'alerts.noAlerts': 'No alerts',
    'alerts.riskScore': 'Risk Score',
    'alerts.review': 'Review',
    'alerts.dismiss': 'Dismiss',
    'settings.language': 'Language',
    'settings.english': 'English',
    'settings.swahili': 'Swahili',
    'settings.profile': 'Profile',
    'settings.outlets': 'Outlets',
    'settings.users': 'Users',
    'settings.notifications': 'Notifications',
    'offline.title': 'You are offline',
    'offline.message': 'Your data is saved locally and will sync when you are back online.',
    'offline.syncNow': 'Sync Now',
    'offline.synced': 'All synced',
    'offline.pending': 'Pending sync',
  },
  sw: {
    'app.name': 'DukaGuard',
    'app.tagline': 'Jua hasa pesa yako ilienda wapi leo',
    'app.loading': 'Inapakia...',
    'auth.login': 'Ingia',
    'auth.logout': 'Toka',
    'auth.email': 'Barua pepe',
    'auth.phone': 'Nambari ya Simu',
    'auth.password': 'Nenosiri',
    'auth.pin': 'Nambari ya Siri',
    'auth.forgotPassword': 'Umesahau Nenosiri?',
    'auth.signup': 'Jiandikishe',
    'auth.alreadyHaveAccount': 'Tayari una akaunti?',
    'auth.dontHaveAccount': 'Huna akaunti?',
    'auth.welcomeBack': 'Karibu Tena',
    'auth.createAccount': 'Unda Akaunti',
    'auth.shopName': 'Jina la Duka',
    'auth.shopAddress': 'Anwani ya Duka',
    'auth.fullName': 'Jina Kamili',
    'nav.dashboard': 'Dashibodi',
    'nav.sales': 'Mauzo',
    'nav.stock': 'Stock',
    'nav.shifts': 'Mabadiliko',
    'nav.reports': 'Ripoti',
    'nav.settings': 'Mipangilio',
    'nav.products': 'Bidhaa',
    'nav.outlets': 'Maduka',
    'nav.users': 'Watumiaji',
    'sales.newSale': 'Mauzo Mpya',
    'sales.cash': 'Pesa',
    'sales.mpesa': 'M-Pesa',
    'sales.mixed': 'Mchanganyiko',
    'sales.total': 'Jumla',
    'sales.items': 'Vitu',
    'sales.addItem': 'Ongeza Kitu',
    'sales.removeItem': 'Ondoa',
    'sales.quantity': 'Idadi',
    'sales.price': 'Bei',
    'sales.completeSale': 'Kamilisha Mauzo',
    'sales.cancel': 'Ghairi',
    'sales.recentSales': 'Mauzo ya Karibuni',
    'stock.currentStock': 'Stock ya Sasa',
    'stock.addStock': 'Ongeza Stock',
    'stock.removeStock': 'Ondoa Stock',
    'stock.adjustStock': 'Rekebisha Stock',
    'stock.wasteStock': 'Weka kama Uporaji',
    'stock.stocktake': 'Hesabu Stock',
    'stock.reorder': 'Kiwango cha Kuagiza',
    'stock.lowStock': 'Bidhaa za Chini',
    'shift.openShift': 'Fungua Mabadiliko',
    'shift.closeShift': 'Funga Mabadiliko',
    'shift.openingCash': 'Pesa ya Kuanza',
    'shift.closingCash': 'Pesa ya Kumaliza',
    'shift.expectedCash': 'Pesa Inayotarajiwa',
    'shift.actualCash': 'Hesabu ya Pesa Halisi',
    'shift.variance': 'Tofauti',
    'shift.currentShift': 'Mabadiliko ya Sasa',
    'shift.noOpenShift': 'Hakuna mabadiliko yaliyofunguliwa',
    'shift.startShift': 'Anza Mabadiliko',
    'shift.endShift': 'Maliza Mabadiliko',
    'dashboard.todaySales': 'Mauzo ya Leo',
    'dashboard.todayCash': 'Pesa',
    'dashboard.todayMpesa': 'M-Pesa',
    'dashboard.transactions': 'Shughuli',
    'dashboard.cashVariance': 'Tofauti ya Pesa',
    'dashboard.weeklyTrend': 'Mwelekeo wa Wiki',
    'dashboard.noData': 'Hakuna data bado',
    'common.save': 'Hifadhi',
    'common.cancel': 'Ghairi',
    'common.delete': 'Futa',
    'common.edit': 'Hariri',
    'common.add': 'Ongeza',
    'common.search': 'Tafuta',
    'common.filter': 'Chuja',
    'common.sort': 'Panga',
    'common.loading': 'Inapakia...',
    'common.error': 'Kosa',
    'common.success': 'Mafanikio',
    'common.confirm': 'Thibitisha',
    'common.yes': 'Ndiyo',
    'common.no': 'Hapana',
    'common.close': 'Funga',
    'common.open': 'Fungua',
    'common.back': 'Rudi',
    'common.next': 'Endelea',
    'common.submit': 'Wasilisha',
    'common.required': 'Lazima',
    'common.optional': 'Hiari',
    'mpesa.import': 'Leta M-Pesa',
    'mpesa.statement': 'Taarifa ya M-Pesa',
    'mpesa.reconcile': 'Linganisha',
    'mpesa.matched': 'Imelinganishwa',
    'mpesa.unmatched': 'Haijalinganishwa',
    'mpesa.uploadCSV': 'Pakia CSV',
    'alerts.title': 'Tahadhari',
    'alerts.noAlerts': 'Hakuna tahadhari',
    'alerts.riskScore': 'Kiwango cha Hatari',
    'alerts.review': 'Kagua',
    'alerts.dismiss': 'Ondoa',
    'settings.language': 'Lugha',
    'settings.english': 'Kiingereza',
    'settings.swahili': 'Kiswahili',
    'settings.profile': 'Wasifu',
    'settings.outlets': 'Maduka',
    'settings.users': 'Watumiaji',
    'settings.notifications': 'Arifa',
    'offline.title': 'Huna mtandao',
    'offline.message': 'Data yako imehifadhiwa ndani na itasawazishwa unapokuwa mtandaoni.',
    'offline.syncNow': 'Sawazisha Sasa',
    'offline.synced': 'Imesawazishwa',
    'offline.pending': 'Inasubiri kusawazishwa',
  },
};

export function t(key: TranslationKey, lang: string = 'en'): string {
  return translations[lang]?.[key] || translations['en'][key] || key;
}
