import axios from "axios";

export const getAllGaugesInfos = async () => {
    const chainIds = [1, 56, 42161, 5000, 10]; // Ethereum, BNB Chain, Arbitrum One, Mantis, and Optimism
    const allGaugesData = [];
    for (const chainId of chainIds) {
        try {
            const response = await axios.get(
                `https://api-v2.pendle.finance/core/v1/${chainId}/markets?excludeBlockedPool=true&limit=50&order_by=customRank:-1`
            );
            const data = response.data;

            if ("results" in data && Array.isArray(data["results"])) {
                for (const gauge of data["results"]) {
                    const gaugeInfo = {
                        name: `${gauge["protocol"]} - ${gauge["farmProName"]} - ${gauge["expiry"]}`,
                        address: gauge["address"],
                        chainId: chainId,
                    };
                    // Format the expiry date without moment.js
                    const expiryDate = gaugeInfo["name"].split(" - ").slice(-1)[0];
                    const formattedDate = new Date(expiryDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    }).toUpperCase().replace(" ", "");
                    gaugeInfo["name"] = gaugeInfo["name"].replace(expiryDate, formattedDate);
                    allGaugesData.push(gaugeInfo);
                }
            } else {
                console.log(`Failed to fetch Pendle gauges for chainId ${chainId}: Invalid response format`);
            }
        } catch (error) {
            console.error(`Error fetching Pendle gauges for chainId ${chainId}: ${error}`);
        }
    }

    return allGaugesData;
}
