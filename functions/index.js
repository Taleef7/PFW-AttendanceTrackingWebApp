const { onRequest } = require("firebase-functions/v2/https");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});


const cors = require("cors")({ origin: true }); // Add this line

exports.sendQRCodes = onRequest(async (req, res) => {
  cors(req, res, async () => { // Wrap the function in cors
    const { courseId } = req.body;

    try {
      const courseDoc = await db.collection("courses").doc(courseId).get();
      if (!courseDoc.exists) throw new Error("Course not found");

      const { students, name: courseName } = courseDoc.data();

      const studentPromises = students.map((id) =>
        db.collection("students").doc(id).get()
      );
      const studentDocs = await Promise.all(studentPromises);

      const emailsSent = [];

      for (const studentDoc of studentDocs) {
        if (!studentDoc.exists) continue;

        const { email, firstName, lastName, qrCode } = studentDoc.data();
        if (!email || !qrCode) continue;

        const mailOptions = {
          from: `Instructor <${process.env.EMAIL_ADDRESS}>`,
          to: email,
          subject: `QR Code for ${courseName}`,
          html: `
            <h1>Hello ${firstName} ${lastName},</h1>
            <p>Here is your QR code for the course <strong>${courseName}</strong>.</p>
            <img src="${qrCode}" alt="QR Code" style="width:200px;height:200px;" />
            <br/><p>Thank you!</p>
          `,
        };

        await transporter.sendMail(mailOptions);
        emailsSent.push(email);
      }

      res.status(200).send({
        success: true,
        message: `Sent QR codes to ${emailsSent.length} students.`,
        emailsSent,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, error: error.message });
    }
  });
});