export interface Quote {
  id: string;
  text: string;
  author: string;
}

export interface FloatingQuoteProps extends Quote {
  onFavorite: (quote: Quote) => void;
  isFavorite: boolean;
}
