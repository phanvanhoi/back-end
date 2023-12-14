const fs = require("fs");

exports.getResource = (req, res) => {
  const fileName = req.params.id;
  fs.readFile(`./uploads/${fileName}`, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      // Set the appropriate headers for the image
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Content-Length", data.length);

      // Return the image data to the client
      res.end(data);
    }
  });
};

exports.upload = (req, res) => {
  const { data, name = "" } = req?.files?.image;

  // Generate a new filename with the appropriate extension (assuming the original file had an extension)
  const extension = name.split(".").pop();
  const newFilename = `${Date.now()}.${extension}`;

  // Specify the new path to save the image
  const newPath = `uploads/${newFilename}`;

  // Write the file data to the new path
  fs.writeFileSync(newPath, data);
  const fileUrl = `http://localhost:8080/${newPath}`; // Replace with your actual domain or file URL

  const newImage = {
    name,
    imageUrl: fileUrl,
  };

  res.json(newImage);
  // Save Contract in the database
};
