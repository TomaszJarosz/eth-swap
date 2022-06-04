const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

require("chai").use(require("chai-as-promised")).should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("EthSwap", ([deployer, investor]) => {
  let token, ethSwap;

  before(async () => {
    token = await Token.new();
    ethSwap = await EthSwap.new(token.address);
    //Transfer all tokens to EthSwap(1 million)
    await token.transfer(ethSwap.address, tokens("1000000"));
  });
  describe("Token deployment", async () => {});

  describe("EthSwap deployment", async () => {});

  describe("buytokens", async () => {
    let result;
    before(async () => {
      //Purchase token before each example
      result = await ethSwap.buyTokens({
        from: investor,
        value: web3.utils.toWei("1", "ether"),
      });
    });

    it("Allows user to instantly purchase tokens from ethSwap for a fixed price", async () => {
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens("100"));

      //check ethSwap Balance
      let ethSwapBalance;
      ethSwapBalance = await token.balanceOf(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens("999900"));
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens("1"));

      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens("100"));
      assert.equal(event.rate.toString(), "100");

      // console.log(result.logs)
    });
  });
});
