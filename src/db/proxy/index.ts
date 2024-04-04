import { Schema, Document, model } from 'mongoose';

interface IProxy extends Document {
  name: string;
  login: string;
  password: string;
  proxy: string;
  host: string;
  port: number;
}

const proxySchema: Schema = new Schema({
  name: { type: String, required: true },
  login: { type: String, required: true },
  password: { type: String, required: true },
  proxy: { type: String, required: true },
  host: { type: String, required: true },
  port: { type: Number, required: true },
});

const ProxyModel = model<IProxy>('Proxy', proxySchema);

export { ProxyModel, IProxy };
