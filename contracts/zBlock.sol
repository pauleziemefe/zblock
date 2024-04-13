pragma solidity >=0.7.0 <0.9.0;

contract ZBlock{

    //user structure
    struct user{
        string name;
        friend[] friendList;
    }

    struct friend{
        address pubkey;
        string name;
    }

    struct message{
        address sender;
        uint256 timestamp;
        string msg;
    }

    mapping(address => user) userList; 
    mapping(bytes32 => message[]) allMessages; 

    //check if user exists
    function checkUserExists(address pubkey) public view returns(bool){
        return bytes (userList[pubkey].name).length > 0;
    }

    //to create account
    function createAccount(string calldata name) external {
        require(checkUserExists(msg.sender) == false, "User already exists!");
        require(byte(name).length>0, "Username cannot be empty!");

        userList[msg.sender].name = name;
    }
}    
