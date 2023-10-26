const { ObjectId } = require("mongodb");

module.exports = (mongoose) => {
  const schema = new mongoose.Schema(
    {
      id: ObjectId,
      name: String,
      role: String,
      birthday: Date,
      sex: String,
      companyId: ObjectId
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Company = mongoose.model("employee", schema);
  return Company;
};