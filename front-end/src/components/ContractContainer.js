import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/fontawesome-free-solid";
import { ethers } from "ethers";
import Collapsible from "./Collapsible";
import { useContractFunction } from "@usedapp/core";
import { Contract } from "ethers";

import { abi } from "../constants";

export default function ContractContainer({
  contractAddress,
  onDeleteRefresh,
}) {
  const [demandVolume, setDemandVolume] = useState(0);
  const [epochNumber, setEpochNumber] = useState(0);
  const [contractInstance, setContractInstance] = useState(null);

  const { state: demandState, send: demand } = useContractFunction(
    contractInstance,
    "demand",
    { transactionName: "Demand" }
  );
  const { state: claimState, send: claim } = useContractFunction(
    contractInstance,
    "claim",
    { transactionName: "Claim" }
  );

  useEffect(() => {
    if (contractAddress) {
      const instance = generateContractInstance(contractAddress);
      setContractInstance(instance);
    }
  }, [contractAddress]);

  const generateContractInstance = (address) => {
    const instance = new Contract(address, abi, ethers.getDefaultProvider());
    return instance;
  };

  const deleteContractAddress = (contractAddress) => {
    const contractAddresses =
      JSON.parse(localStorage.getItem("contractAddresses")) || [];
    const newContractAddresses = contractAddresses.filter(
      (address) => address !== contractAddress
    );
    localStorage.setItem(
      "contractAddresses",
      JSON.stringify(newContractAddresses)
    );
    onDeleteRefresh((prev) => !prev);
  };

  const handleDemandVolumeChange = (event) => {
    setDemandVolume(event.target.value);
  };

  const handleEpochNumberChange = (event) => {
    setEpochNumber(event.target.value);
  };

  const handleDemand = (event) => {
    event.preventDefault();
    demand(demandVolume);
  };

  const handleClaim = (event) => {
    event.preventDefault();
    claim(epochNumber);
  };

  return (
    <div className="mb-6 border-2 border-gray-300 mb-2 rounded-xl">
      <Collapsible
        close
        title=<div className="flex flex-row items-center justify-center">
          <a
            href={`https://testnet.snowtrace.io/address/${contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {
              <div className="text-l font-bold text-center hover:text-blue-600 focus:text-blue-600">
                {contractAddress}
              </div>
            }
          </a>
        </div>
        item=<div
          className="btn p-2 hover:bg-gray-200 rounded font-weight-bold text-center"
          onClick={() => {
            if (
              window.confirm("Are you sure you wish to remove this contract?")
            )
              deleteContractAddress(contractAddress);
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </div>
      >
        <div className="flex flex-row items-center justify-center mb-1"></div>
        <div className="flex flex-col items-end justify-end">
          <div className="flex flex-row items-center justify-center mb-1">
            <input
              className="w-28"
              type="number"
              name="volume"
              placeholder="vol"
              value={demandVolume}
              onChange={handleDemandVolumeChange}
            />
            <button className="w-24" onClick={(event) => handleDemand(event)}>
              demand
            </button>
          </div>
          <div className="flex flex-row items-center justify-center mb-1">
            <input
              className="w-28"
              type="number"
              name="epochNumber"
              placeholder="epoch"
              value={epochNumber}
              onChange={handleEpochNumberChange}
            />
            <button className="w-24" onClick={(event) => handleClaim(event)}>
              claim
            </button>
          </div>
          <div className="flex flex-row items-center justify-center mb-1">
            <button className="w-24">claimAll</button>
          </div>
        </div>
      </Collapsible>
    </div>
  );
}
