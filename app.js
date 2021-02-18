import {config} from 'dotenv';
config();
import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import mongoose from 'mongoose';

const app = express();

// Declare dynamic port 
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// Connect MongoDB at default port 27017.
mongoose.connect('mongodb+srv://' + process.env.AUTH + '@cluster0.4p9si.mongodb.net/xmemeDB?retryWrites=true&w=majority', {
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

// Render home page with content 
app.get('/', (req, res) => {
    Meme.find({}, (err, foundMemes) => {
        if (!err) {
            if (foundMemes) {
                res.render("home", {memes: foundMemes});
            } else {
                res.render("home");
            }
        } else {
            console.log(err);
        }
    });
    // res.render("home");
});

// Get info from form and save in DB 
app.post('/', (req, res) => {
    const meme = new Meme({
        name: req.body.authorName,
        caption: req.body.memeCaption,
        url: req.body.memeURL
    });
    meme.save(function(err) {
        if (!err) {
            res.redirect('/');
        } else {
            console.log(err);
        }
    });
});

app.listen(port, () => {console.log("Server started");});