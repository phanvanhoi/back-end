// const express = require("express");
// const app = express();
// const ExcelJS = require("exceljs");
// const { MongoClient, ServerApiVersion } = require("mongodb");

// app.get("/download-excel", (req, res) => {
//   // Create a new workbook and worksheet
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet("Sheet 1");

//   // Add data to the worksheet
//   worksheet.getCell("A1").value = "Hello";
//   worksheet.getCell("B1").value = "World!";

//   // Set response headers
//   res.setHeader(
//     "Content-Type",
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//   );
//   res.setHeader("Content-Disposition", 'attachment; filename="example.xlsx"');

//   // Send the workbook as a response
//   workbook.xlsx.write(res).then(() => {
//     res.end();
//   });
// });

// const uri =
//   "mongodb+srv://admin:fePNUhaFDwqsYk52@cluster0.zk7gha1.mongodb.net/"; // Replace with your MongoDB connection URL
// const dbName = "database"; // Replace with your database name

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     // Connect the client to the server (optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db(dbName).command({ ping: 1 });
//     const db = client.db(dbName);
//     const collection = db.collection("hop-dong");
//     try {
//       collection.find({}).toArray((err, documents) => {
//         if (err) {
//           console.error("Error fetching data:", err);
//           return;
//         }

//         console.log("Retrieved documents:", documents);

//         // Close the connection
//         client.close();
//       });
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }

//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);

// console.log("call!");

// app.get("/call", (req, res) => {
//   res.end();
// });

// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });
