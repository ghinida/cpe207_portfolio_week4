const http = require('http');
const fs = require('fs');
const path = require('path');


const server = http.createServer((req, res) => {
    let filePath = path.join(
        __dirname,
        'public',
        req.url === '/' ? 'home.html' : req.url
    );

    let extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }
    if (contentType == "text/html" && extname == "") filePath += ".html";

    console.log(filePath);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code == 'ENOENT') {  // Page not found
                fs.readFile(path.join(__dirname, 'public', '404.html'),
                    (err, content) => {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf8');
                    })
            } else {
                // Some server errors: 500
                res.writeHead(500);
                res.end('Server error: ' + err.code);
            }
        } else {
            // Success request
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
        }
    })
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
});