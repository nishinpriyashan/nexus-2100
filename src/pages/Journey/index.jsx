import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJourneyStore } from '../../store/journeyStore';

export default function Journey() {
  const { activeJourney, setActiveJourney } = useJourneyStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!activeJourney) {
      setActiveJourney({ from: "Colombo Fort Station", to: "Kandy Central Hub" });
    }
    // Automatically launch directly into 3D Tracking map screen
    navigate('/tracking', { replace: true });
  }, [activeJourney, navigate, setActiveJourney]);

  return null;
}
