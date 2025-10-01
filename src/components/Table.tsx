import { useState, useEffect, useRef } from 'react';
import { DataTable, type DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator, type PaginatorPageChangeEvent } from 'primereact/paginator';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

import type { ColumnType, MainData } from '../types';

const columns: ColumnType[] = [
  { field: 'id', header: 'ID' },
  { field: 'title', header: 'Title' },
  { field: 'place_of_origin', header: 'Place of Origin' },
  { field: 'artist_display', header: 'Artist Display' },
  { field: 'inscriptions', header: 'Inscriptions' },
  { field: 'date_start', header: 'Date Start' },
  { field: 'date_end', header: 'Date End' },
];

export default function DynamicColumnsDemo() {
  const [mainData, setMainData] = useState<MainData[]>([]);
  const [selectedMainData, setSelectedMainData] = useState<MainData[]>([]);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);
  const [totalRecords, setTotalRecords] = useState(120);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  const [cachedSelectedIds, setCachedSelectedIds] = useState<Set<number>>(new Set());
  const [rowsToSelect, setRowsToSelect] = useState(0);
  const [isSelectingAcrossPages, setIsSelectingAcrossPages] = useState(false);

  const op = useRef<OverlayPanel>(null);

  useEffect(() => {
    console.log("On Page Number: ", currentPage);
    fetchDataByPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const savedSelections = localStorage.getItem('selectedRows');
    if (savedSelections) {
      const parsedSelections = JSON.parse(savedSelections);
      setCachedSelectedIds(new Set(parsedSelections));
      setSelectedRowsCount(parsedSelections.length);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedRows', JSON.stringify(Array.from(cachedSelectedIds)));
  }, [cachedSelectedIds]);

  const fetchDataByPage = async (page: number) => {
    const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
    const data = await res.json();

    setMainData(data.data);
    setRows(data.pagination.limit);
    setTotalRecords(data.pagination.total);
  };

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    setRows(event.rows);

    // console.log("First: ", event.first);
    // console.log("Row: ", event.rows);
    // console.log("Page: ", event.first / event.rows + 1);
    setCurrentPage(event.first / event.rows + 1);
  };

  const handleIconClick = (e: React.MouseEvent) => {
    op.current?.toggle(e);
  };

  const selectTheRows = async () => {
    if (rowsToSelect <= 0) return;

    setIsSelectingAcrossPages(true);
    const newCachedIds = new Set(cachedSelectedIds);
    let remainingToSelect = rowsToSelect;
    let currentPageNum = currentPage;

    const selectFromCurrentPage = (data: MainData[], remaining: number) => {
      let selected = 0;
      for (let i = 0; i < data.length && selected < remaining; i++) {
        if (!newCachedIds.has(data[i].id)) {
          newCachedIds.add(data[i].id);
          selected++;
        }
      }
      return selected;
    };

    const selectedFromCurrentPage = selectFromCurrentPage(mainData, remainingToSelect);
    remainingToSelect -= selectedFromCurrentPage;

    // If we need more rows
    while (remainingToSelect > 0) {
      currentPageNum++;
      try {
        const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${currentPageNum}`);
        const data = await res.json();

        if (!data.data || data.data.length === 0) break; // base case

        const selectedFromPage = selectFromCurrentPage(data.data, remainingToSelect);
        remainingToSelect -= selectedFromPage;

        if (selectedFromPage === 0) break;
      } catch (error) {
        console.error('Error fetching data:', error);
        break;
      }
    }

    setCachedSelectedIds(newCachedIds);
    setSelectedRowsCount(newCachedIds.size);
    setIsSelectingAcrossPages(false);
    setRowsToSelect(0);
    op.current?.hide();
  };

  const handleSelectionChange = (e: DataTableSelectionMultipleChangeEvent<MainData[]>) => {
    const newSelection = e.value as MainData[];
    setSelectedMainData(newSelection);

    const newCachedIds = new Set(cachedSelectedIds);

    mainData.forEach(item => {
      newCachedIds.delete(item.id);
    });

    newSelection.forEach(item => {
      newCachedIds.add(item.id);
    });

    setCachedSelectedIds(newCachedIds);
    setSelectedRowsCount(newCachedIds.size);
  };

  useEffect(() => {
    if (mainData.length > 0) {
      const currentPageSelected = mainData.filter((item: MainData) =>
        cachedSelectedIds.has(item.id)
      );
      setSelectedMainData(currentPageSelected);
    }
  }, [mainData, cachedSelectedIds]);

  const clearAllSelections = () => {
    setCachedSelectedIds(new Set());
    setSelectedMainData([]);
    setSelectedRowsCount(0);
    localStorage.removeItem('selectedRows');
  };

  return (
    <>
      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <Button
            label="Clear All Selections"
            onClick={clearAllSelections}
            severity="secondary"
            size="small"
            disabled={selectedRowsCount === 0}
          />
        </div>

        <DataTable
          selectionMode={null}
          selection={selectedMainData}
          onSelectionChange={handleSelectionChange}
          dataKey="id"
          value={mainData}
          showGridlines
          tableStyle={{ minWidth: '50rem' }}
          loading={isSelectingAcrossPages}
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: '3rem' }}
            header={
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  onClick={handleIconClick}
                >
                  <path d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                </svg>
                {selectedRowsCount > 0 && (
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    ({selectedRowsCount})
                  </span>
                )}
              </div>
            }
          />
          {columns.map(col => (
            <Column key={col.field} field={col.field} header={col.header} />
          ))}
        </DataTable>

        <OverlayPanel
          style={{ marginTop: '4rem' }}
          ref={op}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <label htmlFor="pageInput">Enter Rows to select:</label>
            <InputNumber
              id="pageInput"
              value={rowsToSelect}
              onValueChange={(e) => setRowsToSelect(e.value || 0)}
              placeholder="Enter rows to select"
              min={1}
            />
            <Button
              label={isSelectingAcrossPages ? "Selecting..." : "Go"}
              onClick={selectTheRows}
              size="small"
              loading={isSelectingAcrossPages}
              disabled={isSelectingAcrossPages || rowsToSelect <= 0}
            />
            <small style={{ color: '#666', fontSize: '11px' }}>
              Note: If current page doesn't have enough rows, selection will continue on next pages.
            </small>
          </div>
        </OverlayPanel>

        <Paginator
          first={first}
          rows={rows}
          totalRecords={totalRecords}
          onPageChange={onPageChange} />
      </div >
    </>
  );
}