import React, { useEffect, useState } from 'react';
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
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [previewSelection, setPreviewSelection] = useState<{ startCell?: { rowKey: React.Key; dataIndex: keyof VeriTipi }, endCell?: { rowKey: React.Key; dataIndex: keyof VeriTipi } }>({});


  useEffect(() => {
    const handleMouseUp = () => {
      setIsMouseDown(false);
    };

    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleCellClick = (rowKey: React.Key, dataIndex: keyof VeriTipi) => {
    const index = selectedCells.findIndex(cell => cell.rowKey === rowKey && cell.dataIndex === dataIndex);

    if (index === -1) {
      setSelectedCells([{ rowKey, dataIndex }]);
    } else {
      const newSelectedCells = [...selectedCells];
      newSelectedCells.splice(index, 1);
      setSelectedCells(newSelectedCells);
    }
  };
// hücereye tıkla
const handleMouseEnter = (rowKey: React.Key, dataIndex: keyof VeriTipi) => {
  if (!ctrlPressed && isMouseDown) {
    const index = selectedCells.findIndex(cell => cell.rowKey === rowKey && cell.dataIndex === dataIndex);
    if (index === -1) {
      setSelectedCells([{ rowKey, dataIndex }]);
    }
  } else if (ctrlPressed && isMouseDown) {
    const startCell = selectedCells.length > 0 ? selectedCells[0] : { rowKey, dataIndex };
    const cellsInRange = getCellsInRange(startCell, { rowKey, dataIndex });
    setSelectedCells(cellsInRange);
  }
  // Yeni bir hücreye geldiğimizde, önceki önizleme seçimini kaldır
  setPreviewSelection({});
  };
// tıklamayı kaldır
  const handleMouseDown = () => {
    setIsMouseDown(true);
  };
// klavyeye tklama
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Control') {
      setCtrlPressed(true);
    }
  };
// tıkı kaldırma
  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Control') {
      setCtrlPressed(false);
    }
  };
// hücre seçili mi?
  const isCellSelected = (rowKey: React.Key, dataIndex: keyof VeriTipi) => {
    return selectedCells.some(cell => cell.rowKey === rowKey && cell.dataIndex === dataIndex);
  };

  const renderCell = (rowKey: React.Key, dataIndex: keyof VeriTipi, text: React.ReactNode) => {
    const isSelected = isCellSelected(rowKey, dataIndex);
    const isPreviewSelected = previewSelection.startCell && previewSelection.endCell &&
      rowKey >= previewSelection.startCell.rowKey && rowKey <= previewSelection.endCell.rowKey &&
      dataIndex >= previewSelection.startCell.dataIndex && dataIndex <= previewSelection.endCell.dataIndex;
  
    const background = isSelected ? 'yellow' : isPreviewSelected ? 'rgba(0, 0, 255, 0.1)' : 'transparent';
  
    return {
      children: (
        <div
          onClick={() => handleCellClick(rowKey, dataIndex)}
          onMouseEnter={() => handleMouseEnter(rowKey, dataIndex)}
          onMouseDown={handleMouseDown}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          tabIndex={0}
          style={{
            background: isSelected ? 'yellow' : 'transparent',
            position: 'relative',
            userSelect: 'none',
          }}
        >
          {text}
          {isPreviewSelected && (
            <div
              style={{
                position: 'absolute',
                border: '1px solid blue',
                zIndex: 1,
                pointerEvents: 'none',
                background: 'rgba(0, 0, 255, 0.1)', // Önizleme alanının arka plan rengi
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
              }}
            />
          )}
        </div>
      ),
    };
  };

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

  // başlangıç ve bitişte tıklanan hücrelerin arasındaki hücreleri hesaplar.
  const getCellsInRange = (startCell: { rowKey: React.Key; dataIndex: keyof VeriTipi }, endCell: { rowKey: React.Key; dataIndex: keyof VeriTipi }): { rowKey: React.Key; dataIndex: keyof VeriTipi }[] => {
    const startRowIndex = parseInt(startCell.rowKey as string, 10);
    const endRowIndex = parseInt(endCell.rowKey as string, 10);

    const startDataIndex = Object.keys(initialData[0]).indexOf(startCell.dataIndex);
    const endDataIndex = Object.keys(initialData[0]).indexOf(endCell.dataIndex);

    const selectedCells: { rowKey: React.Key; dataIndex: keyof VeriTipi }[] = [];

    for (let i = Math.min(startRowIndex, endRowIndex); i <= Math.max(startRowIndex, endRowIndex); i++) {
      for (let j = Math.min(startDataIndex, endDataIndex); j <= Math.max(startDataIndex, endDataIndex); j++) {
        const currentDataIndex = Object.keys(initialData[0])[j];
        selectedCells.push({ rowKey: i.toString(), dataIndex: currentDataIndex as keyof VeriTipi });
      }
    }

    return selectedCells;
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="anahtar"
      rowSelection={undefined}
      pagination={false}
    />
  );
};

export default Tablo;
