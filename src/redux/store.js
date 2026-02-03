import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import aggregatorReducer from './slices/aggregatorSlice';
import customerReducer from './slices/customerSlice';
import dashboardReducer from './slices/dashboardSlice';
import disputeReducer from './slices/disputeSlice';
import invoiceReducer from './slices/invoiceSlice';
import merchantReducer from './slices/merchantSlice';
import settlementReducer from './slices/settlementSlice';
import transactionReducer from './slices/transactionSlice';
import usersReducer from './slices/userSlice';
import rolesReducer from './slices/roleSlice';
import permissionsReducer from './slices/permissionSlice';
import complianceReducer from './slices/complianceSlice';
import envReducer from './slices/envSlice';
import activityReducer from './slices/activitySlice';
import pageCustomizationReducer from './slices/pageCustomizationSlice';
import realtimeReducer from './slices/realtimeSlice';

// Read persisted env from localStorage if available
const persistedEnv = (() => {
  try {
    const raw = localStorage.getItem('env');
    return raw ? JSON.parse(raw) : undefined;
  } catch (e) {
    console.warn('Failed to read persisted env from localStorage', e);
    return undefined;
  }
})();

const persistedStep = (() => {
  try {
    const raw = localStorage.getItem('compliance');
    return raw ? JSON.parse(raw) : undefined;
  } catch (e) {
    console.warn('Failed to read persisted compliance step from localStorage', e);
    return undefined;
  }
})();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    aggregator: aggregatorReducer,
    customer: customerReducer,
    dashboard: dashboardReducer,
    dispute: disputeReducer,
    invoice: invoiceReducer,
    merchant: merchantReducer,
    settlement: settlementReducer,
    transaction: transactionReducer,
    users: usersReducer,
    roles: rolesReducer,
    permissions: permissionsReducer,
    compliance: complianceReducer,
    env: envReducer,
    activity: activityReducer,
    pageCustomization: pageCustomizationReducer,
    realtime: realtimeReducer,
  },
  preloadedState: {
    env: {
      env: persistedEnv || 'Test',
    },
    compliance: {
      step: persistedStep || 0,
    },
  },
});

// Persist env changes to localStorage
store.subscribe(() => {
  try {
    const state = store.getState();
    const current = state.env?.env || 'Live';
    localStorage.setItem('env', JSON.stringify(current));
  } catch (e) {
    console.warn('Failed to persist env to localStorage', e);
  }
});

store.subscribe(() => {
  try {
    const state = store.getState();
    const current = state.compliance?.step || 0;
    localStorage.setItem('compliance', JSON.stringify(current));
  } catch (e) {
    console.warn('Failed to persist compliance step to localStorage', e);
  }
});
