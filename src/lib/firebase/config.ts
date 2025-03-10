import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAICwewb9nIfENQH-gOJgkpQXZKBity9ck",
  authDomain: "accounting-c3c06.firebaseapp.com",
  projectId: "accounting-c3c06",
  storageBucket: "accounting-c3c06.appspot.com",
  messagingSenderId: "670119019137",
  appId: "1:670119019137:web:f5c57a1a6f5ef05c720380"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const storage = getStorage(app);

// Настройка Storage
storage.maxOperationRetryTime = 120000; // 2 минуты
storage.maxUploadRetryTime = 120000; // 2 минуты

export { storage };

// Создаем необходимые индексы
const createRequiredIndexes = async () => {
  try {
    const indexes = [
      // Product movements index
      {
        collectionGroup: 'productMovements',
        queryScope: 'COLLECTION',
        fields: [
          { fieldPath: 'productId', order: 'ASCENDING' },
          { fieldPath: 'date', order: 'DESCENDING' }
        ]
      },
      {
        collectionGroup: 'products',
        queryScope: 'COLLECTION',
        fields: [
          { fieldPath: 'warehouse', order: 'ASCENDING' },
          { fieldPath: 'order', order: 'ASCENDING' },
          { fieldPath: '__name__', order: 'ASCENDING' }
        ]
      },
      // Products index for low stock filtering
      {
        collectionGroup: 'products',
        queryScope: 'COLLECTION',
        fields: [
          { fieldPath: 'warehouse', order: 'ASCENDING' },
          { fieldPath: 'quantity', order: 'ASCENDING' },
          { fieldPath: 'order', order: 'ASCENDING' },
          { fieldPath: '__name__', order: 'ASCENDING' }
        ]
      },
      {
        collectionGroup: 'notifications',
        queryScope: 'COLLECTION',
        fields: [
          { fieldPath: 'isRead', order: 'ASCENDING' },
          { fieldPath: 'timestamp', order: 'DESCENDING' }
        ]
      },
      {
        collectionGroup: 'clients',
        queryScope: 'COLLECTION',
        fields: [
          { fieldPath: 'status', order: 'ASCENDING' },
          { fieldPath: 'createdAt', order: 'DESCENDING' }
        ]
      }
    ];

    // В реальном приложении здесь был бы код для создания индексов через Admin SDK
    console.log('Required indexes configuration:', indexes);
  } catch (error) {
    console.error('Error configuring indexes:', error);
  }
};

// Enable offline persistence with unlimited cache size
enableIndexedDbPersistence(db, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
}).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support offline persistence.');
  }
});

createRequiredIndexes();

export default db;