import axios from "axios";
export const sendQRCodesToStudents = async (courseId) => {
  console.log("Sending API request with courseId:", courseId); // Debugging line
  try {
    const response = await axios.post(
      "https://sendqrcodes-tnbhvjygla-uc.a.run.app/", // Replace with correct URL
      { courseId }
    );
    return response.data;
  } catch (error) {
    console.error("API request failed:", error.response?.data || error.message);
    throw error;
  }
};

