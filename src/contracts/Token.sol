pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./ERC20.sol";

contract Token is ERC20 {
    mapping(address => string[]) _places;
    mapping(string => address) _owner;
    mapping(string => address) _hosp;
    string[] public places;
    string memeHash;
    string m = " ";
    uint i;
    uint j;

    constructor() ERC20("MedicalToken", "MTKN") public {
   }

  function mint(string memory name,string memory symbol, uint amnt) public payable{
      _name = name;
      _symbol = symbol;
      _mint(msg.sender, amnt);
      _owner[symbol] = msg.sender;
  }

  function _send(string memory place,address _address) public {
      transfer(_address, 1);
      places = _places[msg.sender];
      places.push(place);
      _places[msg.sender] = places;
      _hosp[place] = _address;
      //approve(msg.sender,1);
  }

  function callb(string memory place) public {
      for(i=0;i<_places[msg.sender].length;i++){
          
          if(keccak256(abi.encodePacked((_places[msg.sender][i]))) == keccak256(abi.encodePacked((place)))){
              j=i;
              _burn(retadd(place),1);
              _mint(msg.sender,1);
          }
      }
      delete _places[msg.sender][j];
      //transferFrom(_hosp[place],msg.sender,1);      
  }

  function arr() public view returns (string[] memory){
      return _places[msg.sender];
  }

  function retadd(string memory pl) public view returns (address){
      return _hosp[pl];
  }

  function set(string memory _memeHash) public {
    memeHash = _memeHash;
  }

  function get() public view returns (string memory) {
      if (balanceOf(msg.sender)>0)
      {return memeHash;}
      else { return m;}
  }


}