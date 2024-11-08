export const SpinWheel = async () => {
  try {
    const response = await fetch("http://localhost:5000/spinWheel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    if (data.success) {
      console.log("Spin wheel successful:", data.txHash)
    } else {
      console.error("Spin wheel failed:", data.error)
    }
  } catch (error) {
    console.error("Error contacting backend server:", error)
  }
}
