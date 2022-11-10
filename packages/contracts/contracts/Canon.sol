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

  struct SignupRequest {
    uint id;
    uint[] publicSignals;
    uint[8] proof;
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

  event SignupRequestSubmitted(
    uint indexed epoch,
    uint indexed id
  );

  event SignupRequestVote(
    uint indexed epoch,
    uint indexed id,
    uint indexed epochKey,
    bool inFavor
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

  // epoch => id => forVoteCount, againstVoteCount
  mapping (uint => mapping(uint => uint[2])) signupRequests;
  // prevent double signup request
  // epoch => state leaf
  mapping (uint => mapping(uint => bool)) signupRequestLeaves;
  mapping (uint => SignupRequest) signupData;
  // epoch => epochKey => voteCount
  mapping (uint => mapping(uint => uint)) signupVotes;

  constructor(Unirep _unirep) {
    unirep = _unirep;
    // 15 minute epochs
    unirep.attesterSignUp(60 * 15);
    // unirep.attesterSignUp(60 * 60 * 24);
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
    unirep.verifyEpochKeyProof(publicSignals1, proof1);
    uint currentEpochKey = publicSignals1[0];
    uint epoch = publicSignals1[2];
    uint currentEpoch = unirep.attesterCurrentEpoch(uint160(publicSignals1[3]));
    require(epoch == currentEpoch);
    // verify proof 2, it should be in the past epoch we're trying to claim
    unirep.verifyEpochKeyProof(publicSignals2, proof2);
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
    unirep.verifyEpochKeyProof(publicSignals, proof);
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
    unirep.verifyEpochKeyProof(publicSignals, proof);
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

  /**
   * Takes a signup proof and the hash of some data
   **/
  function signupRequest(
    uint data,
    uint[] memory publicSignals,
    uint[8] memory proof
  ) public {
    unirep.signupVerifier().verifyProof(publicSignals, proof);
    uint currentEpoch = unirep.attesterCurrentEpoch(uint160(publicSignals[2]));
    require(!signupRequestLeaves[currentEpoch][publicSignals[0]], 'double');
    signupRequestLeaves[currentEpoch][publicSignals[0]] = true;
    require(publicSignals[3] == currentEpoch + 1, 'wrongepoch');
    bytes32 _data = keccak256(abi.encode(data, publicSignals, proof));
    uint id = uint(_data) % 2**200;
    SignupRequest memory request = SignupRequest({
      id: id,
      publicSignals: publicSignals,
      proof: proof
    });
    signupData[id] = request;
    emit SignupRequestSubmitted(
      currentEpoch,
      id
    );
  }

  /**
   * Take an epoch key proof with the data being the signup.
   **/
  function voteSignup(
    uint[] memory publicSignals,
    uint[8] memory proof
  ) public {
    unirep.verifyEpochKeyProof(publicSignals, proof);
    uint currentEpoch = unirep.attesterCurrentEpoch(uint160(publicSignals[3]));
    uint epoch = publicSignals[2];
    require(epoch == currentEpoch, 'epoch');
    require(signupVotes[epoch][publicSignals[0]] == 0, 'double');
    signupVotes[epoch][publicSignals[0]] = 1;
    // if first byte is 0, voting aginst, if it's 1, voting for
    uint data = publicSignals[4];
    uint id = data & uint(0x00000000000000ffffffffffffffffffffffffffffffffffffffffffffffffff);
    uint vote = data & uint(0xffffffffffff0000000000000000000000000000000000000000000000000000);
    uint[2] storage request = signupRequests[currentEpoch][id];
    if (vote == 0) {
      // vote against
      request[1]++;
    } else {
      // vote for
      request[0]++;
    }
    emit SignupRequestVote(
      currentEpoch,
      id,
      publicSignals[0],
      vote != 0
    );
  }

  function executeSignup(uint id) public {
    uint currentEpoch = unirep.attesterCurrentEpoch(uint160(address(this)));
    uint[2] storage request = signupRequests[currentEpoch][id];
    require(request[0] > request[1], 'votefail');
    SignupRequest storage data = signupData[id];
    unirep.userSignUp(data.publicSignals, data.proof);
  }
}
