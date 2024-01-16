import mongoose, { Document, Schema } from "mongoose";

interface FileData {
  id: string;
  file: Buffer;
}

interface ExampleDocument extends Document {
  data: FileData;
}

const exampleSchema = new Schema<ExampleDocument>({
  data: {
    id: { type: String, required: true },
    file: { type: Buffer, required: true },
  },
});

const exampleModel = mongoose.model<ExampleDocument>("Example", exampleSchema);

export default exampleModel;
