import ProfileCard from './profile';
import './profile.css';

export const metadata = {
  title: 'Profile',
};

export default function ProfilePage() {
  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <ProfileCard />
      </div>
    </div>
  );
}
