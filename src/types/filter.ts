import { RoomFacility, RoomType } from './room';

export interface FilterState {
  searchQuery: string;
  roomType: RoomType | 'ALL';
  minCapacity: number | null;
  floor: number | 'ALL';
  facilities: RoomFacility[];
  availableOnly: boolean;
}

export interface QuickFilterOption<T> {
  id: string;
  label: string;
  value: T;
}

