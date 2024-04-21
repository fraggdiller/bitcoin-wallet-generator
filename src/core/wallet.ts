import Crypto from './crypto';
import { BaseBitcoinWallet, BitcoinWallet } from '../other/types';


export default class Wallet extends Crypto {

    public static generateWallet (count: number): BitcoinWallet[] {
        const wallets: BitcoinWallet[] = [];

        for (let i: number = 0; i < count; i++) {
            const mnemonic: string = this.generateMnemonic();

            const generatedWallet: BitcoinWallet = this.processWalletFromMnemonic(mnemonic);

            wallets.push(generatedWallet);
        }

        return wallets;
    };

    public static getWalletFromMnemonic (mnemonics: string[]): BitcoinWallet[] {
        const wallets: BitcoinWallet[] = [];

        for (let i: number = 0; i < mnemonics.length; i++) {
            const mnemonic: string = mnemonics[i];
            const generatedWallet: BitcoinWallet = this.processWalletFromMnemonic(mnemonic);

            wallets.push(generatedWallet);
        }

        return wallets;
    };

    private static processWalletFromMnemonic (mnemonic: string): BitcoinWallet {
        const legacyWallet: BaseBitcoinWallet = this.processLegacyFromMnemonic(mnemonic);
        const nativeSegWitWallet: BaseBitcoinWallet = this.processNativeSegWitFromMnemonic(mnemonic);
        const nestedSegWitWallet: BaseBitcoinWallet = this.processNestedSegWitFromMnemonic(mnemonic);
        const taprootWallet: BaseBitcoinWallet = this.processTaprootFromMnemonic(mnemonic);

        return {
            mnemonic: mnemonic,
            legacyPrivateKey: legacyWallet.privateKey,
            legacyWif: legacyWallet.wif,
            legacyAddress: legacyWallet.address,
            nativeSegWitPrivateKey: nativeSegWitWallet.privateKey,
            nativeSegWitWif: nativeSegWitWallet.wif,
            nativeSegWitAddress: nativeSegWitWallet.address,
            nestedSegWitPrivateKey: nestedSegWitWallet.privateKey,
            nestedSegWitWif: nestedSegWitWallet.wif,
            nestedSegWitAddress: nestedSegWitWallet.address,
            taprootPrivateKey: taprootWallet.privateKey,
            taprootWif: taprootWallet.wif,
            taprootAddress: taprootWallet.address
        };
    };
}