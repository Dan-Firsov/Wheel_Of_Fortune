import { create } from "zustand"

interface Participant {
  address: string
  bet: number
}

export interface IWheelOfFortuneStore {
  totalPot: number
  totalParticipants: number
  participants: Participant[]
  setTotalPot: (newTotal: number) => void
  setTotalParticipants: (newTotal: number) => void
  setParticipants: (newParticipants: Participant[]) => void
}

export const useWheelOfFortuneStore = create<IWheelOfFortuneStore>((set) => ({
  totalPot: 0,
  totalParticipants: 0,
  participants: [],
  setTotalPot: (newTotal) => set({ totalPot: newTotal }),
  setTotalParticipants: (newTotal) => set({ totalParticipants: newTotal }),
  setParticipants: (newParticipants) => set({ participants: newParticipants }),
}))
