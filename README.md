# Pendle Merkle Script

This repository aims to provide scripts for querying an address' merkle reward with details `([pool, wtime] => reward)`.

## Recommendation

We strongly recommend you to make a fork or a clone of this git repository which you can easily receive updates from the root repo. 

The main script you will be work with is `scripts/main.ts`, with its dependency on `scripts/helper` and `scripts/data`. 

Pendle will constantly update `scripts/data` every distribution and possibly `scripts/helper` if any change is made (unlikely). So it is also recommended to not make any change to these files on your side.


## Execute scripts

The POC can be found in `scripts/main.ts`, where it queries the rewards for `ACCOUNT` splitted by pools and weeks. To run the script, make sure you changed `ACCOUNT` to your desired address and run:

```
yarn hardhat run scripts/main.ts 
```