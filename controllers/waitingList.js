import WaitingList from "../models/waitingList.js";
import sendEmail from "../utils/SendEmail.js";

// Add to waiting list
export const addToWaitingList = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;

    // Basic validation
    if (!name || !email || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existing = await WaitingList.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Email already exists in waiting list" });
    }

    // Save to DB
    const newEntry = await WaitingList.create({ name, email, phoneNumber });

    // Notify Admin (support email)
    await sendEmail({
      to: "support@bloomingbet.com",
      subject: "New Waiting List Signup",
      text: `A new user has joined the waiting list:\n
        Name: ${name}\n
        Email: ${email}\n
        Phone: ${phoneNumber}`,
      html: `
        <h2>📩 New Waiting List Signup</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phoneNumber}</p>
        <hr />
        <small>BloomingBet System Notification</small>
      `,
    });

    // Notify User (confirmation email)
    await sendEmail({
      to: email,
      subject: "Welcome to BloomingBet Waiting List 🎉",
      text: `Hi ${name},\n\n
        Thank you for joining the BloomingBet waiting list! 🎊\n
        We’ll keep you updated with news and launch details.\n\n
        Best regards,\n
        The BloomingBet Team`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
          <h2 style="color:#2c3e50;">Welcome to <span style="color:#27ae60;">BloomingBet</span> 🎉</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Thank you for joining the <b>BloomingBet Waiting List</b>! 🎊</p>
          <p>We’ll keep you updated with the latest news and our official launch details very soon.</p>
          <br/>
          <p>Best regards,<br/>
          <b>The BloomingBet Team</b></p>
          <hr/>
          <small style="color:#888;">This is an automated message, please do not reply.</small>
        </div>
      `,
    });

    res.status(201).json({
      message: "Successfully added to waiting list & emails sent",
      data: newEntry,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all waiting list entries
export const getWaitingList = async (req, res) => {
  try {
    const list = await WaitingList.find().sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
