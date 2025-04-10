import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/index.js';
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/api', routes);
// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/socialNetworkDB')
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
