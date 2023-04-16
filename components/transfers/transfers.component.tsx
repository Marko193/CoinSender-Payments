import { useCallback, useEffect, useState } from 'react';
import { SendTransferComponent } from '@/components/send-transfers/send-transfers.component';
import DocumentParserComponent from '@/components/document-parcer/document-parser.component';
import useLocalStorage from '@/hooks/useLocalStorage';
import useFileImport from '@/hooks/useFileImport';
import { useSelector } from 'react-redux';
import { LoaderState } from '@/state/loader/reducer';
const validHeaders: string[] = ['name', 'wallet', 'amount'];

export const TransfersComponent = () => {

  const { error, handleFileImport, localStorage } = useFileImport(validHeaders);

  const [value, setValue] = useLocalStorage('fileData', localStorage);

  const [selectedRows, setSelectedRows] = useState([]);
  const [transactionData, setTransactionData] = useState({ amount: [], wallets: [] });
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [tableData, setTableData] = useState<any>(localStorage);

  const loaderState: LoaderState = useSelector(({ loader }: any) => loader);

  const handleUploadModal = useCallback(() => {
    setUploadModalOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    let amount: any = [];
    let wallets: any = [];
    if (selectedRows && selectedRows.length > 0) {
      amount = selectedRows.map((item: any) => item.amount);
      wallets = selectedRows.map((item: any) => item.wallet);
    }

    setTransactionData({ amount, wallets });
    return () => {};
  }, [selectedRows]);

  useEffect(() => {
    if (!localStorage) {
      setTableData([]);
      setValue([]);
      return;
    }
    setTableData(
      (localStorage as any).map((item: any, index: number) => ({
        isEdit: false,
        isNew: false,
        id: index + 1,
        ...item,
      })),
    );
    setValue(
      (localStorage as any).map((item: any, index: number) => ({
        isEdit: false,
        isNew: false,
        id: index + 1,
        ...item,
      })),
    );
  }, [localStorage]);

  useEffect(() => {
    setTableData(value);
  }, [value]);

  const successTransactionDate = () => {
    const zxc = selectedRows.map((item: any) => ({ ...item, date: new Date() }));

    const results = Array.from(value)
      .map((item: any, index: number) => ({
        id: index,
        ...item,
      }))
      .filter(({ id: id1 }: any) => !selectedRows.some(({ id: id2 }) => id2 === id1));
    setValue([...results, ...zxc] as any);
  };

  return (
    <>
      <SendTransferComponent
        title="Transfers"
        handleUploadModal={handleUploadModal}
        transactionData={transactionData}
        setSelectedRow={setSelectedRows}
        successTransactionDate={successTransactionDate}
        loader={loaderState}
        tableData={tableData}
      />
      <DocumentParserComponent
        open={uploadModalOpen}
        handleUploadModal={handleUploadModal}
        setSelectedRows={setSelectedRows}
        selectedRows={selectedRows}
        tableData={tableData}
        loader={loaderState}
        handleFileImport={handleFileImport}
        error={error}
        setTableData={setTableData}
        setValue={setValue}
      />
    </>
  );
};
