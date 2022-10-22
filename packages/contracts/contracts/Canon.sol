pragma solidity ^0.8.0;

import { Unirep } from '@unirep/contracts/Unirep.sol';

contract Canon {
  Unirep unirep;
  address admin;

  constructor(Unirep _unirep) {
    unirep = _unirep;
    unirep.attesterSignUp(60 * 60 * 24 * 7);
    admin = msg.sender;
  }

  function signup(uint[] memory publicSignals, uint[8] memory proof) public {
    require(msg.sender == admin);
    unirep.userSignUp(publicSignals, proof);
  }

  // a story is a linked list of sections
  struct Section {
    uint id;
    uint author; // an epoch key
    uint authorGraffiti; // graffiti the author left with the section
    uint lastSectionId;
  }

  /**
   * Submit a new section of writing that others may vote on. Accept an epoch
   * key proof signing the hash of the section and any other data.
   **/
  function submitSection() public {

  }

  /**
   * Vote on a section.
   **/
  function voteSection() public {}
}
