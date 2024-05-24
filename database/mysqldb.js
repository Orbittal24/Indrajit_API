import { createConnection } from "mysql";

const mysqlConnection = createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "swastidb",
});

mysqlConnection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});

export default mysqlConnection;
