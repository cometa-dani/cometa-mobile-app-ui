export const apiUrl = process.env?.EXPO_PUBLIC_API_URL || 'https://97yimcjg3h.eu-west-3.awsapprunner.com/api/v1';
export const nodeEnv = process.env?.EXPO_NODE_ENV || 'development';

// supabase
export const supabaseUrl = process.env?.EXPO_PUBLIC_SUPABASE_URL as string;
export const supabaseAnonimousKey = process.env?.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

export const defaultImgPlaceholder = 'https://placehold.co/400';
export const animationDuration = 290;
export const maximunNumberOfPhotos = 5;
export const MAX_NUMBER_PHOTOS = 7;
export const MIN_NUMBER_PHOTOS = 4;
// const url = `https://www.google.com/maps?cid=8997741589594615700&ll=${item.location?.latitude},${item.location?.longitude}&z=18`;
export const imageTransition = 400;
