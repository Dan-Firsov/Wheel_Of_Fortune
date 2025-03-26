
export const fetchGameState = async () => {
    try {
        const response = await fetch("https://project-v1-0-9.onrender.com/api/game-state")
        const data = await response.json()
        if (data.error) {
            throw new Error("Error fetching game state:", data.error)
        }
        return data
    } catch (error) {
        console.error("Error contacting backend server:", error)
    }
}