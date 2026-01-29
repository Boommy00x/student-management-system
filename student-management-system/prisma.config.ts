import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        db: {
            provider: "postgresql",
            url: process.env.DATABASE_URL!, // ต้องมี url
            directUrl: process.env.DIRECT_URL, //  สำหรับ migration
        },
    },
});
