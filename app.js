function start_server(data) {
  const mysql = require('mysql2');
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'default',
    port: 9004,
    database: 'osquery'
  });

  var osquery = require('osquery');
  var os = osquery.createClient({ path: '/home/veniamin/.osquery/shell.em' });

  const express = require('express')
  const app = express()

  app.use(express.json())

  const port = 3000;

  app.get('/', (req, res) => {
    res.sendFile('views/index.html', { root: __dirname })
  })

  app.get('/index.js', (req, res) => {
    res.sendFile('index.js', { root: __dirname })
  })

  app.get("/query", (req, res) => {
    var table_name = req.query.table_name;
    var sql = req.query.sql;

    console.log("SQL:", sql);
    os.query(sql, function(err, result) {
      console.log("ERR:", err);
      console.log("RESULT:", result);

      if (!table_name || result.status.code != 0) {
        res.sendFile('views/error.html', { root: __dirname });
        return;
      }

      connection.query(`
        DROP TABLE IF EXISTS ${table_name}
        `
      )

      columns_sql = `id UInt64`;

      for (var column_name in result.response[0]) {
        columns_sql += `,\n${column_name} String`;
      }

      connection.query(`
        CREATE TABLE ${table_name}
        (
          ${columns_sql}
        )
        ENGINE = MergeTree
        ORDER BY id;
        `
      )

      insert_sql = ``;

      var id = 0;
      for (var obj of result.response) {
        id += 1;

        insert_sql += `(${id}`;

        for (column_name in obj) {
          insert_sql += `, '${obj[column_name]}'`;
        }

        insert_sql += `), `;
      }

      insert_sql[-1]

      connection.query(`
        INSERT INTO ${table_name} (*) VALUES ${insert_sql.slice(0, insert_sql.length - 2)};
        `,
        function (err, results) {
          if (err) {
            console.log(err);
            return;
          }

          res.sendFile('views/success.html', { root: __dirname });
        }
      )
    });
  })

  app.listen(port, function (err) {
    if (err) {
      console.log("Error while starting server:", err);
    } else {
      console.log("Server started at port " + port);
    }
  })
}

start_server();
