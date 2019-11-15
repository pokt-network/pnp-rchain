
var assert = require('assert'),
    rchainPnp = require('../lib/index.js'),
    packageData = require('../package.json'),
    RNodeAPI = require('rchain-api'),
    grpc = require('grpc'),
    rNode_host = 'localhost',
    testRpcPort = 40401,
    networkId = 7777,
    web3 = null,
    rchainPnpOpts = {
      rchain_node: rNode_host,
      network_id: networkId
    };

// before(function(done) {
//   RNodeAPI = RNodeAPI.RNode(grpc, { host: rNode_host, port: testRpcPort });
// });

describe('Plugin Configuration', function() {
  it('should parse the necessary attributes', function() {
    var opts = {rchain_node: 'http://localhost:40401', network_id: '40401'},
        parsedOpts = rchainPnp.parseOpts(opts);

    assert.equal(opts.rchain_node, parsedOpts.rNode);
    assert.equal(opts.network_id, parsedOpts.networkId);
  });

  it('should have defaults', function() {
    var parsedOpts = rchainPnp.parseOpts({});

    assert.equal(parsedOpts.rNode, rchainPnp.DEFAULT_RCHAIN_NODE);
    assert.equal(parsedOpts.networkId, rchainPnp.DEFAULT_NETWORK_ID);
  });
});

describe('#getPluginDefinition()', function(){
  it('should have network, version and package name', function() {
    var pluginDefinition = rchainPnp.getPluginDefinition();

    assert.equal(rchainPnp.NETWORK_NAME, pluginDefinition.network);
    assert.equal(packageData.name, pluginDefinition.package_name);
    assert.equal(packageData.version, pluginDefinition.version);
  });
});

describe('#submitTransaction()', function() {

  it('should submit a valid transaction', function() {
    const clock = () => new Date();
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
    const clock = () => new Date();
    const term = 'new test in } contract test(return) = { return!("test") } {';
    const timestamp = clock().valueOf();

    rchainPnp.submitTransaction(term, rchainPnpOpts).then(function(pocketTxResponse) {
      assert.equal(pocketTxResponse.error, true);
      assert.done();
    }, function() {
      console.error(arguments);
    });
  });
});
