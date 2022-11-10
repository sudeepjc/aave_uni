const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, waffle, artifacts } = require("hardhat");
const hre = require("hardhat");

const { DAI, DAI_WHALE, POOL_ADDRESS_PROVIDER } = require("../config_aave");

describe("Deploy a Flash Loan", function () {
  it("Should take a flash loan and be able to return it", async function () {
    const flashLoanExample = await ethers.getContractFactory(
      "FlashLoanExample"
    );

    const _flashLoanExample = await flashLoanExample.deploy(
      // Address of the PoolAddressProvider: you can find it here: https://docs.aave.com/developers/deployed-contracts/v3-mainnet/polygon
      POOL_ADDRESS_PROVIDER
    );
    await _flashLoanExample.deployed();

    const token = await ethers.getContractAt("IERC20", DAI);
    const BALANCE_AMOUNT_DAI = ethers.utils.parseEther("2000");
    
    // Impersonate the DAI_WHALE account to be able to send transactions from that account
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE],
    });

    console.log('Initial...');
    let daiBalance = await token.balanceOf(DAI_WHALE);
    console.log(`Balance at Whale : ${daiBalance}`);

    daiBalance = await token.balanceOf(_flashLoanExample.address);
    console.log(`Balance at Contract : ${daiBalance}`);

    const signer = await ethers.getSigner(DAI_WHALE);
    await token
      .connect(signer)
      .transfer(_flashLoanExample.address, BALANCE_AMOUNT_DAI); // Sends our contract 2000 DAI from the DAI_WHALE

      console.log('after token transfer...');

    daiBalance = await token.balanceOf(DAI_WHALE);
    console.log(`Balance at Whale : ${daiBalance}`);

    daiBalance = await token.balanceOf(_flashLoanExample.address);
    console.log(`Balance at Contract : ${daiBalance}`);

    const tx = await _flashLoanExample.createFlashLoan(DAI, 1000); // Borrow 1000 DAI in a Flash Loan with no upfront collateral
    await tx.wait();
    const remainingBalance = await token.balanceOf(_flashLoanExample.address); // Check the balance of DAI in the Flash Loan contract afterwards

    console.log('after flash loan...');

    daiBalance = await token.balanceOf(DAI_WHALE);
    console.log(`Balance at Whale : ${daiBalance}`);

    daiBalance = await token.balanceOf(_flashLoanExample.address);
    console.log(`Balance at Contract : ${daiBalance}`);

    expect(remainingBalance.lt(BALANCE_AMOUNT_DAI)).to.be.true; // We must have less than 2000 DAI now, since the premium was paid from our contract's balance
  });
});