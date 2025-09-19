import { View } from '@tarojs/components';
import { cn } from 'clsx-for-tailwind';
import { useMemo } from 'react';

/**
 * Price component props interface
 */
interface PriceProps {
  /** The price value to display */
  price: number | string;
  /** Optional Tailwind styling for the price */
  priceStyle?: string;
  /** Currency symbol to use (defaults to $) */
  currencySymbol?: string;
}

/**
 * Price component that displays a price with optional styling
 * @returns A View component with the formatted price
 */
export function Price({ price, priceStyle, currencySymbol = '$' }: PriceProps) {
  // Validate and format the price
  const formattedPrice = useMemo(() => {
    if (typeof price === 'number') {
      // Handle invalid numbers
      if (isNaN(price) || !isFinite(price)) return '0.00';
      // Ensure positive value and format to 2 decimal places
      return Math.max(0, price).toFixed(2);
    }
    return price;
  }, [price]);

  // Compute the style with memoization
  const preStyle = useMemo(() => {
    return cn(
      'text-red-800',
      'text-sm',
      'inline',
      `before:content-['${currencySymbol}']`,
      priceStyle
    );
  }, [priceStyle, currencySymbol]);

  return <View className={preStyle}>{formattedPrice}</View>;
}

/**
 * TwoPrice component props interface
 */
interface TwoPriceProps {
  /** The new/current price */
  newPrice: number;
  /** The old/original price */
  oldPrice?: number;
  /** Currency symbol to use (defaults to $) */
  currencySymbol?: string;
}

/**
 * Component to display both a new price and an old (crossed out) price
 */
export function TwoPrice({ newPrice, oldPrice, currencySymbol = '$' }: TwoPriceProps) {
  return (
    <View className='flex flex-row items-baseline gap-2'>
      <Price price={newPrice} currencySymbol={currencySymbol} />
      {oldPrice && (
        <>
          {' '}
          <Price
            price={oldPrice}
            priceStyle='text-xs line-through'
            currencySymbol={currencySymbol}
          />
        </>
      )}
    </View>
  );
}
