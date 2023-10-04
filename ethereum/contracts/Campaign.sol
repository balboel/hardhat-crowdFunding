// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.2;

contract CampaignFactory {
    address payable[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender)); //msg.sender here is the deployer of crowdFunding contract
                                                                                //and will be used to be the manager in crowdFunding contract 
        deployedCampaigns.push(payable(newCampaign));
    }

    function getDeployedCampaigns() public view returns (address payable[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint voterCount;
        mapping(address => bool) voters;
    }

    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers; //mapping bool default value is false
    uint public approversCount;
    Request[] public requests;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor (uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory description, uint value, address recipient) public restricted {
        // Request memory newRequest = Request({
            // description: description,
            // value: value,
            // recipient: recipient,
            // complete: false,
            // voterCount: 0
        // });

        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.voterCount = 0;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender], "You are not a contributor"); //look up if msg.sender is an approvers
        require(!request.voters[msg.sender], "You already voted in this request"); //look up if msg.sender already vote or no

        request.voters[msg.sender] = true;
        request.voterCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        
        require(request.voterCount > (approversCount/2));
        require(!request.complete);

        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution, 
            address(this).balance, 
            requests.length, 
            approversCount, 
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    } 
}



