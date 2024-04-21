import Excel from 'exceljs';
import { BitcoinWallet } from '../other/types';

export async function createExcelFile (data: BitcoinWallet[]): Promise<void> {
    const workbook: Excel.Workbook = new Excel.Workbook();
    const worksheet: Excel.Worksheet = workbook.addWorksheet('Data');

    worksheet.columns = [
        { header: 'Mnemonic', key: 'mnemonic', width: 32 },
        { header: 'Legacy (P2PKH) private key', key: 'legacyPrivateKey', width: 32 },
        { header: 'Legacy (P2PKH) wif', key: 'legacyWif', width: 32 },
        { header: 'Legacy (P2PKH) address', key: 'legacyAddress', width: 32 },
        { header: 'Native SegWit (P2WPKH) private key', key: 'nativeSegWitPrivateKey', width: 32 },
        { header: 'Native SegWit (P2WPKH) wif', key: 'nativeSegWitWif', width: 32 },
        { header: 'Native SegWit (P2WPKH) address', key: 'nativeSegWitAddress', width: 32 },
        { header: 'Nested SegWit (P2SH-P2WPKH) private key', key: 'nestedSegWitPrivateKey', width: 32 },
        { header: 'Nested SegWit (P2SH-P2WPKH) wif', key: 'nestedSegWitWif', width: 32 },
        { header: 'Nested SegWit (P2SH-P2WPKH) address', key: 'nestedSegWitAddress', width: 32 },
        { header: 'Taproot (P2TR) private key', key: 'taprootPrivateKey', width: 32 },
        { header: 'Taproot (P2TR) wif', key: 'taprootWif', width: 32 },
        { header: 'Taproot (P2TR) address', key: 'taprootAddress', width: 32 }
    ];

    data.forEach((item: BitcoinWallet): void => {
        worksheet.addRow(item);
    });

    await workbook.xlsx.writeFile('./data/bitcoin-wallets.xlsx');
}
