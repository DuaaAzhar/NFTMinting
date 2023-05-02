import { useState } from "react";
import type { NextPage } from "next";
import { useWallet , useWalletList} from "@meshsdk/react";
import { CardanoWallet } from "@meshsdk/react";
import { Transaction, Data, BlockfrostProvider, resolveDataHash, Asset,PlutusScript,resolvePlutusScriptAddress,
AssetMetadata, Action, Mint, resolvePaymentKeyHash, resolveSlotNo,  } from '@meshsdk/core';
import { BrowserWallet } from '@meshsdk/core';
//import { Lovelace } from "lucid-cardano";

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
  const myAddress2= "addr_test1qzxcmyxe6z4et92tuv9s5c3e57fkkqs75j73vv3vq7065tvy7xevxczvngdm7snmnz2j2fcfg9u7yepfclhpul24hv9s94arh2";
  

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


async function transferAssets() {
    const nativeAssets = [
      {
        unit : '65b00f2037ae0e74172da23589a121a34861bfe51d4c436a21483cf56d794e4654',
        quantity: '1'
      },
      {
        unit : '65b00f2037ae0e74172da23589a121a34861bfe51d4c436a21483cf56d794e465432',
        quantity : '1'
      }
    ];
    const recipient= {address: 'addr_test1qzxcmyxe6z4et92tuv9s5c3e57fkkqs75j73vv3vq7065tvy7xevxczvngdm7snmnz2j2fcfg9u7yepfclhpul24hv9s94arh2'};
    if (wallet){
      let assets : Asset[] = [];
      for (const asset of nativeAssets){
          let thisAsset = {
            unit : '',
            quantity : '1',
          };
          assets.push(thisAsset);
      }
      const tx = new Transaction ({initiator:wallet})
      .sendAssets(recipient.address, assets);
      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
    }
}
const myScript: PlutusScript = {
  code : '4e4d01000033222220051200120011',
  version: 'V1'
};

async function _getAssetUTXO({scriptAddress, asset, datum}: any) {
  const utxos= await blockfrost.fetchAddressUTxOs (
    scriptAddress,
      asset,
  );
  console.log("UTXOS====>>>",utxos);
  const datumHash = resolveDataHash(datum);
  console.log("Datum Hash", datumHash);
  let utxo = utxos.find ((utxo:any)=>{
    console.log("Output of assetUTXO= ",utxo.output.dataHash == datumHash);
    return utxo.output.dataHash == datumHash;
  });

  return utxo;
  
}


async function mintToken() {
  const plutusMintingScriptCbor = "5907ca5907c7010000323233223322323233322232333222323333333322222222323332223233332222323233223233322232333222323233223322323233333222223322332233223322332233222232325335302f320323333573466e1cd55cea8012400046600e64646464646464646464646666ae68cdc39aab9d500a480008cccccccccc054cd408c8c8c8cccd5cd19b8735573aa004900011980d981b1aba150023028357426ae8940088c98d4c158cd5ce02d02b82a82a09aab9e5001137540026ae854028cd408c090d5d0a804999aa8153ae502935742a010666aa054eb940a4d5d0a80399a81181f9aba15006335023335505004875a6ae854014c8c8c8cccd5cd19b8735573aa0049000119a80e9919191999ab9a3370e6aae7540092000233502533503e75a6ae854008c10cd5d09aba25002232635305a3357380bc0b60b20b026aae7940044dd50009aba150023232323333573466e1cd55cea80124000466a04666a07ceb4d5d0a80118219aba135744a004464c6a60b466ae7017816c1641604d55cf280089baa001357426ae8940088c98d4c158cd5ce02d02b82a82a09aab9e5001137540026ae854010cd408dd71aba15003335023335505075c40026ae854008c0d4d5d09aba2500223263530523357380ac0a60a20a026ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226aae7940044dd50009aba150023232323333573466e1d400520062301a3037357426aae79400c8cccd5cd19b875002480108c064c104d5d09aab9e500423333573466e1d400d200223019302c357426aae7940148cccd5cd19b875004480008c070dd71aba135573ca00c464c6a609a66ae7014413813012c1281241204d55cea80089baa001357426ae8940088c98d4c118cd5ce025023822822082309931a982299ab9c49010350543500046044135573ca00226ea80048848cc00400c0088004888888888848cccccccccc00402c02802402001c01801401000c00880048848cc00400c008800448848cc00400c0084800448848cc00400c0084800448848cc00400c00848004848888c010014848888c00c014848888c008014848888c004014800448c88c008dd6000990009aa81a911999aab9f0012500e233500d30043574200460066ae880080cc8c8c8c8cccd5cd19b8735573aa006900011998039919191999ab9a3370e6aae754009200023300d303135742a00466a02605a6ae84d5d1280111931a981b99ab9c03b038036035135573ca00226ea8004d5d0a801999aa805bae500a35742a00466a01eeb8d5d09aba25002232635303333573806e06806406226ae8940044d55cf280089baa00122212333001004003002200122123300100300220011335500175ceb44488c88c008dd5800990009aa81791191999aab9f0022500923350083355031300635573aa004600a6aae794008c010d5d100181709aba10011122002122122330010040031200112232323333573466e1d400520002350083005357426aae79400c8cccd5cd19b87500248008940208c98d4c0a8cd5ce01701581481401389aab9d500113754002242446004006224400224002464646666ae68cdc39aab9d5002480008cc018c01cd5d0a8011bad357426ae8940088c98d4c090cd5ce01401281181109aab9e50011375400244246600200600440024646666ae68cdc39aab9d5001480008dd71aba135573ca004464c6a604066ae7009008407c0784dd500089119191999ab9a3370ea00290021280391999ab9a3370ea004900111a80518031aba135573ca00846666ae68cdc3a801a40004a014464c6a604666ae7009c09008808408007c4d55cea80089baa00112122230030041122200211222001120012323333573466e1d40052002200623333573466e1d400920002006232635301b33573803e03803403203026aae74dd50008910010910009000919191919191999ab9a3370ea0029006100591999ab9a3370ea0049005100691999ab9a3370ea00690041198059bae35742a00a6eb4d5d09aba2500523333573466e1d4011200623300d375c6ae85401cdd71aba135744a00e46666ae68cdc3a802a400846602460286ae854024dd71aba135744a01246666ae68cdc3a8032400446028602a6ae84d55cf280591999ab9a3370ea00e900011809980b1aba135573ca018464c6a604066ae7009008407c07807407006c0680640604d55cea80209aab9e5003135573ca00426aae7940044dd500090911111118038041109111111198030048041091111111802804091111110020911111100191091111111980100480411091111111980080480410009191919191999ab9a3370ea002900111998041bad35742a0086eb4d5d0a8019bad357426ae89400c8cccd5cd19b875002480008c028c02cd5d09aab9e5006232635301133573802a02402001e01c26aae75400c4d5d1280089aab9e5001137540024244600400644424466600200a0080064002464646666ae68cdc3a800a40044600c6eb8d5d09aab9e500323333573466e1d4009200023008375c6ae84d55cf280211931a980599ab9c00f00c00a009008135573aa00226ea80048488c00800c8488c00400c800444888c8c8cccd5cd19b8735573aa0049000119aa80598031aba150023005357426ae8940088c98d4c020cd5ce00600480380309aab9e5001137540029309000900088910919800801801089000a490350543100112323001001223300330020020011";
  const script: PlutusScript ={
    code: plutusMintingScriptCbor,
    version :'V1'
  };
  const redeemer: Partial<Action> = {
  tag: 'MINT',
};

const tx = new Transaction({ initiator: wallet });

// define asset#1 metadata
const assetMetadata1: AssetMetadata = {
  "name": "myNFT",
  "image": "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
  "mediaType": "image/jpg",
  "description": "This NFT is minted by Duaa through smartContract"
};
const asset1: Mint = {
  assetName: 'myNFT',
  assetQuantity: '1',
  metadata: assetMetadata1,
  label: '721',
  recipient: myAddress,
};


tx.mintAsset(
  script,
  asset1,
  redeemer,
);

const unsignedTx = await tx.build();
const signedTx = await wallet.signTx(unsignedTx);
const txHash = await wallet.submitTx(signedTx);
console.log("txHash of Minting tokens= ",txHash);
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
       {/* Send Lovelace */}
      <h1>send lovelace</h1>
        <button
          type="button"
          //onClick={() => sendLovelace('addr_test1qzxcmyxe6z4et92tuv9s5c3e57fkkqs75j73vv3vq7065tvy7xevxczvngdm7snmnz2j2fcfg9u7yepfclhpul24hv9s94arh2', '1000000')}
          disabled={loading}
          style={{
            margin: "8px",
            backgroundColor: loading ? "orange" : "grey",
          }}
        >
          Send Lovelace
        </button>

        {/* Send Assets */}
        <h1>send Assets</h1>
        <button
          type="button"
          onClick={() => transferAssets()}
          disabled={ loading}
          style={{
            margin: "8px",
            backgroundColor: loading ? "orange" : "grey",
          }}
        >
          Send Assets
        </button>

        

         {/* MINT Assets */}
         <h1>MINT Tokens</h1>
        <button
          type="button"
          onClick={() => mintToken()}
          disabled={ loading}
          style={{
            margin: "8px",
            backgroundColor: loading ? "orange" : "grey",
          }}
        >
          Mint Tokens 
        </button>

        

      </>

    )}
  </div>
);
};

export default Home;

