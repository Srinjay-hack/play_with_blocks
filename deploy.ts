//asyc [javascript]

//Synchonous exaple;
//1. Put popcorn;
//2. Wait for the popcorn to get cooked;
//3. Pour drinks;

//Asynchronous example;
//1. Put popcorn;
//2. Pour drinks;
//3. Wait for the popcorn to get cooked;


// async function watchMovie(){
//    await cook();
//    await Serve();
// } 
// function cook(){
//    return Promise();
// }

// const ethers=require("ethers"); 
// const fs=require("fs-extra");
// require("dotenv").config();

import {ethers} from "ethers";
import * as fs from "fs-extra";
import "dotenv/config"

async function main(){
   const provider=new ethers.providers.JsonRpcBatchProvider(process.env.RPC_URL!);
   const wallet=new ethers.Wallet(process.env.PRIVATE_KEY!,provider);
   const encryptedJson=fs.readFileSync("./.encrypted.json","utf8");
   // let wallet=new ethers.Wallet.fromEncryptedJsonSync(
   //    encryptedJson,
   //    process.env.PRIVATE_KEY_PASSWORD!
   // );
   //wallet=await wallet.connect(provider);
   const abi=fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi","utf8");
   const binary=fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin","utf8");
   const contractFactory=new ethers.ContractFactory(abi,binary,wallet);
   console.log("DEploying Pleasee Wait");
   
   const contract=await contractFactory.deploy();
   await contract.deployTransaction.wait(1);
   console.log(`Contract Address: ${contract.address}`);
   //const transactionReceipt=await contract.deployTransaction.wait(1);
   // console.log("Here is the deployment transaction: ");
   // console.log(contract.deployTransaction);
   // console.log("Here is the transaction receipt: ");
   // console.log(transactionReceipt);

   const currentFavouriteNumber=await contract.retrieve();
   console.log(`Current FAVOURITE Number: ${currentFavouriteNumber.toString()}`);
   const transactionResponse=await contract.store("7");
   const transactionReceipt=await transactionResponse.wait(1);
   const updatedFavouriteNumber=await contract.retrieve();
   console.log(`Updated favourite number is:${updatedFavouriteNumber}`);

   // console.log("Lets deploy with only transaction data");
   // const nonce=await wallet.getTransactionCount();
   // const tx={
   //    nonce:nonce,
   //    gasPrice:20000000000,
   //    gasLimit:1000000,
   //    to:null,
   //    value:0,
   // data:""
   //    chainId:1337,
   // };
   // const signedTransaction=await wallet.signTransaction(tx);
   // console.log(signedTransaction);
   // const sentTxResponse=await wallet.sendTransaction(tx);
   // await sentTxResponse.wait(1);
   // console.log(sentTxResponse);
};

main()
.then(()=>process.exit(0))
.catch((error)=>{
   console.error(error);
   process.exit(1);
});

