import assert from 'assert';
import { BigNumber as BN, BigNumber, BigNumberish } from 'ethers';

export type RC = Record<string, BigNumber>;

export interface UserLeafData {
    amount: string;
    leaf: string;
}

export interface MerkleDistributionOutput {
    merkleRoot: string;
    rawUserLeaves: string[];
    usersLeafData: Record<string, UserLeafData>;
}

export class VeBalanceSnapshot {
    slope: BN;
    bias: BN;
    timestamp: number;

    constructor(slope: BN, bias: BN, timestamp: number) {
        this.slope = slope;
        this.bias = bias;
        this.timestamp = timestamp;
    }

    valueAt(time: BigNumberish): BN {
        const value = this.bias.sub(this.slope.mul(time));
        return value.gt(0) ? value : BN.from(0);
    }
}

export class UserVeBalanceList {
    index: number;
    snapshots: VeBalanceSnapshot[];

    constructor() {
        this.snapshots = [];
        this.index = 0;
    }

    valueAt(time: number): BN {
        assert(this.index < this.snapshots.length, '[UserVeBalanceList] index out of bound');
        if (this.snapshots.length === 0) {
            return BN.from(0);
        }
        if (this.snapshots[0].timestamp > time) {
            return BN.from(0);
        }
        if (this.snapshots[this.index].timestamp > time) {
            this.index = 0;
        }
        while (this.index + 1 < this.snapshots.length && this.snapshots[this.index + 1].timestamp <= time) {
            this.index++;
        }
        return this.snapshots[this.index].valueAt(time);
    }

    addSnapshot(slope: BN, bias: BN, timestamp: number) {
        this.snapshots.push(new VeBalanceSnapshot(slope, bias, timestamp));
    }
}

// PoolData[pool][user] = UserVeBalanceList
export type PoolsData = Record<string, Record<string, UserVeBalanceList>>;
