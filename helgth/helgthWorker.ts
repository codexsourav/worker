import { checkWebsiteHealth } from "./helgthCheck";
import { sendNotification } from "./notify";
import { Websites } from "./schema/websites"

export const HelgthCheckWorker = async () => {
    const urls = await Websites.find({ allow: true });
    for (const website of urls) {
        try {
            if (website.url) {
                console.log("-------––––––––––------------------––––––––––-----------");

                console.log('Check website -- ' + website.url);

                const { isHealthy, responseTime } = await checkWebsiteHealth(website.url);
                await website.updateOne({
                    isHealthy,
                    responseTime,
                    lastCheck: Date.now()
                });
                console.log("Website is " + (isHealthy ? "Running ✅" : "Not Running ❌"));

                if (!isHealthy) {
                    console.log("sending email");

                    await sendNotification({ name: website.name || "No Name", url: website.url })
                }

            }
        } catch (error) {
            console.error(error);
        }
    }
    console.log("-------––––––––––------------------––––––––––-----------");
    console.log("All Websites Are Checkek");

}

export const startHelgthCheckWorker = () => {
    HelgthCheckWorker();
    // Call HelgthCheckWorker every hour (1 hour = 60 minutes x 60 seconds x 1000 milliseconds)
    const ONE_HOUR = 60 * 60 * 1000; // 3600000 milliseconds
    setInterval(HelgthCheckWorker, ONE_HOUR);
}
