import {CardElement} from '@stripe/react-stripe-js';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      'color': '#32325d',
      'fontFamily': '"Helvetica Neue", Helvetica, sans-serif',
      'fontSmoothing': 'antialiased',
      'fontSize': '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
  hidePostalCode: true,
};

type PropTypes = {
  onSaveContinueClicked: (event: any) => any;
};

export default function CardInput(props: PropTypes) {
  return (
    <CardElement options={CARD_ELEMENT_OPTIONS} onChange={props.onSaveContinueClicked} />
  );
}
