import { create } from 'zustand';
import { User } from '../types/user';

interface UserState {
  currentUser: User;
  setCurrentUser: (user: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: {
    id: 'student-101',
    name: 'Alex Rivera',
    email: 'a.rivera@campus.edu',
    studentId: 'ST-2024-8841',
    department: 'Computer Science & Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  setCurrentUser: (user) => set({ currentUser: user }),
}));

