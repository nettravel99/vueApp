const express = require('express')
const jwt = require('jsonwebtoken')

const app = express();

// Routes that do not need to be logged in
var publicRoutes = ['/api/login']

let allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    next();
}
app.use(allowCrossDomain);

// add functin to check for routes that need authenticaiton

app.use(function (req, res, next) {

    if (!publicRoutes.includes(req.path)) {
        console.log("called")

        const bearerHeader = req.headers["authorization"]
        // check if bearer is undefined console.log(bearerHeader)

        if (typeof bearerHeader !== 'undefined') {
            // Split of the space

            const bearer = bearerHeader.split(' ')
            // get token from array
            const bearerToken = bearer[1]
            // Set the token
            req.token = bearerToken;

            jwt.verify(req.token, "this is the secret key", (err, authData) => {
                if (err) {
                    res.send(403);
                } else {
                    next()
                }

            })

        } else {

            res.send(403);
        }
    }
    next()
});

app.get('/api', (req, res) => {
    res.json({message: 'welecome to api'});
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, "this is the secret key", (err, authData) => {
        if (err) {
            res.send(403);
        } else {
            res.json({message: 'Post Created.....', authData})
        }

    })

})

app.post('/api/login', (req, res) => {
    // This is where you would get  real user authenticate the user and send the
    // json token back mock user
    user = {
        "id": "1",
        "name": "John",
        "pwd": "12323232",
        "email": "john@adsc.com"

    }

    jwt.sign({
        user
    }, "this is the secret key", {
        expiresIn: '30s'
    }, (err, token) => { // This is the callback function

        if (err) {
            res.send("Forbidden 1")
        } else {
            res.json({token})
        }

    });

});

// Format of token Authorization: Bearer <access_token></access_token> Verify
// Token

function verifyToken(req, res, next) {
    // Get auth header token
    console.log("called")

    const bearerHeader = req.headers["authorization"]
    // check if bearer is undefined console.log(bearerHeader)

    if (typeof bearerHeader !== 'undefined') {
        // Split of the space

        const bearer = bearerHeader.split(' ')
        // get token from array
        const bearerToken = bearer[1]
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();

    } else {
        res.sendStatus(403)
    }

}

app.listen(5000, () => console.log('Server started on 5,000'));