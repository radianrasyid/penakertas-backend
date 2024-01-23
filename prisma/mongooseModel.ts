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

interface menuAccess {
  name: string;
  access: {
    read: boolean;
    add: boolean;
    update: boolean;
    delete: boolean;
    detail: boolean;
  };
  children: menuAccess[];
}
interface UserAccess {
  title: string;
  access: {
    menu: menuAccess[];
  };
}

export interface ExampleDocument extends Document {
  data: FileData;
}

export interface UserAccessData extends Document {
  data: UserAccess;
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

const userAccessSchema = new Schema<UserAccessData>({
  data: {
    title: { type: String, required: true },
    access: {
      menu: [
        {
          name: { type: String, required: true },
          access: {
            read: { type: Boolean, required: true },
            add: { type: Boolean, required: true },
            update: { type: Boolean, required: true },
            delete: { type: Boolean, required: true },
            detail: { type: Boolean, required: true },
          },
          children: [
            {
              name: { type: String, required: true },
              access: {
                read: { type: Boolean, required: true },
                add: { type: Boolean, required: true },
                update: { type: Boolean, required: true },
                delete: { type: Boolean, required: true },
                detail: { type: Boolean, required: true },
              },
            },
          ],
        },
      ],
    },
  },
});

const exampleModel = mongoose.model<ExampleDocument>("File", exampleSchema);
export const userAccess = mongoose.model<UserAccessData>(
  "UserAccess",
  userAccessSchema
);

export default exampleModel;
