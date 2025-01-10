import { BigNumber } from 'ethers';
import { normalizeRawRC, queryAllPositions, RC } from './helper';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';
import rawSwapDatas from './data/swap-result.json';
import { getAllGaugesInfos } from './helper/gaugeInfos';

const WTIME_INF = 2 ** 31 - 1;
const ACCOUNT = '0xD8fa8dC5aDeC503AcC5e026a98F32Ca5C1Fa289A'.toLowerCase();
const vePENDLE = '0x4f30a9d41b80ecc5b94306ab4364951ae3170210'.toLowerCase();

async function main() {
    const votingDatas = await queryAllPositions(WTIME_INF);
    const swapDatas: RC = normalizeRawRC(rawSwapDatas);

    const gaugeInfos = await getAllGaugesInfos();

    let sumReward = BigNumber.from(0);
    let totalVoterRewards = BigNumber.from(0);
    let totalNativeRewards = BigNumber.from(0);
    let resultsByPeriod = {};

    for (let id in swapDatas) {
        const [pool, _week] = id.split('-');
        const wTime = parseInt(_week);

        let name: string = "";

        if (pool.toLowerCase() === vePENDLE) {
            name = "vePENDLE";
        } else {
            for (let gauge of gaugeInfos) {
                if (gauge.address.toLowerCase() === pool.toLowerCase()) {
                    name = gauge.name;
                    break;
                }
            }
        }

        if (!votingDatas[pool] || !votingDatas[pool][ACCOUNT]) continue;

        const rewardAmount = swapDatas[id];
        let totalVotingPower = BigNumber.from(0);

        for (let user of Object.keys(votingDatas[pool])) {
            const userVotingPower = votingDatas[pool][user].valueAt(wTime);
            totalVotingPower = totalVotingPower.add(userVotingPower);
        }

        const accountShare = votingDatas[pool][ACCOUNT].valueAt(wTime);
        if (accountShare.eq(0)) continue;
        const rewardForAccount = rewardAmount.mul(accountShare).div(totalVotingPower);

        sumReward = sumReward.add(rewardForAccount);

        if (name === "vePENDLE") {
            totalNativeRewards = totalNativeRewards.add(rewardForAccount);
        } else {
            totalVoterRewards = totalVoterRewards.add(rewardForAccount);
        }

        if (!resultsByPeriod[wTime]) {
            resultsByPeriod[wTime] = {};
        }
        if (!resultsByPeriod[wTime][pool]) {
            resultsByPeriod[wTime][pool] = { name: name, reward: '0' };
        }

        resultsByPeriod[wTime][pool].reward = rewardForAccount.toString();
    }

    const totalRewards = sumReward.toString();
    const output = {
        resultsByPeriod,
        totalRewards,
        totalVoterRewards: totalVoterRewards.toString(),
        totalNativeRewards: totalNativeRewards.toString()
    };

    const dates = Object.keys(resultsByPeriod).map(timestamp => new Date(parseInt(timestamp) * 1000).toISOString().split('T')[0]);

    const startDate = dates[0].split('-').reverse().join('-').substring(0, 5);
    const endDate = dates[dates.length - 1].split('-').reverse().join('-').substring(0, 5);
    
    const currentYear = format(new Date(), 'yyyy');

    const fileName = `${startDate}_${endDate}-${currentYear}`.replace(/-/g, '-');

    const dirPath = path.join(__dirname, `./data/sdPendle-rewards/${fileName}.json`);
    const dir = path.dirname(dirPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dirPath, JSON.stringify(output, null, 2));
    console.log(`${dirPath}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
