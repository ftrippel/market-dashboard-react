import { Table } from './components/common/Table';
import type { TableColumn } from './types';

const testData = [
  { sym: 'TEST1', price: 100, d1: 1.5, w1: 2.5, hi52: 10, ytd: 5, spark: [1, 2, 3, 4, 5] },
  { sym: 'TEST2', price: 200, d1: -1.5, w1: -2.5, hi52: -10, ytd: -5, spark: [1, 2, 3, 4, 5] },
];

const testColumns: TableColumn[] = [
  { key: 'sym', label: 'Symbol', align: 'left' },
  { key: 'price', label: 'Price', format: 'number' },
  { key: 'd1', label: '1D%', format: 'pnl' },
];

export function AppTest() {
  console.log('AppTest rendering with data:', testData);
  
  return (
    <div style={{ padding: '40px', fontFamily: 'IBM Plex Mono, monospace' }}>
      <h1>TABLE COMPONENT TEST</h1>
      <p>Should see "TEST1" and "TEST2" in the first column below:</p>
      <Table columns={testColumns} data={testData} sortBy="w1" sortOrder="desc" />
    </div>
  );
}
