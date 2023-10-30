const { ObjectId } = require("mongodb");

module.exports = (mongoose) => {
  const schema = new mongoose.Schema(
    {
      id: ObjectId,
      name: String,
      price: Number,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;                             
    return object;
  });

  const Item = mongoose.model("item", schema);
  return Item;
};
