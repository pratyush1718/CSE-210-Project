

export const recommendDispatcher = async (userID: string) => {
  const apiURL = 'http://localhost:' + import.meta.env.VITE_BACKEND_PORT + '/api/discovery/recommendations';

  //console.log('Fetching recommendations from URL:', apiURL);
  //console.log('ID is ', userID);
  try {
    const response = await fetch(apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firebaseId: userID }),
    });

    //const response = await fetch(apiURL);
    //console.log('Response status:', response.status);
    const responseData = await response.json();

    if (responseData && responseData.recommendations) {
      console.log('recommendations: ', responseData.recommendations);
      return responseData.recommendations
    } else {
      console.log('no message');
      return []
    }
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return []
  }
};
