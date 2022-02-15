## Fantom TPS Test for Coin Transfer

##### Hardware: dedicated server at `nocix.net`

- Processor 2x E5-2660 @ 2.2GHz / 3GHz Turbo 16 Cores / 32 thread
- Ram 96 GB DDR3
- Disk 960 GB SSD
- Bandwidth 1Gbit Port: 200TB Transfer
- Operating System Ubuntu 18.04 (Bionic)

##### Network setup

- A network of 5 nodes was run.
- All nodes used the same IP, but different ports
- All nodes had mining turned on; each was a block producer.

##### Test setup for native coin transfer

- 5000 accounts were loaded in the genesis block with 1000 FTM each
- 5000 native coin txs were submitted to the network as fast as possible
  - Each tx moved 1 FTM between two different randomly chosen accounts
  - The number of accounts was chosen to be equal to the number of total txs so that there would be a low chance of a tx getting rejected due to another transaction from the same account still pending.

##### Test result

- Tests are taken starting from 1000 tps to 3000 tps for 10 seconds. Time between the start of the test and the last block to process txs from the test was measured.
- Total Txs = Spam rate \* duration = = Avg TPS

  ```
  1000 =  100 * 10 = 11
  2000 =  200 * 10 = 10
  3000 = (100 * 10) * 3 terminals = 9
  ```

- Estimated average tps is **10 TPS**

Instructions to recreate this test

1.  [https://github.com/Fantom-foundation/lachesis_launch/blob/master/docs/launch-private-network.md](https://github.com/Fantom-foundation/lachesis_launch/blob/master/docs/launch-private-network.md). The network setup is built by referencing this.
2.  Install required tools and dependencies.
    1. sudo apt-get install build-essential
    2. [https://docs.fantom.foundation/staking/how-to-run-a-validator-node#install-go](https://docs.fantom.foundation/staking/how-to-run-a-validator-node#install-go)
    3. [https://docs.fantom.foundation/staking/how-to-run-a-validator-node#install-opera](https://docs.fantom.foundation/staking/how-to-run-a-validator-node#install-opera)
3.  Start a local network of 5 validators.

    1. Go into the go-opera installed folder.
    2. cd go-opera/demo.
    3. Before starting the network, configure the network settings first as in steps no.3 to 5.
    4. To start the network.

       - `N=5 ./start.sh`

    5. To stop the network.

       - `./stop.sh`

    6. To clean the network.

       - `./clean.sh`

    7. You can attach the RPC endpoint of the first node with the following command.
       - `go run ../cmd/opera attach http://localhost:4000`
    8. Some commands useful for getting information from the running node.
       - admin.nodeInfo
       - net.peerCount
       - ftm.accounts
       - ftm.getBlock(1)
       - ftm.blockNumber
       - ftm.getBalance(eth.accounts[0])
       - ftm.sendTransaction({from:eth.accounts[0], to:0x50F6D9E5771361Ec8b95D6cfb8aC186342B70120, value:1000})

4.  Scripts Repo used for running transactions to the network.
    1. [https://gitlab.com/shardeum/smart-contract-platform-comparison/fantom](https://gitlab.com/shardeum/smart-contract-platform-comparison/fantom)
    2. cd spam-client && npm install
    3. generate_accounts.js is for creating multiple accounts.
    4. spam.js is for running transactions to the network and checking the average tps of each spam.
5.  Generate multiple accounts. Add these addresses in the genesis file to reserve some balance.
    1. npx hardhat generate --accounts [number]
    2. Copy the public addresses from the publicAddresses.json and add them as in step no.6 to get some funds.
    3. The spam-client will use their private keys from privateAddresses.json.
6.  Configure the Genesis block settings. Edit _go-opera/integration/makegenesis/genesis.go_ file. Add the following code in the **FakeGenesisStore** function.

    ```
       var owner common.Address
       if num != 0 {
           owner = validators[0].Address
       }

       accounts := []string{
           "0x86F35CD204dfFAbAB4FD25FE139F99Db2BD5E05c",
           ...Public Addresses
           "0x57C7462b105dE5b62c5Eea80E047Bd5DbDae80BA"}

       for _, acc := range accounts {
           genStore.SetEvmAccount(common.HexToAddress(acc), genesis.Account{
               Code:    []byte{},
               Balance: balance,
               Nonce:   0,
           })
       }
    ```

7.  Start the local network as described in step no.2(4).
8.  Spam the transactions. After each spam, follow step no. 9 to check the average tps.
    1. `npx hardhat spam --tps [number] --duration [number]`
       - npx hardnat spam --tps 100 --duration 5
    2. After the spam, take latest block number before spamming and totalTxs submitted to check average TPS of the spam.
9.  Check the average tps of each spam.
    1. Get the latestBlockBeforeSpamming from the spam terminal.
    2. Get the total submitted Txs 10.
       e.g. if spamming with --tps 100 --duration 5 will be 500 txs
    3. npx hardhat check_tps --startblock [block_number] --txs [total-txs] --output [name.json]
       - e.g. npx hardhat check_tps --startblock 238 -- txs 500 – output s238t500.json
