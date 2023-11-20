import { useState, useEffect } from "react";
import Web3 from "web3";
import metamask from "../assets/metamask.svg";
import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [address, setAddress] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [balance, setBalance] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Get the selected account
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setAddress(accounts[0]);

        // Set loggedIn to true upon successful login
        setLoggedIn(true);
        setError("");
      } catch (error) {
        console.error("Error logging in:", error);
        setError("Error logging in. Please try again.");
      }
    } else {
      setError("MetaMask not found. Please install MetaMask to proceed.");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setAddress("");
    setBalance("");
    setError("");
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (loggedIn && address) {
        try {
          const web3 = new Web3(window.ethereum);
          const weiBalance = await web3.eth.getBalance(address);
          const etherBalance = web3.utils.fromWei(weiBalance, "ether");
          setBalance(etherBalance);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
  }, [loggedIn, address]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="p-8 bg-gray-800 rounded-lg shadow-lg">
        {error && <p className="text-red-500">{error}</p>}
        {!loggedIn ? (
          <>
            <img className="w-56 ml-6" src={metamask} alt="MetaMask" />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10 pt-2"
              onClick={handleLogin}
            >
              Login with MetaMask
            </button>
            <br />
            <p className="text-center p-3">OR</p>
            <Link
              to="https://metamask.io/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-1">
                Create your Metamask Account
              </button>
            </Link>
          </>
        ) : (
          <div>
            <p>Logged in with address: {address}</p>
            {balance && <p>Balance: {balance} ETH</p>}
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
