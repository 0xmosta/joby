import { usePrivy, useWallets } from "@privy-io/react-auth"

import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';

import { useEffect, useState } from 'react';

import { TransitiveTrustGraph } from "@ethereum-attestation-service/transitive-trust-sdk";

export default function Eas() {
  const { user } = usePrivy()
  const { wallets } = useWallets()

  const [ethersProvider, setEthersProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [ethersSigner, setEthersSigner] = useState<ethers.Signer | null>(null);

  //console.log('wallets', wallets)

  useEffect(() => {
    const init = async () => {
      if (wallets.length > 0) {
        const _provider = await wallets[0].getEthersProvider()
        setEthersProvider(_provider)

        const _signer = _provider.getSigner()
        setEthersSigner(_signer)
      }
    }

    init()
  }, [wallets])

  const graph = new TransitiveTrustGraph();

  // Add edges to the graph
  graph.addEdge("A", "B", 0.6, 0.2);
  graph.addEdge("B", "C", 0.4, 0.1);
  graph.addEdge("C", "D", 0.5, 0.3);
  graph.addEdge("A", "C", 0.5, 0.1);

  // Compute trust scores for specific targets
  const scores = graph.computeTrustScores("A", ["D"]);

  console.log('scores', scores)



  if (!ethersProvider || !ethersSigner) {
    return <div>Loading...</div>
  }

  //const EASContractAddress = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e'; // Sepolia v0.26
  //const eas = new EAS(EASContractAddress)

  return (
    <div>
    uuu
    </div>
  )
}
