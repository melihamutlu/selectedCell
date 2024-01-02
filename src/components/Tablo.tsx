import React, { useState } from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

interface VeriTipi {
  anahtar: React.Key;
  ad: string;
  yaş: number;
  adres: string;
}

const initialData: VeriTipi[] = [
  {
    anahtar: '1',
    ad: 'Emel Yılmaz',
    yaş: 32,
    adres: 'Esenyurt, İstanbul',
  },
  {
    anahtar: '2',
    ad: 'Hasan Armut',
    yaş: 42,
    adres: 'Eyüpsultan, İstanbul',
  },
  {
    anahtar: '3',
    ad: 'Ayşe Günaydın',
    yaş: 32,
    adres: 'Şişli, İstanbul',
  },
  {
    anahtar: '4',
    ad: 'Fatma Sönmez',
    yaş: 32,
    adres: 'Maltepe, İstanbul',
  },
];

const Tablo: React.FC = () => {
  const [data] = useState<VeriTipi[]>(initialData);
  const [selectedCells, setSelectedCells] = useState<{ rowKey: React.Key; dataIndex: keyof VeriTipi }[]>([]);
  const [ctrlPressed, setCtrlPressed] = useState<boolean>(false);

  const handleCellClick = (rowKey: React.Key, dataIndex: keyof VeriTipi, e: React.MouseEvent<HTMLDivElement>) => {
    if (!ctrlPressed) {
      // Ctrl tuşuna basılmamışsa mevcut seçimleri temizle
      setSelectedCells([{ rowKey, dataIndex }]);
    } else {
      // Ctrl tuşuna basılmışsa yeni seçimi ekleyip/kaldır
      const isSelected = selectedCells.some(cell => cell.rowKey === rowKey && cell.dataIndex === dataIndex);
      let updatedSelection: { rowKey: React.Key; dataIndex: keyof VeriTipi }[];

      if (isSelected) {
        updatedSelection = selectedCells.filter(cell => !(cell.rowKey === rowKey && cell.dataIndex === dataIndex));
      } else {
        updatedSelection = [...selectedCells, { rowKey, dataIndex }];
      }

      setSelectedCells(updatedSelection);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Control') {
      setCtrlPressed(true);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Control') {
      setCtrlPressed(false);
    }
  };

  const isCellSelected = (rowKey: React.Key, dataIndex: keyof VeriTipi) => {
    return selectedCells.some(cell => cell.rowKey === rowKey && cell.dataIndex === dataIndex);
  };

  const renderCell = (rowKey: React.Key, dataIndex: keyof VeriTipi, text: React.ReactNode) => ({
    children: (
      <div
        onClick={(e) => handleCellClick(rowKey, dataIndex, e)}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        tabIndex={0}
        style={{
          background: isCellSelected(rowKey, dataIndex) ? 'yellow' : 'transparent',
        }}
      >
        {text}
      </div>
    ),
  });


  const columns: ColumnsType<VeriTipi> = [
    {
      title: 'Anahtar',
      dataIndex: 'anahtar',
      render: (text, record) => renderCell(record.anahtar, 'anahtar', text),
    },
    {
      title: 'Ad',
      dataIndex: 'ad',
      render: (text, record) => renderCell(record.anahtar, 'ad', text),
    },
    {
      title: 'Yaş',
      dataIndex: 'yaş',
      render: (text, record) => renderCell(record.anahtar, 'yaş', text),
    },
    {
      title: 'Adres',
      dataIndex: 'adres',
      render: (text, record) => renderCell(record.anahtar, 'adres', text),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="anahtar"
      rowSelection={undefined}
    />
  );
};

export default Tablo;
