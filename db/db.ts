import * as SQLite from 'expo-sqlite';
import { IMessage } from 'react-native-gifted-chat';

// function openDb() {
//   return SQLite.openDatabaseSync('offline.db');
// }

// export const db = openDb();

// export async function dropDatabase() {
//   await db.closeAsync();
//   // await SQLiteDatabase.();
// }

// export async function initDatabase() {
//   db.withTransactionAsync(async () => {
//     await db.runAsync(`
//     CREATE TABLE IF NOT EXISTS ${TableNames.QUERY_CLIENTS} (
//       id INTEGER PRIMARY KEY,
//       timestamp INTEGER NOT NULL,
//       buster TEXT
//     )`);

//     await db.runAsync(`
//     CREATE TABLE IF NOT EXISTS ${TableNames.QUERY_CLIENT_QUERIES} (
//       query_hash TEXT PRIMARY KEY,
//       value TEXT,
//       query_client_id INTEGER NOT NULL,
//       FOREIGN KEY(query_client_id) REFERENCES query_clients(id)
//     )`);

//     await db.runAsync(`
//     CREATE TABLE IF NOT EXISTS ${TableNames.QUERY_CLIENT_MUTATIONS} (
//       mutation_key TEXT PRIMARY KEY,
//       value TEXT,
//       query_client_id INTEGER NOT NULL,
//       FOREIGN KEY(query_client_id) REFERENCES query_clients(id)
//     )`);
//   });
// }

// export const TableNames = {
//   QUERY_CLIENTS: 'query_clients',
//   QUERY_CLIENT_QUERIES: 'query_client_queries',
//   QUERY_CLIENT_MUTATIONS: 'query_client_mutations',
// } as const;

// export const QUERY_CLIENT_INITIAL_ID = 1;

// PERSISTER FOR TANSTACK QUERY
// https://github.com/kapobajza/React_Native_Offline_first_sample/blob/main/db/persister.ts

class ChatDB {
  private db: SQLite.SQLiteDatabase;
  private static BATCH_SIZE = 50;

  constructor() {
    this.db = SQLite.openDatabaseSync('chat.db');
    this.initDatabase();
  }

  private initDatabase() {
    this.db.withTransactionSync(async () => {
      // Friendship messages table for recent messages
      this.db.runSync(`
        CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY NOT NULL,
          friendship_id TEXT NOT NULL,
          content TEXT NOT NULL,
          sender_id TEXT NOT NULL,
          created_at TEXT NOT NULL,
          is_read INTEGER DEFAULT 0,
          batch_number INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_messages_friendship
          ON messages(friendship_id, batch_number);
      `);
    });
  }

  async addMessage(friendshipId: string, message: IMessage) {
    const batchNumber = await this.getCurrentBatchNumber(friendshipId);

    // this.db.transaction(tx => {
    //   tx.executeSql(
    //     `INSERT INTO messages (id, friendship_id, content, sender_id, created_at, batch_number)
    //      VALUES (?, ?, ?, ?, ?, ?)`,
    //     [
    //       message._id,
    //       friendshipId,
    //       message.text,
    //       message.user._id,
    //       message.createdAt.toISOString(),
    //       batchNumber
    //     ]
    //   );
    // });
  }

  private async getCurrentBatchNumber(friendshipId: string): Promise<number> {
    return new Promise((resolve) => {
      // this.db.transaction(tx => {
      //   tx.executeSql(
      //     `SELECT COUNT(*) as count FROM messages WHERE friendship_id = ?`,
      //     [friendshipId],
      //     (_, { rows }) => {
      //       const count = rows._array[0].count;
      //       resolve(Math.floor(count / this.BATCH_SIZE));
      //     }
      //   );
      // });
    });
  }

  async getMessages(friendshipId: string, page = 0): Promise<IMessage[]> {
    return new Promise((resolve) => {
      // this.db.transaction(tx => {
      //   tx.executeSql(
      //     `SELECT * FROM messages
      //      WHERE friendship_id = ?
      //      ORDER BY created_at DESC
      //      LIMIT ? OFFSET ?`,
      //     [friendshipId, this.BATCH_SIZE, page * this.BATCH_SIZE],
      //     (_, { rows }) => {
      //       resolve(rows._array.map(row => ({
      //         _id: row.id,
      //         text: row.content,
      //         createdAt: new Date(row.created_at),
      //         user: {
      //           _id: row.sender_id
      //         },
      //         isRead: Boolean(row.is_read)
      //       })));
      //     }
      //   );
      // });
    });
  }

  async clearHistory(friendshipId: string) {
    // this.db.transaction(tx => {
    //   tx.executeSql(
    //     'DELETE FROM messages WHERE friendship_id = ?',
    //     [friendshipId]
    //   );
    // });
  }
}
