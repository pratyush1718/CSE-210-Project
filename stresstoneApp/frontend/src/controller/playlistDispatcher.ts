

export const playlistDispatcher = async (userID: string) => {
    const port = import.meta.env.VITE_BACKEND_PORT || 3000;
    const apiURL = 'http://localhost:' + port + "/api/playlist/liked";
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
  
      if (responseData && responseData) {
        console.log('recommendations: ', responseData);
        return responseData;
      } else {
        console.log('no message');
        return []
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return []
    }
  };