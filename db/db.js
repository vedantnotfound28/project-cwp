const mongoose= require("mongoose");

 async function connectdb() {

    await mongoose.connect(mongodb+srv://v:hOXHNxHOcuBp8BTo@cluster0.ebxma8k.mongodb.net/halley)
          
    
 } 