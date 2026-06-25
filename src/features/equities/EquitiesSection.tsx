import { Card, ExpandableTableCard, MarketTable, Section } from '../../components/common';
import { useMarketStore } from '../../store/marketStore';
import type { MarketTableOptions } from '../../types';

const rankByW1: Pick<MarketTableOptions, 'sortBy' | 'sortOrder'> = {
  sortBy: 'w1',
  sortOrder: 'desc',
};

export function EquitiesSection() {
  const store = useMarketStore();

  return (
    <Section number="02" title="Equities Overview">
      <Card label="▸ Major ETF Stats" style={{ marginBottom: '9px' }}>
        <MarketTable
          data={store.etfs}
          nameLabel="ETF"
          showTrend
          showHoldings
          holdings={store.holdings}
          {...rankByW1}
        />
      </Card>

      <Card label="▸ S&P 500 Sub-Market Performance" style={{ marginBottom: '9px' }}>
        <MarketTable
          data={store.submkt}
          nameLabel="Sub-Market / ETF"
          rank
          showTrend
          {...rankByW1}
        />
      </Card>

      <div className="g2" style={{ marginBottom: '9px' }}>
        <Card label="▸ S&P 500 Sub-Sector">
          <MarketTable
            data={store.sectors}
            nameLabel="Sector"
            rank
            hasPrice={false}
            showTrend
            showHoldings
            benchmarkSym="SPY"
            holdings={store.holdings}
            {...rankByW1}
          />
        </Card>
        <Card label="▸ S&P 500 EW Sub-Sector">
          <MarketTable
            data={store.sectorsEW}
            nameLabel="EW Sector"
            rank
            hasPrice={false}
            showTrend
            showHoldings
            benchmarkSym="RSP"
            holdings={store.holdings}
            {...rankByW1}
          />
        </Card>
      </div>

      <ExpandableTableCard
        label="▸ Thematic Sectors — Top 10 Ranked by 1W"
        expandTitle={`All Thematic Sectors (${store.thematic.length})`}
        data={store.thematic}
        holdings={store.holdings}
        style={{ marginBottom: '9px' }}
        tableProps={{
          nameLabel: 'Theme / ETF',
          rank: true,
          showTrend: true,
          showHoldings: true,
          ...rankByW1,
        }}
      />

      <ExpandableTableCard
        label="▸ Country ETFs — Top 10 Ranked by 1W"
        expandTitle={`All Country ETFs (${store.country.length})`}
        data={store.country}
        holdings={store.holdings}
        tableProps={{
          nameLabel: 'Country / ETF',
          rank: true,
          showTrend: true,
          showHoldings: true,
          ...rankByW1,
        }}
      />
    </Section>
  );
};
