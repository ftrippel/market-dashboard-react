import { Card, MarketTable, Section } from '../../components/common';
import { useMarketStore } from '../../store/marketStore';
import { colors } from '../../utils/formatting';

export function MacroSection() {
  const store = useMarketStore();

  return (
    <Section number="01" title="Macro Overview" subtitle="EOD SNAPSHOT · PREV CLOSE · RANKED BY CATEGORY">
      <div className="mg">
        <Card label="▸ US Index Futures">
          <MarketTable data={store.futures} nameLabel="Contract" />
        </Card>
        <Card label="▸ Volatility & Dollar">
          <MarketTable data={store.dxvix} nameLabel="Instrument" />
        </Card>
      </div>

      <Card label="▸ Crypto" style={{ marginBottom: '9px' }}>
        <MarketTable data={store.crypto} nameLabel="Asset" priceLabel="Price (USD)" />
      </Card>

      <div className="mg">
        <Card label="▸ Precious & Base Metals">
          <MarketTable data={store.metals} nameLabel="Metal" />
        </Card>
        <Card label="▸ Energy Commodities">
          <MarketTable data={store.commodities} nameLabel="Commodity" />
        </Card>
      </div>

      <div className="mg">
        <Card label="▸ US Treasury Yields">
          <MarketTable data={store.yields} nameLabel="Tenor" isYield priceLabel="Yield%" />
        </Card>
        <Card label="▸ Global Market Indices">
          <MarketTable data={store.global} nameLabel="Index" />
        </Card>
      </div>
    </Section>
  );
}

export function MacroDivider() {
  return (
    <div
      style={{
        height: '1px',
        background: `linear-gradient(90deg, ${colors.accent}, transparent)`,
        opacity: 0.2,
        margin: '18px 0',
      }}
    />
  );
}
