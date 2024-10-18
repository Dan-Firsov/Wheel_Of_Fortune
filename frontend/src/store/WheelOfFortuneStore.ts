import { create } from "zustand"

export interface PotState {
  totalPot: number
  setTotalPot: (newTotal: number) => void
}
export interface ParcticipantsState {
  totalParcticipants: number
  setTotalParticipants: (newTotal: number) => void
}

export const usePotState = create<PotState>((set) => ({
  totalPot: 0,
  setTotalPot: (newTotal) => set({ totalPot: newTotal }),
}))

export const useParticipantsState = create<ParcticipantsState>((set) => ({
  totalParcticipants: 0,
  setTotalParticipants: (newTotal) => set({ totalParcticipants: newTotal }),
}))
