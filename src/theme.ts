import { useColorScheme } from 'react-native';

const light = {
  bg: '#ffffff',
  card: '#f9fafb',
  cardBorder: 'transparent',
  cardDoneBorder: '#bfdbfe',
  iconBg: '#e5e7eb',
  iconDoneBg: '#dbeafe',
  iconColor: '#9ca3af',
  iconDoneColor: '#3b82f6',
  text: '#111827',
  textSecondary: '#6b7280',
  textTertiary: '#d1d5db',
  tileBankBg: '#f3f4f6',
  tileBankBorder: '#d1d5db',
  tileSelectedBg: '#eff6ff',
  tileSelectedBorder: '#93c5fd',
  accent: '#3b82f6',
  progressBg: '#e5e7eb',
  footerShadow: '#000',
};

const dark = {
  bg: '#111827',
  card: '#1f2937',
  cardBorder: 'transparent',
  cardDoneBorder: '#1e40af',
  iconBg: '#374151',
  iconDoneBg: '#1e3a5f',
  iconColor: '#6b7280',
  iconDoneColor: '#60a5fa',
  text: '#f9fafb',
  textSecondary: '#9ca3af',
  textTertiary: '#4b5563',
  tileBankBg: '#1f2937',
  tileBankBorder: '#374151',
  tileSelectedBg: '#1e3a5f',
  tileSelectedBorder: '#3b82f6',
  accent: '#3b82f6',
  progressBg: '#374151',
  footerShadow: '#000',
};

export function useColors() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? dark : light;
}
