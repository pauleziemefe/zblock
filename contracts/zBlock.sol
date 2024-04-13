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

    struct AllUserStruct{
        string name;
        address accoutAddress;
    }

    AllUserStruct[] getAllUsers;

    mapping(address => user) userList; 
    mapping(bytes32 => message[]) allMessages; 

    //check if user exists
    function checkUserExists(address pubkey) public view returns(bool){
        return bytes (userList[pubkey].name).length > 0;
    }

    //to create account
    function createAccount(string calldata name) external {
        require(checkUserExists(msg.sender) == false, "User already exists!");
        require(bytes(name).length>0, "Username cannot be empty!");

        userList[msg.sender].name = name;

        getAllUsers.push(AllUserStruct(name, msg.sender));
    }

    //to get username
    function getUsername(address pubkey) external view returns(string memory){
        require(checkUserExists(pubkey), "User is not registered!");
        return userList[pubkey].name;
    }

    //to add friends
    function addFriend(address friend_key, string calldata name) external{
        require(checkUserExists(msg.sender), "Create an account first!");
        require(checkUserExists(friend_key), "User is not registered!");
        require(msg.sender != friend_key, "User cannot add themselves as friend!");
        require(checkAlreadyFriends(msg.sender, friend_key)== false, "You are already friends!");

        _addfriend(msg.sender, friend_key, name);
        _addfriend(friend_key, msg.sender, userList[msg.sender].name);
    }

    function checkAlreadyFriends(address pubkey1, address pubkey2) internal view returns(bool){
        if(userList[pubkey1].friendList.length > userList[pubkey2].friendList.length){
            address tmp = pubkey1;
            pubkey1 = pubkey2;
            pubkey2 = tmp;
        } 
        for (uint256 i = 0; i < userList[pubkey1].friendList.length; i++) {
            if(userList[pubkey1].friendList[i].pubkey == pubkey2)return true;
        }
        return false;
    }

    function _addfriend(address me, address friend_key, string memory name) internal{
        friend memory newFriend = friend(friend_key, name);
        userList[me].friendList.push(newFriend);
    }

    //get my friend
    function getMyFriendList() external view returns(friend[] memory){
        return userList[msg.sender].friendList;
    }

    //get chat code
    function _getChatCode(address pubkey1, address pubkey2) internal pure returns(bytes32){
        if(pubkey1 < pubkey2){
            return keccak256(abi.encodePacked(pubkey1, pubkey2));
        } else return keccak256(abi.encodePacked(pubkey2, pubkey1));
    }

    //send messages
    function sendMessage(address friend_key, string calldata _msg) external{
        require(checkUserExists(msg.sender), "Create an account first!");
        require(checkUserExists(friend_key), "User is not registered!");
        require(checkAlreadyFriends(msg.sender, friend_key), "You are not friends with user!");

        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        message memory newMsg = message(msg.sender, block.timestamp, _msg);
        allMessages[chatCode].push(newMsg);
    }

    //read message
    function readMessage(address friend_key) external view returns(message[] memory){
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        return allMessages[chatCode];
    }

    function getAllAppUsers() public view returns(AllUserStruct[] memory){
        return getAllUsers;
    }
}    