const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

let marketplace_instance, voxel, sk721nft, sk1155nft;
let vxltoken;
describe("SuperKluster Marketplace Tests", function() {
  this.beforeEach(async function() {   
    [
      account1, 
      account2,  // SkTeamWallet
      account3, 
      account4
    ] = await ethers.getSigners();
   
    // const TEST = await ethers.getContractFactory("Test");
    // testContract = await TEST.deploy(account1.address);    

    const VOXEL = await ethers.getContractFactory("Voxel");
    voxel = await VOXEL.deploy();
    await voxel.deployed();

    const Marketplace = await ethers.getContractFactory("SKMarketPlace");
    marketplace_instance = await upgrades.deployProxy(Marketplace, [
      voxel.address,
      account1.address,
      account2.address,
      account1.address
    ]);

    const SK721NFT = await ethers.getContractFactory("SK721Collection");
    sk721nft = await SK721NFT.deploy("SuperKluster721", "SK721", marketplace_instance.address);
    await sk721nft.deployed();

    const SK1155NFT = await ethers.getContractFactory("SK1155Collection");
    sk1155nft = await SK1155NFT.deploy("SuperKluster1155", "SK1155", marketplace_instance.address);
    await sk1155nft.deployed();


    vxltoken = await ethers.getContractAt(
      "Voxel",
      "0x16CC8367055aE7e9157DBcB9d86Fd6CE82522b31"
    );

    // console.log("vxltoken: ", vxltoken);
  })

  it("UseCase105 Test", async function() {
    [
      account1, 
      account2,  // SkTeamWallet
      account3,  // seller
      account4,   // buyer
      account5, 
      account6,
      account7,   // creator
      account8,    // creator
      account9
    ] = await ethers.getSigners();

    console.log("vxltoken: ", vxltoken.address);

    // VXL transfer
    await voxel.connect(account1).transfer(account4.address, hre.ethers.utils.parseEther("20000"));

    // ----- buy item----

    // ----- buyItemWithEth ----

     
    await voxel.connect(account4).approve(marketplace_instance.address, hre.ethers.utils.parseEther("20000000"));


    await marketplace_instance.connect(account1).setETHServiceFee(200);

    /* 
    let buyItem = {
      collection: sk721nft.address,
      buyer: account4.address,
      seller: account3.address,
      creator: account5.address,
      tokenId: 1000,
      quantity: 1,
      // price: hre.ethers.utils.parseEther("0.24"),
      // royaltyAmount: hre.ethers.utils.parseEther("0.024"),
      price: hre.ethers.utils.parseEther("5000"),
      royaltyAmount: hre.ethers.utils.parseEther("100"),
      tokenURI: "https://base_uri/url/back.json",
      shouldMint: true,
      deadline: 1674582399,
      nonce: 0
    };

    let buyItemMessageHash = ethers.utils.solidityKeccak256(
      ["address", "address", "address", "address", "uint256", "uint256", "uint256", "uint256", "uint256", "string", "bool", "uint256", "uint256"],
      [buyItem.collection, buyItem.buyer, buyItem.seller, buyItem.creator, buyItem.tokenId, buyItem.quantity, buyItem.price, buyItem.royaltyAmount,
       buyItem.quantity, buyItem.tokenURI, buyItem.shouldMint, buyItem.nonce, buyItem.deadline
      ]
    );

    let buyItemSignature = await account1.signMessage(ethers.utils.arrayify(buyItemMessageHash));

    
    
    await marketplace_instance.connect(account4).buyItem(buyItem.collection, buyItem.seller, buyItem.creator, buyItem.tokenId, buyItem.quantity, buyItem.price, buyItem.royaltyAmount, buyItem.quantity,
      buyItem.tokenURI, buyItem.shouldMint, buyItem.deadline, buyItemSignature);
    
    /* 
  
    await marketplace_instance.connect(account4).buyItemWithETH(buyItem.collection, buyItem.seller, buyItem.creator, buyItem.tokenId, buyItem.quantity, buyItem.price, buyItem.royaltyAmount, buyItem.quantity,
      buyItem.tokenURI, buyItem.shouldMint, buyItem.deadline, buyItemSignature, {
        value: ethers.utils.parseEther("0.24")  
      }); */


      /* console.log("Seller balance => ", (await account3.getBalance()));  
      console.log("Buyer balance => ", (await account4.getBalance()));
      console.log("creator balance => ", (await marketplace_instance.connect(account5).getClaimRoyalty())); */


    /* 
    console.log("seller balance => ", (await voxel.balanceOf(account3.address)));  
    console.log("buyer balance => ", (await voxel.balanceOf(account4.address)));

    // console.log("Seller balance => ", (await account3.getBalance()));  
    // console.log("Buyer balance => ", (await account4.getBalance()));  
    
    console.log("Royalty receiver balance => ", (await marketplace_instance.connect(account5).getClaimRoyalty()));  
    await marketplace_instance.connect(account5).claimRoyalty(account5.address); */
    

    // ---- accept item ---
    
    /* 
    let acceptItem = {
      collection: sk721nft.address,
      buyer: account4.address,
      seller: account3.address,
      creator: account5.address,
      tokenId: 1000,
      quantity: 1,
      price: hre.ethers.utils.parseEther("5000"),
      royaltyAmount: hre.ethers.utils.parseEther("100"),
      tokenURI: "https://base_uri/url/back.json",
      shouldMint: true,
      deadline: 1674582399,
      nonce: 0
    };

    let acceptItemMessageHash = ethers.utils.solidityKeccak256(
      ["address", "address", "address", "address", "uint256", "uint256", "uint256", "uint256", "uint256", "string", "bool", "uint256", "uint256"],
      [acceptItem.collection, acceptItem.buyer, acceptItem.seller, acceptItem.creator, acceptItem.tokenId, acceptItem.quantity, acceptItem.price, acceptItem.royaltyAmount,
        acceptItem.quantity, acceptItem.tokenURI, acceptItem.shouldMint, acceptItem.nonce, acceptItem.deadline
      ]
    );
    let acceptItemSignature = await account1.signMessage(ethers.utils.arrayify(acceptItemMessageHash));

    await marketplace_instance.connect(account3).acceptItem(
      acceptItem.collection, acceptItem.buyer, acceptItem.creator, acceptItem.tokenId, acceptItem.quantity, acceptItem.price, acceptItem.royaltyAmount, acceptItem.quantity,
      acceptItem.tokenURI, acceptItem.shouldMint, acceptItem.deadline, acceptItemSignature);
    
    console.log("seller balance => ", (await voxel.balanceOf(account3.address)));  
    console.log("buyer balance => ", (await marketplace_instance.connect(account5).getClaimRoyalty()));

    await marketplace_instance.connect(account5).claimRoyalty(account5.address);

    console.log("creator balance => ", (await voxel.balanceOf(account5.address)));   */

    // ----- buy cart----
    
    // await voxel.connect(account1).transfer(account4.address, hre.ethers.utils.parseEther("20000"));
    // await voxel.connect(account4).approve(marketplace_instance.address, hre.ethers.utils.parseEther("20000000"));

    
    await vxltoken.connect(account4).approve(marketplace_instance.address, hre.ethers.utils.parseEther("20000000"));

    let _sellers = [
      {
        "seller": account3.address,
        "price": hre.ethers.utils.parseEther("1.8"),
        "collections": [
          {
            "collection": sk721nft.address,
            "batch": false,
            "creators": [
              account7.address, account8.address
            ],
            "tokenIds": [ 1001, 1002 ],
            "prices": [ hre.ethers.utils.parseEther("0.3"), hre.ethers.utils.parseEther("0.5")],
            "royaltyAmounts": [ hre.ethers.utils.parseEther("0.03"), hre.ethers.utils.parseEther("0.05") ],
            "tokenURIs": ["https://ipfs.io/token_id/1233", "https://ipfs.io/token_id/4323"]
          },
          {
            "collection": sk1155nft.address,
            "batch": true,
            "creators": [
              account7.address, account8.address, account8.address, account8.address, account7.address
            ],
            "tokenIds": [ 10000, 10001, 10002, 10003, 10004 ],
            "prices": [ hre.ethers.utils.parseEther("0.2"), hre.ethers.utils.parseEther("0.2"), hre.ethers.utils.parseEther("0.2"), hre.ethers.utils.parseEther("0.2"), hre.ethers.utils.parseEther("0.2")],
            "royaltyAmounts": [ hre.ethers.utils.parseEther("0.02"), hre.ethers.utils.parseEther("0.02"), hre.ethers.utils.parseEther("0.02"), 
                                hre.ethers.utils.parseEther("0.02"), hre.ethers.utils.parseEther("0.02") ],
            "tokenURIs": ["https://ipfs.io/token_id/4732", "https://ipfs.io/token_id/8123", "https://ipfs.io/token_id/8123", 
                          "https://ipfs.io/token_id/8123", "https://ipfs.io/token_id/8123"]
          }
        ]
      },
      {
        "seller": account5.address,
        "price": hre.ethers.utils.parseEther("0.5"),
        "collections": [
          {
            "collection": sk721nft.address,
            "batch": false,
            "creators": [
              account7.address, account8.address
            ],
            "tokenIds": [ 1003, 1004 ],
            "prices": [ hre.ethers.utils.parseEther("0.2"), hre.ethers.utils.parseEther("0.3")],
            "royaltyAmounts": [ hre.ethers.utils.parseEther("0.02"), hre.ethers.utils.parseEther("0.03") ],
            "tokenURIs": ["https://ipfs.io/token_id/2665", "https://ipfs.io/token_id/7890"]
          }
        ]
      }
    ];

    let typeArray = [];
    let dataArray = [];

    for(let i = 0; i < _sellers.length; i ++) {
      for(let j = 0; j < _sellers[i]['collections'].length; j ++) {
        for(let k = 0; k < _sellers[i]['collections'][j]['tokenIds'].length; k ++) {
          typeArray.push("address"); typeArray.push("uint256");
          typeArray.push("uint256"); typeArray.push("uint256");
          typeArray.push("string");

          dataArray.push(_sellers[i]['collections'][j]['creators'][k]);
          dataArray.push(_sellers[i]['collections'][j]['tokenIds'][k]);
          dataArray.push(_sellers[i]['collections'][j]['prices'][k]);
          dataArray.push(_sellers[i]['collections'][j]['royaltyAmounts'][k]);
          dataArray.push(_sellers[i]['collections'][j]['tokenURIs'][k]);
        }

        typeArray.push("address"); typeArray.push("bool");
        dataArray.push(_sellers[i]['collections'][j]['collection']);
        dataArray.push(_sellers[i]['collections'][j]['batch']);
      }
      typeArray.push("address"); typeArray.push("uint256");
      dataArray.push(_sellers[i]['seller']);
      dataArray.push(_sellers[i]['price']);
    }

    typeArray.push("address");
    typeArray.push("uint256");
    typeArray.push("uint256");
    typeArray.push("uint256");
    typeArray.push("uint256");

    let _cartPrice = hre.ethers.utils.parseEther("2.3");
    let _deadline = 1674582399;
    let _payload = 1;

    dataArray.push(account9.address);
    dataArray.push(_cartPrice);
    dataArray.push(_payload);
    dataArray.push(0);
    dataArray.push(_deadline);

    let messageHash = ethers.utils.solidityKeccak256(
      typeArray,
      dataArray
    );

    let signature = await account1.signMessage(ethers.utils.arrayify(messageHash));

    console.log("Buyer1 balance => ", (await account9.getBalance()));

    await marketplace_instance.connect(account9).buyCartWithETH(_sellers, _cartPrice, _payload, _deadline, signature, {
      value: ethers.utils.parseEther("2.30")  
    });

    console.log("creator balance => ", (await marketplace_instance.connect(account7).getClaimRoyalty()));  
    console.log("creator balance => ", (await marketplace_instance.connect(account8).getClaimRoyalty()));
    // console.log("account4 balance => ", (await voxel.balanceOf(account4.address)));
    // console.log("seller balance => ", (await voxel.balanceOf(account3.address)));
    console.log("Seller balance => ", (await account3.getBalance()));  
    console.log("Buyer2 balance => ", (await account9.getBalance()));
  })
});