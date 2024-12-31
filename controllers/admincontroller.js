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
        -- v1 status counts
        SUM(CASE WHEN v1_status = 'OK' AND CAST(v1_start_date AS DATE) = CAST(GETDATE() AS DATE) THEN 1 ELSE 0 END) AS v1_ok_count,
        SUM(CASE WHEN v1_status = 'NOT OK' AND CAST(v1_start_date AS DATE) = CAST(GETDATE() AS DATE) THEN 1 ELSE 0 END) AS v1_notok_count,

        -- v2 status counts
        SUM(CASE WHEN v2_status = 'OK' AND CAST(v2_start_date AS DATE) = CAST(GETDATE() AS DATE) THEN 1 ELSE 0 END) AS v2_ok_count,
        SUM(CASE WHEN v2_status = 'NOT OK' AND CAST(v2_start_date AS DATE) = CAST(GETDATE() AS DATE) THEN 1 ELSE 0 END) AS v2_notok_count,

        -- welding status counts
        SUM(CASE WHEN welding_status = 'OK' AND CAST(welding_start_date AS DATE) = CAST(GETDATE() AS DATE) THEN 1 ELSE 0 END) AS welding_ok_count,
        SUM(CASE WHEN welding_status = 'NOT OK' AND CAST(welding_start_date AS DATE) = CAST(GETDATE() AS DATE) THEN 1 ELSE 0 END) AS welding_notok_count,

        -- fpcb status counts
        SUM(CASE WHEN fpcb_status = 'OK' AND CAST(fpcb_start_date AS DATE) = CAST(GETDATE() AS DATE) THEN 1 ELSE 0 END) AS fpcb_ok_count,
        SUM(CASE WHEN fpcb_status = 'NOT OK' AND CAST(fpcb_start_date AS DATE) = CAST(GETDATE() AS DATE) THEN 1 ELSE 0 END) AS fpcb_notok_count

      FROM [dbo].[clw_station_status]`
    );

    response.status(200).json({
      status: "success",
      data: result.recordset[0], // Aggregate counts for the day
    });
  } catch (error) {
    console.error("Error while updating live status:", error);
    response.status(500).json({ status: "error", msg: "Error while updating live status" });
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

////////////////////weekmonth avg/////////////////////////////


// //////////////////////week/////////////////////////////////////
export const WeekMonthDiff = asyncHandler(async (request, response) => {
  try {
    const avgvalue = 480.0; 

    await sql.connect(config);
    const result = await sql.query`
      SELECT    
        SUM(CAST(v1_difference AS DECIMAL(10, 2))) / ${avgvalue} AS v1_weekDiff_Avg,
        SUM(CAST(v2_difference AS DECIMAL(10, 2))) / ${avgvalue} AS v2_weekDiff_Avg,
        SUM(CAST(welding_difference AS DECIMAL(10, 2))) / ${avgvalue} AS welding_weekDiff_Avg,
        SUM(CAST(fpcb_difference AS DECIMAL(10, 2))) / ${avgvalue} AS fpcb_weekDiff_Avg
        FROM [dbo].[clw_station_status]
    WHERE 
    (v1_end_date >= DATEADD(HOUR, 6, DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()), 0)) 
     AND v1_end_date < DATEADD(HOUR, 22, DATEADD(DAY, 5, DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()), 0))))
    OR
    (v2_end_date >= DATEADD(HOUR, 6, DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()), 0)) 
     AND v2_end_date < DATEADD(HOUR, 22, DATEADD(DAY, 5, DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()), 0))))
    OR
    (welding_end_date >= DATEADD(HOUR, 6, DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()), 0)) 
     AND welding_end_date < DATEADD(HOUR, 22, DATEADD(DAY, 5, DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()), 0))))
    OR
    (fpcb_end_date >= DATEADD(HOUR, 6, DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()), 0)) 
     AND fpcb_end_date < DATEADD(HOUR, 22, DATEADD(DAY, 5, DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()), 0))))`;

    response.status(200).json({ status: "success", data: result.recordset });
  } catch (error) {
    console.error("Error while counting records:", error);
    response.status(500).json({ status: "error", msg: "Error while counting records" });
  }
}); 





// Function to call WeekMonthDiff at an interval
const callWeekMonthDiff = () => {
  // Mock request and response objects
  const request = {}; // Add any necessary properties
  const response = {
    json: (data) => console.log('Response:', data),
    status: (statusCode) => ({
      json: (data) => console.log('Response with status:', statusCode, data),
    }),
  };

  // Call the function
  WeekMonthDiff(request, response);
};

// Set the interval to 10 seconds (10000 milliseconds)
setInterval(callWeekMonthDiff, 10000);
