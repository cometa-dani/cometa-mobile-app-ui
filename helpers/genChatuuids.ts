import { child, get, ref } from 'firebase/database';
import { realtimeDB } from '../config/firebase/firebase';


// Generate chatuuids
const generateChatuuids = (userId1: string, userId2: string): [string, string] => {
  return [
    [userId1, userId2].join('_'),
    [userId2, userId1].join('_')
  ];
};


const checkChatUuuidExists = async (chatuuid: string) => {
  const dbRef = ref(realtimeDB);
  try {
    const snapshot = await get(child(dbRef, `chats/${chatuuid}`));
    return snapshot.exists();
  }
  catch (error) {
    // console.log(error);
  }
};


export async function getChatuuidKey(userId1: string, userId2: string): Promise<string | undefined> {
  const [uuidKey1, uuidKey2] = generateChatuuids(userId1, userId2);

  const exists1 = await checkChatUuuidExists(uuidKey1);
  if (exists1) {
    return uuidKey1;
  }
  const exists2 = await checkChatUuuidExists(uuidKey2);
  if (exists2) {
    return uuidKey2;
  }
  return undefined;
}
