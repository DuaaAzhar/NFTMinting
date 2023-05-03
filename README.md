
## Getting Started
### Step 1:
Clone the repo, delete the node modules folder and run ```npm i``` to install all dependencies 

### Step 3:
Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

### Step 3:
install the nami wallet extension of chrome
https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifnkikgncikgfhdo?hl=en

Create wallet, get test ADA faucets
https://docs.cardano.org/cardano-testnet/tools/faucet

### Step 4:
Once you successfully setup the project, then on localhost press on `Connect Wallet` select Nami or eternl wallet upto your choice
Then Click on `Mint Tokens` button to mint the NFT. 
The pop up window will open to sign the transaction. You need to sign it and wait for 30 seconds. Then go into your wallet and check the transaction.
You can also get the transactionHash from inspect, as i have consoled it here.

#### Note:
- Now, from where the image of NFT is coming? 
I have uploaded that image on ipfs and added up the static link in code for your ease.
To use your own images, you need to upload files on ipfs and add the link in metadata i.e.
```
const assetMetadata1: AssetMetadata = {
  "name": "myNFT",
  "image": "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
  "mediaType": "image/jpg",
  "description": "This NFT is minted by Duaa through smartContract"
};
```
- Also, Currently I am using my Blockfrost API in this file just for demo so that it will be easy for you to understand the flow, but for project building, we will make the new Blockfrost API and project to interact with blockchain.
