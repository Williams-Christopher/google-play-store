const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const store = require('./data');

app = express();

app.use(morgan('common'));
app.use(cors());

app.listen(8000, () => {
    console.log('Now listening on port 8000 => http://localhost:8000/');
});

app.get('/apps', (req, res) => {
    let { sort, genre } = req.query;
    console.log(req.query);

    if (sort) {
        if (!['rating', 'app'].includes(sort.toLowerCase())) {
            return res.status(400).send('Use rating or app with the sort query parameter.');
        } else {
            // https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
            sort = sort.charAt(0).toUpperCase() + sort.slice(1);
        }
    }

    if (genre) {
        if (!['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(genre.toLowerCase())) {
            return res.status(400).send('Use a valid value for the genre query param.');
        }
    } else if (genre === '') {
        return res.status(400).send('Use a valid value for the genre query param.');
    } else {
        genre = '';
    }

    let results = store.filter(item => item.Genres.toLowerCase().includes(genre));
    
    if(sort) {
        results.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        })
    }
    

    res.send(results);
});