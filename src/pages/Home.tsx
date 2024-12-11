import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to stations page for now
    navigate("/stations");
  }, [navigate]);

  return null;
};

export default Home;