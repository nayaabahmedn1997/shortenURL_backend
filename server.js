const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./DB');
dotenv.config();



const PORT  = 6002;



const server  = http.createServer(app);
//Connect to database
connectDB();

server.listen(PORT, ()=>{

    console.log(`Server is running on PORT ${PORT}`);
})


