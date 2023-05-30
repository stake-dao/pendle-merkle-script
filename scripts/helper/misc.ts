import { BigNumber, Contract } from 'ethers';
import { MerkleDistributionOutput, RC, UserLeafData } from './types';
import { assert } from 'console';
import { ethers } from 'hardhat';
import hre from "hardhat"

export function getWeekStartTimestamp(timestamp: number): number {
    const week = Math.floor(timestamp / 604800);
    return week * 604800;
}

export function getWeekEndTimestamp(timestamp: number): number {
    return getWeekStartTimestamp(timestamp) + 604800;
}

export function normalizeRawRC(rawUserRewards: Record<string, string>): RC {
    const userRewards: RC = {};
    for (let user of Object.keys(rawUserRewards)) {
        const reward = BigNumber.from(rawUserRewards[user]);
        userRewards[user] = reward;
    }
    return userRewards;
}

export function getWeekPoolId(pool: string, wTime: number): string {
    assert(wTime == getWeekStartTimestamp(wTime), `Invalid week time: ${wTime}`);
    return `${pool}-${wTime}`;
}

export async function getContractAt<CType extends Contract>(abiType: string, address: string) {
    if (address == null || address == undefined) {
        return {} as CType;
    }
    return (await hre.ethers.getContractAt(abiType, address)) as CType;
}
