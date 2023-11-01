const { ObjectId } = require("mongodb");

module.exports = (mongoose) => {
  const schema = new mongoose.Schema(
    {
      id: ObjectId,
      employeeId: ObjectId,
      contractId: ObjectId,
      itemId: ObjectId,
      number: Number,
      totalPrice: Number,
      lock: Boolean,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const EmployeesContractsSign = mongoose.model("employees-contracts-sign", schema);
  return EmployeesContractsSign;
};
