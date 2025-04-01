export const selectWinner = async () => {
  try {
    const response = await fetch(
      'https://project-v1-0-9.onrender.com/api/select-winner',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const data = await response.json();
    if (data.success) {
      console.log('Spin wheel successful:', data.txHash);
    } else {
      console.error('Spin wheel failed:', data.error);
    }
  } catch (error) {
    console.error('Error contacting backend server:', error);
  }
};
