export const startNewGameSession = async () => {
    try {
        const response = await fetch("https://project-v1-0-9.onrender.com/new-session", {
          method: "POST",
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        console.log("Request sent successfully");
      } catch (error) {
        console.error("Error:", error);
      }
    }

