const app = require("./app"); // import app จากไฟล์ที่คุณเขียน
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`2) Server is running on http://localhost:${PORT}`);
});

