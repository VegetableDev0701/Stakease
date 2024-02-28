import { useContext } from "react";
import { WalletContext } from "../store/WalletProvider";

export const useWalletStore = () => useContext(WalletContext);
