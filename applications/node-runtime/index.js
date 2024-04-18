const express = require('express');
const app = express();
const path = require('path');
const createSignedUrl = require('./createSignedUrl')
const cors = require('cors')


app.use(express.static(path.join(__dirname, './build')));
app.use(cors())
// Start the server
const PORT = process.env.PORT || 8080;


app.get('/create-signed-url', async (req, res) => {
    
    if (req.query.filePath) {
        try {
            const filePath = req.query.filePath;
            const expiresInSeconds = req.query.expiresInSeconds
            const signedUrl = await createSignedUrl(filePath, expiresInSeconds)
            return res.send(signedUrl)    
        } catch (e) {
            res.send(e)
        }
            
    }
    
    res.send("")
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});