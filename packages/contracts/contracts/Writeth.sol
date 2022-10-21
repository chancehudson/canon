pragma solidity ^0.8.0;

import { Unirep } from '@unirep/contracts/Unirep.sol';

contract Writeth {
  constructor(Unirep unirep) {
    unirep.attesterSignUp(60 * 60 * 24 * 7);
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
