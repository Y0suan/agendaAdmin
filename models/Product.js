import {model, Schema, models} from "mongoose";

const ProductSchena = new Schema({
    title: {type: String, required: true},
    description: String,
    price: {type: Number, required: true},
    images:[{type:String}],
});

export const Product = models.Product || model('Product',ProductSchena);
