// 1 Unnecessary Dependency in useMemo:

// The useMemo hook for sortedBalances includes prices in its dependency array,
//  but prices is not used within the computation of sortedBalances.
//  This can lead to unnecessary recalculations when prices changes.

// 2 Incorrect Filtering Logic:

// The filtering logic inside useMemo is incorrect.
//  The condition if (lhsPriority > -99) should be if (balancePriority > -99).
//  Additionally, the logic for filtering balances with amount <= 0 is flawed.
//  It should return true for balances with amount > 0 to include them in the sorted list.

//3  Redundant Mapping:

// The code maps over sortedBalances twice: once to create
//  formattedBalances and again to create rows. This is inefficient and can be combined into a single loop.

//4 Missing Return Value in sort Callback:

// The sort callback does not return a value when leftPriority
//  is equal to rightPriority. This can lead to inconsistent sorting behavior.

//5 Using Index as Key:

// Using the index as the key for WalletRow components is an
// anti-pattern. It can cause issues with React's reconciliation algorithm, especially if the list order changes or items are added/removed.

//6 TypeScript Issues:

// The blockchain property is not defined in the WalletBalance
//  interface, but it is used in the getPriority function. This can lead to runtime errors.

// The FormattedWalletBalance interface is not used correctly.
//  The formattedBalances array is created but never used.

//7 Inefficient Sorting and Filtering:

// The filtering and sorting logic can be optimized.
//  Currently, it filters balances and then sorts them,
// but these operations can be combined for better performance.

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Added missing property
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority; // Simplified sorting logic
      });
  }, [balances]); // Removed unnecessary dependency on prices

  const rows = sortedBalances.map((balance: WalletBalance) => {
    const usdValue = prices[balance.currency] * balance.amount;
    const formattedBalance: FormattedWalletBalance = {
      ...balance,
      formatted: balance.amount.toFixed(),
    };

    return (
      <WalletRow
        className={classes.row}
        key={`${balance.currency}-${balance.blockchain}`} // Use a unique key
        amount={formattedBalance.amount}
        usdValue={usdValue}
        formattedAmount={formattedBalance.formatted}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};
