/* global require, module, exports */
const rnode = require('rchainApi');

const DEFAULT_RCHAIN_NODE = 'http://127.0.0.1:40401',
      NETWORK_NAME = 'RCHAIN',
      DEFAULT_NETWORK_ID = '7777';

module.exports.DEFAULT_RCHAIN_NODE = DEFAULT_RCHAIN_NODE;
module.exports.DEFAULT_NETWORK_ID = DEFAULT_NETWORK_ID;
module.exports.NETWORK_NAME = NETWORK_NAME;

function parseOpts(opts) {
  return {
    rNode: opts['rchain_node'] || DEFAULT_RCHAIN_NODE
    networkId: opts['network_id'] || DEFAULT_NETWORK_ID
  }
}

module.exports.parseOpts = parseOpts;

module.exports.getPluginDefinition = function() {
  return {
    network: NETWORK_NAME,
    version: packageData.version,
    package_name: packageData.name
  }
}

module.exports.submitTransaction = async function(code, opts) {
  var parsedOpts = parseOpts(opts),
      rchainNode = parsedOpts.rNode,
      myNode = () => RNode(grpc, { host: 'localhost', port: 40401 }),
      deployData = {term: code,
                    timestamp: new Date().valueOf()
                   },
      txHash = null,
      error = false,
      errorMsg = null;

  try {
    txHash = await myNode.doDeploy(deployData).then(result => {
    // Force RNode to make a block immediately
    return myNode.createBlock()
  })

  } catch (e) {
    console.error(e);
    txHash = null;
    error = true;
    errorMsg = e;
  }

  return {
    hash: txHash,
    metadata: {},
    error: error,
    errorMsg: errorMsg
  };
}
