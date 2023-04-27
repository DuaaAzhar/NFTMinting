import { Button } from "@chakra-ui/react";
import { Action, Data, Wallet, resolvePaymentKeyHash } from "@martifylabs/mesh";
import {
  BlockfrostProvider,
  BrowserWallet,
  resolveDataHash,
  Transaction,
} from "@martifylabs/mesh";
import { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";

const Home: NextPage = (props) => {
  return (
    <div className="font-avenir">
      <Stake />
      <Unstake />
    </div>
  );
};

const Stake = () => {
  const [wallet, setWallet] = useState<BrowserWallet>();
  const [availableWallets, setAvailableWallets] = useState<
    Wallet[] | undefined
  >(undefined);
  const [assets, setAssets] = useState<any>();
  const [selectedAssets, setSelectedAssets] = useState<any>({});
  const [txnHash, setTxnHash] = useState<string>("");

  useEffect(() => {
    async function init() {
      setAvailableWallets(BrowserWallet.getInstalledWallets());
    }
    init();
  }, []);

  const stakeAsset = async () => {
    const addresses = await wallet?.getUsedAddresses();
    if (addresses) {
      // Create datum
      const spendingKeyHash = resolvePaymentKeyHash(addresses[0]);
      const datum: Data = { alternative: 0, fields: [spendingKeyHash] };

      // Select assets
      const assets = Object.keys(selectedAssets).map((key: any) => {
        return { unit: key, quantity: "1" };
      });
      console.log(assets);

      // Build transaction
      const unsignedTxn = await new Transaction({ initiator: wallet })
        .sendAssets(
          "addr_test1wr8pnrgmm2p0mkqnl6wgxvtaz007zsf8tphtpumvmnpf0qqwvqm8c", // SCRIPT ADDRESS HERE
          assets,
          { datum }
        )
        .build();

      if (wallet) {
        const signedTxn = await wallet.signTx(unsignedTxn);
        const txHash = await wallet.submitTx(signedTxn);
        setTxnHash(txHash);
      }
    }
  };

  return (
    <div className="font-avenir">
      <div className="flex flex-col items-center gap-12 bg-orange-400 p-16">
        <h1 className="text-3xl font-bold text-white">Stake Assets</h1>
        <div className="flex flex-row gap-8">
          {availableWallets?.map((wallet, i) => (
            <Button
              colorScheme={"yellow"}
              key={i}
              onClick={async () => {
                const enabledWallet = await BrowserWallet.enable(wallet.name);
                setWallet(enabledWallet);
              }}
            >
              <div className="mr-2">
                <Image
                  src={`${wallet.icon}`}
                  width="24"
                  height="24"
                  alt="wallet"
                />
              </div>
              {wallet.name}
            </Button>
          ))}
        </div>
        {wallet !== undefined && (
          <div>
            <div>Wallet Connected!</div>
            <Button
              onClick={async () => {
                const result = await (await wallet.getAssets()).slice(0, 10);
                setAssets(result);
              }}
            >
              Get Assets
            </Button>
          </div>
        )}
        {assets !== undefined && (
          <div className="flex flex-wrap gap-2">
            {assets.map((asset: any) => (
              <Button
                key={asset.assetName}
                colorScheme={selectedAssets[asset.unit] ? "green" : "blue"}
                onClick={() => {
                  const sa = JSON.parse(JSON.stringify(selectedAssets));
                  if (asset.unit in sa) {
                    delete sa[asset.unit];
                  } else {
                    sa[asset.unit] = 1;
                  }
                  setSelectedAssets(sa);
                }}
              >
                {asset.assetName}
              </Button>
            ))}
          </div>
        )}
        {Object.keys(selectedAssets).length !== 0 && (
          <div>
            <h1>Selected Asset:</h1>
            <ul>
              {Object.keys(selectedAssets).map((key: any) => (
                <li key={key}>{key}</li>
              ))}
            </ul>
            <Button colorScheme={"red"} onClick={() => stakeAsset()}>
              Stake!
            </Button>
          </div>
        )}
        {txnHash.length !== 0 && (
          <div>
            <h1>Txn Sent!</h1>
            <p>{txnHash}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Unstake = () => {
  const [wallet, setWallet] = useState<BrowserWallet>();
  const [availableWallets, setAvailableWallets] = useState<
    Wallet[] | undefined
  >(undefined);
  const scriptAddress =
    "addr_test1wr8pnrgmm2p0mkqnl6wgxvtaz007zsf8tphtpumvmnpf0qqwvqm8c";

  useEffect(() => {
    async function init() {
      setAvailableWallets(BrowserWallet.getInstalledWallets());
    }
    init();
  }, []);

  const unstakeAsset = async () => {
    const script =
      "590e3e590e3b010000332332233223232333222323332223233333333222222223233322232333322223232332232333222323332223232332233223232333332222233223322332233223322332233222222323253353033333006300800530070043333573466e1cd55cea8012400046601664646464646464646464646666ae68cdc39aab9d500a480008cccccccccc064cd409c8c8c8cccd5cd19b8735573aa004900011980f981d1aba15002302c357426ae8940088d4164d4c168cd5ce2481035054310005b49926135573ca00226ea8004d5d0a80519a8138141aba150093335502e75ca05a6ae854020ccd540b9d728169aba1500733502704335742a00c66a04e66aa0a8098eb4d5d0a8029919191999ab9a3370e6aae754009200023350213232323333573466e1cd55cea80124000466a05266a084eb4d5d0a80118239aba135744a00446a0ba6a60bc66ae712401035054310005f49926135573ca00226ea8004d5d0a8011919191999ab9a3370e6aae7540092000233502733504275a6ae854008c11cd5d09aba2500223505d35305e3357389201035054310005f49926135573ca00226ea8004d5d09aba2500223505935305a3357389201035054310005b49926135573ca00226ea8004d5d0a80219a813bae35742a00666a04e66aa0a8eb88004d5d0a801181c9aba135744a00446a0aa6a60ac66ae71241035054310005749926135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135573ca00226ea8004d5d0a8011919191999ab9a3370ea00290031180f181d9aba135573ca00646666ae68cdc3a801240084603a608a6ae84d55cf280211999ab9a3370ea00690011180e98181aba135573ca00a46666ae68cdc3a80224000460406eb8d5d09aab9e50062350503530513357389201035054310005249926499264984d55cea80089baa001357426ae8940088d4124d4c128cd5ce249035054310004b49926104a1350483530493357389201035054350004a4984d55cf280089baa0012323333573466e1cd55cea800a400046eb8d5d09aab9e5002235043353044335738921035054310004549926137540024646666ae68cdc39aab9d5001480008cd4054cd54108cd54109d73ae75a6ae84d55cf280111a8219a982219ab9c491035054310004549926137540024424660020060044002444444444424666666666600201601401201000e00c00a00800600440024424660020060044002244246600200600424002244246600200600424002244246600200600424002424444600800a424444600600a424444600400a424444600200a40022464460046eb0004c8004d540d088cccd55cf80092807119a80698021aba100230033574400406646464646666ae68cdc39aab9d5003480008ccc01cc8c8c8cccd5cd19b8735573aa004900011980698189aba1500233501302d357426ae8940088d40d8d4c0dccd5ce249035054310003849926135573ca00226ea8004d5d0a801999aa805bae500a35742a00466a01eeb8d5d09aba25002235032353033335738921035054310003449926135744a00226aae7940044dd50009110919980080200180110009109198008018011000899aa800bae75a224464460046eac004c8004d540b888c8cccd55cf80112804919a80419aa81898031aab9d5002300535573ca00460086ae8800c0b84d5d08008891001091091198008020018900089119191999ab9a3370ea002900011a80418029aba135573ca00646666ae68cdc3a801240044a01046a0526a605466ae712401035054310002b499264984d55cea80089baa001121223002003112200112001232323333573466e1cd55cea8012400046600c600e6ae854008dd69aba135744a00446a0466a604866ae71241035054310002549926135573ca00226ea80048848cc00400c00880048c8cccd5cd19b8735573aa002900011bae357426aae7940088d407cd4c080cd5ce24810350543100021499261375400224464646666ae68cdc3a800a40084a00e46666ae68cdc3a8012400446a014600c6ae84d55cf280211999ab9a3370ea00690001280511a8111a981199ab9c490103505431000244992649926135573aa00226ea8004484888c00c0104488800844888004480048c8cccd5cd19b8750014800880188cccd5cd19b8750024800080188d4068d4c06ccd5ce249035054310001c499264984d55ce9baa0011220021220012001232323232323333573466e1d4005200c200b23333573466e1d4009200a200d23333573466e1d400d200823300b375c6ae854014dd69aba135744a00a46666ae68cdc3a8022400c46601a6eb8d5d0a8039bae357426ae89401c8cccd5cd19b875005480108cc048c050d5d0a8049bae357426ae8940248cccd5cd19b875006480088c050c054d5d09aab9e500b23333573466e1d401d2000230133016357426aae7940308d407cd4c080cd5ce2481035054310002149926499264992649926135573aa00826aae79400c4d55cf280109aab9e500113754002424444444600e01044244444446600c012010424444444600a010244444440082444444400644244444446600401201044244444446600201201040024646464646666ae68cdc3a800a400446660106eb4d5d0a8021bad35742a0066eb4d5d09aba2500323333573466e1d400920002300a300b357426aae7940188d4040d4c044cd5ce2490350543100012499264984d55cea80189aba25001135573ca00226ea80048488c00800c888488ccc00401401000c80048c8c8cccd5cd19b875001480088c018dd71aba135573ca00646666ae68cdc3a80124000460106eb8d5d09aab9e500423500a35300b3357389201035054310000c499264984d55cea80089baa001212230020032122300100320011122232323333573466e1cd55cea80124000466aa016600c6ae854008c014d5d09aba25002235007353008335738921035054310000949926135573ca00226ea8004498480048004448848cc00400c008448004448c8c00400488cc00cc008008004c8c8c8ccc888c8cc88c8cc88c8ccc888ccc888cccccccc88888888cc88ccccc88888cccc8888cc88cc88cc88ccc888cc88ccc888cc88cc88cc88cc88c8c8c8cc88c8c8cccc8888c8cc88c8888c8cc124cc04924011d4f776e65722773207369676e6174757265206e6f7420636f7272656374003322353018002222222222253353502d33355301a1200133501c2253353502f002210031001502e253353057333573466e3c0300041641604d40c0004540bc00c84164415d4004d410c010cc04924118546f6b656e73206e6f742073656e7420746f206f776e65720033355300e1200132335011223335350470032200200200135350450012200133504504904c2001332233322320013200135505322533535022001100322133006002300400122330043322333573466e1c008004148144ccc888c8c8c004014c8004d5415c88cd4d4098005200022353550530022253353058333573466e3c0080241681644c01c0044c01800cc8004d5415888cd4d4094005200022353550520022253353057333573466e3c00801c16416040044c01800ccc88ccd54c0384800488cd54c054480048d4d5414000488cd5414c008cd54c060480048d4d5414c00488cd54158008ccd4d5405c0048cc1752000001223305e00200123305d00148000004cd54c054480048d4d5414000488cd5414c008ccd4d540500048cd54c064480048d4d5415000488cd5415c008d5406c00400488ccd5540480780080048cd54c064480048d4d5415000488cd5415c008d54064004004ccd5540340640080054090d4c0700088888888888ccd54c0604800488d4c0b0008888d4c0d000c88cd4c15c00894cd4c188ccd5cd19b8f013001064063133503500500710072007502e00950053504700833550515504a35504a00233550515501735504a002355017002001001005501d501e13530130012200211122233355300612001501b3355300b1200123535504600122335504900235500d001333553006120012235355047002225335304c33355301012001323350132233353500b00322002002001353500900122001335009225335304e0021050100104d23535504a001223300a0020050061003133501f004003501c0013355300b120012353550460012232335504a0033001005320013550502253353501f001135500d0032213535504c00222533530513300c0020081335501200700113006003002122123300100300212001320013550472211222533535019001100222133005002333553007120010050040011121222300300411221222330020050041121222300100411200132001355042221122533535013001150152213350163004002335530061200100400132001355041221122253353501300113535006003220012213335350080052200230040023335530071200100500400112212330010030021200122333573466e3c0080040f40f0894cd4c0e800440f04cd5ce00101d8891a9aa81a8009100091091980080180110009111111111091999999999800805805004804003803002802001801100091091980080180110009110919980080200180110008891001091091198008020018900091091980080180110008909118010018891000890008910919800801801090008910919800801801090008910919800801801090008909111801802089110010891100089000909111180200290911118018029091111801002909111180080290009109198008018011000909111111180380411091111111980300480410911111118028040911111100209111111001910911111119801004804110911111119800804804100090911801001911091199800802802001900090911801001909118008019000890008910919800801801090008891a9aa801000910010891091980080180108900091299a9801801080088020910010910009000889118010009119b800020011123230010012233003300200200101"; // SCRIPT CBOR HERE

    const assets = [
      {
        unit: "2f874f8be27b21f34b0d6366e3e9268a041dcccdc8a98d55c4a15d0f6164617065416c666f6e736f5768697465",
        quantity: 1,
      },
    ];

    const addresses = await wallet?.getUsedAddresses();

    if (addresses) {
      // Create datum
      const spendingKeyHash = resolvePaymentKeyHash(addresses[0]);
      const datum: Data = { alternative: 0, fields: [spendingKeyHash] };

      // Create redeemer
      const redeemerData: Data = {
        alternative: 0,
        fields: [
          assets.map((asset) => {
            return {
              alternative: 0,
              fields: [
                {
                  alternative: 0,
                  fields: [
                    asset.unit.substring(0, 56),
                    asset.unit.substring(56),
                  ],
                },
                asset.quantity,
              ],
            };
          }),
        ],
      };

      const redeemer: Partial<Action> = {
        data: redeemerData,
      };

      if (wallet) {
        const blockfrost = new BlockfrostProvider(
          "previewsrQ20AONDuX93ZH7IR3i6IKVVKYsqi2i"
        );
        const assetUtxo = await blockfrost.fetchAddressUtxos(
          scriptAddress,
          assets[0].unit
        );
        console.log(assetUtxo);

        const tx = new Transaction({ initiator: wallet })
          .redeemValue(script, assetUtxo[0], { datum, redeemer })
          .sendValue(addresses[0], assetUtxo[0]);

        const unsignedTx = await tx.build();
        const signedTx = await wallet.signTx(unsignedTx, true); // note the partial sign here
        const txHash = await blockfrost.submitTx(signedTx);
        console.log("Txn successful: ", txHash);
      }
    }
  };

  return (
    <div className="font-avenir">
      <div className="flex flex-col items-center gap-12 bg-purple-400 p-16">
        <h1 className="text-3xl font-bold text-white">Unstake Assets</h1>
        <div className="flex flex-row gap-8">
          {availableWallets?.map((wallet, i) => (
            <Button
              colorScheme={"yellow"}
              key={i}
              onClick={async () => {
                const enabledWallet = await BrowserWallet.enable(wallet.name);
                setWallet(enabledWallet);
              }}
            >
              <div className="mr-2">
                <Image
                  src={`${wallet.icon}`}
                  width="24"
                  height="24"
                  alt="wallet"
                />
              </div>
              {wallet.name}
            </Button>
          ))}
        </div>
        {wallet !== undefined && (
          <div>
            <div>Wallet Connected!</div>
            <Button colorScheme={"red"} onClick={() => unstakeAsset()}>
              Unstake!
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;