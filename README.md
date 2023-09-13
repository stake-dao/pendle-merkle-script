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


## Some other notes

In case you would like to gather the datas for some old reward batch or multiple reward batches at a time. Here's how to proceed:
- Step 1: Look for the commit hash containing the reward data for your desired batch
- Step 2: Get the json file containing the swap data `scripts/data/swap-result.json` and replace it to the main branch's according path. In case you want to run multiple batches, you can merge the json files into one (respecting json convention) and it should still work.
- Step 3: Run the script