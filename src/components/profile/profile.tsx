import type { FC } from 'react';
import { profileWrapper } from './profile.styled';

interface profileProps {}

const profile: FC<profileProps> = () => (
 <profileWrapper data-testid="profile">
    profile Component
 </profileWrapper>
);

export default profile;
