export type BaseBitcoinWallet = {
    privateKey: string,
    address: string,
    wif: string
};

export type BitcoinWallet = {
    mnemonic: string,
    legacyPrivateKey: string,
    legacyWif: string,
    legacyAddress: string,
    nativeSegWitPrivateKey: string,
    nativeSegWitWif: string,
    nativeSegWitAddress: string,
    nestedSegWitPrivateKey: string,
    nestedSegWitWif: string,
    nestedSegWitAddress: string,
    taprootPrivateKey: string,
    taprootWif: string,
    taprootAddress: string
};