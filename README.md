# balance

## Pre-requisites
- Connection to a mongodb server

## Setup
- Navigate to the directory `balance` and run `npm install`
- Update the `.env` file
  - `DBNAME=`: The database name to connet to if running mongodb locally.
  - `DB_CONNECTION=`: Url to mongodb if not running locally
  - `API_URL=`: http://api.etherscan.io/api?module=account
  - `API_KEY_TOKEN=`: You etherscan api key
  - `LOG_LEVEL=`: Log level for winston logger. Can be set as `debug or info or error`
- To start the application run `node server.js`

## API
- `POST /address/:account_address` : Pass the account address as parameter. This will trigger the process to query etherscan api
to store the normal transaction, internal transaction and balance data in the mongodb database
- `GET /api/normaltransaction` : Get the normal transactions. It can have 4 optional parameters
  - `/api/normaltransaction` : Get all the normal transactions stored in the database collection
  - `/api/normaltransaction?address=acc_address`: Get all the normal transactions stored in the database collection for the `acc_address`
  - `/api/normaltransaction?from=from_address`: Get all the normal transactions stored in the database collection, originated from the `from_address`
  - `/api/normaltransaction?to=to_address`: Get all the normal transactions stored in the database collection, sent to the `to_address`
  - `/api/normaltransaction?hash=txnhash`: Get the normal transaction stored in the database collection, matching the `txnhash`
  
 - `GET /api/internaltransaction` : Get the internal transactions. It can have 4 optional parameters
   - `/api/internaltransaction` : Get all the internal transactions stored in the database collection
   - `/api/internaltransaction?address=acc_address`: Get all the internal transactions stored in the database collection for the `acc_address`
   - `/api/internaltransaction?from=from_address`: Get all the internal transactions stored in the database collection, originated from the `from_address`
   - `/api/internaltransaction?to=to_address`: Get all the internal transactions stored in the database collection, sent to the `to_address`
   - `/api/internaltransaction?hash=txnhash`: Get the internal transaction stored in the database collection, matching the `txnhash`
  
 - `GET /api/balance`: Get the balance for stored accounts. It takes one optional parameter
   - `/api/balance`: Get the account and balances of all the address in the database.
   - `/api/balance?address=acc_address`: Gets the following information for the provided address.
     - account address
     - account balance
     - number of normal txn to this address
     - number of normal txn from this address
     - number of internal txn to this address
     - number of internal txn from this address
   
## Database
- There are three collections created in the database
  - `transactions`: Store normal transaction data. 
    - index: `hash`
  - `inttransactions`: Store internal transaction data.
    - index: `hash`
  - `balances`: Store the balance data for accounts.
