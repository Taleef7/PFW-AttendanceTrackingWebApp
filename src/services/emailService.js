import emailjs from "emailjs-com";

/**
 * Send QR codes to students via email.
 * @param {Array} students - A list of students.
 * @param {string} courseName - The name of the course.
 */
export const sendQRCodesToStudents = async (students, courseName) => {
  for (const student of students) {
    if (!student.qrCode) {
      console.error(`No QR code found for student ID: ${student.id}`);
      continue;
    }

    const templateParams = {
      to_email: student.email,
      to_name: `${student.firstName} ${student.lastName}`,
      course_name: courseName,
      qr_code: student.qrCode, // Assuming the QR code is already stored in the student document
    };

    try {
      await emailjs.send(
        "your_service_id", // Replace with your EmailJS service ID
        "your_template_id", // Replace with your EmailJS template ID
        templateParams,
        "your_user_id" // Replace with your EmailJS user ID
      );
      console.log(`QR code sent to ${student.email}`);
    } catch (error) {
      console.error(`Error sending email to ${student.email}:`, error);
    }
  }
};
