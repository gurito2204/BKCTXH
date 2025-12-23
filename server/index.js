const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
require("dotenv").config();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://mern-job-portal-website.vercel.app/"],
    methods: ["POST", "GET", "DELETE", "PATCH"],
    credentials: true,
  })
);

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = "mongodb+srv://abc:123@cluster0.yytwizd.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Define an array of super-admin emails
const SUPER_ADMIN_EMAILS = ["nofapplz04@gmail.com", "abcadmin@gmail.com","dinh.du1420@gmail.com"];

async function run() {
  try {
    // Connect to the database first
    await client.connect();
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const db = client.db("mernJobPortal");
    const jobsCollections = db.collection("demoJobs");
    const usersCollection = db.collection("users");

    await usersCollection.createIndex({ email: 1 }, { unique: true });

    // --- All API Endpoints will be defined here ---

    // Get user and FORCE ADMIN ROLE for super-admins
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email: email });

      if (user) {
        // ** SUPERUSER CHECK **
        // This ensures the main admin accounts always have admin rights.
        if (SUPER_ADMIN_EMAILS.includes(user.email)) {
          user.role = "admin";
        }
        res.send(user);
      } else {
        res.status(404).send({ message: "User not found" });
      }
    });

    // Create/update user on login. Assign 'student' role by default unless a role already exists.
    app.post("/user", async (req, res) => {
      const { email, name } = req.body;
      const filter = { email: email };
      const updateDoc = {
        $setOnInsert: {
          email: email,
          name: name,
          role: "student", // Default role for new users
        },
      };
      const options = { upsert: true };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // SECURED Posting a Job
    app.post("/post-job", async (req, res) => {
      const body = req.body;
      const userEmail = body.postedBy;

      if (!userEmail) {
        return res.status(400).send({ message: "Email người đăng (postedBy) là bắt buộc." });
      }

      const user = await usersCollection.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).send({ message: "Không tìm thấy người dùng." });
      }

      // Enforce admin role for superusers before authorization check
      if (SUPER_ADMIN_EMAILS.includes(user.email)) {
        user.role = "admin";
      }

      // Authorization check: Only admins or officers can post jobs
      if (user.role !== "admin" && user.role !== "officer") {
        return res.status(403).send({ message: "Bạn không có quyền đăng hoạt động." });
      }

      body.createAt = new Date();
      body.status = "pending";
      body.applicants = [];
      try {
        const result = await jobsCollections.insertOne(body);
        res.status(200).send(result);
      } catch (error) {
        res.status(500).send({ message: "Lỗi server nội bộ!", status: false });
      }
    });

    // Get all APPROVED jobs for the main page
    app.get("/all-jobs", async (req, res) => {
      const jobs = await jobsCollections.find({ status: "approved" }).toArray();
      res.send(jobs);
    });

    // Get all PENDING jobs for the admin dashboard
    app.get("/admin/all-jobs", async (req, res) => {
      const jobs = await jobsCollections.find({ status: "pending" }).toArray();
      res.send(jobs);
    });

    // Get Jobs by email for MyJobs page - with ADMIN override
    app.get("/myJobs/:email", async (req, res) => {
      const requestorEmail = req.params.email;
      const user = await usersCollection.findOne({ email: requestorEmail });

      let query = { postedBy: requestorEmail };

      // ** ADMIN OVERRIDE **
      // If the user is an admin or a super-admin, show them all jobs.
      if (user && (user.role === "admin" || SUPER_ADMIN_EMAILS.includes(requestorEmail))) {
        query = {}; // Empty query finds all documents
      }

      const jobs = await jobsCollections.find(query).toArray();
      res.send(jobs);
    });

    // Get Single job using ID
    app.get("/job/:id", async (req, res) => {
      const id = req.params.id;
      const job = await jobsCollections.findOne({ _id: new ObjectId(id) });
      res.send(job);
    });

    // Admin approve job
    app.patch("/admin/approve-job/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: { status: "approved" } };
      const result = await jobsCollections.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Apply for a job (ATOMIC OPERATION)
    app.post("/apply/:id", async (req, res) => {
      try {
        const jobId = req.params.id;
        const { userEmail, userName } = req.body;

        if (!ObjectId.isValid(jobId)) {
          return res.status(400).send({ message: "Invalid Job ID format." });
        }

        const newApplicant = {
          _id: new ObjectId(),
          email: userEmail,
          name: userName,
          status: "pending",
          confirmedDays: 0,
        };

        const filter = {
          _id: new ObjectId(jobId),
          "applicants.email": { $ne: userEmail },
          status: "approved",
          $expr: { $lt: [{ $size: { $ifNull: ["$applicants", []] } }, "$maxApplicants"] },
        };

        const updateDoc = {
          $push: { applicants: newApplicant },
        };

        const result = await jobsCollections.updateOne(filter, updateDoc);

        if (result.modifiedCount === 0) {
          const job = await jobsCollections.findOne({ _id: new ObjectId(jobId) });
          if (!job) {
            return res.status(404).send({ message: "Hoạt động không tồn tại." });
          }
          if (job.status !== "approved") {
            return res.status(400).send({ message: "Hoạt động này không còn mở để ứng tuyển." });
          }
          if (job.applicants && job.applicants.some((app) => app.email === userEmail)) {
            return res.status(400).send({ message: "Bạn đã ứng tuyển hoạt động này rồi." });
          }
          return res.status(400).send({ message: "Hoạt động đã đủ số lượng người tham gia." });
        }

        await jobsCollections.updateOne(
          {
            _id: new ObjectId(jobId),
            $expr: { $gte: [{ $size: { $ifNull: ["$applicants", []] } }, "$maxApplicants"] },
          },
          { $set: { status: "closed" } }
        );

        res.status(200).send({ message: "Ứng tuyển thành công!" });
      } catch (error) {
        console.error("Error applying for job:", error);
        res.status(500).send({ message: "Lỗi máy chủ nội bộ" });
      }
    });

    // Confirm an applicant and set their social days
    app.patch("/job/:jobId/applicant/:applicantId/confirm", async (req, res) => {
      try {
        const { jobId, applicantId } = req.params;
        const { confirmedDays } = req.body;

        if (confirmedDays === undefined || isNaN(Number(confirmedDays)) || Number(confirmedDays) < 0) {
          return res.status(400).send({ message: "Invalid value for confirmed days." });
        }

        const days = Number(confirmedDays);
        const filter = { _id: new ObjectId(jobId), "applicants._id": new ObjectId(applicantId) };
        const updateDoc = { $set: { "applicants.$.status": "confirmed", "applicants.$.confirmedDays": days } };
        const result = await jobsCollections.updateOne(filter, updateDoc);

        if (result.matchedCount === 0) {
          return res.status(404).send({ acknowledged: false, message: "Job or applicant not found." });
        }

        res.send({ acknowledged: true, message: "Applicant confirmed successfully." });
      } catch (error) {
        console.error("Error confirming applicant:", error);
        res.status(500).send({ acknowledged: false, message: "Internal Server Error" });
      }
    });

    // --- ADMIN ROUTES FOR OFFICER MANAGEMENT ---
    app.get("/admin/officers", async (req, res) => {
      const officers = await usersCollection.find({ role: "officer" }).toArray();
      res.send(officers);
    });

    app.patch("/admin/promote", async (req, res) => {
      const { email } = req.body;
      if (!email) {
        return res.status(400).send({ message: "Email is required." });
      }

      const filter = { email: email };
      const updateDoc = {
        $set: { role: "officer" },
        $setOnInsert: { email: email, name: email.split("@")[0] }, // Set name on creation
      };
      const options = { upsert: true };

      const result = await usersCollection.updateOne(filter, updateDoc, options);

      res.send({ acknowledged: true, message: "User role updated successfully." });
    });

    app.patch("/admin/demote", async (req, res) => {
      const { email } = req.body;
      if (!email) {
        return res.status(400).send({ message: "Email is required." });
      }

      // Prevent the super-admins from being demoted
      if (SUPER_ADMIN_EMAILS.includes(email)) {
        return res.status(403).send({ message: "Không thể xóa quyền của quản trị viên cao nhất." });
      }

      const result = await usersCollection.updateOne({ email: email }, { $set: { role: "student" } });

      if (result.matchedCount === 0) {
        // This error should not happen for users in the list, but it's kept as a fallback.
        return res.status(404).send({ message: "User not found in database." });
      }

      res.send({ acknowledged: true, message: "Officer demoted to student." });
    });

    // Delete a Job
    app.delete("/job/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await jobsCollections.deleteOne(filter);
      res.send(result);
    });

    // Start the server only after the DB connection is successful
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}

// Run the main function
run();
