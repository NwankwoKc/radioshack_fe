import type { FC } from 'react';
import { searchWrapper } from './search.styled';

interface searchProps {}

const search: FC<searchProps> = () => (
 <searchWrapper data-testid="search">
    search Component
 </searchWrapper>
);

export default search;
