const { ObjectId } = require("mongodb");

module.exports = (mongoose) => {
  const schema = new mongoose.Schema(
    {
      id: ObjectId,
      companyId: ObjectId,
      name: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Contract = mongoose.model("contract", schema);
  return Contract;
};
