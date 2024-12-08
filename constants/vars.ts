export const apiUrl = process.env?.EXPO_PUBLIC_API_URL || 'https://97yimcjg3h.eu-west-3.awsapprunner.com/api/v1';
export const nodeEnv = process.env?.EXPO_NODE_ENV || 'development';

// firebase
export const apiKey = process.env?.EXPO_PUBLIC_API_KEY || 'AIzaSyCraiiYgLG1BU3GDGNFuCheu2OknqUw24Y';
export const authDomain = process.env?.EXPO_PUBLIC_AUTH_DOMAIN || 'cometa-e5dd5.firebaseapp.com';
export const projectId = process.env?.EXPO_PUBLIC_PROJECT_ID || 'cometa-e5dd5';
export const storageBucket = process.env?.EXPO_PUBLIC_STORAGE_BUCKET || 'cometa-e5dd5.appspot.com';
export const messagingSenderId = process.env?.EXPO_PUBLIC_MESAGING_SENDER_ID || '1018637932302';
export const appId = process.env?.EXPO_PUBLIC_APP_ID || '1:1018637932302:web:4e1c21f6d236d2aedda95f';
export const measurementId = process.env?.EXPO_PUBLIC_MEASURING_ID || 'G-G4W08CQPBL';
export const databaseURL = process.env?.EXPO_PUBLIC_DATABASE_URL || 'https://cometa-e5dd5-default-rtdb.europe-west1.firebasedatabase.app';

// supabase
export const supabaseUrl = process.env?.EXPO_PUBLIC_SUPABASE_URL as string;
export const supabaseAnonimousKey = process.env?.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

export const animationDuration = 290;
// export const screenOptions = { headerShown: false, animation: 'slide_from_right', animationDuration };

export const defaultImgPlaceholder = 'https://placehold.co/400';
export const maximunNumberOfPhotos = 5;
export const MAX_NUMBER_PHOTOS = 7;
export const MIN_NUMBER_PHOTOS = 4;

