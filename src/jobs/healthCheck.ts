// import cron from "node-cron";
import axios from "axios";
import { db } from "../utils/db";
import { monitoredUrls, checkResults } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

// Run every 5 minutes
export const schedule =async()=>{
   console.log("🔁 Running scheduled health checks...");

  try {
    const urls = await db.select().from(monitoredUrls);

    for (const url of urls) {
      try {
        const res = await axios.get(url.url, { timeout: 5000 });
        await db.insert(checkResults).values({
          urlId: url.id,
          status: res.status,
          isHealthy: res.status >= 200 && res.status < 400,
        });

        console.log(`✅ ${url.url} - ${res.status}`);
      } catch (err: any) {
        await db.insert(checkResults).values({
          urlId: url.id,
          status: err.response?.status || 0,
          isHealthy: false,
        });

        console.log(`❌ ${url.url} - Failed`);
      }
    }
  } catch (err) {
    console.error("💥 Error running health checks:", err);
  }
  
}
// cron.schedule("*/5 * * * *", async () => {
 
// });
