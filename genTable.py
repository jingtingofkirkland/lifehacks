"""
Stock portfolio table generator and visualizer.
Fetches current stock prices from Yahoo Finance and generates HTML tables
displaying portfolio performance with initial investments, current values, 
dividends, and gains/losses.
"""

import time
from datetime import date
from typing import Dict, List, Optional, Tuple

import requests


# Configuration constants
class Config:
    """Configuration for the stock portfolio generator."""

    # API settings
    API_BASE_URL = "https://query2.finance.yahoo.com/v8/finance/download"
    USER_AGENT = ""

    # Portfolio settings
    INITIAL_PORTFOLIO_VALUE = 10000
    CASH_OUT_FEE = 300

    # Stock symbols
    STOCK_SYMBOLS = ["FXAIX", "FZILX", "FXNAX", "BABA", "BYDDY"]

    # HTML table styling
    TABLE_STYLE = "width:100%"


class Record:
    """Represents a single row in the portfolio table."""

    def __init__(
        self,
        name: str,
        initial_amount: str,
        current_amount: str,
        dividend_ytd: str,
        gain_loss: str,
        is_header: bool = False,
    ):
        self.name = name
        self.initial_amount = initial_amount
        self.current_amount = current_amount
        self.dividend_ytd = dividend_ytd
        self.gain_loss = gain_loss
        self.is_header = is_header


class Stock:
    """Represents a stock holding in the portfolio."""

    def __init__(
        self,
        name: str,
        origin_unit_price: float,
        initial_amount: float,
        cur_unit_price: float = 0.0,
        dividends: Optional[List[float]] = None,
    ):
        self.name = name
        self.origin_unit_price = origin_unit_price
        self.initial_amount = initial_amount
        self.cur_unit_price = cur_unit_price
        self.dividends = dividends or []

    def gain_percentage(self) -> float:
        """Calculate the gain percentage."""
        if self.origin_unit_price == 0:
            return 0.0
        return self.cur_unit_price / self.origin_unit_price

    def unit_count(self) -> float:
        """Calculate number of units owned."""
        if self.origin_unit_price == 0:
            return 0.0
        return self.initial_amount / self.origin_unit_price

    def current_value(self) -> float:
        """Calculate current value of holdings."""
        return self.gain_percentage() * self.initial_amount

    def dividend_total(self) -> float:
        """Calculate total dividends received."""
        return sum(self.dividends) * self.unit_count()

    def total_gain(self) -> float:
        """Calculate total gain including dividends."""
        return self.current_value() + self.dividend_total() - self.initial_amount


class StockPriceAPI:
    """Handles API interactions for fetching stock prices."""

    @staticmethod
    def fetch_stock_price(
        symbol: str, period_start: int, period_end: int
    ) -> Optional[str]:
        """
        Fetch stock price data from Yahoo Finance API.

        Args:
            symbol: Stock symbol (e.g., 'FXAIX')
            period_start: Start timestamp (epoch seconds)
            period_end: End timestamp (epoch seconds)

        Returns:
            CSV response data as string, or None if request failed
        """
        api_url = (
            f"{Config.API_BASE_URL}/{symbol}"
            f"?period1={period_start}"
            f"&period2={period_end}"
            f"&interval=1d"
            f"&events=history"
            f"&includeAdjustedClose=true"
        )

        headers = {"User-Agent": Config.USER_AGENT}

        try:
            response = requests.get(api_url, headers=headers)
            response.raise_for_status()
            return response.text
        except requests.RequestException as e:
            print(f"Error fetching price for {symbol}: {e}")
            return None

    @staticmethod
    def parse_close_price(csv_data: str) -> Optional[float]:
        """
        Parse closing price from CSV data.

        Args:
            csv_data: CSV response from Yahoo Finance API

        Returns:
            Close price as float, or None if parsing failed
        """
        try:
            lines = csv_data.strip().split("\n")
            if len(lines) < 2:
                return None

            headers = lines[0].split(",")
            prices = lines[1].split(",")

            close_index = headers.index("Close")
            return float(prices[close_index])
        except (ValueError, IndexError) as e:
            print(f"Error parsing price data: {e}")
            return None

    @staticmethod
    def get_current_price(
        symbol: str, period_start: int, period_end: int
    ) -> Optional[float]:
        """
        Get current stock price for a symbol.

        Args:
            symbol: Stock symbol
            period_start: Start timestamp
            period_end: End timestamp

        Returns:
            Current price as float, or None if failed
        """
        data = StockPriceAPI.fetch_stock_price(symbol, period_start, period_end)
        if data is None:
            return None
        return StockPriceAPI.parse_close_price(data)


class HTMLTableGenerator:
    """Generates HTML tables for portfolio display."""

    def __init__(self, indent: str = "  "):
        self.indent = indent

    def _create_tag(self, tag: str, content: str, is_header: bool = False) -> str:
        """Create an HTML tag with content."""
        tag_name = "th" if is_header else "td"
        return f"{self.indent}{self.indent}<{tag_name}> {content} </{tag_name}>\n"

    def _create_row(self, record: Record) -> str:
        """Create an HTML table row from a Record."""
        row = [f"{self.indent}<tr>\n"]
        row.append(self._create_tag("td", record.name, record.is_header))
        row.append(self._create_tag("td", record.initial_amount, record.is_header))
        row.append(self._create_tag("td", record.current_amount, record.is_header))
        row.append(self._create_tag("td", record.dividend_ytd, record.is_header))
        row.append(self._create_tag("td", record.gain_loss, record.is_header))
        row.append(f"{self.indent}</tr>\n")
        return "".join(row)

    def generate_table(self, records: List[Record]) -> str:
        """Generate complete HTML table from records."""
        rows = [self._create_row(record) for record in records]
        return f'<table style="{Config.TABLE_STYLE}">\n{"".join(rows)}</table>'


class PortfolioManager:
    """Manages stock portfolio and generates reports."""

    def __init__(self):
        self.stocks = [
            Stock("FXAIX", 142.71, 5000.0, dividends=[0.538, 0.602]),
            Stock("FZILX", 10.5, 1500.0),
            Stock("FXNAX", 10.4, 1827.0, dividends=[0.022, 0.025]),
            Stock("BABA", 105.0, 1050.0),
            Stock("BYDDY", 62.3, 623.0, dividends=[0.331]),
        ]
        self.table_generator = HTMLTableGenerator()

    def update_stock_prices(self, prices: List[float]) -> None:
        """Update current prices for all stocks."""
        if len(prices) != len(self.stocks):
            raise ValueError(f"Expected {len(self.stocks)} prices, got {len(prices)}")

        for stock, price in zip(self.stocks, prices):
            stock.cur_unit_price = price

    def calculate_totals(self) -> Tuple[float, float, float]:
        """Calculate portfolio totals."""
        total_current = (
            sum(stock.current_value() for stock in self.stocks) - Config.CASH_OUT_FEE
        )
        total_dividends = sum(stock.dividend_total() for stock in self.stocks)
        total_gain = total_current + total_dividends - Config.INITIAL_PORTFOLIO_VALUE
        return total_current, total_dividends, total_gain

    def generate_report(
        self, prices: Optional[List[float]] = None, report_date: str = ""
    ) -> str:
        """
        Generate HTML report for the portfolio.

        Args:
            prices: List of current stock prices. If None, uses default values.
            report_date: Date string for the report header.

        Returns:
            HTML table string
        """
        # Set default prices if not provided
        if prices is None:
            prices = [156.84, 10.72, 10.14, 92.90, 63.14]

        self.update_stock_prices(prices)

        # Create records
        records = [
            Record(
                "Funds",
                "Initial Value/Unit price",
                f"Current Value ({report_date})",
                "Dividend YTD",
                "Gain",
                is_header=True,
            )
        ]

        # Add stock records
        for stock in self.stocks:
            records.append(
                Record(
                    stock.name,
                    f"${stock.initial_amount:.2f}/${stock.origin_unit_price:.2f}",
                    f"${stock.current_value():.2f}/${stock.cur_unit_price:.2f}",
                    f"${stock.dividend_total():.2f}",
                    f"${stock.total_gain():.2f}",
                )
            )

        # Add cash out fee
        records.append(
            Record(
                "Cash Out Fee",
                "$0",
                f"$-{Config.CASH_OUT_FEE}",
                "$0",
                f"$-{Config.CASH_OUT_FEE}",
            )
        )

        # Calculate and add totals
        total_current, total_dividends, total_gain = self.calculate_totals()
        records.append(
            Record(
                "Total",
                f"${Config.INITIAL_PORTFOLIO_VALUE}",
                f"${total_current:.2f}",
                f"${total_dividends:.2f}",
                f"${total_gain:.2f}",
            )
        )

        return self.table_generator.generate_table(records)


def main():
    """Main function to fetch prices and generate portfolio report."""
    current_epoch = int(time.time())
    one_day_ago = current_epoch - 86400  # 86400 seconds in a day
    today = date.today()

    # Fetch current prices for all stocks
    prices = []
    for symbol in Config.STOCK_SYMBOLS:
        price = StockPriceAPI.get_current_price(symbol, one_day_ago, current_epoch)
        if price is None:
            print(f"Warning: Could not fetch price for {symbol}, using 0.0")
            price = 0.0
        prices.append(price)

    # Generate and print report
    portfolio = PortfolioManager()
    report = portfolio.generate_report(prices, str(today))
    print(report)


if __name__ == "__main__":
    main()
