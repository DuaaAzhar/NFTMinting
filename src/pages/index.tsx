import { useState } from "react";
import type { NextPage } from "next";
import { useWallet , useWalletList} from "@meshsdk/react";
import { CardanoWallet } from "@meshsdk/react";
import { Transaction, Data, BlockfrostProvider, resolveDataHash, Asset,PlutusScript,resolvePlutusScriptAddress,
AssetMetadata, Action, Mint, resolvePaymentKeyHash, resolveSlotNo,  } from '@meshsdk/core';
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
  const myAddress2= "addr_test1qzxcmyxe6z4et92tuv9s5c3e57fkkqs75j73vv3vq7065tvy7xevxczvngdm7snmnz2j2fcfg9u7yepfclhpul24hv9s94arh2";
  const fortyTwoScript: PlutusScript = {
    code : '584b5849010000332233322222253353004333573466ebc008dd4240a800c00a2010264c6a600e66ae7124010f77726f6e672072656465656d6572210000849848800848800480044800480041',
    version: 'V1'
  };
  const fortyTwoAddress = resolvePlutusScriptAddress (fortyTwoScript, 0);
  const VestingScript: PlutusScript ={
    //code: '590cf3590cf00100003323322323322332232323332223233322232333333332222222232333222323333222232323322323332223233322232323322332232323333322222332233223322332233223322223232223232533530333330083333573466e1cd55cea803240004660a06eb8d5d0a8031bad357426ae8940188c98d4c128cd5ce0270258248241999ab9a3370e6aae74dd5002240004096464c6a609466ae7013812c124120cccd5cd19b8735573aa004900011980599191919191919191919191999ab9a3370e6aae754029200023333333333019335027232323333573466e1cd55cea8012400046603e60746ae854008c0b0d5d09aba25002232635305a3357380bc0b60b20b026aae7940044dd50009aba1500a33502702835742a012666aa05ceb940b4d5d0a804199aa8173ae502d35742a00e66a04e0866ae854018cd409ccd54150131d69aba150053232323333573466e1cd55cea80124000466a0426464646666ae68cdc39aab9d5002480008cd40a4cd4109d69aba150023047357426ae8940088c98d4c178cd5ce03102f82e82e09aab9e5001137540026ae854008c8c8c8cccd5cd19b8735573aa0049000119a81399a8213ad35742a004608e6ae84d5d1280111931a982f19ab9c06205f05d05c135573ca00226ea8004d5d09aba25002232635305a3357380bc0b60b20b026aae7940044dd50009aba1500433502775c6ae85400ccd409ccd54151d710009aba150023039357426ae8940088c98d4c158cd5ce02d02b82a82a09aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aab9e5001137540026ae854008c8c8c8cccd5cd19b875001480188c078c0ecd5d09aab9e500323333573466e1d400920042301d3045357426aae7940108cccd5cd19b875003480088c074c0c0d5d09aab9e500523333573466e1d4011200023020375c6ae84d55cf280311931a982899ab9c05505205004f04e04d04c135573aa00226ea8004d5d09aba25002232635304a33573809c0960920902094264c6a609266ae712401035054350004a048135573ca00226ea80044d55cf280089baa0012212330010030022001222222222212333333333300100b00a00900800700600500400300220012212330010030022001122123300100300212001122123300100300212001122123300100300212001212222300400521222230030052122223002005212222300100520011232230023758002640026aa06e446666aae7c004940388cd4034c010d5d080118019aba200203323232323333573466e1cd55cea801a4000466600e6464646666ae68cdc39aab9d5002480008cc034c0c4d5d0a80119a8098169aba135744a004464c6a606e66ae700ec0e00d80d44d55cf280089baa00135742a006666aa016eb94028d5d0a80119a807bae357426ae8940088c98d4c0cccd5ce01b81a01901889aba25001135573ca00226ea800488848ccc00401000c00880048848cc00400c00880044cd54005d73ad112232230023756002640026aa06244646666aae7c008940248cd4020cd540c4c018d55cea80118029aab9e500230043574400605c26ae840044488008488488cc00401000c48004488c8c8cccd5cd19b875001480008d4020c014d5d09aab9e500323333573466e1d4009200225008232635302a33573805c05605205004e26aae7540044dd5000890911801001889100089000919191999ab9a3370e6aae7540092000233006300735742a0046eb4d5d09aba25002232635302433573805004a04604426aae7940044dd500091091980080180110009191999ab9a3370e6aae75400520002375c6ae84d55cf280111931a981019ab9c02402101f01e1375400224464646666ae68cdc3a800a40084a00e46666ae68cdc3a8012400446a014600c6ae84d55cf280211999ab9a3370ea00690001280511931a981199ab9c02702402202102001f135573aa00226ea8004484888c00c0104488800844888004480048c8cccd5cd19b8750014800880188cccd5cd19b8750024800080188c98d4c06ccd5ce00f80e00d00c80c09aab9d37540022440042440024002464646464646666ae68cdc3a800a4018401646666ae68cdc3a80124014401a46666ae68cdc3a801a40104660166eb8d5d0a8029bad357426ae8940148cccd5cd19b875004480188cc034dd71aba15007375c6ae84d5d1280391999ab9a3370ea00a9002119809180a1aba15009375c6ae84d5d1280491999ab9a3370ea00c90011180a180a9aba135573ca01646666ae68cdc3a803a400046026602c6ae84d55cf280611931a981019ab9c02402101f01e01d01c01b01a019018135573aa00826aae79400c4d55cf280109aab9e500113754002424444444600e01044244444446600c012010424444444600a010244444440082444444400644244444446600401201044244444446600201201040024646464646666ae68cdc3a800a400446660106eb4d5d0a8021bad35742a0066eb4d5d09aba2500323333573466e1d400920002300a300b357426aae7940188c98d4c044cd5ce00a80900800780709aab9d5003135744a00226aae7940044dd5000909118010019110911998008028020019000919191999ab9a3370ea0029001118031bae357426aae79400c8cccd5cd19b875002480008c020dd71aba135573ca008464c6a601666ae7003c0300280240204d55cea80089baa001212230020032122300100320011122232323333573466e1cd55cea80124000466aa016600c6ae854008c014d5d09aba25002232635300833573801801200e00c26aae7940044dd5000a4c24002400222442466002006004224002920103505431002212330010030022001112323001001223300330020020013322333222333322223322332233223332223322332233223333222233223232323322323332222223235302a0035335302753353027332235301a002222222222253353501133355301412001335016225335350130022100310015012253353034333573466e3c0300040d80d44d40500045404c00c840d840d14004d4c0500108800840a44cd5ce24811f62656e65666963696172792773207369676e6174757265206d697373696e6700028153353027333222353502000222353502600222353502400522353502a0022253335301b333501700b0060021533530320011533530320051333501600b00300710331333501600b00300710331333501600b00300733333333500f22333573466e1c0080040ac0a8894cd4c0a4ccd5cd19b8700200102b02a1015153353029333573466e240080040ac0a8404c405088ccd5cd19b8800200102b02a22333573466e240080040ac0a888ccd5cd19b8900200102a02b22333573466e200080040a80ac894cd4c0a4ccd5cd19b8900200102b02a100110022253353029333573466e240080040ac0a840084004cd4078cd4088d4098d4c050010880040a4cd408140900a4d4c0614004888888888801040a44cd5ce24914646561646c696e65206e6f7420726561636865640002810281353015001220021212230020031122001120013200132323001001223300330020020012211222533535017001135350060032200122133353500800522002300400233355300712001005004001122123300100300212001122235350170022235350190032253335300c33350080070040021533530230031001102510241025122232323232533353501e00621533353501f0062153335350200082130044984c00d26153335350200072130044984c00d261010100e1533353501f0072130044984c00d261533353501f0062130044984c00d26100f1533353501e0052100d100e100c1533353501e00521533353501f0072130054984c011261533353501f0062130054984c01126100f100d1533353501e0062130054984c011261533353501e0052130054984c01126100e2533353501e00521533353501f00721533353502000721333500b00a002001161616100e1533353501e00621533353501f00621333500a009002001161616100d100c2533353501d00421533353501e00621533353501f00621333500a009002001161616100d1533353501d00521533353501e005213335009008002001161616100c100b2533353501c00321533353501d00521533353501e005213335009008002001161616100c1533353501c00421533353501d004213335008007002001161616100b100a2533353501b00221533353501c00421533353501d004213335008007002001161616100b1533353501b00321533353501c003213335007006002001161616100a100912353500200122222222007122222222123333333300100900800700600500400300212001122200312220021222001200122123300100300220012212330010030022001222222222212333333333300100b00a0090080070060050040030022001112200212212233001004003120011221233001003002120011221233001003002120011221233001003002120011212223003004112220021122200112001122002122001200112001200101',
      code: '590bb2590baf0100003323233223322323233322232333222323333333322222222323332223233332222323233223233322232333222323233223322323233333222223322332233223322332233222222323253353031333006375a00a6666ae68cdc39aab9d37540089000102491931a982419ab9c04c0490470463333573466e1cd55cea8012400046601264646464646464646464646666ae68cdc39aab9d500a480008cccccccccc05ccd40948c8c8cccd5cd19b8735573aa004900011980e981c1aba15002302a357426ae8940088c98d4c160cd5ce02e02c82b82b09aab9e5001137540026ae854028cd4094098d5d0a804999aa8163ae502b35742a010666aa058eb940acd5d0a80399a8128209aba15006335025335505204a75a6ae854014c8c8c8cccd5cd19b8735573aa0049000119a80f9919191999ab9a3370e6aae7540092000233502733504075a6ae854008c114d5d09aba25002232635305c3357380c00ba0b60b426aae7940044dd50009aba150023232323333573466e1cd55cea80124000466a04a66a080eb4d5d0a80118229aba135744a004464c6a60b866ae7018017416c1684d55cf280089baa001357426ae8940088c98d4c160cd5ce02e02c82b82b09aab9e5001137540026ae854010cd4095d71aba15003335025335505275c40026ae854008c0dcd5d09aba2500223263530543357380b00aa0a60a426ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226aae7940044dd50009aba150023232323333573466e1d400520062301c3039357426aae79400c8cccd5cd19b875002480108c06cc10cd5d09aab9e500423333573466e1d400d20022301b302e357426aae7940148cccd5cd19b875004480008c078dd71aba135573ca00c464c6a609e66ae7014c14013813413012c1284d55cea80089baa001357426ae8940088c98d4c120cd5ce026024823823082409931a982399ab9c49010350543500048046135573ca00226ea80048848cc00400c0088004888888888848cccccccccc00402c02802402001c01801401000c00880048848cc00400c008800448848cc00400c0084800448848cc00400c0084800448848cc00400c00848004848888c010014848888c00c014848888c008014848888c004014800448c88c008dd6000990009aa81a911999aab9f0012500e233500d30043574200460066ae880080cc8c8c8c8cccd5cd19b8735573aa006900011998039919191999ab9a3370e6aae754009200023300d303135742a00466a02605a6ae84d5d1280111931a981b99ab9c03b038036035135573ca00226ea8004d5d0a801999aa805bae500a35742a00466a01eeb8d5d09aba25002232635303333573806e06806406226ae8940044d55cf280089baa00122212333001004003002200122123300100300220011335500175ceb44488c88c008dd5800990009aa81791191999aab9f0022500923350083355031300635573aa004600a6aae794008c010d5d100181709aba10011122002122122330010040031200112232323333573466e1d400520002350083005357426aae79400c8cccd5cd19b87500248008940208c98d4c0a8cd5ce01701581481401389aab9d500113754002242446004006224400224002464646666ae68cdc39aab9d5002480008cc018c01cd5d0a8011bad357426ae8940088c98d4c090cd5ce01401281181109aab9e50011375400244246600200600440024646666ae68cdc39aab9d5001480008dd71aba135573ca004464c6a604066ae7009008407c0784dd500089119191999ab9a3370ea00290021280391999ab9a3370ea004900111a80518031aba135573ca00846666ae68cdc3a801a40004a014464c6a604666ae7009c09008808408007c4d55cea80089baa00112122230030041122200211222001120012323333573466e1d40052002200623333573466e1d400920002006232635301b33573803e03803403203026aae74dd50008910010910009000919191919191999ab9a3370ea0029006100591999ab9a3370ea0049005100691999ab9a3370ea00690041198059bae35742a00a6eb4d5d09aba2500523333573466e1d4011200623300d375c6ae85401cdd71aba135744a00e46666ae68cdc3a802a400846602460286ae854024dd71aba135744a01246666ae68cdc3a8032400446028602a6ae84d55cf280591999ab9a3370ea00e900011809980b1aba135573ca018464c6a604066ae7009008407c07807407006c0680640604d55cea80209aab9e5003135573ca00426aae7940044dd500090911111118038041109111111198030048041091111111802804091111110020911111100191091111111980100480411091111111980080480410009191919191999ab9a3370ea002900111998041bad35742a0086eb4d5d0a8019bad357426ae89400c8cccd5cd19b875002480008c028c02cd5d09aab9e5006232635301133573802a02402001e01c26aae75400c4d5d1280089aab9e5001137540024244600400644424466600200a0080064002464646666ae68cdc3a800a40044600c6eb8d5d09aab9e500323333573466e1d4009200023008375c6ae84d55cf280211931a980599ab9c00f00c00a009008135573aa00226ea80048488c00800c8488c00400c800444888c8c8cccd5cd19b8735573aa0049000119aa80598031aba150023005357426ae8940088c98d4c020cd5ce00600480380309aab9e5001137540029309000900088910919800801801089000a490350543100112323001001223300330020020013322333222333322223322332233223322332233332222332232323222235301e0025335301b333222353501400222353501a00222353501800522353501e00222533353014333501000b0060021533530260011533530260051333500f00b00300710271333500f00b00300710271333500f00b00300733333333500822333573466e1c00800407c078894cd4c074ccd5cd19b8700200101f01e100e15335301d333573466e2400800407c0784030403488ccd5cd19b8800200101f01e22333573466e2400800407c07888ccd5cd19b8900200101e01f22333573466e2000800407807c894cd4c074ccd5cd19b8900200101f01e10011002225335301d333573466e2400800407c07840084004cd4048cd4058d406800c074cd40514060074d4c03cd4c03400488008888888888801040744cd5ce24914646561646c696e65206e6f7420726561636865640001c122235350120022235350140032253335300c333500800700400215335301e00310011020101f1020122232323232533353501900621533353501a00621533353501b0082130044984c00d261533353501b0072130044984c00d261010100e1533353501a0072130044984c00d261533353501a0062130044984c00d26100f153335350190052100d100e100c1533353501900521533353501a0072130054984c011261533353501a0062130054984c01126100f100d153335350190062130054984c01126153335350190052130054984c01126100e2533353501900521533353501a00721533353501b00721333500b00a002001161616100e1533353501900621533353501a00621333500a009002001161616100d100c2533353501800421533353501900621533353501a00621333500a009002001161616100d15333535018005215333535019005213335009008002001161616100c100b25333535017003215333535018005215333535019005213335009008002001161616100c15333535017004215333535018004213335008007002001161616100b100a25333535016002215333535017004215333535018004213335008007002001161616100b15333535016003215333535017003213335007006002001161616100a10091235350020012222222200712222222212333333330010090080070060050040030021200112220031222002122200120012212330010030022001222222222212333333333300100b00a00900800700600500400300220011221233001003002120011221233001003002120011221233001003002120011212223003004112220021122200112001122002122001200112001200101',
    version: 'V1'
  }
  const VestingAddress= resolvePlutusScriptAddress (VestingScript, 0);
async function connectWallet() {
  const _wallet=await window.cardano['yoroi'].enable();
   //const _wallet = await BrowserWallet.enable('Yoroi');
   console.log("Wallet connected= ",_wallet);
 }  
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

async function sendLovelaceToAddr(address : string, lovelace: string) {
  if (wallet) {
    const tx= new Transaction ({initiator :wallet})
    .sendLovelace(
      address,
      lovelace,
    )
    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);
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

async function lockADA() {
  if (wallet)
  { 
    console.log("FortyTwoScript address= ",fortyTwoAddress);
    //scriptAddress= addr_test1wzh8k89fy4d2gqqzwrecuhh86ads4ay4tpnpyw6a0994fuqwkte0x
    //sendLovelace(fortyTwoAddress, '1000000');
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
  "name": "MeshByContract",
  "image": "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
  "mediaType": "image/jpg",
  "description": "This NFT is minted by Duaa through smartContract"
};
const asset1: Mint = {
  assetName: 'MeshByContract',
  assetQuantity: '1',
  metadata: assetMetadata1,
  label: '721',
  recipient: myAddress,
};
const assetMetadata2: AssetMetadata = {
  "name": "TokenByContract",
  "description": "This Token is minted by Duaa through smart contract"
};
const asset2: Mint ={
  assetName: 'TokenByContract',
  assetQuantity: '10',
  metadata: assetMetadata2,
  label: '20',
  recipient: myAddress
};

tx.mintAsset(
  script,
  asset2,
  redeemer,
);

const unsignedTx = await tx.build();
const signedTx = await wallet.signTx(unsignedTx);
const txHash = await wallet.submitTx(signedTx);
console.log("txHash of Minting tokens= ",txHash);
}
async function getSlotNumberInMintutes(afterMinutes:any) {
  let MintsFromNow = new Date();
      MintsFromNow.setMinutes(MintsFromNow.getMinutes()+ afterMinutes);
      console.log("MintsFromNow= ",MintsFromNow);
      const slot = resolveSlotNo('preview', MintsFromNow.getTime());
      console.log("Slot numnber= ",slot);
      return slot;
}

async function Vesting() {
  
  if (wallet)
    {
      console.log("Vesting Script address= ",VestingAddress);
      //const payPubKeyHash= resolvePaymentKeyHash(myAddress2);
      //console.log("Payment Public Key Hash= ", payPubKeyHash);
      //Vesting1 Script address=  addr_test1wza6dh527avqqdwws5cka9gs5qa45hcvjkg8vx7drrh4cfc23u2qf

      //const slotNumber= await getSlotNumberInMintutes(5);
      //const slotNumber= "1676391526000";
      // const myDatum : Data = new Map<Data, Data>();
      // myDatum.set('beneficiary', payPubKeyHash);
      // myDatum.set('deadline', slotNumber);
      const myDatum: Data= 1676554746000;
      //console.log("My datum= ",myDatum);
      const myDatumHash = resolveDataHash(myDatum);
      console.log("datum hash= ",myDatumHash );
      //datum hash= e2bd09b99d5924e111b54752c88dcfa93b04cb24f66978258b3aad9051315a96
      //025343e7b8d3440a1c42689c8043bc9935f405710bfe3c2e38d1a290c87f502a
      const tx= new Transaction ({initiator: wallet})
      .sendLovelace({
        address: VestingAddress,
        datum: {
          value: myDatum
        },
      },
      '1000000',
      );
      // datumHash= 4235d467c2d494a0e81fe07691d21191da63f5fb610909a4e3d1d2c58cbcd6d7
      const unsignedTx= await tx.build();
      const signedTx= await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      console.log("txHash of locking in Vesting= ",txHash);
    }
}

async function UnVest() {
  const assets = [
    {
      unit: "lovelace",
      quantity: 1000000,
    },
  ];  
  const myDatum: Data= 1676554746000;
  const dataHash = resolveDataHash(myDatum);
  const assetUTXO = await _getAssetUTXO ({
    scriptAddress: VestingAddress,
    asset: assets[0].unit,
    datum: myDatum,
  });
  console.log("asset UTXO = ", assetUTXO);

  const tx =  new Transaction ({initiator:wallet})
    .redeemValue({
      value: assetUTXO,
      script:VestingScript,
      datum: dataHash ,
})
    .sendValue(myAddress, assetUTXO)      
    
  const unsignedTx = await tx.build();
  const signedTx = await wallet.signTx(unsignedTx, true);
  const txHash = await wallet.submitTx(signedTx);  
  console.log ("txHash of unlocking= ", txHash);
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

        {/* Lock ADA */}
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
          Lock ADA
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

        {/* Lock in vesting contract */}
        <h1>Lock in Vesting</h1>
        <button
          type="button"
          onClick={() => Vesting()}
          disabled={ loading}
          style={{
            margin: "8px",
            backgroundColor: loading ? "orange" : "grey",
          }}
        >
          Lock In Vesting
        </button>

        {/* UnLock from vesting contract */}
        <h1>UnLock from Vesting</h1>
        <button
          type="button"
          onClick={() => UnVest()}
          disabled={ loading}
          style={{
            margin: "8px",
            backgroundColor: loading ? "orange" : "grey",
          }}
        >
          UnLock from Vesting
        </button>

      </>

    )}
  </div>
);
};

export default Home;
