
import { useState } from "react";
import type { NextPage } from "next";
import { useWallet , useWalletList} from "@meshsdk/react";
import { CardanoWallet } from "@meshsdk/react";
import { Transaction, Data, BlockfrostProvider, resolveDataHash, Asset,PlutusScript,resolvePlutusScriptAddress,
AssetMetadata, Action, Mint,  } from '@meshsdk/core';
import { BrowserWallet } from '@meshsdk/core';
import { Lovelace } from "lucid-cardano";


const Home: NextPage = () => {
  const wallets = useWalletList();
  const { connected, wallet } = useWallet();
  //const {wallet, setWallet} = connectWallet();
  const [assets, setAssets] = useState <null | any>(null);
  const [address, setAddress] = useState <null | any>(null);
  const [balance, setBalance] = useState <null | any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const blockfrost = new BlockfrostProvider('previewcnO9ZPJOCwjKFTB30KxDHb3Ax2wSW9rc');
  const myAddress= "addr_test1qrfc7cl7xvrwta37pc5kj86skq6hutmd264330aan2tmctl9x45vk80z57z2mrr86vnnq478z3rj22xay7cfe3mg0vnqeyfm5a";
  const fortyTwoScript: PlutusScript = {
    code : '584b5849010000332233322222253353004333573466ebc008dd4240a800c00a2010264c6a600e66ae7124010f77726f6e672072656465656d6572210000849848800848800480044800480041',
    version: 'V1'
  };
  const fortyTwoAddress = resolvePlutusScriptAddress (fortyTwoScript, 0);

async function getAssets() {
  if (wallet){
    setLoading(true);
    const _assets = await wallet.getAssets();
    setAssets(_assets);
    setLoading(false);
  }
}
async function getAddress() {
  if (wallet){
    setLoading(true);
    const _address = await wallet.getChangeAddress();
    setAddress(_address);
    setLoading(false);
  }
}
async function getBalance() {
  if (wallet){
    setLoading(true);
    const _balance = await wallet.getLovelace();
    setBalance(_balance);
    setLoading(false);
  }
}

async function lockADA() {
    if (wallet)
    { 
      const fortyTwoScript: PlutusScript = {
        code : '584b5849010000332233322222253353004333573466ebc008dd4240a800c00a2010264c6a600e66ae7124010f77726f6e672072656465656d6572210000849848800848800480044800480041',
        version: 'V1'
      };
      const fortyTwoAddress = resolvePlutusScriptAddress (fortyTwoScript, 0);
      console.log("FortyTwoScript address= ",fortyTwoAddress);
      //scriptAddress= addr_test1wzh8k89fy4d2gqqzwrecuhh86ads4ay4tpnpyw6a0994fuqwkte0x
      const tx = new Transaction ({initiator : wallet})
        .sendLovelace({
          address: fortyTwoAddress,
          datum: {
            value :0,
          },
        },
        '1000000'
        )
        const unsignedTx = await tx.build();
        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);
        console.log("txHash= ", txHash);
    }
}

async function _getAssetUTXO({scriptAddress, asset, datum}: any) {
  const utxos= await blockfrost.fetchAddressUTxOs (
    scriptAddress,
    asset
  );
  console.log("UTXOS====>>>",utxos);
  const dataHash = resolveDataHash(datum);
  console.log("Datum Hash", dataHash);
  let utxo = utxos.find ((utxo:any)=>{
    console.log("Output of assetUTXO= ",utxo.output.dataHash == dataHash);
    return utxo.output.dataHash == dataHash;
  });

  return utxo;
  
}
async function unLockADA() {
  const assets = [
    {
      unit: "lovelace",
      quantity: 1000000,
    },
  ];  
  
  const assetUTXO = await _getAssetUTXO ({
    scriptAddress: 'addr_test1wzh8k89fy4d2gqqzwrecuhh86ads4ay4tpnpyw6a0994fuqwkte0x',
    asset: assets[0].unit,
    datum: 0,
  });
  console.log("asset UTXO = ", assetUTXO);
  
  const fortyTwoScript: PlutusScript = {
    code : '584b5849010000332233322222253353004333573466ebc008dd4240a800c00a2010264c6a600e66ae7124010f77726f6e672072656465656d6572210000849848800848800480044800480041',
    version: 'V1'
  };
  
  const myRedeemer: Partial<Action> = {
    data: 42,
  };
  const tx =  new Transaction ({initiator:wallet})
    .redeemValue({
      value: assetUTXO,
      script:fortyTwoScript,
      datum: 0 , 
      redeemer: myRedeemer,
})
    .sendValue(myAddress, assetUTXO)      
    
  const unsignedTx = await tx.build();
  const signedTx = await wallet.signTx(unsignedTx, true);
  const txHash = await wallet.submitTx(signedTx);  
  console.log ("txHash of unlocking= ", txHash);
}

async function lockAsset() {
  
  
    if (wallet)
      { 
        console.log("FortyTwoScript address= ",fortyTwoAddress);
        //scriptAddress= addr_test1wzh8k89fy4d2gqqzwrecuhh86ads4ay4tpnpyw6a0994fuqwkte0x
  
        const tx = new Transaction({ initiator: wallet })
        .sendAssets(
          {
            address: fortyTwoAddress,
            datum: {
              value: 0,
            },
          },
          [
            {
              unit: "65b00f2037ae0e74172da23589a121a34861bfe51d4c436a21483cf56d794e465432",
              quantity: "1",
            },
          ],
        );
  const unsignedTx = await tx.build();
  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);
  console.log("txHash of locking of asset: ", txHash);     
  }
  }
  
  async function unLockAsset() {
    
    // fetch input UTXO
    const assetUtxo = await _getAssetUTXO({
      scriptAddress: 'addr_test1wzh8k89fy4d2gqqzwrecuhh86ads4ay4tpnpyw6a0994fuqwkte0x',
      asset: '65b00f2037ae0e74172da23589a121a34861bfe51d4c436a21483cf56d794e465432',
      datum: 0,
    });
    const myRedeemer: Partial<Action> = {
      data: 42,
    };
    // create the unlock asset transaction
    const tx = new Transaction({ initiator: wallet })
      .redeemValue({
        value: assetUtxo,
        script: {
          version: 'V1',
          code : '584b5849010000332233322222253353004333573466ebc008dd4240a800c00a2010264c6a600e66ae7124010f77726f6e672072656465656d6572210000849848800848800480044800480041',
        },
        datum: 0,
        redeemer: myRedeemer
      })
      .sendValue(myAddress, assetUtxo) // address is recipient address
      .setRequiredSigners([myAddress]);
    
    const unsignedTx = await tx.build();
    // note that the partial sign is set to true
    const signedTx = await wallet.signTx(unsignedTx, true);
    const txHash = await wallet.submitTx(signedTx);
    console.log("txHash of unlocking Asset: ",txHash);
  }


return (
  <div>
    <h1>Connect Wallet</h1>
    <CardanoWallet />
    {connected && (
      <>
      {/* Get Assets */}
        <h1>Get Wallet Assets</h1>
        {assets ? (
          <pre>
            <code className="language-js">
              {JSON.stringify(assets, null, 2)}
            </code>
          </pre>
        ) : (
          <button
            type="button"
            onClick={() => getAssets()}
            disabled={loading}
            style={{
              margin: "8px",
              backgroundColor: loading ? "orange" : "grey",
            }}
          >
            Get Wallet Assets
          </button>
        )}
          {/* Get Address  */}
         <h1>Get Wallet Address</h1>
        {address ? (
          <pre>
            <code className="language-js">
              {JSON.stringify(address, null, 2)}
            </code>
          </pre>
        ) : (
          <button
            type="button"
            onClick={() => getAddress()}
            disabled={loading}
            style={{
              margin: "8px",
              backgroundColor: loading ? "orange" : "grey",
            }}
          >
            Get Wallet Address
          </button>
        )}
        
        {/* Get Balance */}
        <h1>Get Wallet Balance</h1>
        {balance ? (
          <pre>
            <code className="language-js">
              {JSON.stringify(balance, null, 2)}
            </code>
          </pre>
        ) : (
          <button
            type="button"
            onClick={() => getBalance}
            disabled={loading}
            style={{
              margin: "8px",
              backgroundColor: loading ? "orange" : "grey",
            }}
          >
            Get Wallet Balance
          </button>
        )}
      
        {/* Lock Assets */}
        <h1>Lock ADA</h1>
        <button
          type="button"
          onClick={() => lockADA()}
          disabled={ loading}
          style={{
            margin: "8px",
            backgroundColor: loading ? "orange" : "grey",
          }}
        >
          Lock Assets
        </button>

        {/* UnLock ADA */}
        <h1>UnLock ADA</h1>
        <button
          type="button"
          onClick={() => unLockADA()}
          disabled={ loading}
          style={{
            margin: "8px",
            backgroundColor: loading ? "orange" : "grey",
          }}
        >
          UnLock ADA
        </button> 

        {/* Lock Asset */}
        <h1>Lock Asset</h1>
        <button
          type="button"
          onClick={() => lockAsset()}
          disabled={ loading}
          style={{
            margin: "8px",
            backgroundColor: loading ? "orange" : "grey",
          }}
        >
          Lock Asset
        </button>

        {/* {Unlock Asser} */}
        <h1>UnLock Asset</h1>
        <button
          type="button"
          onClick={() => unLockAsset()}
          disabled={ loading}
          style={{
            margin: "8px",
            backgroundColor: loading ? "orange" : "grey",
          }}
        >
          UnLock Asset
        </button>   
      </>

    )}
  </div>
);
};

export default Home;