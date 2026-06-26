const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const mailSender = require("../config/mailSender");

const fileSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  imageUrl: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  tags: {
    type: String,
  },
  email: {
    type: String,
  },
});

fileSchema.post("save", async function (doc) {
  try {
    const body = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <h2 style="color: #333333; text-align: center;">
            File Uploaded Successfully 🎉
          </h2>

          <p style="font-size: 16px; color: #555555;">
            Hello <strong>${doc.name}</strong>,
          </p>

          <p style="font-size: 16px; color: #555555;">
            Your file has been uploaded successfully to Cloudinary.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a 
              href="${doc.imageUrl}" 
              target="_blank"
              style="
                background-color: #4F46E5;
                color: white;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 6px;
                display: inline-block;
                font-weight: bold;
              "
            >
              View File
            </a>
          </div>

          <p style="font-size: 14px; color: #777777;">
            If the button doesn't work, copy and paste the following URL into your browser:
          </p>

          <p style="word-break: break-all; font-size: 14px; color: #4F46E5;">
            ${doc.imageUrl}
          </p>

          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">

          <p style="font-size: 12px; color: #999999; text-align: center;">
            This is an automated email from your file upload service.
          </p>

        </div>
      </div>
    `;

    const info = await mailSender(
      doc.email,
      "📁 New File Uploaded Successfully",
      body,
    );

    console.log("Mail sent:", info.messageId);
  } catch (error) {
    console.log("Mail Error:", error);
  }
});
const File = mongoose.model("File", fileSchema);
module.exports = File;
