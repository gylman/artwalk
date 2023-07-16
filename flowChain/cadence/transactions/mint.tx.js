export const MINT_ARTWALK = `
  import ArtWalk from 0xa963b619092736ed
  
  transaction(image: String, name: String) {

    prepare(acct: AuthAccount) {
      if acct.borrow<&ArtWalk.Collection>(from: ArtWalk.CollectionStoragePath) == nil {
        acct.save(<- ArtWalk.createEmptyCollection(), to: ArtWalk.CollectionStoragePath)
        acct.link<&ArtWalk.Collection{ArtWalk.CollectionPublic}>(/public/ArtWalkCollection, target: ArtWalk.CollectionStoragePath)
      }
          
      let nftCollection = acct.borrow<&ArtWalk.Collection>(from: ArtWalk.CollectionStoragePath)!
      nftCollection.deposit(token: <- ArtWalk.mintNFT(image: image, name: name))
    }

    execute {
      log("NFT MINTED")
    }
  }
`