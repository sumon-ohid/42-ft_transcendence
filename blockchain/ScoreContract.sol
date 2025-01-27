// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ScoreContract
{
    struct Result
    {
        string winnerName;
        uint score;
    }

    mapping(uint => Result) public results;
    uint public resultCount = 0;

    function storeResult(string memory _winnerName, uint _score) public
    {
        results[resultCount] = Result(_winnerName, _score);
        resultCount++;
    }

    function getAllResults() public view returns (Result[] memory) {
        Result[] memory allResults = new Result[](resultCount);
        for (uint i = 0; i < resultCount; i++) {
            allResults[i] = results[i];
        }
        return allResults;
    }
}