import { compareAToZ } from '../../../../../util/index.js';

function compareSubaccounts(a, b) {
  // Sort main account first.
  if (a.subaccount === 'main') {
    return -1;
  }

  if (b.subaccount === 'main') {
    return 1;
  }

  // Sort subaccounts alphabetically.
  return compareAToZ(a.subaccount, b.subaccount);
}

function sortSubaccounts(subaccounts) {
  return subaccounts.sort(compareSubaccounts);
}

export { sortSubaccounts };
