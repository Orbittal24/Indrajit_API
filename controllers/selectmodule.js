import sql from 'mssql';

// export const selectAll = asyncHandler(async (request, response) => {
//   // Connect to MySQL
//   const mysqlConnection = mysql.createConnection({
//     host: 'DESKTOP-FKJATC0',
//     user: 'admin',
//     password: 'admin',
//     database: 'replus_treceability'
//   });

//   mysqlConnection.connect();

//   try {
//     if (request.method === 'GET') {
//       // Handle GET request
//       mysqlConnection.query('SELECT * FROM link_module_RFID', function (error, results, fields) {
//         if (error) {
//           console.error('MySQL Query Error:', error);
//           response.status(500).json({ message: 'Error querying MySQL database' });
//           return;
//         }

//         // Log the query results
//         console.log('Query Results:', results);

//         // Close MySQL connection
//         mysqlConnection.end();

//         // Send back the results
//         response.status(200).json(results);
//       });
//     } else {
//       // Return a 405 Method Not Allowed error for unsupported methods
//       response.setHeader('Allow', ['GET']);
//       response.status(405).end(`Method ${request.method} Not Allowed`);
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     response.status(500).json({ message: 'Internal server error' });
//   }
// });



// Define asyncHandler
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Configuration for your MSSQL database connection
const sqlConfig = {
  user: 'admin',
  password: 'admin',
  server: 'DESKTOP-FKJATC0',
  database: 'replus_treceability',
  options: {
    encrypt: false, 
    trustServerCertificate: true,
  }
};

// Your selectAll function with asyncHandler
export const selectAll = asyncHandler(async (request, response) => {
  try {
    if (request.method === 'GET') {
      // Connect to MSSQL
      await sql.connect(sqlConfig);

      // Execute the query
      const result = await sql.query('SELECT * FROM link_module_RFID');

      // Log the query results
      console.log('Query Results:', result.recordset);

      // Send back the results
      response.status(200).json(result.recordset);
    } else {
      // Return a 405 Method Not Allowed error for unsupported methods
      response.setHeader('Allow', ['GET']);
      response.status(405).end(`Method ${request.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error:', error);
    response.status(500).json({ message: 'Internal server error' });
  } finally {
    // Close MSSQL connection
    sql.close();
  }
});