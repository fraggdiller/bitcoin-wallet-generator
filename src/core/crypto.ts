import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { ethers } from 'ethers';
import { createECDH, createHash, ECDH } from 'node:crypto';
import bs58check from 'bs58check';
import base58 from 'bs58';
import { Paths } from '../other/enums';
import bech32 from 'bech32';
import { ECPairAPI, ECPairFactory, ECPairInterface } from 'ecpair';
import * as tinysecp from 'tiny-secp256k1';
import ecurve from 'ecurve';
import { BaseBitcoinWallet } from '../other/types';
// @ts-ignore
import schnorr from 'bip-schnorr';



export default class Crypto {

    private static getLegacyAddress (privateKey: string): string {
        const ecdh: ECDH = createECDH('secp256k1');
        const privateKeyBuffer: Buffer = Buffer.from(privateKey, 'hex');
        ecdh.setPrivateKey(privateKeyBuffer);
        const publicKey: Buffer = ecdh.getPublicKey(null, 'compressed');

        const sha256Hash: Buffer = createHash('sha256').update(publicKey).digest();
        const ripemd160Hash: Buffer = createHash('ripemd160').update(sha256Hash).digest();
        const addressBuffer: Buffer = Buffer.concat([Buffer.from([0x00]), ripemd160Hash]);

        return bs58check.encode(addressBuffer);
    };

    protected static processLegacyFromMnemonic (mnemonic: string): BaseBitcoinWallet {
        const wallet: ethers.HDNodeWallet = ethers.HDNodeWallet.fromPhrase(mnemonic, '', Paths.bLegacy, ethers.wordlists.en);
        const privateKey: string = this.removeHexPrefix(wallet.privateKey);

        const address: string = this.getLegacyAddress(privateKey);

        const wif: string = this.getWif(privateKey);

        return {
            privateKey: privateKey,
            address: address,
            wif: wif
        };
    };

    private static getNativeSegWitAddress (publicKey: string): string {
        const publicKeyBuffer: Buffer = Buffer.from(this.removeHexPrefix(publicKey), 'hex');
        const sha256Hash: Buffer = createHash('sha256').update(publicKeyBuffer).digest();
        const ripemd160Hash: Buffer = createHash('ripemd160').update(sha256Hash).digest();

        const words: number[] = bech32.bech32.toWords(ripemd160Hash);
        words.unshift(0);

        return bech32.bech32.encode('bc', words);
    };

    protected static processNativeSegWitFromMnemonic (mnemonic: string): BaseBitcoinWallet {
        const wallet: ethers.HDNodeWallet = ethers.HDNodeWallet.fromPhrase(mnemonic, '', Paths.bNative, ethers.wordlists.en);
        const privateKey: string = this.removeHexPrefix(wallet.privateKey);
        const publicKey: string = wallet.publicKey;

        const address: string = this.getNativeSegWitAddress(publicKey);

        const wif: string = this.getWif(privateKey);

        return {
            privateKey: privateKey,
            address: address,
            wif: wif
        };
    };

    private static getNestedSegWitAddress (privateKey: string): string {
        const ecdh: ECDH = createECDH('secp256k1');
        const privateKeyBuffer: Buffer = Buffer.from(privateKey, 'hex');
        ecdh.setPrivateKey(privateKeyBuffer);
        const publicKey: Buffer = ecdh.getPublicKey(null, 'compressed');

        const sha256Hash: Buffer = createHash('sha256').update(publicKey).digest();
        const ripemd160Hash: Buffer = createHash('ripemd160').update(sha256Hash).digest();

        const redeemScript: Buffer = Buffer.concat([
            Buffer.from('0014', 'hex'),
            ripemd160Hash
        ]);

        const redeemScriptHash: Buffer = createHash('sha256').update(redeemScript).digest();
        const redeemScriptRipemd160: Buffer = createHash('ripemd160').update(redeemScriptHash).digest();

        const addressBytes: Buffer = Buffer.concat([
            Buffer.from('05', 'hex'),
            redeemScriptRipemd160
        ]);

        const checksum: Buffer = createHash('sha256').update(createHash('sha256').update(addressBytes).digest()).digest().slice(0, 4);

        const addressBuffer: Buffer = Buffer.concat([addressBytes, checksum]);

        return base58.encode(addressBuffer);
    };

    protected static processNestedSegWitFromMnemonic (mnemonic: string): BaseBitcoinWallet {
        const wallet: ethers.HDNodeWallet = ethers.HDNodeWallet.fromPhrase(mnemonic, '', Paths.bNested, ethers.wordlists.en);
        const privateKey: string = this.removeHexPrefix(wallet.privateKey);

        const address: string = this.getNestedSegWitAddress(privateKey);

        const wif: string = this.getWif(privateKey);

        return {
            privateKey: privateKey,
            address: address,
            wif: wif
        };
    };

    private static getTaprootAddress (privateKey: string): string {
        const ECPair: ECPairAPI = ECPairFactory(tinysecp);
        const secp256k1: ecurve.Curve = ecurve.getCurveByName('secp256k1');

        const privateKeyBuffer: Buffer = Buffer.from(privateKey, 'hex');
        const keyPair: ECPairInterface = ECPair.fromPrivateKey(privateKeyBuffer);

        const pubKey = ecurve.Point.decodeFrom(secp256k1, keyPair.publicKey);
        const taprootPubkey = schnorr.taproot.taprootConstruct(pubKey);
        const words: number[] = bech32.bech32.toWords(taprootPubkey);
        words.unshift(1);

        return bech32.bech32m.encode('bc', words);
    };

    protected static processTaprootFromMnemonic (mnemonic: string): BaseBitcoinWallet {
        const wallet: ethers.HDNodeWallet = ethers.HDNodeWallet.fromPhrase(mnemonic, '', Paths.bTaproot, ethers.wordlists.en);
        const privateKey: string = this.removeHexPrefix(wallet.privateKey);

        const address: string = this.getTaprootAddress(privateKey);

        const wif: string = this.getWif(privateKey);

        return {
            privateKey: privateKey,
            address: address,
            wif: wif
        };
    };

    private static getWif (privateKey: string): string {
        const extendedKey: string = '80' + this.removeHexPrefix(privateKey) + '01';

        const _1sha256: Buffer = createHash('sha256').update(Buffer.from(extendedKey, 'hex')).digest();
        const _2sha256: Buffer = createHash('sha256').update(_1sha256).digest();
        const finalKey: Buffer = Buffer.from(extendedKey + _2sha256.toString('hex').slice(0, 8), 'hex');

        return base58.encode(finalKey);
    };

    protected static generateMnemonic (): string {
        return bip39.generateMnemonic(wordlist, 128);
    };
    
    private static removeHexPrefix (hex: string): string {
        return hex.replace(/^0x/i, '');
    };
}