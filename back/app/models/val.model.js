module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        name: String,
        weather: String,
        scene: String,
        timeofday: String
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Val = mongoose.model("val", schema);
    return Val;
  };