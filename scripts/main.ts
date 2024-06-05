import { BigNumber } from 'ethers';
import { normalizeRawRC, queryAllPositions, RC } from './helper';
import rawSwapDatas from './data/swap-result.json';

const WTIME_INF = 2 ** 31 - 1;
const ACCOUNT = '0xD8fa8dC5aDeC503AcC5e026a98F32Ca5C1Fa289A'.toLowerCase();
async function main() {
    const votingDatas = await queryAllPositions(WTIME_INF);
    const swapDatas: RC = normalizeRawRC(rawSwapDatas);

    let sumReward = BigNumber.from(0);

    for(let id in swapDatas) {
        const [pool, _week] = id.split('-');
        const wTime = parseInt(_week);

        if (!votingDatas[pool] || !votingDatas[pool][ACCOUNT]) continue;

        const rewardAmount = swapDatas[id];
        let totalVotingPower = BigNumber.from(0);

        for(let user of Object.keys(votingDatas[pool])) {
            const userVotingPower = votingDatas[pool][user].valueAt(wTime);
            totalVotingPower = totalVotingPower.add(userVotingPower);
        }

        const accountShare = votingDatas[pool][ACCOUNT].valueAt(wTime);
        if (accountShare.eq(0)) continue;
        const rewardForAccount = rewardAmount.mul(accountShare).div(totalVotingPower); 
        
        console.log(`pool: ${pool}, wtime: ${wTime}, rewardForAccount: ${rewardForAccount.toString()}`);

        sumReward = sumReward.add(rewardForAccount);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });