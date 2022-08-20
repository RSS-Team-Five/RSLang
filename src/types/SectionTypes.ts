import { NumbersToN } from 'ts-number-range/number-range';

type GroupType = NumbersToN<6>;
type PageType = NumbersToN<30>;

type SectionCard = {
  imgUrl: string;
  alt: string;
  sectionName: string;
  active: boolean;
};

export { GroupType, PageType, SectionCard };
