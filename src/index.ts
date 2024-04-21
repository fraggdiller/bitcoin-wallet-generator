import { BitcoinWallet } from './other/types';
import Wallet from './core/wallet';
import Filehandler from './other/filehandler';
import { createExcelFile } from './core/excel';


async function main (): Promise<void> {

    const args: string[] = process.argv.slice(3);

    let wallets: BitcoinWallet[];

    switch (args[0]) {
        case 'generate':
            wallets = Wallet.generateWallet(parseInt(args[1]));
            break;
        case 'get':
            const mnemonics: string[] = await Filehandler.loadFile('./data/mnemonics.txt');
            wallets = Wallet.getWalletFromMnemonic(mnemonics);
            break;
        default:
            throw new Error('Invalid args. use npm start generate N or npm start get');
    }

    await createExcelFile(wallets);
}

await main();