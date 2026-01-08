function logger(req, res, next) {

    const start = Date.now();

    // ดักจับ Event เมื่อ Response ส่งกลับไปหาผู้ใช้เสร็จสิ้น (Finish)
    res.on('finish', () => {
        // คำนวณระยะเวลา (เวลาปัจจุบัน - เวลาเริ่มต้น)
        const duration = Date.now() - start;
        console.log(`Hello${req.method} ${req.originalUrl} -> ${duration}ms`);
    });

    // สั่งให้ทำงานต่อไปยัง Controller
    next();
}

module.exports = logger;