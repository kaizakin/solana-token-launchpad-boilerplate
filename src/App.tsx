import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./App.css";
import { TokenLaunchpad } from "./components/TokenLaunchpad";
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";

function App() {
  return (
    <>
      <ConnectionProvider endpoint="https://api.devnet.solana.com">
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <WalletMultiButton />
            <WalletDisconnectButton />
            <TokenLaunchpad />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

export default App;
