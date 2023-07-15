//import { Authorities } from '@common/constants/authorities';

export interface LaySnavItems {
  type: 'link' | 'dropdown';
  icon?: string;
  name: string;
  url?: string;
  dropdownLinks?: SnavDropdownLink[];
  authorities?: any | any[];
  disableOnContexts?: any | any[];
}

interface SnavDropdownLink {
  name: string;
  url: string;
  urlIsNotAutoCompleted?: boolean;
  authorities?: any | any[];
  disableOnContexts?: any | any[];
}

export const SIDE_NAV: LaySnavItems[] = [
  {
    type: 'link',
    name: 'Personas',
    icon: 'person',
    url: 'personas',
  },
  {
    type: 'link',
    name: 'Entidades',
    icon: 'real_estate_agent',
    url: 'entidades',
  },
  {
    type: 'link',
    name: 'Evaluaciones',
    icon: 'quiz',
    url: 'evaluaciones',
  },
];

export const SIDE_NAV_PUBLIC: LaySnavItems[] = [
  {
    type: 'link',
    name: 'Evaluaciones a personas',
    icon: 'person',
    url: 'public/evaluaciones',
  },
  {
    type: 'link',
    name: 'Evaluaciones a entidades',
    icon: 'person',
    url: 'public/evaluaciones-entidades',
  },
];
