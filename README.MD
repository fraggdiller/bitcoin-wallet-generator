[![Typing SVG](https://readme-typing-svg.demolab.com?font=Raleway&weight=500&size=50&duration=3000&pause=1000&color=20F700&center=true&vCenter=true&width=640&height=90&lines=Bitcoin+Wallet+Generator)](https://git.io/typing-svg)

# Bitcoin wallets generator

This code will allow you to generate a specified number of Bitcoin wallets and save them to xlsx file.

- Legacy (P2PKH)
- Native SegWit (P2WPKH)
- Nested SegWit (P2SH-P2WPKH)
- Taproot (P2TR)

## Install dependencies

You can install it using:
```
npm i
```

## Wallet generator

To generate wallets you can run the following command in terminal
```
npm start generate 10
```

It runs wallet generator and saves generated data in `./data/bitcoin-wallets.xlsx`

## Getting data of pregenerated wallets
You can get all wallet data from mnemonics. You should load your mnemonics to `./data/mnemonics.txt` and run
```
npm start get
```

## Conclusion
```
git clone https://github.com/fraggdiller/bitcoin-wallet-generator.git
cd bitcoin-wallet-generator
npm i
npm start generate 10
npm start get
```

### Support / Qs

`Telegram:` https://t.me/alblak7952