export const COUNTRIES = [
  {
    code: 'BD',
    name: 'Bangladesh',
    currency: 'BDT',
    paymentMethods: ['bKash', 'Nagad', 'Rocket']
  },
  {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    paymentMethods: ['UPI']
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    currency: 'SAR',
    paymentMethods: []
  },
  {
    code: 'ID',
    name: 'Indonesia',
    currency: 'IDR',
    paymentMethods: []
  },
  {
    code: 'PK',
    name: 'Pakistan',
    currency: 'PKR',
    paymentMethods: []
  },
  {
    code: 'LK',
    name: 'Sri Lanka',
    currency: 'LKR',
    paymentMethods: []
  },
  {
    code: 'MY',
    name: 'Malaysia',
    currency: 'MYR',
    paymentMethods: []
  }
];

export function getCountries() {
  return COUNTRIES.map((country) => ({
    ...country,
    paymentMethods: [...country.paymentMethods]
  }));
}

export function getCountryByCode(code) {
  if (typeof code !== 'string') {
    return null;
  }

  const country = COUNTRIES.find(
    (item) => item.code === code.toUpperCase()
  );

  return country
    ? {
        ...country,
        paymentMethods: [...country.paymentMethods]
      }
    : null;
}