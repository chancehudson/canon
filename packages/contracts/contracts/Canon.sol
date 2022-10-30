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

  /**
   * Canon management
   **/
  // epoch => id => section
  mapping (uint => mapping(uint => Section)) sectionById;
  // epoch => epochkey => bool
  mapping (uint => mapping(uint => bool)) epochKeyHasSubmitted;
  // epoch => id => voteCount
  mapping (uint => mapping(uint => uint)) votesById;
  // epoch => id, votes
  mapping (uint => uint[2]) canon;
  // mapping of whether the author has claimed ownership/rep
  // epoch => bool
  mapping (uint => bool) claimedCanon;
  // epoch => epoch key => hasVoted
  mapping (uint => mapping(uint => bool)) epochKeyVotes;

  constructor(Unirep _unirep) {
    unirep = _unirep;
    // 4 hour epochs
    unirep.attesterSignUp(60 * 15);
    // unirep.attesterSignUp(60 * 3);
    admin = msg.sender;
  }

  function signup(uint[] memory publicSignals, uint[8] memory proof) public {
    require(msg.sender == admin, 'sender');
    unirep.userSignUp(publicSignals, proof);
  }

  /**
   * Prove control of a past epoch key and a current epoch key.
   * Claim authorship of some canon indexes
   **/
  function claimCanonOwnership(
    uint[] memory publicSignals1,
    uint[8] memory proof1,
    uint[] memory publicSignals2,
    uint[8] memory proof2
  ) public {
    // verify proof1, it should be in the current epoch
    require(unirep.verifyEpochKeyProof(publicSignals1, proof1), 'badproof1');
    uint currentEpochKey = publicSignals1[0];
    uint epoch = publicSignals1[2];
    uint currentEpoch = unirep.attesterCurrentEpoch(uint160(publicSignals1[3]));
    require(epoch == currentEpoch);
    // verify proof 2, it should be in the past epoch we're trying to claim
    require(unirep.verifyEpochKeyProof(publicSignals2, proof2), 'badproof2');
    uint oldEpoch = publicSignals2[2];
    require(oldEpoch < currentEpoch, 'newepoch');
    uint[2] storage oldCanon = canon[oldEpoch];
    Section storage section = sectionById[oldEpoch][oldCanon[0]];
    require(section.author == publicSignals2[0], 'nonauthor');
    require(claimedCanon[oldEpoch] == false, 'doubleclaim');
    claimedCanon[oldEpoch] = true;
    unirep.submitAttestation(
      currentEpoch,
      currentEpochKey,
      1,
      0,
      0
    );
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
    uint id = uint(data) % 2**200;
    require(id == publicSignals[4], 'badsig');
    require(!epochKeyHasSubmitted[epoch][epochKey], 'double');
    epochKeyHasSubmitted[epoch][epochKey] = true;
    sectionById[epoch][id].id = id;
    sectionById[epoch][id].author = epochKey;
    sectionById[epoch][id].graffitiHash = graffitiHash;
    sectionById[epoch][id].contentHash = contentHash;
    sectionById[epoch][id].epoch = epoch;
    sectionById[epoch][id].voteCount = 0;
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
    require(epochKeyVotes[epoch][epochKey] == false);
    epochKeyVotes[epoch][epochKey] = true;
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
    // attest to the author
    unirep.submitAttestation(
      currentEpoch,
      sectionById[epoch][id].author,
      0,
      1,
      0
    );
  }
}
