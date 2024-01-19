import mongoose, { Document, Schema } from "mongoose";

interface FileData {
  id: string;
  file: {
    fieldname: String;
    originalname: String;
    mimetype: String;
    encoding: String;
    size: Number;
    buffer: Buffer;
    checksum: String;
  };
}

export interface ExampleDocument extends Document {
  data: FileData;
}

const exampleSchema = new Schema<ExampleDocument>({
  data: {
    id: { type: String, required: true },
    file: {
      type: {
        fieldname: String,
        originalname: String,
        mimetype: String,
        encoding: String,
        size: Number,
        buffer: Buffer,
        checksum: String,
      },
      required: true,
    },
  },
});

const exampleModel = mongoose.model<ExampleDocument>("File", exampleSchema);

export default exampleModel;
