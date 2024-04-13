import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

//Internal Imports
import {
  CheckIfWalletConnected,
  connectWallet,
  connectingWithContract,
} from "../utils/apiFeature";

export const ZBlockContext = React.createContext();

export const ZBlockProvider = ({ children }) => {
  //UseState
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [friendLists, setFriendLists] = useState([]);
  const [friendMsg, setFriendMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [error, setError] = useState("");

  //Chat User Data
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  const router = useRouter();

  //Fetch Data Time of Page Load
  const fetchData = async () => {
    try {
      //get contract
      const contract = await connectingWithContract();
      //get account
      const connectAccount = await connectWallet();
      setAccount(connectAccount);
      //get username
      const userName = await contract.getUsername(connectAccount);
      setUserName(userName);
      //get friend list
      const friendLists = await contract.getMyFriendList();
      setFriendLists(friendLists);
      //get all application user lists
      const userLists = await contract.getAllAppUsers();
      setUserLists(userLists);
    } catch (error) {
      setError("Please Install and Connect Your Wallet!");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  //Read Message
  const readMessage = async (friendAddress) => {
    try {
      const contract = await connectingWithContract();
      const read = await contract.readMessage(friendAddress);
      setFriendMsg(read);
    } catch (error) {
      setError("Currently You Have No Messages");
    }
  };

  //Create Account
  const createAccount = async ({ name, accountAddress }) => {
    try {
      if (name || accountAddress)
        return setError("Name and Account cannot be Empty!");
      const contract = await connectingWithContract();
      const getCreatedUser = await contract.createAccount(name);
      setLoading(true);
      await getCreatedUser.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Error while Creating Account. Please Reload Browser");
    }
  };

  //Add Your Friend
  const addFriends = async (name, accountAddress) => {
    try {
      if (name || accountAddress) return setError("Please provide account");

      const contract = await connectingWithContract();
      const addMyFriend = await contract.addFriend(accountAddress, name);
      setLoading(true);
      await addMyFriend.wait();
      setLoading(false);
      router.push("/");
      window.location.reload();
    } catch (error) {
      setError("Something went wrong while adding friend. Try Again!");
    }
  };

  //Send Message To Friend
  const sendMessage = async ({ msg, address }) => {
    try {
      if (msg || address) return setError("Please type your message");
      const contract = await connectingWithContract();
      const addMessage = await contract.sendMessage(address, msg);
      setLoading(true);
      await addMessage.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Please reload and Try Again!");
    }
  };

  //Read Information
  const readUser = async (userAddress) => {
    const contract = await connectingWithContract();
    const userName = await contract.getUsername(userAddress);
    setCurrentUserName(userName);
    setCurrentUserAddress(userAddress);
  };
  return (
    <ZBlockContext.Provider
      value={{
        readMessage,
        createAccount,
        addFriends,
        sendMessage,
        readUser,
        account,
        userName,
        friendLists,
        friendMsg,
        loading,
        userLists,
        error,
        currentUserName,
        currentUserAddress,
      }}
    >
      {children}
    </ZBlockContext.Provider>
  );
};
