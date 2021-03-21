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
  
    const Image = mongoose.model("image", schema);
    return Image;
  };