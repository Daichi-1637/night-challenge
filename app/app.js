var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));


var pg = require('pg');

var conString = "データベースのURL"

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

//app.options('*', cors());
app.get('/dicts', function (req, res) {
    var client = new pg.Client(conString);
    client.connect(function (err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }

        client.query('select * from custom_response', function (err, result) {
            if (err) {
                return console.error('error running query', err);
            }

            res.json(result.rows);

            client.end();
        });
    });
});

app.post('/dicts', function (req, res) {
    var client = new pg.Client(conString);
    client.connect(function (err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }

        client.query('insert into custom_response (request, response) values ($1, $2)', [req.body.request, req.body.response], function (err, result) {
            if (err) {
                return console.error('error running query', err);
            }

            //console.log(result.rows);
            res.json(result.rows);

            client.end();
        });
    });
});

app.put('/dicts/:id', function (req, res) {
    var client = new pg.Client(conString);
    client.connect(function (err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }

        client.query('update custom_response set request = $1, response = $2 where id = $3',
            [req.body.request, req.body.response, req.body.id], function (err, result) {
                if (err) {
                    return console.error('error running query', err);
                }

                res.json(result);

                client.end();
            });
    });
});

app.delete('/dicts/:id', function (req, res) {
    var client = new pg.Client(conString);
    client.connect(function (err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }

        client.query('delete from custom_response where id = $1', [req.params.id], function (err, result) {
            if (err) {
                return console.error('error running query', err);
            }

            //console.log(req);
            res.json(result)

            client.end();
        });
    });
});

//サーバ起動
app.listen(port);
console.log('listen on port ' + port);
