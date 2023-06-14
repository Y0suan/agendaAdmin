import mongoose, {model, Schema, models} from "mongoose";

const ProductSchena = new Schema({
    title: {type: String, required: true},
    description: String,
    price: Number,
    hubicacion: String,
    facebook: String,
    instagram: String,
    images:[{type:String}],
    category:{type:mongoose.Types.ObjectId,ref:'Category'},
    properties:{type:Object},
},{
    timestamps: true,
});

export const Product = models.Product || model('Product',ProductSchena);
