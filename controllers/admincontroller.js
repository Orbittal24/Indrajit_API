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
        SUM(CASE WHEN v1_status = 'OK' AND DATEPART(HOUR, v1_end_date) BETWEEN 6 AND 13 THEN 1 ELSE 0 END) AS v1_first_shift_ok,
        SUM(CASE WHEN v1_status = 'NOT OK' AND DATEPART(HOUR, v1_end_date) BETWEEN 6 AND 13 THEN 1 ELSE 0 END) AS v1_first_shift_notok,
        SUM(CASE WHEN v1_status = 'OK' AND DATEPART(HOUR, v1_end_date) BETWEEN 14 AND 21 THEN 1 ELSE 0 END) AS v1_second_shift_ok,
        SUM(CASE WHEN v1_status = 'NOT OK' AND DATEPART(HOUR, v1_end_date) BETWEEN 14 AND 21 THEN 1 ELSE 0 END) AS v1_second_shift_notok,
        SUM(CASE WHEN v1_status = 'OK' AND (DATEPART(HOUR, v1_end_date) BETWEEN 22 AND 23 OR DATEPART(HOUR, v1_end_date) BETWEEN 0 AND 5) THEN 1 ELSE 0 END) AS v1_third_shift_ok,
        SUM(CASE WHEN v1_status = 'NOT OK' AND (DATEPART(HOUR, v1_end_date) BETWEEN 22 AND 23 OR DATEPART(HOUR, v1_end_date) BETWEEN 0 AND 5) THEN 1 ELSE 0 END) AS v1_third_shift_notok,
        
        -- v2_status counts
        SUM(CASE WHEN v2_status = 'OK' AND DATEPART(HOUR, v2_end_date) BETWEEN 6 AND 13 THEN 1 ELSE 0 END) AS v2_first_shift_ok,
        SUM(CASE WHEN v2_status = 'NOT OK' AND DATEPART(HOUR, v2_end_date) BETWEEN 6 AND 13 THEN 1 ELSE 0 END) AS v2_first_shift_notok,
        SUM(CASE WHEN v2_status = 'OK' AND DATEPART(HOUR, v2_end_date) BETWEEN 14 AND 21 THEN 1 ELSE 0 END) AS v2_second_shift_ok,
        SUM(CASE WHEN v2_status = 'NOT OK' AND DATEPART(HOUR, v2_end_date) BETWEEN 14 AND 21 THEN 1 ELSE 0 END) AS v2_second_shift_notok,
        SUM(CASE WHEN v2_status = 'OK' AND (DATEPART(HOUR, v2_end_date) BETWEEN 22 AND 23 OR DATEPART(HOUR, v2_end_date) BETWEEN 0 AND 5) THEN 1 ELSE 0 END) AS v2_third_shift_ok,
        SUM(CASE WHEN v2_status = 'NOT OK' AND (DATEPART(HOUR, v2_end_date) BETWEEN 22 AND 23 OR DATEPART(HOUR, v2_end_date) BETWEEN 0 AND 5) THEN 1 ELSE 0 END) AS v2_third_shift_notok,

        -- welding_status counts
        SUM(CASE WHEN welding_status = 'OK' AND DATEPART(HOUR, welding_end_date) BETWEEN 6 AND 13 THEN 1 ELSE 0 END) AS welding_first_shift_ok,
        SUM(CASE WHEN welding_status = 'NOT OK' AND DATEPART(HOUR, welding_end_date) BETWEEN 6 AND 13 THEN 1 ELSE 0 END) AS welding_first_shift_notok,
        SUM(CASE WHEN welding_status = 'OK' AND DATEPART(HOUR, welding_end_date) BETWEEN 14 AND 21 THEN 1 ELSE 0 END) AS welding_second_shift_ok,
        SUM(CASE WHEN welding_status = 'NOT OK' AND DATEPART(HOUR, welding_end_date) BETWEEN 14 AND 21 THEN 1 ELSE 0 END) AS welding_second_shift_notok,
        SUM(CASE WHEN welding_status = 'OK' AND (DATEPART(HOUR, welding_end_date) BETWEEN 22 AND 23 OR DATEPART(HOUR, welding_end_date) BETWEEN 0 AND 5) THEN 1 ELSE 0 END) AS welding_third_shift_ok,
        SUM(CASE WHEN welding_status = 'NOT OK' AND (DATEPART(HOUR, welding_end_date) BETWEEN 22 AND 23 OR DATEPART(HOUR, welding_end_date) BETWEEN 0 AND 5) THEN 1 ELSE 0 END) AS welding_third_shift_notok,

        -- fpcb_status counts
        SUM(CASE WHEN fpcb_status = 'OK' AND DATEPART(HOUR, fpcb_end_date) BETWEEN 6 AND 13 THEN 1 ELSE 0 END) AS fpcb_first_shift_ok,
        SUM(CASE WHEN fpcb_status = 'NOT OK' AND DATEPART(HOUR, fpcb_end_date) BETWEEN 6 AND 13 THEN 1 ELSE 0 END) AS fpcb_first_shift_notok,
        SUM(CASE WHEN fpcb_status = 'OK' AND DATEPART(HOUR, fpcb_end_date) BETWEEN 14 AND 21 THEN 1 ELSE 0 END) AS fpcb_second_shift_ok,
        SUM(CASE WHEN fpcb_status = 'NOT OK' AND DATEPART(HOUR, fpcb_end_date) BETWEEN 14 AND 21 THEN 1 ELSE 0 END) AS fpcb_second_shift_notok,
        SUM(CASE WHEN fpcb_status = 'OK' AND (DATEPART(HOUR, fpcb_end_date) BETWEEN 22 AND 23 OR DATEPART(HOUR, fpcb_end_date) BETWEEN 0 AND 5) THEN 1 ELSE 0 END) AS fpcb_third_shift_ok,
        SUM(CASE WHEN fpcb_status = 'NOT OK' AND (DATEPART(HOUR, fpcb_end_date) BETWEEN 22 AND 23 OR DATEPART(HOUR, fpcb_end_date) BETWEEN 0 AND 5) THEN 1 ELSE 0 END) AS fpcb_third_shift_notok,

        -- module_a_barcode counts
        SUM(CASE WHEN DATEPART(HOUR, fpcb_end_date) BETWEEN 6 AND 14 THEN 1 ELSE 0 END) AS module_first_shift_total,
        SUM(CASE WHEN DATEPART(HOUR, fpcb_end_date) BETWEEN 13 AND 21 THEN 1 ELSE 0 END) AS module_second_shift_total,
        SUM(CASE WHEN DATEPART(HOUR, fpcb_end_date) BETWEEN 22 AND 23 OR DATEPART(HOUR, fpcb_end_date) BETWEEN 0 AND 5 THEN 1 ELSE 0 END) AS module_third_shift_total,

         SUM(CASE WHEN DATEPART(HOUR, v1_end_date) BETWEEN 6 AND 13 THEN v1_difference ELSE 0 END) AS v1_fristshift_Diff,
          SUM(CASE WHEN DATEPART(HOUR, v1_end_date) BETWEEN 14 AND 21 THEN v1_difference ELSE 0 END) AS v1_secoundshift_Diff,
          SUM(CASE WHEN DATEPART(HOUR, v2_end_date) BETWEEN 6 AND 13 THEN v2_difference ELSE 0 END) AS v2_fristshift_Diff,
          SUM(CASE WHEN DATEPART(HOUR, v2_end_date) BETWEEN 14 AND 21 THEN v2_difference ELSE 0 END) AS v2_secoundshift_Diff,
          SUM(CASE WHEN DATEPART(HOUR, welding_end_date) BETWEEN 6 AND 13 THEN welding_difference ELSE 0 END) AS welding_fristshift_Diff,
          SUM(CASE WHEN DATEPART(HOUR, welding_end_date) BETWEEN 14 AND 21 THEN welding_difference ELSE 0 END) AS welding_secoundshift_Diff,
          SUM(CASE WHEN DATEPART(HOUR, fpcb_end_date) BETWEEN 6 AND 13 THEN fpcb_difference ELSE 0 END) AS fpcb_fristshift_Diff,
          SUM(CASE WHEN DATEPART(HOUR, fpcb_end_date) BETWEEN 14 AND 21 THEN fpcb_difference ELSE 0 END) AS fpcb_secoundshift_Diff,
            (SELECT TOP 1 module_barcode FROM dbo.linking_module_RFID ORDER BY sr_no DESC) AS latest_module_barcode
          
      FROM [dbo].[clw_station_status]
      WHERE CAST(v1_end_date AS DATE) = CAST(GETDATE() AS DATE)
         OR CAST(v2_end_date AS DATE) = CAST(GETDATE() AS DATE)
         OR CAST(welding_end_date AS DATE) = CAST(GETDATE() AS DATE)
         OR CAST(fpcb_end_date AS DATE) = CAST(GETDATE() AS DATE)
         OR CAST(fpcb_end_date AS DATE) = CAST(GETDATE() AS DATE);`
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

////////////////////weekmonth avg/////////////////////////////

// import asyncHandler from "express-async-handler";
// import sql from "mssql";

// const config = {
//   user: "admin2",
  // password: "reset@123",
  // database: "replus_treceability",
  // server: "DESKTOP-FKJATC0",
//   options: {
//     encrypt: false, // Change to true if you're using SSL
//     trustServerCertificate: false, // Change to true if using self-signed certificates
//   },
// };

// const pool = new sql.ConnectionPool(config);

// pool.connect().then(() => {
//   console.log("Connected to MSSQL database!");
// }).catch(err => {
//   console.error("Error connecting to MSSQL database:", err);
// });

// export default pool;

// export const CountAll = asyncHandler(async (request, response) => {
//   try {
//     const avgvalue = 480.0; 

//     const result = await pool.request()
//       .input('avgvalue', sql.Float, avgvalue) 
//       .query(`
      
//         SELECT 
//         SUM(CASE WHEN v1_status = 'OK' AND DATEPART(HOUR, v1_end_date) BETWEEN 6 AND 12 THEN 1 ELSE 0 END) AS v1_first_shift_ok,
//         SUM(CASE WHEN v1_status = 'NOT OK' AND DATEPART(HOUR, v1_end_date) BETWEEN 6 AND 12 THEN 1 ELSE 0 END) AS v1_first_shift_notok,
//         SUM(CASE WHEN v1_status = 'OK' AND DATEPART(HOUR, v1_end_date) BETWEEN 13 AND 21 THEN 1 ELSE 0 END) AS v1_second_shift_ok,
//         SUM(CASE WHEN v1_status = 'NOT OK' AND DATEPART(HOUR, v1_end_date) BETWEEN 13 AND 21 THEN 1 ELSE 0 END) AS v1_second_shift_notok,
//         SUM(CASE WHEN v1_status = 'OK' AND (DATEPART(HOUR, v1_end_date) BETWEEN 22 AND 23 OR DATEPART(HOUR, v1_end_date) BETWEEN 0 AND 5) THEN 1 ELSE 0 END) AS v1_third_shift_ok,
//         SUM(CASE WHEN v1_status = 'NOT OK' AND (DATEPART(HOUR, v1_end_date) BETWEEN 22 AND 23 OR DATEPART(HOUR, v1_end_date) BETWEEN 0 AND 5) THEN 1 ELSE 0 END) AS v1_third_shift_notok,
        
//         -- v2_status counts
//         SUM(CASE WHEN v2_status = 'OK' AND DATEPART(HOUR, v2_end_date) BETWEEN 6 AND 12 THEN 1 ELSE 0 END) AS v2_first_shift_ok,
//         SUM(CASE WHEN v2_status = 'NOT OK' AND DATEPART(HOUR, v2_end_date) BETWEEN 6 AND 12 THEN 1 ELSE 0 END) AS v2_first_shift_notok,
//         SUM(CASE WHEN v2_status = 'OK' AND DATEPART(HOUR, v2_end_date) BETWEEN 13 AND 21 THEN 1 ELSE 0 END) AS v2_second_shift_ok,
//         SUM(CASE WHEN v2_status = 'NOT OK' AND DATEPART(HOUR, v2_end_date) BETWEEN 13 AND 21 THEN 1 ELSE 0 END) AS v2_second_shift_notok,
//         SUM(CASE WHEN v2_status = 'OK' AND (DATEPART(HOUR, v2_end_date) BETWEEN 22 AND 23 OR DATEPART(HOUR, v2_end_date) BETWEEN 0 AND 5) THEN 1 ELSE 0 END) AS v2_third_shift_ok,
//         SUM(CASE WHEN v2_status = 'NOT OK' AND (DATEPART(HOUR, v2_end_date) BETWEEN 22 AND 23 OR DATEPART(HOUR, v2_end_date) BETWEEN 0 AND 5) THEN 1 ELSE 0 END) AS v2_third_shift_notok,

//         -- welding_status counts
//         SUM(CASE WHEN welding_status = 'OK' AND DATEPART(HOUR, welding_end_date) BETWEEN 6 AND 12 THEN 1 ELSE 0 END) AS welding_first_shift_ok,
//         SUM(CASE WHEN welding_status = 'NOT OK' AND DATEPART(HOUR, welding_end_date) BETWEEN 6 AND 12 THEN 1 ELSE 0 END) AS welding_first_shift_notok,
//         SUM(CASE WHEN welding_status = 'OK' AND DATEPART(HOUR, welding_end_date) BETWEEN 13 AND 21 THEN 1 ELSE 0 END) AS welding_second_shift_ok,
//         SUM(CASE WHEN welding_status = 'NOT OK' AND DATEPART(HOUR, welding_end_date) BETWEEN 13 AND 21 THEN 1 ELSE 0 END) AS welding_second_shift_notok,
//         SUM(CASE WHEN welding_status = 'OK' AND (DATEPART(HOUR, welding_end_date) BETWEEN 22 AND 23 OR DATEPART(HOUR, welding_end_date) BETWEEN 0 AND 5) THEN 1 ELSE 0 END) AS welding_third_shift_ok,
//         SUM(CASE WHEN welding_status = 'NOT OK' AND (DATEPART(HOUR, welding_end_date) BETWEEN 22 AND 23 OR DATEPART(HOUR, welding_end_date) BETWEEN 0 AND 5) THEN 1 ELSE 0 END) AS welding_third_shift_notok,

//         -- fpcb_status counts
//         SUM(CASE WHEN fpcb_status = 'OK' AND DATEPART(HOUR, fpcb_end_date) BETWEEN 6 AND 12 THEN 1 ELSE 0 END) AS fpcb_first_shift_ok,
//         SUM(CASE WHEN fpcb_status = 'NOT OK' AND DATEPART(HOUR, fpcb_end_date) BETWEEN 6 AND 12 THEN 1 ELSE 0 END) AS fpcb_first_shift_notok,
//         SUM(CASE WHEN fpcb_status = 'OK' AND DATEPART(HOUR, fpcb_end_date) BETWEEN 13 AND 21 THEN 1 ELSE 0 END) AS fpcb_second_shift_ok,
//         SUM(CASE WHEN fpcb_status = 'NOT OK' AND DATEPART(HOUR, fpcb_end_date) BETWEEN 13 AND 21 THEN 1 ELSE 0 END) AS fpcb_second_shift_notok,
//         SUM(CASE WHEN fpcb_status = 'OK' AND (DATEPART(HOUR, fpcb_end_date) BETWEEN 22 AND 23 OR DATEPART(HOUR, fpcb_end_date) BETWEEN 0 AND 5) THEN 1 ELSE 0 END) AS fpcb_third_shift_ok,
//         SUM(CASE WHEN fpcb_status = 'NOT OK' AND (DATEPART(HOUR, fpcb_end_date) BETWEEN 22 AND 23 OR DATEPART(HOUR, fpcb_end_date) BETWEEN 0 AND 5) THEN 1 ELSE 0 END) AS fpcb_third_shift_notok,

//         -- module_a_barcode counts
//         SUM(CASE WHEN DATEPART(HOUR, fpcb_end_date) BETWEEN 6 AND 12 THEN 1 ELSE 0 END) AS module_first_shift_total,
//         SUM(CASE WHEN DATEPART(HOUR, fpcb_end_date) BETWEEN 13 AND 21 THEN 1 ELSE 0 END) AS module_second_shift_total,
//         SUM(CASE WHEN DATEPART(HOUR, fpcb_end_date) BETWEEN 22 AND 23 OR DATEPART(HOUR, fpcb_end_date) BETWEEN 0 AND 5 THEN 1 ELSE 0 END) AS module_third_shift_total,


//         SUM(CASE WHEN DATEPART(HOUR, v1_end_date) BETWEEN 6 AND 12 THEN v1_difference ELSE 0 END) / @avgvalue AS v1_fristshift_Diff,
//         SUM(CASE WHEN DATEPART(HOUR, v1_end_date) BETWEEN 13 AND 21 THEN v1_difference ELSE 0 END) / @avgvalue AS v1_secoundshift_Diff,
//         SUM(CASE WHEN DATEPART(HOUR, v2_end_date) BETWEEN 6 AND 12 THEN v2_difference ELSE 0 END) / @avgvalue AS v2_fristshift_Diff,
//         SUM(CASE WHEN DATEPART(HOUR, v2_end_date) BETWEEN 13 AND 21 THEN v2_difference ELSE 0 END) / @avgvalue AS v2_secoundshift_Diff,
//         SUM(CASE WHEN DATEPART(HOUR, welding_end_date) BETWEEN 6 AND 12 THEN welding_difference ELSE 0 END) / @avgvalue AS welding_fristshift_Diff,
//         SUM(CASE WHEN DATEPART(HOUR, welding_end_date) BETWEEN 13 AND 21 THEN welding_difference ELSE 0 END) / @avgvalue AS welding_secoundshift_Diff,
//         SUM(CASE WHEN DATEPART(HOUR, fpcb_end_date) BETWEEN 6 AND 12 THEN fpcb_difference ELSE 0 END) / @avgvalue AS fpcb_fristshift_Diff,
//         SUM(CASE WHEN DATEPART(HOUR, fpcb_end_date) BETWEEN 13 AND 21 THEN fpcb_difference ELSE 0 END) / @avgvalue AS fpcb_secoundshift_Diff

//         FROM [dbo].[clw_station_status]
//         WHERE CAST(v1_end_date AS DATE) = CAST(GETDATE() AS DATE)
//            OR CAST(v2_end_date AS DATE) = CAST(GETDATE() AS DATE)
//            OR CAST(welding_end_date AS DATE) = CAST(GETDATE() AS DATE)
//            OR CAST(fpcb_end_date AS DATE) = CAST(GETDATE() AS DATE)
//            OR CAST(fpcb_end_date AS DATE) = CAST(GETDATE() AS DATE)
//       `);

//     response.status(200).json({ status: "success", data: result.recordset });
//   } catch (error) {
//     console.error("Error while counting records:", error);
//     response.status(500).json({ status: "error", msg: "Error while counting records" });
//   }
// });

// // Function to call CountAll1 at an interval
// const callCountAll = () => {
//   // Mock request and response objects
//   const request = {}; // Add any necessary properties
//   const response = {
//     json: (data) => console.log('Response:', data),
//     status: (statusCode) => ({
//       json: (data) => console.log('Response with status:', statusCode, data),
//     }),
//   };

//   // Call the function
//   CountAll(request, response);
// };

// // Set the interval to 10 seconds (10000 milliseconds)
// setInterval(callCountAll, 10000);


// //////////////////////week/////////////////////////////////////
export const WeekMonthDiff = asyncHandler(async (request, response) => {
  try {
    const avgvalue = 480.0; 

    // const currentDate = new Date();
    // const startOfWeek = new Date(currentDate);
    // startOfWeek.setDate(currentDate.getDate() - (currentDate.getDay() + 6) % 7); // Go back to the beginning of the current week, considering Monday as the start
    // startOfWeek.setHours(6, 0, 0, 0); // Start of the week (Monday at 6:00 AM)

    // const endOfWeek = new Date(startOfWeek);
    // endOfWeek.setDate(startOfWeek.getDate() + 6); // Go forward 6 days to reach Saturday
    // endOfWeek.setHours(22, 0, 0, 0); // End of the week (Saturday at 10:00 PM)

    // const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    // const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

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
     AND fpcb_end_date < DATEADD(HOUR, 22, DATEADD(DAY, 5, DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()), 0))))

    `;

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


// ////////////////month////////////////////////////////////

// export const monthDiff = asyncHandler(async (request, response) => {
//   try {
//     const avgvalue = 480.0; 

//     const currentDate = new Date();
//     const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//     const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

//     const result = await pool.request()
//     .input('avgvalue', sql.Float, avgvalue)
//     .input('firstDayOfMonth', sql.DateTime, firstDayOfMonth)
//     .input('lastDayOfMonth', sql.DateTime, lastDayOfMonth)
//     .query(`
      
//         SELECT 
//       SUM(CONVERT(FLOAT, v1_difference)) / @avgvalue AS v1_monthDiff_Avg,
//     SUM(CONVERT(FLOAT, v2_difference)) / @avgvalue AS v2_monthDiff_Avg,
//     SUM(CONVERT(FLOAT, welding_difference)) / @avgvalue AS welding_monthDiff_Avg,
//     SUM(CONVERT(FLOAT, fpcb_difference)) / @avgvalue AS fpcb_Diff_monthAvg
//           FROM [dbo].[clw_station_status]
//           WHERE v1_end_date BETWEEN @firstDayOfMonth AND @lastDayOfMonth
//             AND v2_end_date BETWEEN @firstDayOfMonth AND @lastDayOfMonth
//             AND welding_end_date BETWEEN @firstDayOfMonth AND @lastDayOfMonth
//             AND fpcb_end_date BETWEEN @firstDayOfMonth AND @lastDayOfMonth;
//              `);

//     response.status(200).json({ status: "success", data: result.recordset });
//   } catch (error) {
//     console.error("Error while counting records:", error);
//     response.status(500).json({ status: "error", msg: "Error while counting records" });
//   }
// });

// // Function to call CountAll1 at an interval
// const callmonthDiff = () => {
//   // Mock request and response objects
//   const request = {}; // Add any necessary properties
//   const response = {
//     json: (data) => console.log('Response:', data),
//     status: (statusCode) => ({
//       json: (data) => console.log('Response with status:', statusCode, data),
//     }),
//   };

//   // Call the function
//   monthDiff(request, response);
// };

// // Set the interval to 10 seconds (10000 milliseconds)
// setInterval(callmonthDiff, 10000);






