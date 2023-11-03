const { ObjectId } = require("mongodb");

module.exports = (mongoose) => {
  const schema = new mongoose.Schema(
    {
      fileName: String,
      filePath: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Image = mongoose.model("image", schema);
  return Image;
};
