import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Main from './view/Main';
import { useAuth } from "./contex";

const App = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if(!user){
      navigate("/login");
    }
  }, [user]);

  return (<> { user? <Main/> : 'loading user'} </>);
};

export default App;