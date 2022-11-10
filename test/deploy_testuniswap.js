const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, waffle, artifacts } = require("hardhat");
const hre = require("hardhat");

const { WETH, WETH_WHALE, DAI, USDC, DAI_WHALE } = require("../config_uniswap");

describe("Swap on UniSwap", function () {
  it("Swap Single Hop Exact AmountIn : Swap WETH --> DAI", async function () {
    const uniswapV2Swap = await ethers.getContractFactory(
      "UniswapV2SwapExamples"
    );

    const _uniswapV2Swap = await uniswapV2Swap.deploy();
    await _uniswapV2Swap.deployed();

    // Impersonate the WETH_WHALE account to be able to send transactions from that account
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [WETH_WHALE],
    });

    const signer = await ethers.getSigner(WETH_WHALE);

    const WETH_AMOUNT = ethers.utils.parseEther("1");
    const wethTokenInstance = await ethers.getContractAt("contracts/SwapExample.sol:IWETH", WETH);
    const daiTokenInstance = await ethers.getContractAt("contracts/SwapExample.sol:IERC20", DAI);
    
    console.log(`Before Swap...`);
    const WETH_BALANCE = await wethTokenInstance.balanceOf(WETH_WHALE); 
    console.log(`WETH_BALANCE: ${WETH_BALANCE}`);

    const DAI_BALANCE = await daiTokenInstance.balanceOf(WETH_WHALE); 
    console.log(`DAI_BALANCE: ${DAI_BALANCE}`);

    await wethTokenInstance
    .connect(signer)
    .approve(_uniswapV2Swap.address, WETH_AMOUNT); // Approve contract 1 WETH from the WETH_WHALE
    
    const MIN_DAI_AMOUNT = ethers.utils.parseEther("1");

    const tx = await _uniswapV2Swap.connect(signer).swapSingleHopExactAmountIn(WETH_AMOUNT, MIN_DAI_AMOUNT); // Swap DAI for WETH 
    await tx.wait();

    console.log(`After Swap...`);
    const new_WETH_BALANCE = await wethTokenInstance.balanceOf(WETH_WHALE); 
    console.log(`WETH_BALANCE: ${new_WETH_BALANCE}`);

    const new_DAI_BALANCE = await daiTokenInstance.balanceOf(WETH_WHALE); 
    console.log(`DAI_BALANCE: ${new_DAI_BALANCE}`);

    expect(DAI_BALANCE.lt(new_DAI_BALANCE)).to.be.true; // DAI balance should be more than what he already had
  });

  it("Swap Single Hop Exact AmountOut : Swap WETH --> DAI", async function () {
    const uniswapV2Swap = await ethers.getContractFactory(
      "UniswapV2SwapExamples"
    );

    const _uniswapV2Swap = await uniswapV2Swap.deploy();
    await _uniswapV2Swap.deployed();

    // Impersonate the WETH_WHALE account to be able to send transactions from that account
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [WETH_WHALE],
    });

    const signer = await ethers.getSigner(WETH_WHALE);

    const WETH_AMOUNT = ethers.utils.parseEther("1");
    const wethTokenInstance = await ethers.getContractAt("contracts/SwapExample.sol:IWETH", WETH);
    const daiTokenInstance = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", DAI);
    
    console.log(`Before Swap...`);
    const WETH_BALANCE = await wethTokenInstance.balanceOf(WETH_WHALE); 
    console.log(`WETH_BALANCE: ${WETH_BALANCE}`);

    const DAI_BALANCE = await daiTokenInstance.balanceOf(WETH_WHALE); 
    console.log(`DAI_BALANCE: ${DAI_BALANCE}`);

    await wethTokenInstance
    .connect(signer)
    .approve(_uniswapV2Swap.address, WETH_AMOUNT); // Approve contract 1 WETH from the WETH_WHALE
    
    const Desired_DAI_AMOUNT = ethers.utils.parseEther("1");

    const tx = await _uniswapV2Swap.connect(signer).swapSingleHopExactAmountOut(Desired_DAI_AMOUNT,WETH_AMOUNT); // Swap DAI for WETH 
    await tx.wait();

    console.log(`After Swap...`);
    const new_WETH_BALANCE = await wethTokenInstance.balanceOf(WETH_WHALE); 
    console.log(`WETH_BALANCE: ${new_WETH_BALANCE}`);

    const new_DAI_BALANCE = await daiTokenInstance.balanceOf(WETH_WHALE); 
    console.log(`DAI_BALANCE: ${new_DAI_BALANCE}`);

    expect(DAI_BALANCE.lt(new_DAI_BALANCE)).to.be.true; // DAI balance should be more than what he already had
  });

  it("Swap Multi Hop Exact Amount In : Swap DAI --> WETH --> USDC", async function () {
    const uniswapV2Swap = await ethers.getContractFactory(
      "UniswapV2SwapExamples"
    );

    const _uniswapV2Swap = await uniswapV2Swap.deploy();
    await _uniswapV2Swap.deployed();

    // Impersonate the WETH_WHALE account to be able to send transactions from that account
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE],
    });

    const signer = await ethers.getSigner(DAI_WHALE);

    const DAI_AMOUNT = ethers.utils.parseEther("100");
    const wethTokenInstance = await ethers.getContractAt("contracts/SwapExample.sol:IWETH", WETH);
    const daiTokenInstance = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", DAI);
    const usdcTokenInstance = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", USDC);
    
    console.log(`Before Swap...`);

    const WETH_BALANCE = await wethTokenInstance.balanceOf(DAI_WHALE); 
    console.log(`WETH_BALANCE: ${WETH_BALANCE}`);

    const DAI_BALANCE = await daiTokenInstance.balanceOf(DAI_WHALE); 
    console.log(`DAI_BALANCE: ${DAI_BALANCE}`);

    const USDC_BALANCE = await usdcTokenInstance.balanceOf(DAI_WHALE); 
    console.log(`USDC_BALANCE: ${USDC_BALANCE}`);

    await daiTokenInstance
    .connect(signer)
    .approve(_uniswapV2Swap.address, DAI_AMOUNT); // Approve contract 1 WETH from the WETH_WHALE
    
    // USDC has 6 decimals
    const Miminum_USDC_AMOUNT = ethers.utils.parseEther("0.00000000001");

    const tx = await _uniswapV2Swap.connect(signer).swapMultiHopExactAmountIn(DAI_AMOUNT,Miminum_USDC_AMOUNT); // Swap DAI for WETH 
    await tx.wait();

    console.log(`After Swap...`);
    
    const new_WETH_BALANCE = await wethTokenInstance.balanceOf(DAI_WHALE); 
    console.log(`WETH_BALANCE: ${new_WETH_BALANCE}`);

    const new_DAI_BALANCE = await daiTokenInstance.balanceOf(DAI_WHALE); 
    console.log(`DAI_BALANCE: ${new_DAI_BALANCE}`);
    
    const new_USDC_BALANCE = await usdcTokenInstance.balanceOf(DAI_WHALE); 
    console.log(`DAI_BALANCE: ${new_USDC_BALANCE}`);

    expect(USDC_BALANCE.lt(new_USDC_BALANCE)).to.be.true; // USDC balance should be more than what he already had
  });
});