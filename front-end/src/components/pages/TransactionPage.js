import { ChainId } from '@usedapp/core';
import React from 'react';
const { getBlockchainName } = require('subnet/scripts/getBlockchainName.js');


class TransactionPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      /**
       * subnet: {
       *  subnetId: string,
       *  blockchainId: string,
       *  subnetName: string,
       * }
       */
      subnets: [],
    };
  }

  componentDidMount() {
    const subnets = JSON.parse(localStorage.getItem('subnets')) || [];
    this.setState({ subnets });
  }

  saveSubnet = async (event) => {
    event.preventDefault();
    if (!this.validateSubnet(event)) {
      return;
    }
    let blockchainName
    try {
      blockchainName = await getBlockchainName(
      event.target.elements.blockchainId.value
    )
    } catch (e) {
      blockchainName = 'Unknown'
    }

    if (typeof blockchainName !== 'string') {
      blockchainName = 'Unknown';
    }

    const subnet = {
      subnetId: event.target.elements.subnetId.value,
      blockchainId: event.target.elements.blockchainId.value,
      subnetName:  blockchainName,
    };
    const subnets = [...this.state.subnets, subnet];
    this.setState({ subnets });
    localStorage.setItem('subnets', JSON.stringify(subnets));
  }

  validateSubnet = (event) => {
    event.preventDefault();
    const subnetId = event.target.elements.subnetId.value;
    const blockchainId = event.target.elements.blockchainId.value;

    if (subnetId.length < 49 || subnetId.length > 52 ||
      blockchainId.length < 49 || blockchainId.length > 52) {
      alert('Invalid Subnet ID or Blockchain ID');
      return false;
    }

    if (!subnetId.match(/^[a-zA-Z0-9]+$/) || !blockchainId.match(/^[a-zA-Z0-9]+$/)) {
      alert('Invalid Subnet ID or Blockchain ID');
      return false;
    }

    // if subnet with these ids already exists, return false:
    for (let i = 0; i < this.state.subnets.length; i++) {
      if (this.state.subnets[i].subnetId === subnetId &&
        this.state.subnets[i].blockchainId === blockchainId) {
        alert('Blockchain with these IDs already exists');
        return false;
      }
    }

    return true;
  }

  removeSubnet = (subnetId) => {
    const subnets = this.state.subnets.filter((subnet) => subnet.subnetId !== subnetId);
    this.setState({ subnets });
    localStorage.setItem('subnets', JSON.stringify(subnets));
  }

  render() {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold text-center mb-2 mt-4">Transaction Page</h1>
        </div>
        <div className="form">
          <form onSubmit={this.saveSubnet}>
            <input type="text" name="subnetId" placeholder='Subnet ID' />
            <input type="text" name="blockchainId" placeholder='Blockchain ID' />
            <button className='mt-1 mb-1'
            >
              Add Subnet
            </button>
          </form>
        </div>
        <ul>
          {this.state.subnets.map((subnet) => (
            <div key={subnet.subnetId}>
              <div className="p-6 mt-6 text-left border w-wrap rounded-xl">
                <div className="flex flex-col items-center justify-center">
                  <a href={'/transact/' + subnet.subnetId}>
                    <div className='text-xl font-bold text-center mb-2 hover:text-red-600 focus:text-red-600'>{subnet.subnetName}</div>
                  </a>
                  <div className='flex flex-col items-center justify-center'>
                    <div className='text-lg mb-2'>Subnet ID: {subnet.subnetId}</div>
                    <div className='text-lg'>Blockchain ID: {subnet.blockchainId}</div>   
                    <button className='mt-1' onClick={() =>
                      window.confirm('Are you sure you wish to remove this subnet?')
                      && this.removeSubnet(subnet.subnetId)
                    }
                    >Remove</button>
                    
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ul>
      </div>
    );
  }
}

export default TransactionPage;