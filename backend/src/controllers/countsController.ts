let currentTotalPot = 0
let currentParticipantCount = 0
let participants: Array<{ address: string; bet: number }> = []

export function updateGameState(newTotalPot: number, newParticipantCount: number, updatedParticipants: Array<{ address: string; bet: number }>) {
  currentTotalPot = newTotalPot
  currentParticipantCount = newParticipantCount
  participants = updatedParticipants
}

export async function getCurrentGameState() {
  return {
    totalPot: currentTotalPot,
    participantCount: currentParticipantCount,
    participants,
  }
}
