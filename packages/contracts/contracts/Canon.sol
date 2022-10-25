// SPDX-License-Identifier: MIT
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

  event SectionSubmitted(
    uint indexed epochKey,
    uint indexed epoch,
    uint indexed contentHash,
    uint graffitiHash
  );

  event SectionVote(
    uint indexed epochKey,
    uint indexed sectionId,
    uint indexed voteCount
  );

  event CanonFire(
    uint indexed epoch,
    uint indexed sectionId,
    uint indexed voteCount
  );

  // epoch => epoch key => section
  mapping (uint => mapping(uint => Section)) sectionByEpochKey;
  // epoch => id => voteCount
  mapping (uint => mapping(uint => uint)) votesById;
  // epoch => id, votes
  mapping (uint => uint[2]) canon;

  constructor(Unirep _unirep) {
    unirep = _unirep;
    // 4 hour epochs
    unirep.attesterSignUp(60 * 60 * 4);
    // unirep.attesterSignUp(60 * 3);
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
    uint contentHash,
    uint graffitiHash,
    uint[] memory publicSignals,
    uint[8] memory proof
  ) public {
    require(unirep.verifyEpochKeyProof(publicSignals, proof), 'badproof');
    uint epochKey = publicSignals[0];
    uint epoch = publicSignals[2];
    uint currentEpoch = unirep.attesterCurrentEpoch(uint160(publicSignals[3]));
    require(epoch == currentEpoch);
    bytes32 data = keccak256(abi.encode(contentHash, graffitiHash, epochKey, epoch));
    uint moddedHash = uint(data) % 2**200;
    require(moddedHash == publicSignals[4], 'badsig');
    require(sectionByEpochKey[epoch][epochKey].id == 0, 'double');
    sectionByEpochKey[epoch][epochKey].id = moddedHash;
    sectionByEpochKey[epoch][epochKey].author = epochKey;
    sectionByEpochKey[epoch][epochKey].graffitiHash = graffitiHash;
    sectionByEpochKey[epoch][epochKey].contentHash = contentHash;
    sectionByEpochKey[epoch][epochKey].epoch = epoch;
    sectionByEpochKey[epoch][epochKey].voteCount = 0;
    emit SectionSubmitted(
      epochKey,
      epoch,
      contentHash,
      graffitiHash
    );
  }

  /**
   * Vote on a section.
   * Accepts an epoch key proof
   **/
  function voteSection(
    uint[] memory publicSignals,
    uint[8] memory proof
  ) public {
    require(unirep.verifyEpochKeyProof(publicSignals, proof), 'badproof');
    uint currentEpoch = unirep.attesterCurrentEpoch(uint160(publicSignals[3]));
    uint epoch = publicSignals[2];
    require(epoch == currentEpoch, 'epoch');
    uint id = publicSignals[4];
    uint epochKey = publicSignals[0];
    uint voteCount = votesById[epoch][id] + 1;
    votesById[epoch][id] = voteCount;
    if (votesById[epoch][id] > canon[epoch][1]) {
      // update the current canonical entry
      canon[epoch][0] = id;
      canon[epoch][1] = voteCount;
      emit CanonFire(
        epoch,
        id,
        voteCount
      );
    }
    emit SectionVote(
      epochKey,
      id,
      voteCount
    );
  }
}
