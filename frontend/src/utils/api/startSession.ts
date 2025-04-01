export const startNewGameSession = async () => {
  try {
    const response = await fetch(
      'https://project-v1-0-9.onrender.com/api/new-session',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const data = await response.json();
    if (data.success) {
      console.log('Create game successful:', data.txHash);
    } else {
      console.error('Create game failed:', data.error);
    }
  } catch (error) {
    console.error('Error contacting backend server:', error);
  }
};
