export const URLs = {
  home: '/',
  dashboard: '/dashboard',
  feed: '/feed',
  signIn: '/sign-in',
  signUp: '/sign-up',
  termsOfService: '/terms',
  privacyPolicy: '/privacy',
} as const;

export const MAX_NUMBER_OF_IMAGES = 3;
export const MAX_NUMBER_OF_VIDEOS = 1;
export const MAX_VIDEO_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'genai', label: 'GenAI' },
  { id: 'ai-ml', label: 'AI/ML' },
  { id: 'ar-vr', label: 'AR/VR' },
  { id: 'blockchain', label: 'Blockchain' },
  { id: 'robotics', label: 'Robotics' },
  { id: 'iot', label: 'IoT' },
  { id: 'cloud', label: 'Cloud' },
] as const;
