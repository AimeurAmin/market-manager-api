import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
}, {
    timestamps: true,
});


companySchema.virtual("users", {
    ref: "User",
    localField: "_id",
    foreignField: "company",
});

companySchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "company",
});


companySchema.virtual("barcodes", {
    ref: "Barcode",
    localField: "_id",
    foreignField: "company",
});

companySchema.virtual("products", {
    ref: "Product",
    localField: "_id",
    foreignField: "company",
});

companySchema.virtual("stores", {
    ref: "Stock",
    localField: "_id",
    foreignField: "company",
});

companySchema.virtual("sales", {
    ref: "Sale",
    localField: "_id",
    foreignField: "company",
});

companySchema.virtual("invoices", {
    ref: "Invoice",
    localField: "_id",
    foreignField: "company",
});

companySchema.virtual("clients", {
    ref: "Client",
    localField: "_id",
    foreignField: "company",
});

companySchema.virtual("payments", {
    ref: "Payment",
    localField: "_id",
    foreignField: "company",
});

companySchema.virtual("roles", {
    ref: "Role",
    localField: "_id",
    foreignField: "company",
});

companySchema.virtual("permissions", {
    ref: "Permission",
    localField: "_id",
    foreignField: "company",
});


const Company = mongoose.model("Company", companySchema);

export default Company;