import { sendQRCodesToStudents } from "../services/emailService.js";

// Example controller function to send QR codes
export const sendQREmails = async (req, res) => {
  try {
    const { students, courseName } = req.body;

    // Call the function to send emails
    await sendQRCodesToStudents(students, courseName);

    res.status(200).json({ message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ error: "Failed to send emails." });
  }
};