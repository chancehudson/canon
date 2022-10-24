pragma solidity ^0.8.0;

import { Unirep } from '@unirep/contracts/Unirep.sol';

contract Canon {

  // a story is a linked list of sections
  struct Section {
    uint id; // hash of all of this
    uint author; // an epoch key
    uint graffitiHash; // graffiti the author left with the section
    uint contentHash;
    uint epoch;
    uint voteCount;
  }

  Unirep unirep;
  address admin;

  // epoch => epoch key => section
  mapping (uint => mapping(uint => Section)) sectionByEpochKey;

  // the canonical section for an epoch
  // epoch => section
  mapping (uint => uint) sectionByEpoch;

  constructor(Unirep _unirep) {
    unirep = _unirep;
    unirep.attesterSignUp(60 * 60 * 24 * 7);
    admin = msg.sender;
  }

  function signup(uint[] memory publicSignals, uint[8] memory proof) public {
    require(msg.sender == admin, 'sender');
    unirep.userSignUp(publicSignals, proof);
  }

  /**
   * Submit a new section of writing that others may vote on. Accept an epoch
   * key proof signing the hash of the section and any other data.
   **/
  function submitSection(
    uint graffitiHash,
    uint contentHash,
    uint[] memory publicSignals,
    uint[8] memory proof
  ) public {
    require(unirep.verifyEpochKeyProof(publicSignals, proof), 'badproof');
    uint epochKey = publicSignals[0];
    uint epoch = publicSignals[2];
    uint currentEpoch = unirep.attesterCurrentEpoch(uint160(publicSignals[3]));
    require(epoch == currentEpoch);
    bytes32 data = keccak256(abi.encodePacked(epochKey, graffitiHash, contentHash, epoch));
    require(uint(data) == publicSignals[4], 'badsig');
    sectionByEpochKey[epoch][epochKey].id = uint(data);
    sectionByEpochKey[epoch][epochKey].author = epochKey;
    sectionByEpochKey[epoch][epochKey].graffitiHash = graffitiHash;
    sectionByEpochKey[epoch][epochKey].contentHash = contentHash;
    sectionByEpochKey[epoch][epochKey].epoch = epoch;
    sectionByEpochKey[epoch][epochKey].voteCount = 0;
  }

  /**
   * Vote on a section.
   * Accepts an epoch key proof
   **/
  function voteSection(
    uint[] memory publicSignals,
    uint[8] memory proof
  ) public {

  }
}
