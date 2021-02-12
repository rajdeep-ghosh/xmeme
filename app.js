import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import mongoose from 'mongoose';

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://localhost:27017/xmemeDB', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});

// Create memeSchema
const memeSchema = new mongoose.Schema({
    name: String,
    caption: String,
    url: String
});

// Create meme model 
const Meme = mongoose.model('Meme', memeSchema);

app.get('/', (req, res) => {
    res.render("home");
});

app.post('/', (req, res) => {
    const meme = new Meme({
        name: req.body.authorName,
        caption: req.body.memeCaption,
        url: req.body.memeURL
    });
    meme.save();
})

app.listen(8081, () => {console.log("Server started");});