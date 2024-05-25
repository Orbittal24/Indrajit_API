import asyncHandler from "express-async-handler";
import sql from "mssql";

const config = {
  user: "admin2",
  password: "reset@123",
  database: "replus_treceability",
  server: "REP-TRACE",
  options: {
    encrypt: false, // Change to true if you're using SSL
    trustServerCertificate: false, // Change to true if using self-signed certificates
  },
};

const pool = new sql.ConnectionPool(config);

pool.connect().then(() => {
  console.log("Connected to MSSQL database!");
}).catch(err => {
  console.error("Error connecting to MSSQL database:", err);
});

export default pool;

export const CountAll = asyncHandler(async (request, response) => {
  try {
    const result = await pool.request().query(
      `SELECT 
      SUM(CASE WHEN v1_status = 'OK' THEN 1 ELSE 0 END) AS vision_1AllOKCount,
      SUM(CASE WHEN v1_status = 'NOK' THEN 1 ELSE 0 END) AS vision_1AllNotOKCount,
  
      SUM(CASE WHEN v2_status = 'OK' THEN 1 ELSE 0 END) AS vision_2AllOKCount,
      SUM(CASE WHEN v2_status = 'NOK' THEN 1 ELSE 0 END) AS vision_2AllNotOKCount,
  
      SUM(CASE WHEN welding_status = 'OK' THEN 1 ELSE 0 END) AS weldingAllOKCount,
      SUM(CASE WHEN welding_status = 'NOK' THEN 1 ELSE 0 END) AS weldingAllNotOKCount,
  
      SUM(CASE WHEN fpcb_status = 'OK' THEN 1 ELSE 0 END) AS fpcb_weldingAllOKCount,
      SUM(CASE WHEN fpcb_status = 'NOK' THEN 1 ELSE 0 END) AS fpcb_weldingAllNotOKCount,
  
      COUNT(module_barcode) AS moduleCount
  FROM [replus_treceability].[dbo].[clw_station_status];
  `
    );

    response.status(200).json({ status: "success", data: result.recordset });
  } catch (error) {
    console.error("Error while counting records:", error);
    response.status(500).json({ status: "error", msg: "Error while counting records" });
  }
});

// Function to call CountAll at an interval
const callCountAll = () => {
  // Mock request and response objects
  const request = {}; // Add any necessary properties
  const response = {
    json: (data) => console.log('Response:', data),
    status: (statusCode) => ({
      json: (data) => console.log('Response with status:', statusCode, data),
    }),
  };

  // Call the function
  CountAll(request, response);
};

// Set the interval to 10 seconds (10000 milliseconds)
setInterval(callCountAll, 10000);
