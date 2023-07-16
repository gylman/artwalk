// https://github.com/onflow/flow-nft/blob/master/contracts/ExampleNFT.cdc
// https://www.youtube.com/watch?v=GVz0M4bavWs&ab_channel=JacobTucker

import NonFungibleToken from "NonFungibleToken"

pub contract ArtWalk: NonFungibleToken {

    /// Total supply of ArtWalkNFTs in existence
    pub var totalSupply: UInt64

    /// The event that is emitted when the contract is created
    pub event ContractInitialized()

    /// The event that is emitted when an NFT is withdrawn from a Collection
    pub event Withdraw(id: UInt64, from: Address?)

    /// The event that is emitted when an NFT is deposited to a Collection
    pub event Deposit(id: UInt64, to: Address?)

    /// Storage and Public Paths
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    /// The core resource that represents a Non Fungible Token.
    /// New instances will be created using the NFTMinter resource
    /// and stored in the Collection resource
    ///
    pub resource NFT: NonFungibleToken.INFT {

        /// The unique ID that each NFT has
        pub let id: UInt64

        /// Metadata fields
        pub let name: String
        pub let image: String

        init(_name: String, _image: String) {
            self.id = ArtWalk.totalSupply
            ArtWalk.totalSupply = ArtWalk.totalSupply + 1
            self.name = _name   
            self.image = _image
        }

    }

    /// Defines the methods that are particular to this NFT contract collection
    ///
    pub resource interface CollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowEntireNFT(id: UInt64): &NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow ArtWalkNFT reference: the ID of the returned reference is incorrect"
            }
        }
    }

    /// The resource that will be holding the NFTs inside any account.
    /// In order to be able to manage NFTs any account will need to create
    /// an empty collection first
    ///
    pub resource Collection: CollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
            self.ownedNFTs <- {}
        }

        /// Removes an NFT from the collection and moves it to the caller
        ///
        /// @param withdrawID: The ID of the NFT that wants to be withdrawn
        /// @return The NFT resource that has been taken out of the collection
        ///
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        /// Adds an NFT to the collections dictionary and adds the ID to the id array
        ///
        /// @param token: The NFT resource to be included in the collection
        ///
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @ArtWalk.NFT

            emit Deposit(id: token.id, to: self.owner?.address)
            // add the new token to the dictionary which removes the old one
            self.ownedNFTs[token.id] <-! token
        }

        /// Helper method for getting the collection IDs
        ///
        /// @return An array containing the IDs of the NFTs in the collection
        ///
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        /// Gets a reference to an NFT in the collection so that
        /// the caller can read its metadata and call its methods
        ///
        /// @param id: The ID of the wanted NFT
        /// @return A reference to the wanted NFT resource
        ///
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        /// Gets a reference to the whole NFT 
        /// interface so that the caller can retrieve the views that the NFT
        /// is implementing and resolve them
        ///
        /// @param id: The ID of the wanted NFT
        /// @return The resource reference conforming to the Resolver interface
        ///
        pub fun borrowEntireNFT(id: UInt64): &NFT {
            let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            return nft as! &NFT
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    /// Allows anyone to create a new empty collection
    ///
    /// @return The new Collection resource
    ///
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }
    
    pub fun mintNFT(image: String, name: String): @NFT{
        return <- create NFT(_name: name, _image: image)
    }

    init() {
        // Initialize the total supply
        self.totalSupply = 0

        // Set the named paths
        self.CollectionStoragePath = /storage/ArtWalkCollectionStorage
        self.CollectionPublicPath = /public/ArtWalkCollectionPublic
        self.MinterStoragePath = /storage/ArtWalkCollectionMinter

        // Create a Collection resource and save it to storage
        let collection <- create Collection()
        self.account.save(<-collection, to: self.CollectionStoragePath)

        // create a public capability for the collection
        self.account.link<&ArtWalk.Collection{NonFungibleToken.CollectionPublic, ArtWalk.CollectionPublic}>(
            self.CollectionPublicPath,
            target: self.CollectionStoragePath
        )


        emit ContractInitialized()
    }
}