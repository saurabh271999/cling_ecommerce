import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        unique: true,
        maxlength: [20, 'Category name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [false, 'Category description is required'],
        maxlength: [100, 'Category description cannot exceed 100 characters'],
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Category image is required'],
        trim: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

export default Category;

