import { create } from "zustand";

interface LockState {
  isLocked: boolean;
  lock: () => void;
  unlock: () => void;
}

const useLockStore = create<LockState>((set) => ({
  isLocked: false,
  lock: () => set({ isLocked: true }),
  unlock: () => set({ isLocked: false }),
}));

export default useLockStore;
