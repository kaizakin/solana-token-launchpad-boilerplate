import { createInitializeMint2Instruction, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useState } from "react"

export function TokenLaunchpad() {

    const wallet = useWallet();
    const { connection } = useConnection(); // connnection provider gives the connection to the RPC 
    console.log("connection url" + connection);

    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [image, setImageUrl] = useState("");
    const [supply, setSupply] = useState("");

    async function createToken() {
        const lamports = await getMinimumBalanceForRentExemptMint(connection);   // min balance for rent exemption
        const mintKeypair = Keypair.generate(); // keypair of the mint acc
        const decimals = 2; // the number of decimals the token can have (user defined)

        // createMint(); // instead of calling this this require the private key to sign paritally sign the transaction and pass it to wallet for complete signature.

        const transaction = new Transaction().add(
            SystemProgram.createAccount({ // creates a mint acc
                fromPubkey: wallet.publicKey as PublicKey, // user creating token
                newAccountPubkey: mintKeypair.publicKey,
                space: MINT_SIZE,
                lamports,
                programId: TOKEN_PROGRAM_ID,
            }),
            createInitializeMint2Instruction(mintKeypair.publicKey, decimals, wallet.publicKey as PublicKey, wallet.publicKey as PublicKey, TOKEN_PROGRAM_ID), // Initializes the mint.
            // mint authority and freeze authority of that mint is set to the user's public key.
        );

        transaction.feePayer = wallet.publicKey as PublicKey; // the user creating the mint is gonna be the gas feepayer for the transaction.
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash; // the hash of the latest added block solana asks this becoz 
        // by the time this transaction gets processed if the blockchain has grown long solana will simply reject this mint transaction.

        transaction.partialSign(mintKeypair); // since the user's private key isn't accesible paritially sign and send the transaction to wallet to complete signature.
        const response = await wallet.sendTransaction(transaction, connection); //it will popup the wallet to sign the transaction and send it to the blockchain.
        console.log(response);
    }

    return <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }}>
        <h1>Solana Token Launchpad</h1>
        <input onChange={e => setName(e.target.value)} className='inputText' type='text' placeholder='Name'></input> <br />
        <input onChange={e => setSymbol(e.target.value)} className='inputText' type='text' placeholder='Symbol'></input> <br />
        <input onChange={e => setImageUrl(e.target.value)} className='inputText' type='text' placeholder='Image URL'></input> <br />
        <input onChange={e => setSupply(e.target.value)} className='inputText' type='text' placeholder='Initial Supply'></input> <br />
        <button onClick={createToken} className='btn'>Create a token</button>
    </div>
}