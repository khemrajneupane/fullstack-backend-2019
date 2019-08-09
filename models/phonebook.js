const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false); //remove deprecation warning while updating
const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(result => {
    console.log("connected to MongoDB");
  })
  .catch(error => {
    console.log("error connecting to MongoDB:", error.message);
  });

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    required: true
  }
  //id: String
});

phonebookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Phonebook", phonebookSchema);

/*
const Phonebook = mongoose.model("Phonebook", phonebookSchema);
module.exports = {
  removePhonebookEntry: id => {
    return Phonebook.findByIdAndRemove(id);
  }
};
*/