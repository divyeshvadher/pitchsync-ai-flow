
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SignUpRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");

  useEffect(() => {
    // Default to founder if no role is specified
    if (role === "investor") {
      navigate("/signup/investor");
    } else {
      navigate("/signup/founder");
    }
  }, [navigate, role]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

export default SignUpRedirect;
