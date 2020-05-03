if (process.env.NODE_ENV === "production") {
    const fs = require("fs"); 
    fs.writeFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, process.env.GOOGLE_CONFIG, (err) => { });
}