export enum ErrorMessages {
  extensionMessage = 'Invalid file extension, Please select a valid csv of exel file',
  invalidFile = 'The file is broken or invalid. Please select a valid file.',
  invalidFormat = 'Invalid file format. Please select a valid file format.',
  invalidHeaders = 'Invalid header. Please upload a file with valid header.',
  duplicateWallets = 'There are duplicate wallet addresses present in the file: ',
  invalidAmount = 'You have not valid amount in file: ',
}

export enum FileExtensions {
  CSV = 'csv',
  XLSX = 'xlsx',
  XLS = 'xls',
}

export const ALLOWED_EXTENSIONS = [FileExtensions.CSV, FileExtensions.XLS, FileExtensions.XLSX];

export const ERROR_MESSAGES = {
  extensionMessage: ErrorMessages.extensionMessage,
  invalidFile: ErrorMessages.invalidFile,
  invalidFormat: ErrorMessages.invalidFormat,
  invalidHeaders: ErrorMessages.invalidHeaders,
};
