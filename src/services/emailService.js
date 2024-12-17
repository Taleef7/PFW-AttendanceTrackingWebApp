import axios from "axios";

export const sendQRCodesToStudents = async (courseId) => {
  console.log("Sending API request to send QR codes with courseId:", courseId); // Debugging line
  try {
    const response = await axios.post(
      "https://sendqrcodes-tnbhvjygla-uc.a.run.app/", // Replace with your deployed Cloud Function URL
      { courseId }
    );
    console.log("API Response:", response.data); // Debugging line
    return response.data;
  } catch (error) {
    console.error("Error calling sendQRCodesToStudents API:", error.response || error.message);
    throw error;
  }
};
