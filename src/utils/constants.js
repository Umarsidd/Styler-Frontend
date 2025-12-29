// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9168/api/v1';

// Third-party API Keys
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH_TOKEN: '/auth/refresh-token',
  AUTH_CHANGE_PASSWORD: '/auth/change-password',
  AUTH_ME: '/auth/me',

  // Salon endpoints
  SALONS_SEARCH: '/salons/search',
  SALONS_NEARBY: '/salons/nearby',
  SALONS_BY_ID: '/salons/:id',
  SALONS_SERVICES: '/salons/:id/services',
  SALONS_CREATE: '/salons',
  SALONS_MY: '/salons/my',
  SALONS_UPDATE: '/salons/:id',
  SALONS_DELETE: '/salons/:id',
  SALONS_ADD_SERVICE: '/salons/:id/services',
  SALONS_UPDATE_SERVICE: '/salons/:id/services/:serviceId',
  SALONS_DELETE_SERVICE: '/salons/:id/services/:serviceId',
  SALONS_UPDATE_HOURS: '/salons/:id/operating-hours',

  // Appointment endpoints
  APPOINTMENTS_CHECK_AVAILABILITY: '/appointments/check-availability',
  APPOINTMENTS_CREATE: '/appointments',
  APPOINTMENTS_LIST: '/appointments',
  APPOINTMENTS_UPCOMING: '/appointments/upcoming',
  APPOINTMENTS_BY_ID: '/appointments/:id',
  APPOINTMENTS_UPDATE_STATUS: '/appointments/:id/status',
  APPOINTMENTS_CANCEL: '/appointments/:id/cancel',
  APPOINTMENTS_SALON: '/appointments/salon/:salonId',
  APPOINTMENTS_SALON_STATS: '/appointments/salon/:salonId/statistics',

  // Payment endpoints
  PAYMENTS_INITIATE: '/payments/initiate',
  PAYMENTS_VERIFY: '/payments/verify',
  PAYMENTS_LIST: '/payments',
  PAYMENTS_REFUND: '/payments/:id/refund',
  PAYMENTS_SALON_STATS: '/payments/salon/:salonId/statistics',

  // Review endpoints
  REVIEWS_CREATE: '/reviews',
  REVIEWS_MY: '/reviews/my',
  REVIEWS_SALON: '/reviews/salon/:salonId',
  REVIEWS_SALON_RATING: '/reviews/salon/:salonId/rating',
  REVIEWS_RESPONSE: '/reviews/:id/response',

  // Barber endpoints
  BARBERS_REGISTER: '/barbers',
  BARBERS_BY_ID: '/barbers/:id',
  BARBERS_UPDATE: '/barbers/:id',
  BARBERS_UPLOAD_DOCS: '/barbers/:id/documents',
  BARBERS_UPDATE_AVAILABILITY: '/barbers/:id/availability',
  BARBERS_BY_SALON: '/barbers/salon/:salonId',
  BARBERS_PENDING: '/barbers/salon/:salonId/pending',
  BARBERS_APPROVE: '/barbers/:id/approve',
  BARBERS_REJECT: '/barbers/:id/reject',
};

// Local Storage Keys (deprecated - using Zustand persist)
export const STORAGE_KEYS = {
  TOKEN: 'styler_token',
  REFRESH_TOKEN: 'styler_refresh_token',
  EMAIL: 'styler_email',
  USER_TYPE: 'styler_user_type',
  USER_NAME: 'styler_user_name',
};

// User Roles (matching backend enum)
export const USER_ROLES = {
  SUPER_ADMIN: 'superadmin',
  SALON_OWNER: 'salon_owner',
  BARBER: 'barber',
  CUSTOMER: 'customer',
  RECEPTIONIST: 'receptionist',
  SUPPORT: 'support',
};

// Legacy support
export const USER_TYPES = {
  ADMIN: 'superadmin',
  USER: 'customer',
};
