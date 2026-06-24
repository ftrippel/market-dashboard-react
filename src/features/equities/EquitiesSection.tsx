import { Card, MarketTable, Section } from '../../components/common';
import { useMarketStore } from '../../store/marketStore';

export function EquitiesSection() {
  const store = useMarketStore();

  return (
    <Section number="02" title="Equities Overview" subtitle="RANKED BY 1W PERFORMANCE">
      <Card label="▸ Major ETF Stats" style={{ marginBottom: '9px' }}>
        <MarketTable
          data={store.etfs}
          nameLabel="ETF"
          showTrend
          showHoldings
          holdings={store.holdings}
        />
      </Card>

      <Card label="▸ S&P 500 Sub-Market Performance — Ranked by 1W" style={{ marginBottom: '9px' }}>
        <MarketTable
          data={store.submkt}
          nameLabel="Sub-Market / ETF"
          rank
          showTrend
        />
      </Card>

      <div className="g2" style={{ marginBottom: '9px' }}>
        <Card label="▸ S&P 500 Sub-Sector — Ranked by 1W">
          <MarketTable
            data={store.sectors}
            nameLabel="Sector"
            rank
            hasPrice={false}
            showTrend
            showHoldings
            benchmarkSym="SPY"
            holdings={store.holdings}
          />
        </Card>
        <Card label="▸ S&P 500 EW Sub-Sector — Ranked by 1W">
          <MarketTable
            data={store.sectorsEW}
            nameLabel="EW Sector"
            rank
            hasPrice={false}
            showTrend
            showHoldings
            benchmarkSym="RSP"
            holdings={store.holdings}
          />
        </Card>
      </div>

      <Card label="▸ Top 10 Thematic Sectors — Ranked by 1W (Holdings expandable ▸)" style={{ marginBottom: '9px' }}>
        <MarketTable
          data={store.thematic}
          nameLabel="Theme / ETF"
          rank
          showTrend
          showHoldings
          holdings={store.holdings}
        />
      </Card>

      <Card label="▸ Country ETFs — Top 10 by 1W Performance (Holdings expandable ▸)">
        <MarketTable
          data={store.country}
          nameLabel="Country / ETF"
          rank
          showTrend
          showHoldings
          holdings={store.holdings}
        />
      </Card>
    </Section>
  );
}
