
var assert = require('assert'),
    rchainPnp = require('../index.js'),
    packageData = require('../package.json'),
    rchainApi = require('rchain-api'),
    accounts = [],
    rNode = 'localhost',
    testRpcPort = 40401,
    networkId = 5777,
    web3 = null,
    rchainPnpOpts = {
      rchain_node: rNode,
      network_id: networkId
    };

before(function(done) {
  rchainApi = RNode(grpc, { host: rNode, port: testRpcPort });
  // rchainApi.eth.getAccounts(function(error, web3Accounts) {
  //   accounts = web3Accounts;
  //   done();
  // });
});

describe('Plugin Configuration', function() {
  it('should parse the necessary attributes', function() {
    var opts = {rchain_node: 'http://localhost:40401', network_id: '40401'},
        parsedOpts = rchainPnpparseOpts(opts);

    assert.equal(opts.rchain_node, parsedOpts.rNode);
    assert.equal(opts.network_id, parsedOpts.networkId);
  });

  it('should have defaults', function() {
    var parsedOpts = rchainPnpparseOpts({});

    assert.equal(parsedOpts.rNode, rchainPnpDEFAULT_RCHAIN_NODE);
    assert.equal(parsedOpts.networkId, rchainPnpDEFAULT_NETWORK_ID);
  });
});

describe('#getPluginDefinition()', function(){
  it('should have network, version and package name', function() {
    var pluginDefinition = rchainPnpgetPluginDefinition();

    assert.equal(rchainPnpNETWORK_NAME, pluginDefinition.network);
    assert.equal(packageData.name, pluginDefinition.package_name);
    assert.equal(packageData.version, pluginDefinition.version);
  });
});

describe('#submitTransaction()', function() {

  it('should submit a valid transaction', function() {
    const term = 'new test in { contract test(return) = { return!("test") } }';
    const timestamp = clock().valueOf();

    rchainPnp.submitTransaction(term, rchainPnpOpts).then(function(pocketTxResponse) {
      assert.equal(pocketTxResponse.error, false);
      assert.equal(pocketTxResponse.errorMsg, null);
    }, function() {
      console.error(arguments);
    });
  });

  it('should return error response for an invalid transaction', function() {
    const term = 'new test in } contract test(return) = { return!("test") } {';
    const timestamp = clock().valueOf();

    rchainPnp.submitTransaction(term, rchainPnpOpts).then(function(pocketTxResponse) {
      assert.equal(pocketTxResponse.error, true);
    }, function() {
      console.error(arguments);
    });
  });
});
