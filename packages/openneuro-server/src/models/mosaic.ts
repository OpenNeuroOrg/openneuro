import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose


/**
 * Mosaic output collection
 */
export interface MosaicDocument extends Document {
  id: string
  datasetId: string
}

const mosaicSchema = new Schema({
  id: { type: String, required: true },
  datasetId: { type: String, required: true },
})

const Mosaic = model<MosaicDocument>("Mosaic", mosaicSchema)

export default Mosaic
