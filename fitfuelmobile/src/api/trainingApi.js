export const fetchTrainingDetails = async (trainingId) => {
    try {
      const response = await fetch(`http://10.0.2.2:8000/sport/trainings/${trainingId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
    }
  };