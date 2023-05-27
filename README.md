# clickhouse-osquery

A simple showcase of how data from a locally running [osquery](https://github.com/osquery/osquery) client can be inserted into a table on a locally running [ClickHouse](https://github.com/ClickHouse/ClickHouse) server for subsequent analysis.

This is a Node.js app that uses [mysql2](https://www.npmjs.com/package/mysql2) to access a locally running ClickHouse server and [osquery-node](https://www.npmjs.com/package/osquery) to access a locally running osquery client.

## Running the app

Before running the JS app, make sure to have a [ClickHouse server](https://clickhouse.com/docs/en/quick-start) and an [osquery client](https://osquery.readthedocs.io/en/stable/introduction/using-osqueryi/) running. In ClickHouse, create a database named "osquery" for the app to connect to.

To run the JS server app on your machine:

1. Install [Node.js](https://nodejs.org/en/).
2. Clone this repository to your machine.
3. Go to the root folder of the repository in the terminal and install npm package dependencies by running this command:
```
npm install
```
4. Run the app using this command:
```
node app
```
The default port for this app is 3000, so once the app is running the page can be accessed locally on [localhost:3000](http://localhost:3000/)

## Usage

The app processes a simple form with 2 input fields:

- Table name: the name of the table to write results into.
- Query: the SQL query to be sent to the osquery client.

In case of a successful write, the new ClickHouse table can be accessed by standard means.
