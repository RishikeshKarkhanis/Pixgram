const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        await mongoose.connect('mongodb+srv://rishikeshkarkhanis0101:zfQVdD4X3HeyVk77@pixgram.zs3ooaz.mongodb.net/myDatabase?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
};

module.exports = connectDatabase;
