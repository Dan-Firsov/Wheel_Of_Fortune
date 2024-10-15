import { create } from "zustand"

export interface PotState {
  totalPot: number
  setTotalPot: (newTotal: number) => void
}
export interface ParcticipantsState {
  totalParcticipants: number
  setTotalParcticipants: (newTotal: number) => void
}

export const usePotState = create<PotState>((set) => ({
  totalPot: 0,
  setTotalPot: (newTotal) => set({ totalPot: newTotal }),
}))

export const useParcticipantsState = create<ParcticipantsState>((set) => ({
  totalParcticipants: 0,
  setTotalParcticipants: (newTotal) => set({ totalParcticipants: newTotal }),
}))
