import mongoose from 'mongoose';


const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.Mongoose_Url);
    console.log("Connected to Database");
  }
  catch (error) {
    console.log(error);
  }
}

export default connectToDatabase;