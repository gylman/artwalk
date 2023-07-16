# Structure

- ./cadence contains smart contracts, scripts for interaction with blockchain and transactions to be sent to it 
- ./TestFrontEnd folder contains React-App with simple frontEnd for testing the interaction with contracts localy

## Usage 

### TestFronEnd
To test interaction localy run:
    
    cd ./TestFrontEnd 
then:
    
    npm start 
you can see the service on http://localhost:3000

### Deployment:
To deploy the contracts on Testnet run in terminal:
    
    flow project deploy --network testnet
don't forget to set up your account and put it in flow.json

To update contracts on account run in terminal: 

    flow accounts update-contract <ContractName> --network testnet --signer <YourAccount>

For keys generation look into Flow Docs: 
    
    https://developers.flow.com/tooling/flow-cli/keys/generate-keys