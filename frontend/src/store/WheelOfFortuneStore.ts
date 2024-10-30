import { create } from "zustand"

export interface IWheelOfFortuneStore {
  totalPot: number
  totalParticipants: number
  winner: string
  isGameFinished: boolean
  setTotalPot: (newTotal: number) => void
  setTotalParticipants: (newTotal: number) => void
  setWinner: (newWinner: string) => void
  setIsGameFinished: (newBool: boolean) => void
}

export const useWheelOfFortuneStore = create<IWheelOfFortuneStore>((set) => ({
  totalPot: 0,
  totalParticipants: 0,
  winner: "",
  isGameFinished: false,
  setTotalPot: (newTotal) => set({ totalPot: newTotal }),
  setTotalParticipants: (newTotal) => set({ totalParticipants: newTotal }),
  setWinner: (newWinner) => set({ winner: newWinner }),
  setIsGameFinished: (newBool) =>
    set(() => {
      if (localStorage.getItem("isGameFinished")) {
        localStorage.removeItem("isGameFinished")
      }
      localStorage.setItem("isGameFinished", JSON.stringify(newBool))
      return { isGameFinished: newBool }
    }),
}))
