import { openDB } from "idb";

// IndexedDB Setup
const DATABASE_NAME = import.meta.env.DATABASE_NAME;
const STORE_NAME = import.meta.env.STORE_NAME;

const initializeDB = async () => {
  return openDB(DATABASE_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
};

export default initializeDB;
