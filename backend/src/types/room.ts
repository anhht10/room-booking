export type RoomType =
  | 'STUDY_ROOM'
  | 'COMPUTER_LAB'
  | 'SCIENCE_LAB'
  | 'GROUP_ROOM';

export type RoomFacility =
  | 'WIFI'
  | 'PROJECTOR'
  | 'WHITEBOARD'
  | 'COMPUTER'
  | 'AIR_CONDITIONING'
  | 'POWER_OUTLET';

export interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  roomNumber: string;
  type: RoomType;
  capacity: number;
  facilities: RoomFacility[];
  image: string;
  description: string;
  available: boolean;
  openingTime: string; // HH:mm format e.g. "08:00"
  closingTime: string; // HH:mm format e.g. "18:00"
}

export interface RoomQueryFilters {
  search?: string;
  type?: RoomType | 'ALL';
  minCapacity?: number;
  floor?: number | 'ALL';
  facilities?: string; // Comma-separated list e.g. "WIFI,PROJECTOR"
  availableOnly?: boolean;
}

