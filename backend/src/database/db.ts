import fs from 'fs';
import path from 'path';
import { Room } from '../types/room';
import { Booking } from '../types/booking';
import { getSeedBookings, SEED_ROOMS } from './seed';

interface DatabaseSchema {
  rooms: Room[];
  bookings: Booking[];
  updatedAt: string;
}

const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'campus.db.json');

class Database {
  private data: DatabaseSchema;
  private isLoaded = false;

  constructor() {
    this.data = {
      rooms: [...SEED_ROOMS],
      bookings: getSeedBookings(),
      updatedAt: new Date().toISOString(),
    };
  }

  public async init(): Promise<void> {
    if (this.isLoaded) return;

    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = await fs.promises.readFile(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw) as DatabaseSchema;
        this.data = parsed;
        console.log(`[Database] Loaded persistent data from ${DB_FILE}`);
      } else {
        // Initialize with seed data
        this.data = {
          rooms: [...SEED_ROOMS],
          bookings: getSeedBookings(),
          updatedAt: new Date().toISOString(),
        };
        await this.persist();
        console.log(`[Database] Initialized new persistent store with seed data at ${DB_FILE}`);
      }
    } catch (err) {
      console.error('[Database] Failed to read database file, using in-memory seed:', err);
    }

    this.isLoaded = true;
  }

  private async persist(): Promise<void> {
    try {
      this.data.updatedAt = new Date().toISOString();
      const tempFile = `${DB_FILE}.tmp`;
      await fs.promises.writeFile(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      await fs.promises.rename(tempFile, DB_FILE);
    } catch (err) {
      console.error('[Database] Failed to persist data to disk:', err);
    }
  }

  public getRooms(): Room[] {
    return this.data.rooms;
  }

  public async saveRooms(rooms: Room[]): Promise<void> {
    this.data.rooms = rooms;
    await this.persist();
  }

  public getBookings(): Booking[] {
    return this.data.bookings;
  }

  public async saveBookings(bookings: Booking[]): Promise<void> {
    this.data.bookings = bookings;
    await this.persist();
  }
}

export const db = new Database();

