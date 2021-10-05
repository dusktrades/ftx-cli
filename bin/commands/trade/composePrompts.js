import { SCHEDULE } from '../../options/global/schedule/index.js';
import { OPTIONS } from '../../options/index.js';

import {
  account,
  markets,
  wallet,
} from '../../../src/api/ftx/endpoints/index.js';

import { ORDER_TYPES } from '../../../src/api/ftx/structures/orderTypes.js';

import {
  compareAToZ,
  formatCurrency,
  formatNormalNumberNotation,
  formatUsd,
} from '../../../src/util/index.js';

import { validateAnswer } from '../helpers/index.js';

let data = null;
let activeMarket = null;
let parseSize = null;
let parsePrice = null;

async function fetchData({ exchange, ...globalOptions }) {
  const credentials = {
    apiKey: globalOptions.key,
    apiSecret: globalOptions.secret,
    subaccount: globalOptions.subaccount,
  };

  const [marketData, accountData, balances, positions] = await Promise.all([
    markets.getMarkets({ exchange }),
    account.getAccountInformation({ exchange, credentials }),
    wallet.getBalances({ exchange, credentials }),
    account.getPositions({ exchange, credentials }),
  ]);

  data = {
    markets: marketData,
    account: accountData,
    balances,
    positions,
  };
}

function composeMarketChoices() {
  return data.markets
    .map(({ name }) => ({ title: name }))
    .sort((a, b) => compareAToZ(a.title, b.title));
}

function getInitialMarket(marketChoices) {
  return marketChoices.find(({ title }) => title === 'BTC-PERP') == null
    ? marketChoices[0].title
    : 'BTC-PERP';
}

function composeFuturesSizingMethod() {
  const { name, underlying } = activeMarket;
  const availableCollateral = data.account.freeCollateral;

  const positionSize =
    data.positions.find(({ future }) => future === name)?.size ?? 0;

  return [
    { title: underlying, value: { type: 'basic', sizeCurrency: 'base' } },
    { title: 'USD', value: { type: 'basic', sizeCurrency: 'quote' } },
    {
      title: `Relative to available collateral (${formatUsd(
        availableCollateral
      )})`,
      value: { type: 'relative', sizeHook: 'default' },
      disabled: availableCollateral === 0,
    },
    {
      title: `Relative to position (${formatNormalNumberNotation(
        positionSize
      )} ${underlying})`,
      value: { type: 'relative', sizeHook: 'position' },
      disabled: positionSize === 0,
    },
  ];
}

function composeSpotSizingMethod(side) {
  const { baseCurrency, quoteCurrency } = activeMarket;
  const currency = side === 'sell' ? baseCurrency : quoteCurrency;

  const availableBalance =
    data.balances.find(({ coin }) => coin === currency)
      ?.availableWithoutBorrow ?? 0;

  return [
    { title: baseCurrency, value: { type: 'basic', sizeCurrency: 'base' } },
    { title: quoteCurrency, value: { type: 'basic', sizeCurrency: 'quote' } },
    {
      title: `Relative to available wallet balance (${formatCurrency(
        availableBalance
      )} ${currency})`,
      value: { type: 'relative', sizeHook: 'default' },
      disabled: availableBalance === 0,
    },
  ];
}

function requiresPrice(type) {
  return ORDER_TYPES[type].executionType === 'limit';
}

function composeFormatPrice() {
  return (price) =>
    activeMarket.type === 'future'
      ? formatUsd(price, { strictDecimalPlaces: false })
      : `${formatNormalNumberNotation(price)} ${activeMarket.quoteCurrency}`;
}

function composePricingMethod() {
  const formatPrice = composeFormatPrice();

  return [
    { title: 'Basic', value: { type: 'basic' } },
    { title: 'Scaled', value: { type: 'scaled' } },
    {
      title: `Relative to ${activeMarket.name} market price (${formatPrice(
        activeMarket.price
      )})`,
      value: { type: 'relative', priceHook: 'market' },
    },
    {
      title: `Relative to ${activeMarket.name} last price (${formatPrice(
        activeMarket.last
      )})`,
      value: { type: 'relative', priceHook: 'last' },
    },
    {
      title: `Relative to ${activeMarket.name} bid price (${formatPrice(
        activeMarket.bid
      )})`,
      value: { type: 'relative', priceHook: 'bid' },
    },
    {
      title: `Relative to ${activeMarket.name} ask price (${formatPrice(
        activeMarket.ask
      )})`,
      value: { type: 'relative', priceHook: 'ask' },
    },
  ];
}

function composeParsePrice(type) {
  switch (type) {
    case 'relative':
      return OPTIONS.COMMANDS.PRICE.parseRelative;
    case 'scaled':
      return OPTIONS.COMMANDS.PRICE.parseScaled;
    default:
      return OPTIONS.COMMANDS.PRICE.parseBasic;
  }
}

async function composeQuestions(globalOptions) {
  await fetchData(globalOptions);

  const marketChoices = composeMarketChoices();

  return [
    {
      type: 'autocomplete',
      name: 'market',
      message: 'Select market (autocomplete)',
      fallback: 'No matching markets found.',
      initial: getInitialMarket(marketChoices),
      choices: marketChoices,
    },
    {
      type: 'select',
      name: 'side',
      message: 'Select side',
      choices: OPTIONS.COMMANDS.SIDE.interactiveChoices,
    },
    {
      type: 'select',
      name: 'type',
      message: 'Select type',
      choices: OPTIONS.COMMANDS.ORDER_TYPE.interactiveChoices,
    },
    {
      type: 'select',
      name: 'sizingMethod',
      message: 'Select sizing method',
      choices: (_, { market, side }) => {
        activeMarket = data.markets.find(({ name }) => name === market);

        return activeMarket.type === 'future'
          ? composeFuturesSizingMethod()
          : composeSpotSizingMethod(side);
      },
    },
    {
      type: ({ type }) => {
        parseSize =
          type === 'relative'
            ? OPTIONS.COMMANDS.SIZE.parseRelative
            : OPTIONS.COMMANDS.SIZE.parseBasic;

        return 'text';
      },
      name: 'size',
      message: 'Enter size',
      validate: (size) => validateAnswer(size, parseSize),
      format: (size) => parseSize(size),
    },
    {
      type: (_, { type }) => (requiresPrice(type) ? 'select' : null),
      name: 'pricingMethod',
      message: 'Select pricing method',
      choices: () => composePricingMethod(),
    },
    {
      type: ({ type }, { type: orderType }) => {
        if (!requiresPrice(orderType)) {
          return null;
        }

        parsePrice = composeParsePrice(type);

        return 'text';
      },
      name: 'price',
      message: 'Enter price',
      validate: (price) => validateAnswer(price, parsePrice),
      format: (price) => parsePrice(price),
    },
    {
      type: 'text',
      name: 'split',
      message: 'Enter number of individual orders',
      initial: '1',
      validate: (split) => validateAnswer(split, OPTIONS.COMMANDS.SPLIT.parser),
      format: (split) => OPTIONS.COMMANDS.SPLIT.parser(split),
    },
    {
      type: (split) => (split.isEqualTo(1) ? null : 'text'),
      name: 'duration',
      message: 'Enter total order duration (leave blank to skip)',
      validate: (duration) =>
        duration == null ||
        validateAnswer(duration, OPTIONS.COMMANDS.DURATION.parser),
      format: (duration) =>
        duration == null
          ? OPTIONS.COMMANDS.DURATION.default
          : OPTIONS.COMMANDS.DURATION.parser(duration),
    },
    {
      type: 'select',
      name: 'schedulingMethod',
      message: 'Select scheduling method',
      choices: [
        { title: 'Now', value: 'now' },
        { title: 'Date and time', value: 'date' },
        { title: 'Recurring', value: 'cron' },
      ],
    },
    {
      type: (schedulingMethod) => {
        switch (schedulingMethod) {
          case 'date':
            return 'date';
          case 'cron':
            return 'text';
          default:
            return null;
        }
      },
      name: 'schedule',
      message: (schedulingMethod) =>
        schedulingMethod === 'cron'
          ? 'Enter recurring schedule (cron expression/shorthand)'
          : 'Enter date and time (ISO 8601 timestamp) (local timezone)',
      initial: (schedulingMethod) =>
        schedulingMethod === 'cron' ? 'every-minute' : new Date(),
      validate: (schedule) =>
        schedule == null ||
        validateAnswer(
          schedule instanceof Date ? schedule.toISOString() : schedule,
          SCHEDULE.parser
        ),
      format: (schedule) =>
        SCHEDULE.parser(
          schedule instanceof Date ? schedule.toISOString() : schedule
        ),
    },
  ];
}

/**
 * After the user submits their answers, set derived answers and discard the
 * answers that they are derived from.
 */
function handleSubmit({ sizingMethod, pricingMethod, ...answers }) {
  return {
    ...answers,
    ...(sizingMethod.sizeCurrency && {
      sizeCurrency: sizingMethod.sizeCurrency,
    }),
    ...(sizingMethod.sizeHook && { sizeHook: sizingMethod.sizeHook }),
    ...(pricingMethod?.priceHook && { priceHook: pricingMethod.priceHook }),
  };
}

async function composePrompts(globalOptions) {
  return {
    questions: await composeQuestions(globalOptions),
    handleSubmit,
  };
}

export { composePrompts };
