import QRCode from "qrcode";

/**
 * Generate a QR Code for a student.
 * @param {Object} student - The student object.
 * @param {string} courseId - The course ID.
 * @returns {Promise<string>} - A Base64-encoded QR code.
 */
export const generateQRCodeForStudent = async (student, courseId) => {
  try {
    if (!student.id || !student.email) {
      throw new Error("Student must have a valid ID and email.");
    }

    const qrData = {
      studentId: student.id,
      email: student.email, // Include email for additional validation
      courseId,
      timestamp: new Date().toISOString(), // Timestamp for uniqueness
    };

    const data = JSON.stringify(qrData); // Convert QR data to a string
    return await QRCode.toDataURL(data); // Generate QR code as Base64
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};
